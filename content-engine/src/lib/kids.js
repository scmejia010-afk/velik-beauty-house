/**
 * Reglas específicas del nicho infantil. Verificado 2026-10.
 *
 * Dos restricciones severas que no aplican a otros nichos:
 *
 * 1. COPPA. Todo contenido marcado "made for kids" NO puede servir anuncios
 *    personalizados, solo contextuales. El efecto es brutal: CPM cae a ~$1.59,
 *    la tasa de monetización a ~32%, y el RPM resultante a ~$0.33.
 *    Reduce el ingreso hasta un 80% frente a contenido de audiencia general.
 *    Además desactiva memberships, Super Chat, comentarios, end screens y
 *    campanita: se pierden las dos palancas de RPM que usan los otros nichos.
 *
 * 2. Política de contenido inauténtico de YouTube. En enero 2026 YouTube
 *    terminó 16 canales que acumulaban 4.700 millones de vistas por
 *    "contenido generado en masa, repetitivo o basado en plantillas".
 *    El contenido infantil con IA es el arquetipo exacto de lo que persiguen.
 *    La política no penaliza usar IA; penaliza lo repetitivo y de plantilla.
 */

/** RPM real del nicho infantil, no el del rango general. */
export const KIDS_RPM = {
  youtube_long:   { min: 0.33, max: 3.00 },  // COPPA aplicado
  youtube_shorts: { min: 0.03, max: 0.10 },
  facebook:       { min: 0.50, max: 3.00 },  // sigue siendo la mejor
  tiktok:         { min: 0.40, max: 1.20 },
};

/**
 * Shorts infantiles tienen 45.7% de playback monetizado contra 12.1% del
 * formato largo — un efecto colateral de COPPA. Proporcionalmente los
 * Shorts monetizan mejor de lo que su RPM sugiere.
 */
export const KIDS_MONETIZED_PLAYBACK = { shorts: 0.457, long: 0.121 };

/**
 * Compuerta de autenticidad. Bloquea lo que la política de YouTube
 * clasifica como inauténtico ANTES de publicar.
 *
 * Esta es la pieza que decide si el proyecto sobrevive a doce meses o se
 * termina en una ola de enforcement. No es opcional.
 */
export function checkAuthenticity(video, recentVideos = []) {
  const problems = [];

  // (a) Plantilla: si la estructura del guion se repite, es "template-based".
  const skeleton = s => (s ?? '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4)
    .slice(0, 40)
    .join(' ');

  const mine = skeleton(video.script);
  for (const prev of recentVideos) {
    const sim = jaccard(mine.split(' '), skeleton(prev.script).split(' '));
    if (sim > 0.6) {
      problems.push(
        `guion ${Math.round(sim * 100)}% similar a "${prev.title}" `
        + `— YouTube lo clasifica como contenido de plantilla`
      );
      break;
    }
  }

  // (b) Hook repetido: el mismo gancho en varias piezas es señal de producción en masa.
  if (video.hook && recentVideos.some(p => p.hook?.trim().toLowerCase() === video.hook.trim().toLowerCase())) {
    problems.push('hook idéntico a una pieza reciente');
  }

  // (c) Divulgación de IA obligatoria desde mayo 2025 para contenido
  // sintético que pueda confundirse con la realidad. No divulgar es
  // desmonetización permanente.
  if (video.ai_generated && !video.ai_disclosed) {
    problems.push('contenido sintético sin divulgación de IA declarada');
  }

  // (d) Contenido infantil angustiante: categoría explícita de la política.
  // Revisión humana obligatoria, no automatizable.
  if (!video.human_reviewed) {
    problems.push(
      'sin revisión humana — obligatoria en nicho infantil por la categoría '
      + '"off-putting or distressing content" de la política'
    );
  }

  return { ok: problems.length === 0, problems };
}

function jaccard(a, b) {
  const A = new Set(a), B = new Set(b);
  if (!A.size || !B.size) return 0;
  let inter = 0;
  for (const x of A) if (B.has(x)) inter++;
  return inter / (A.size + B.size - inter);
}

/** Proyección honesta para el nicho infantil, con COPPA aplicado. */
export function projectKidsRevenue({ platform, postsPerDay, viewsPerPost }) {
  const rpm = KIDS_RPM[platform];
  if (!rpm) throw new Error(`plataforma sin datos de RPM infantil: ${platform}`);
  const k = (postsPerDay * 30 * viewsPerPost) / 1000;
  return { low: +(k * rpm.min).toFixed(2), high: +(k * rpm.max).toFixed(2) };
}
