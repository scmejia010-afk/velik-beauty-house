/**
 * Agente 1 — Scout. Inteligencia de temas. Cadencia diaria.
 *
 * En el nicho infantil el catálogo de temas es acotado y muy competido
 * (colores, números, animales, canciones). El valor del Scout no es
 * encontrar temas nuevos: es encontrar ÁNGULOS distintos sobre temas
 * conocidos, porque repetir la misma fórmula es exactamente lo que la
 * política de contenido inauténtico de YouTube penaliza.
 */
import { db } from '../lib/db.js';

/** Temas base del nicho. El ángulo es lo que diferencia, no el tema. */
const KIDS_TOPICS = [
  'colors', 'numbers', 'shapes', 'animals', 'alphabet', 'body parts',
  'feelings', 'weather', 'food', 'vehicles', 'family', 'daily routines',
  'opposites', 'seasons', 'jobs', 'sounds', 'manners', 'safety',
];

export async function runScout({ generateAngles }) {
  const { data: accounts, error } = await db
    .from('accounts')
    .select('id, niche, language, target_market')
    .eq('active', true);
  if (error) throw new Error(`no se pudieron leer las cuentas: ${error.message}`);

  // Lo que ya funcionó: hooks con mejor retención a los 3 segundos.
  const { data: winners } = await db
    .from('metrics')
    .select('retention_3s, rpm_usd, publication_id, publications(video_id, videos(hook, title))')
    .order('retention_3s', { ascending: false })
    .limit(20);

  // Lo ya publicado, para no repetir ángulo.
  const { data: used } = await db
    .from('trends')
    .select('topic, hook_angle')
    .gte('detected_at', new Date(Date.now() - 90 * 864e5).toISOString());

  const inserted = [];
  for (const account of accounts ?? []) {
    const angles = await generateAngles({
      topics: KIDS_TOPICS,
      language: account.language,
      market: account.target_market,
      provenWinners: (winners ?? []).map(w => w.publications?.videos?.hook).filter(Boolean),
      alreadyUsed: (used ?? []).map(u => `${u.topic}: ${u.hook_angle}`),
    });

    for (const a of angles) {
      const { data, error: insErr } = await db.from('trends').insert({
        platform: 'multi',
        niche: account.niche,
        topic: a.topic,
        hook_angle: a.angle,
        score: a.score,
        evidence: { rationale: a.rationale, account_id: account.id },
      }).select('id').single();
      if (insErr) {
        console.error(`tendencia descartada (${a.topic}): ${insErr.message}`);
        continue;
      }
      inserted.push(data.id);
    }
  }
  return { trendsCreated: inserted.length };
}
