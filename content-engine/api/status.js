/**
 * Datos del panel en una sola llamada.
 *
 * Una llamada por tarjeta haría que el panel dispare 6 peticiones en cada
 * carga, y con el límite de conexiones de Supabase eso se nota. Mejor una
 * consulta compuesta.
 */
import { db } from '../src/lib/db.js';
import { PLATFORM_LIMITS } from '../src/lib/limits.js';
import { quotaDay } from '../src/lib/quota.js';

export default async function handler(req, res) {
  try {
    const today = new Date();

    const [series, episodes, pendingReview, queue, published, accounts, runs, metrics] =
      await Promise.all([
        db.from('series').select('id, title, premise, status, episode_count, characters, art_style'),
        db.from('episodes').select('id, series_id, number, title, lesson, status').order('number'),
        db.from('videos')
          .select('id, title, hook, duration_sec, media_url, created_at')
          .eq('status', 'ready').eq('human_reviewed', false),
        db.from('publications')
          .select('id, status, scheduled_for, error, videos(title), accounts(handle, platform)')
          .in('status', ['queued', 'publishing', 'skipped_quota'])
          .order('scheduled_for').limit(50),
        db.from('publications')
          .select('id, published_at, platform_post_id, videos(title), accounts(handle, platform)')
          .eq('status', 'published').order('published_at', { ascending: false }).limit(20),
        db.from('accounts').select('id, label, platform, handle, active, target_market'),
        db.from('orchestrator_runs')
          .select('id, started_at, finished_at, stage, status, credits_spent, report')
          .order('started_at', { ascending: false }).limit(10),
        db.from('metrics')
          .select('views, qualified_views, revenue_usd, rpm_usd, retention_3s, geo_breakdown, captured_at')
          .order('captured_at', { ascending: false }).limit(200),
      ]);

    // Cupo restante por cuenta: el dato que decide si hoy se puede publicar.
    const quotas = [];
    for (const a of accounts.data ?? []) {
      const day = quotaDay(a.platform, today);
      const { data: usage } = await db.from('quota_usage')
        .select('posts_used').eq('account_id', a.id).eq('day', day).maybeSingle();
      const cap = PLATFORM_LIMITS[a.platform]?.postsPerDay ?? 0;
      const used = usage?.posts_used ?? 0;
      quotas.push({ accountId: a.id, label: a.label, platform: a.platform, used, cap, remaining: cap - used });
    }

    const m = metrics.data ?? [];
    const totals = {
      views: m.reduce((s, r) => s + (r.views ?? 0), 0),
      revenue: +m.reduce((s, r) => s + Number(r.revenue_usd ?? 0), 0).toFixed(2),
      avgRpm: m.length
        ? +(m.filter(r => r.rpm_usd).reduce((s, r) => s + Number(r.rpm_usd), 0) /
            (m.filter(r => r.rpm_usd).length || 1)).toFixed(3)
        : null,
    };

    res.setHeader('cache-control', 'no-store');
    res.status(200).json({
      series: series.data ?? [],
      episodes: episodes.data ?? [],
      pendingReview: pendingReview.data ?? [],
      queue: queue.data ?? [],
      published: published.data ?? [],
      accounts: accounts.data ?? [],
      quotas,
      runs: runs.data ?? [],
      totals,
      generatedAt: today.toISOString(),
    });
  } catch (e) {
    console.error('status falló:', e);
    res.status(500).json({ error: e.message });
  }
}
