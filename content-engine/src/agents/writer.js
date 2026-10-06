/**
 * Agente 2 — Writer. Guion. Se dispara por tendencia nueva.
 *
 * Dos restricciones duras del nicho:
 * - La pieza debe superar los 60 segundos: por debajo, TikTok y Facebook
 *   no generan ingresos aunque el video se publique bien.
 * - El hook se resuelve en los primeros 3 segundos, donde se decide
 *   retention_3s y con ella el alcance.
 *
 * Y una tercera, específica de este nicho: el guion NO puede compartir
 * estructura con piezas recientes. La compuerta de autenticidad lo bloquea.
 */
import { db } from '../lib/db.js';
import { checkAuthenticity } from '../lib/kids.js';

const MIN_DURATION_SEC = 70;  // margen sobre el mínimo de 60

export async function runWriter({ generateScript, limit = 10 }) {
  const { data: trends, error } = await db
    .from('trends')
    .select('id, topic, hook_angle, niche, evidence')
    .order('score', { ascending: false })
    .limit(limit);
  if (error) throw new Error(`no se pudieron leer las tendencias: ${error.message}`);

  // Ventana de comparación para detectar guiones de plantilla.
  const { data: recent } = await db
    .from('videos')
    .select('title, hook, script')
    .order('created_at', { ascending: false })
    .limit(50);

  const results = { created: 0, rejected: [] };

  for (const trend of trends ?? []) {
    const accountId = trend.evidence?.account_id;
    const draft = await generateScript({
      topic: trend.topic,
      angle: trend.hook_angle,
      minDurationSec: MIN_DURATION_SEC,
      // El modelo recibe lo ya escrito para divergir, no para imitar.
      avoidStructuresOf: (recent ?? []).slice(0, 15).map(r => r.script),
    });

    const video = {
      account_id: accountId,
      trend_id: trend.id,
      title: draft.title,
      hook: draft.hook,
      script: draft.script,
      duration_sec: draft.durationSec,
      format: draft.durationSec >= 60 ? 'long' : 'short',
      made_for_kids: true,
      ai_generated: true,
      ai_disclosed: true,   // divulgación obligatoria, declarada en el origen
      human_reviewed: false,
    };

    if (video.duration_sec < 60) {
      results.rejected.push({ topic: trend.topic, why: `${video.duration_sec}s < 60s, no monetiza` });
      continue;
    }

    const auth = checkAuthenticity(video, recent ?? []);
    if (!auth.ok) {
      results.rejected.push({ topic: trend.topic, why: auth.problems.join('; ') });
      continue;
    }

    const { error: insErr } = await db.from('videos').insert({ ...video, authenticity: auth });
    if (insErr) {
      results.rejected.push({ topic: trend.topic, why: insErr.message });
      continue;
    }
    recent?.unshift(video);  // la siguiente iteración compara contra esta
    results.created++;
  }
  return results;
}
