/**
 * Agente 4 — Publisher. Cada 15 minutos. La pieza crítica del sistema.
 *
 * Sin la compuerta de cupo el sistema falla del peor modo posible: la API
 * rechaza por límite, el video nunca se publica, y nadie se entera hasta
 * revisar el reporte del mes.
 *
 * Orden obligatorio por publicación:
 *   1. validar monetización (duración mínima)
 *   2. compuerta de cupo local
 *   3. en Meta, cupo real del endpoint (manda sobre la constante local)
 *   4. publicar
 *   5. registrar consumo SOLO si se confirmó
 */
import { db } from '../lib/db.js';
import { canPublish, recordUsage, validateForMonetization, fetchMetaLiveQuota } from '../lib/quota.js';
import * as meta from '../lib/platforms/meta.js';
import * as tiktok from '../lib/platforms/tiktok.js';
import * as youtube from '../lib/platforms/youtube.js';

export async function runPublisher({ now = new Date(), batch = 20 } = {}) {
  const { data: due, error } = await db
    .from('publications')
    .select(`
      id, video_id, account_id, attempts,
      videos (title, script, media_url, duration_sec, made_for_kids, ai_disclosed, human_reviewed),
      accounts (id, platform, handle, access_token, made_for_kids)
    `)
    .eq('status', 'queued')
    .lte('scheduled_for', now.toISOString())
    .limit(batch);
  if (error) throw new Error(`no se pudo leer la cola: ${error.message}`);

  const report = { published: 0, skippedQuota: 0, failed: 0, blocked: 0 };

  for (const pub of due ?? []) {
    const { videos: video, accounts: account } = pub;

    // Barrera de seguridad: el trigger de la base ya lo exige, pero la cola
    // puede haber sido poblada antes de la migración.
    if (!video.human_reviewed || !video.ai_disclosed) {
      await fail(pub, 'sin revisión humana o divulgación de IA', 'failed');
      report.blocked++;
      continue;
    }

    const monet = validateForMonetization(video, account.platform);
    if (!monet.ok) {
      await fail(pub, monet.problems.join('; '), 'failed');
      report.blocked++;
      continue;
    }

    const gate = await canPublish(db, account, now);
    if (!gate.ok) {
      // Reprogramar al día siguiente. Nunca reintentar en bucle contra
      // un límite diario: solo quema peticiones.
      await db.from('publications').update({
        status: 'queued',
        scheduled_for: nextDay(now).toISOString(),
        error: gate.reason,
      }).eq('id', pub.id);
      report.skippedQuota++;
      continue;
    }

    await db.from('publications')
      .update({ status: 'publishing', attempts: pub.attempts + 1 })
      .eq('id', pub.id);

    try {
      const result = await dispatch(account, video);
      await db.from('publications').update({
        status: 'published',
        published_at: new Date().toISOString(),
        platform_post_id: result.platformPostId ?? result.publishId,
        error: null,
      }).eq('id', pub.id);

      // Solo después de confirmar. Registrar antes inflaría el consumo
      // y dejaría cupo sin usar.
      await recordUsage(db, account, now);
      report.published++;
    } catch (e) {
      await fail(pub, e.message, pub.attempts + 1 >= 3 ? 'failed' : 'queued');
      report.failed++;
    }
  }
  return report;
}

async function dispatch(account, video) {
  switch (account.platform) {
    case 'facebook':
      return meta.publishFacebookReel({
        pageId: account.handle, token: account.access_token,
        videoUrl: video.media_url, description: video.title,
      });
    case 'instagram':
      return meta.publishInstagramReel({
        igUserId: account.handle, token: account.access_token,
        videoUrl: video.media_url, caption: video.title,
      });
    case 'tiktok':
      return tiktok.publishVideo({
        accessToken: account.access_token,
        videoUrl: video.media_url, title: video.title,
      });
    case 'youtube':
      return youtube.uploadVideo({
        accessToken: account.access_token,
        filePath: video.media_url, title: video.title,
        description: video.script?.slice(0, 4500) ?? '',
        madeForKids: true,      // obligatorio en este nicho
        aiDisclosed: true,
      });
    default:
      throw new Error(`plataforma sin cliente: ${account.platform}`);
  }
}

async function fail(pub, error, status) {
  const patch = { status, error };
  if (status === 'queued') {
    // Reintento con espera creciente: 15min, 1h, 4h.
    const delays = [15, 60, 240];
    const mins = delays[Math.min(pub.attempts, delays.length - 1)];
    patch.scheduled_for = new Date(Date.now() + mins * 60000).toISOString();
  }
  await db.from('publications').update(patch).eq('id', pub.id);
}

function nextDay(d) {
  const n = new Date(d);
  n.setUTCDate(n.getUTCDate() + 1);
  n.setUTCHours(6, 0, 0, 0);
  return n;
}
