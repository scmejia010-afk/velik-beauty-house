/**
 * Límites reales de las APIs de publicación (verificado 2026-10).
 *
 * Esta tabla es la restricción más importante del sistema entero: define
 * cuántas piezas por día puede absorber cada cuenta. El escalado NO es
 * vertical (más posts en una cuenta) sino horizontal (más cuentas).
 */
export const PLATFORM_LIMITS = {
  tiktok: {
    postsPerDay: 15,
    // El cupo es POR CREADOR y se comparte entre todas las apps que ese
    // creador haya autorizado. Si usa otra herramienta de scheduling,
    // esos posts también cuentan. Asumimos el extremo conservador del
    // rango documentado (15-25) para no perder publicaciones.
    sharedAcrossApps: true,
    requestsPerMinute: 6,
    statusRequestsPerMinute: 30,
    minDurationSec: 60,     // <60s NO genera ingresos en Creator Rewards
    // Un cliente sin auditar solo deja publicar a 5 usuarios cada 24h.
    unauditedMaxCreators: 5,
  },
  instagram: {
    postsPerDay: 50,        // reels y stories cuentan al mismo cupo
    // El límite de 200 llamadas/hora es POR TOKEN, no por cuenta:
    // un token para 10 cuentas estrangula a las 10. Un token por cuenta.
    callsPerHourPerToken: 200,
    // Endpoint que da el cupo real de cada cuenta. Consultar antes de encolar.
    quotaEndpoint: '/{ig-user-id}/content_publishing_limit',
    minDurationSec: 0,
  },
  facebook: {
    postsPerDay: 50,
    callsPerHourPerToken: 200,
    minDurationSec: 60,     // el dinero está en piezas largas
  },
  youtube: {
    // La cuota de 10.000 unidades/día es POR PROYECTO Google Cloud.
    // Un upload cuesta 1600 → 6 videos/día por proyecto.
    dailyApiUnits: 10000,
    uploadCostUnits: 1600,
    postsPerDay: 6,
    quotaResetTz: 'America/Los_Angeles',  // medianoche Pacífico, no UTC
    minDurationSec: 0,
  },
};

/** RPM observado por plataforma, USD por 1000 vistas cualificadas. */
export const RPM_RANGE = {
  facebook:  { min: 1.00, max: 10.00 },  // la más rentable y la menos disputada
  tiktok:    { min: 0.40, max: 1.20 },
  youtube:   { min: 0.03, max: 0.10 },   // Shorts
  instagram: { min: 0.01, max: 0.05 },   // casi simbólico por vistas directas
};

/**
 * Multiplicador de ingreso por mercado de la audiencia.
 * Es la palanca de mayor impacto del sistema: la misma pieza con las mismas
 * vistas paga ~10x si la audiencia es US en vez de CO.
 */
export const MARKET_MULTIPLIER = {
  US: 10.0, GB: 9.0, CA: 8.0, AU: 8.0,
  ES: 3.0, MX: 2.0, BR: 2.5, CL: 1.5, AR: 1.2,
  CO: 1.0, PE: 1.0,
};

/** Capacidad diaria total del sistema, dado un conjunto de cuentas. */
export function dailyCapacity(accounts) {
  return accounts
    .filter(a => a.active)
    .reduce((total, a) => total + (PLATFORM_LIMITS[a.platform]?.postsPerDay ?? 0), 0);
}

/** Ingreso mensual estimado, para dimensionar antes de construir. */
export function projectMonthlyRevenue({ platform, postsPerDay, viewsPerPost, market }) {
  const rpm = RPM_RANGE[platform];
  const mult = MARKET_MULTIPLIER[market] ?? 1;
  const monthlyViews = postsPerDay * 30 * viewsPerPost;
  const k = monthlyViews / 1000;
  return {
    monthlyViews,
    low:  +(k * rpm.min * mult).toFixed(2),
    high: +(k * rpm.max * mult).toFixed(2),
  };
}
