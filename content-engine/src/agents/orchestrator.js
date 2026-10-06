/**
 * Agente 0 — Orquestador. Dirige la cadena completa de una serie.
 *
 *   crear serie -> esquematizar episodios -> guionizar -> producir
 *   -> revisión humana -> encolar -> publicar
 *
 * Principios de diseño:
 *
 * 1. Es una máquina de estados sobre la base de datos, no un script largo.
 *    Cada etapa deja su resultado persistido, así que si falla en la etapa 4
 *    se reanuda en la 4 y no se repite el trabajo de las anteriores — que ya
 *    costó créditos.
 *
 * 2. Presupuesto de créditos explícito. Con cupo mensual limitado, un
 *    orquestador sin tope puede gastarlo entero en una sola corrida.
 *
 * 3. Se detiene en la revisión humana. No la puede saltar: es la barrera
 *    que protege el proyecto de la política de contenido inauténtico, y
 *    está forzada por trigger en la base de datos.
 */
import { db } from '../lib/db.js';
import { checkAuthenticity } from '../lib/kids.js';

/** Costo en créditos por etapa, para controlar el presupuesto. */
const CREDIT_COST = {
  imagePerScene: 2,
  audioPerEpisode: 2,
};

export async function runOrchestrator({
  ai,                       // { outlineSeries, outlineEpisodes, writeEpisode }
  hf,                       // cliente Higgsfield
  seriesId = null,          // null = crear serie nueva
  episodesToProduce = 3,
  creditBudget = 100,       // tope duro de gasto en esta corrida
  seed = {},                // premisa, edad, idioma, cuenta
} = {}) {
  const run = await startRun(seriesId);
  const spent = { credits: 0 };
  const report = { stages: [] };

  try {
    // ── Etapa 1: la serie ────────────────────────────────────────────
    let series = seriesId ? await loadSeries(seriesId) : null;
    if (!series) {
      await setStage(run, 'crear-serie');
      series = await createSeries({ ai, seed });
      report.stages.push({ stage: 'crear-serie', seriesId: series.id, title: series.title });
    }

    // ── Etapa 2: esquema de episodios ────────────────────────────────
    await setStage(run, 'esquematizar');
    const outlined = await ensureOutlines({ ai, series, want: episodesToProduce });
    report.stages.push({ stage: 'esquematizar', episodes: outlined.length });

    // ── Etapa 3: guiones ─────────────────────────────────────────────
    await setStage(run, 'guionizar');
    const scripted = [];
    for (const ep of outlined) {
      const result = await scriptEpisode({ ai, series, episode: ep });
      if (result.ok) scripted.push(result.episode);
      else report.stages.push({ stage: 'guionizar', skipped: ep.number, why: result.why });
    }
    report.stages.push({ stage: 'guionizar', scripted: scripted.length });

    // ── Etapa 4: producción ──────────────────────────────────────────
    // Imágenes + narración, no video generado: ~10 créditos por episodio
    // contra ~84. Con cupo mensual limitado esa diferencia es el proyecto.
    await setStage(run, 'producir');
    const produced = [];
    for (const ep of scripted) {
      const cost = estimateCost(ep);
      if (spent.credits + cost > creditBudget) {
        report.stages.push({
          stage: 'producir',
          stopped: `presupuesto agotado antes del episodio ${ep.number}`,
          spent: spent.credits,
          budget: creditBudget,
        });
        break;
      }
      const out = await produceEpisode({ hf, series, episode: ep });
      spent.credits += out.credits;
      if (out.ok) produced.push(out.episode);
      else report.stages.push({ stage: 'producir', failed: ep.number, error: out.error });
    }
    report.stages.push({ stage: 'producir', produced: produced.length, credits: spent.credits });

    // ── Etapa 5: entrega a revisión humana ───────────────────────────
    // El orquestador NO publica. Deja las piezas listas y se detiene:
    // el trigger de la base impide encolar lo no revisado.
    await setStage(run, 'esperar-revision');
    report.stages.push({
      stage: 'esperar-revision',
      awaitingReview: produced.length,
      note: 'El orquestador se detiene aquí. Aprobar en /api/review para encolar.',
    });

    await finishRun(run, 'completed', spent.credits, report);
    return { ok: true, seriesId: series.id, ...report, creditsSpent: spent.credits };
  } catch (e) {
    await finishRun(run, 'failed', spent.credits, { ...report, error: e.message });
    throw e;
  }
}

