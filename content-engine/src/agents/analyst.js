/**
 * Agente 5 — Analyst. Diario. Cierra el ciclo de aprendizaje.
 *
 * El dato que gobierna el proyecto no son las vistas: es el RPM efectivo
 * por geografía. Si el 80% de las vistas viene de mercados de CPM bajo,
 * el problema no es el volumen de producción, es el targeting — y producir
 * más solo multiplica el costo, no el ingreso.
 */
import { db } from '../lib/db.js';
import * as youtube from '../lib/platforms/youtube.js';
import { metaGraph } from '../lib/platforms/meta.js';
import { MARKET_MULTIPLIER } from '../lib/limits.js';

export async function runAnalyst({ now = new Date(), lookbackDays = 7 } = {}) {
  const since = new Date(now - lookbackDays * 864e5);

  const { data: pubs, error } = await db
    .from('publications')
    .select('id, platform_post_id, accounts (platform, access_token, target_market)')
    .eq('status', 'published')
    .gte('published_at', since.toISOString());
  if (error) throw new Error(`no se pudieron leer las publicaciones: ${error.message}`);

  const out = { captured: 0, errors: [] };

  for (const pub of pubs ?? []) {
    try {
      const m = pub.accounts.platform === 'youtube'
        ? await youtubeMetrics(pub, since, now)
        : await metaMetrics(pub);

      const rpm = m.views > 0 ? (m.revenue / (m.views / 1000)) : null;

      const { error: insErr } = await db.from('metrics').insert({
        publication_id: pub.id,
        views: m.views,
        qualified_views: m.qualifiedViews ?? m.views,
        avg_watch_sec: m.avgWatchSec,
        retention_3s: m.retention3s,
        revenue_usd: m.revenue,
        rpm_usd: rpm,
        geo_breakdown: m.geo,
      });
      if (insErr) throw new Error(insErr.message);
      out.captured++;
    } catch (e) {
      out.errors.push({ publication: pub.id, error: e.message });
    }
  }

  out.diagnosis = await diagnoseGeography();
  return out;
}

async function youtubeMetrics(pub, since, now) {
  const r = await youtube.fetchAnalytics({
    accessToken: pub.accounts.access_token,
    videoId: pub.platform_post_id,
    startDate: since.toISOString().slice(0, 10),
    endDate: now.toISOString().slice(0, 10),
  });
  const cols = (r.columnHeaders ?? []).map(c => c.name);
  const idx = n => cols.indexOf(n);
  const geo = {};
  let views = 0, revenue = 0, watchSum = 0;

  for (const row of r.rows ?? []) {
    const country = row[idx('country')];
    const v = row[idx('views')] ?? 0;
    const rev = row[idx('estimatedRevenue')] ?? 0;
    geo[country] = { views: v, revenue: rev };
    views += v;
    revenue += rev;
    watchSum += (row[idx('averageViewDuration')] ?? 0) * v;
  }
  return { views, revenue, avgWatchSec: views ? watchSum / views : null, geo };
}

async function metaMetrics(pub) {
  const r = await metaGraph(`/${pub.platform_post_id}/video_insights`, {
    metric: 'total_video_views,total_video_view_total_time,total_video_impressions',
    access_token: pub.accounts.access_token,
  });
  const get = n => r.data?.find(d => d.name === n)?.values?.[0]?.value ?? 0;
  const views = get('total_video_views');
  const totalTimeMs = get('total_video_view_total_time');
  return {
    views,
    revenue: 0,  // el ingreso de Meta se consolida aparte, no por video
    avgWatchSec: views ? (totalTimeMs / 1000) / views : null,
    geo: null,
  };
}

/**
 * Diagnóstico de geografía: el hallazgo central del proyecto es que la
 * misma pieza paga hasta 10x según de dónde venga la audiencia. Esto
 * convierte ese hallazgo en una señal accionable.
 */
async function diagnoseGeography() {
  const { data } = await db
    .from('metrics')
    .select('geo_breakdown, views')
    .not('geo_breakdown', 'is', null)
    .order('captured_at', { ascending: false })
    .limit(200);

  const byCountry = {};
  for (const row of data ?? []) {
    for (const [country, v] of Object.entries(row.geo_breakdown ?? {})) {
      byCountry[country] = (byCountry[country] ?? 0) + (v.views ?? 0);
    }
  }
  const total = Object.values(byCountry).reduce((a, b) => a + b, 0);
  if (!total) return { note: 'sin datos geográficos todavía' };

  const weighted = Object.entries(byCountry)
    .reduce((acc, [c, v]) => acc + (MARKET_MULTIPLIER[c] ?? 1) * (v / total), 0);

  const topMarkets = Object.entries(byCountry)
    .sort((a, b) => b[1] - a[1]).slice(0, 5)
    .map(([c, v]) => ({ country: c, share: +(v / total * 100).toFixed(1) }));

  return {
    effectiveMultiplier: +weighted.toFixed(2),
    topMarkets,
    // 10 = toda la audiencia en mercados premium; 1 = toda en CPM bajo.
    verdict: weighted < 2
      ? 'audiencia concentrada en mercados de CPM bajo: producir más no sube el ingreso, hay que corregir targeting'
      : 'mezcla de audiencia saludable',
  };
}
