import { PLATFORM_LIMITS } from './limits.js';

/**
 * Control de cupo. Toda publicación pasa por aquí ANTES de salir.
 *
 * Sin esta compuerta el sistema falla del peor modo posible: la API acepta
 * la llamada, devuelve error de límite, y el video queda sin publicar sin
 * que nadie se entere. Preferimos marcar 'skipped_quota' y reencolar.
 */

/** Día de cupo correspondiente a un instante, en la zona de reset de la plataforma. */
export function quotaDay(platform, at = new Date()) {
  const tz = PLATFORM_LIMITS[platform]?.quotaResetTz;
  // YouTube resetea a medianoche Pacífico; el resto usa ventana rodante/UTC.
  const d = tz
    ? new Date(at.toLocaleString('en-US', { timeZone: tz }))
    : at;
  return d.toISOString().slice(0, 10);
}

/**
 * ¿Puede esta cuenta publicar una pieza más hoy?
 * Devuelve el motivo cuando no, para registrarlo en publications.error.
 */
export async function canPublish(db, account, at = new Date()) {
  const limits = PLATFORM_LIMITS[account.platform];
  if (!limits) return { ok: false, reason: `plataforma desconocida: ${account.platform}` };

  const day = quotaDay(account.platform, at);
  const { data: usage } = await db
    .from('quota_usage')
    .select('posts_used, api_units_used')
    .eq('account_id', account.id)
    .eq('day', day)
    .maybeSingle();

  const used = usage ?? { posts_used: 0, api_units_used: 0 };

  if (limits.postsPerDay && used.posts_used >= limits.postsPerDay) {
    return {
      ok: false,
      reason: `cupo diario agotado: ${used.posts_used}/${limits.postsPerDay}`,
      retryAfterDay: true,
    };
  }

  // YouTube se agota por unidades de API antes que por número de posts.
  if (limits.dailyApiUnits) {
    const needed = used.api_units_used + limits.uploadCostUnits;
    if (needed > limits.dailyApiUnits) {
      return {
        ok: false,
        reason: `cuota API insuficiente: ${used.api_units_used}+${limits.uploadCostUnits} > ${limits.dailyApiUnits}`,
        retryAfterDay: true,
      };
    }
  }

  return { ok: true, remaining: (limits.postsPerDay ?? Infinity) - used.posts_used };
}

/**
 * Cupo real reportado por Instagram/Facebook.
 * Meta documenta 50 en un lugar y 100 en otro; el endpoint es la verdad.
 * Siempre preferir este dato sobre la constante local.
 */
export async function fetchMetaLiveQuota(igUserId, token) {
  const url = `https://graph.facebook.com/v21.0/${igUserId}/content_publishing_limit`
            + `?fields=quota_usage,config&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`content_publishing_limit ${res.status}: ${await res.text()}`);
  const { data } = await res.json();
  const row = data?.[0] ?? {};
  return { used: row.quota_usage ?? 0, total: row.config?.quota_total ?? 50 };
}

/** Registra el consumo. Llamar SOLO tras una publicación confirmada. */
export async function recordUsage(db, account, at = new Date()) {
  const limits = PLATFORM_LIMITS[account.platform];
  const day = quotaDay(account.platform, at);
  const { error } = await db.rpc('increment_quota', {
    p_account_id: account.id,
    p_day: day,
    p_posts: 1,
    p_units: limits.uploadCostUnits ?? 0,
  });
  if (error) throw new Error(`no se pudo registrar el cupo: ${error.message}`);
}

/**
 * Valida la pieza contra los requisitos de monetización de la plataforma.
 * Un video de 45s en TikTok se publica bien y no paga nada: hay que
 * bloquearlo antes, no descubrirlo en el reporte de ingresos.
 */
export function validateForMonetization(video, platform) {
  const limits = PLATFORM_LIMITS[platform];
  const problems = [];
  if (limits?.minDurationSec && (video.duration_sec ?? 0) < limits.minDurationSec) {
    problems.push(
      `${platform} exige >=${limits.minDurationSec}s para generar ingresos `
      + `(esta pieza: ${video.duration_sec ?? 0}s)`
    );
  }
  return { ok: problems.length === 0, problems };
}