// ─── Etapas ───────────────────────────────────────────────────────────

async function createSeries({ ai, seed }) {
  const draft = await ai.outlineSeries({
    premise: seed.premise,
    targetAge: seed.targetAge ?? '3-6',
    language: seed.language ?? 'en',
  });

  const { data, error } = await db.from('series').insert({
    account_id: seed.accountId ?? null,
    title: draft.title,
    premise: draft.premise,
    // La biblia de personajes mantiene coherencia entre episodios hechos
    // en días distintos. Sin ella la serie se desarma visualmente.
    characters: draft.characters,
    setting: draft.setting,
    art_style: draft.artStyle,
    target_age: seed.targetAge ?? '3-6',
    language: seed.language ?? 'en',
    status: 'active',
  }).select().single();
  if (error) throw new Error(`no se pudo crear la serie: ${error.message}`);
  return data;
}

async function ensureOutlines({ ai, series, want }) {
  const { data: existing } = await db
    .from('episodes')
    .select('id, number, title, lesson, synopsis, scenes, status')
    .eq('series_id', series.id)
    .in('status', ['outlined', 'scripted'])
    .order('number');

  if ((existing?.length ?? 0) >= want) return existing.slice(0, want);

  const { data: last } = await db
    .from('episodes')
    .select('number, title, synopsis')
    .eq('series_id', series.id)
    .order('number', { ascending: false })
    .limit(5);

  const startAt = (last?.[0]?.number ?? 0) + 1;
  const needed = want - (existing?.length ?? 0);

  const drafts = await ai.outlineEpisodes({
    series,
    startAt,
    count: needed,
    // El arco continúa: el modelo necesita saber qué ya pasó.
    previously: (last ?? []).reverse().map(e => `${e.number}. ${e.title}: ${e.synopsis}`),
  });

  const rows = [];
  for (const d of drafts) {
    const { data, error } = await db.from('episodes').insert({
      series_id: series.id,
      number: d.number,
      title: d.title,
      lesson: d.lesson,
      synopsis: d.synopsis,
      status: 'outlined',
    }).select().single();
    if (error) {
      console.error(`episodio ${d.number} descartado: ${error.message}`);
      continue;
    }
    rows.push(data);
  }

  await db.from('series')
    .update({ episode_count: startAt + rows.length - 1 })
    .eq('id', series.id);

  return [...(existing ?? []), ...rows].slice(0, want);
}

async function scriptEpisode({ ai, series, episode }) {
  if (episode.status === 'scripted' && episode.scenes?.length) {
    return { ok: true, episode };
  }

  const draft = await ai.writeEpisode({ series, episode, minDurationSec: 70 });

  // Duración mínima: por debajo de 60s no monetiza en TikTok ni Facebook.
  if (draft.durationSec < 60) {
    return { ok: false, why: `${draft.durationSec}s < 60s, no monetiza` };
  }

  // Compuerta de autenticidad contra los episodios anteriores de ESTA serie.
  // Una serie debe tener voz consistente pero episodios distintos: si dos
  // episodios comparten estructura, es contenido de plantilla.
  const { data: recent } = await db
    .from('videos')
    .select('title, hook, script')
    .order('created_at', { ascending: false })
    .limit(50);

  const candidate = {
    title: draft.title ?? episode.title,
    hook: draft.hook,
    script: draft.narration,
    ai_generated: true,
    ai_disclosed: true,
    human_reviewed: false,
  };

  const auth = checkAuthenticity(candidate, recent ?? []);
  // La falta de revisión humana es esperada en esta etapa: la aporta la
  // persona más adelante. Los demás problemas sí bloquean.
  const blocking = auth.problems.filter(p => !p.includes('revisión humana'));
  if (blocking.length) return { ok: false, why: blocking.join('; ') };

  const { data, error } = await db.from('episodes').update({
    scenes: draft.scenes,     // [{ imagePrompt, narration, seconds }]
    status: 'scripted',
  }).eq('id', episode.id).select().single();
  if (error) return { ok: false, why: error.message };

  return { ok: true, episode: { ...data, _draft: draft } };
}

function estimateCost(episode) {
  const scenes = episode.scenes?.length ?? episode._draft?.scenes?.length ?? 6;
  return scenes * CREDIT_COST.imagePerScene + CREDIT_COST.audioPerEpisode;
}

/**
 * Produce el episodio como imágenes + narración.
 *
 * El estilo visual se repite literalmente en cada prompt (series.art_style)
 * para que los personajes se vean iguales entre episodios — esa coherencia
 * es lo que hace que se lea como una serie y no como piezas sueltas.
 */
async function produceEpisode({ hf, series, episode }) {
  const scenes = episode.scenes ?? episode._draft?.scenes ?? [];
  if (!scenes.length) return { ok: false, credits: 0, error: 'episodio sin escenas' };

  let credits = 0;
  try {
    const images = await hf.generateImageBatch(
      scenes.map(s => ({
        prompt: `${s.imagePrompt}. ${series.art_style}`,
        characters: series.characters,
      }))
    );
    credits += scenes.length * CREDIT_COST.imagePerScene;

    const narration = scenes.map(s => s.narration).join(' ');
    const audio = await hf.generateAudio({ text: narration, voiceId: series.voice_id });
    credits += CREDIT_COST.audioPerEpisode;

    // Ensamblaje: paneo y zoom sobre imágenes fijas (Ken Burns), sincronizado
    // con la narración. Es software, no generación: no consume créditos.
    const media = await hf.assembleFromImages({
      images, audio,
      durations: scenes.map(s => s.seconds),
    });

    const totalSec = scenes.reduce((a, s) => a + s.seconds, 0);

    const { data: video, error: vErr } = await db.from('videos').insert({
      account_id: series.account_id,
      episode_id: episode.id,
      title: `${series.title} — ${episode.title}`,
      hook: episode._draft?.hook ?? null,
      script: narration,
      duration_sec: totalSec,
      format: totalSec >= 60 ? 'long' : 'short',
      production_mode: 'images',
      media_url: media.url,
      hf_job_id: media.jobId,
      status: 'ready',
      made_for_kids: true,
      ai_generated: true,
      ai_disclosed: true,
      human_reviewed: false,
    }).select('id').single();
    if (vErr) throw new Error(vErr.message);

    await db.from('episodes')
      .update({ status: 'produced', video_id: video.id })
      .eq('id', episode.id);

    return { ok: true, credits, episode: { ...episode, video_id: video.id } };
  } catch (e) {
    await db.from('episodes').update({ status: 'failed' }).eq('id', episode.id);
    return { ok: false, credits, error: e.message };
  }
}

// ─── Registro de ejecución ────────────────────────────────────────────

async function startRun(seriesId) {
  const { data, error } = await db.from('orchestrator_runs')
    .insert({ series_id: seriesId, stage: 'inicio' })
    .select('id').single();
  if (error) throw new Error(`no se pudo registrar la corrida: ${error.message}`);
  return data.id;
}

const setStage = (id, stage) =>
  db.from('orchestrator_runs').update({ stage }).eq('id', id);

const finishRun = (id, status, credits, report) =>
  db.from('orchestrator_runs').update({
    status, stage: status, credits_spent: credits,
    finished_at: new Date().toISOString(), report,
  }).eq('id', id);

const loadSeries = async id => {
  const { data } = await db.from('series').select('*').eq('id', id).maybeSingle();
  return data;
};
