/**
 * Simulación del orquestador de punta a punta, con base de datos en memoria
 * y respuestas de modelo falsas. No gasta créditos ni toca Supabase.
 *
 * Sirve para ver la cadena completa en texto y confirmar que las etapas,
 * el presupuesto y las compuertas se comportan como se espera.
 */
import { setDbClient } from '../src/lib/db.js';
import { makeStoryAI } from '../src/lib/storytelling.js';

// ─── Base de datos en memoria ─────────────────────────────────────────
const tables = { series: [], episodes: [], videos: [], orchestrator_runs: [] };
let ids = 0;
const newId = () => `id-${++ids}`;

function makeFakeDb() {
  return {
    from(table) {
      const rows = tables[table] ??= [];
      const q = {
        _filters: [], _limit: Infinity, _single: false,
        select() { return q; },
        eq(c, v) { q._filters.push(r => r[c] === v); return q; },
        in(c, vs) { q._filters.push(r => vs.includes(r[c])); return q; },
        not() { return q; },
        gte() { return q; },
        lte() { return q; },
        order() { return q; },
        limit(n) { q._limit = n; return q; },
        maybeSingle() { q._single = true; return q.then(x => x); },
        single() { q._single = true; return q.then(x => x); },
        insert(payload) {
          const items = (Array.isArray(payload) ? payload : [payload])
            .map(p => ({ id: newId(), created_at: new Date().toISOString(), ...p }));
          rows.push(...items);
          const r = { data: items[0], error: null };
          return { select: () => ({ single: async () => r, then: f => f(r) }), then: f => f(r) };
        },
        update(patch) {
          return {
            eq(c, v) {
              const hits = rows.filter(r => r[c] === v);
              hits.forEach(r => Object.assign(r, patch));
              const r = { data: hits[0] ?? null, error: null };
              return { select: () => ({ single: async () => r, then: f => f(r) }), then: f => f(r) };
            },
          };
        },
        then(resolve) {
          let out = rows.filter(r => q._filters.every(f => f(r)));
          out = out.slice(0, q._limit);
          return Promise.resolve(resolve({
            data: q._single ? (out[0] ?? null) : out,
            error: null,
          }));
        },
      };
      return q;
    },
    rpc: async () => ({ error: null }),
  };
}

// ─── Modelo falso: devuelve una serie y episodios distintos entre sí ──
let epCounter = 0;
const FAKE_SCENES = [
  ['a teal owl under a glass tree', 'Pip the owl woke up early today.'],
  ['the owl looking at an unlit lantern', 'But one lantern would not glow.'],
  ['the owl flying upward', 'So Pip flew up to look inside.'],
  ['a sleeping firefly in the lantern', 'A tiny firefly was fast asleep!'],
  ['the owl whispering', 'Pip whispered very, very softly.'],
  ['the firefly waking and glowing', 'The firefly woke and lit the grove.'],
  ['friends dancing in warm light', 'All the friends danced in the light.'],
  ['the grove glowing at dusk', 'And the grove was bright again.'],
  ['the owl waving goodnight', 'Goodnight, little firefly. Goodnight.'],
];

const fakeComplete = async prompt => {
  if (prompt.includes('Design an original animated series')) {
    return JSON.stringify({
      title: 'The Lantern Grove',
      premise: 'Three friends keep a forest of glass trees glowing at dusk.',
      characters: [
        { name: 'Pip', role: 'protagonist', appearance: 'small round owl, teal feathers, yellow scarf, large amber eyes', personality: 'curious', voice: 'soft, slow' },
        { name: 'Bo', role: 'companion', appearance: 'stout badger, grey and cream fur, red boots', personality: 'brave', voice: 'bouncy' },
      ],
      setting: 'a forest of glass trees that must be lit each evening',
      artStyle: 'soft gouache illustration, warm dusk palette, rounded shapes, gentle rim light',
    });
  }
  if (prompt.includes('Outline episodes')) {
    const start = Number(prompt.match(/Outline episodes (\d+)/)[1]);
    return JSON.stringify(
      Array.from({ length: 3 }, (_, i) => ({
        number: start + i,
        title: ['The Sleeping Firefly', 'Bo Counts the Stars', 'The Scarf in the Wind'][i],
        lesson: ['being gentle', 'counting to five', 'asking for help'][i],
        synopsis: `Episode ${start + i} synopsis, a distinct problem and resolution.`,
      }))
    );
  }
  // Guion: cada episodio recibe narración distinta para pasar la compuerta.
  epCounter++;
  return JSON.stringify({
    title: `Episode ${epCounter}`,
    hook: `Hook number ${epCounter}: something unexpected happens tonight!`,
    scenes: FAKE_SCENES.map(([img, nar], i) => ({
      imagePrompt: `${img}, variation ${epCounter}-${i}`,
      narration: `${nar} Episode ${epCounter} line ${i} with unique wording ${'alpha beta gamma delta'.split(' ')[i % 4]}${epCounter}.`,
      seconds: 9,
    })),
    durationSec: 0,
  });
};

// ─── Higgsfield falso ─────────────────────────────────────────────────
const fakeHf = {
  generateImageBatch: async scenes => scenes.map((_, i) => ({ url: `https://fake/img-${i}.png` })),
  generateAudio: async () => ({ url: 'https://fake/audio.mp3' }),
  assembleFromImages: async () => ({ url: 'https://fake/episode.mp4', jobId: 'job-fake' }),
};

// ─── Correr ───────────────────────────────────────────────────────────
setDbClient(makeFakeDb());
const { runOrchestrator } = await import('../src/agents/orchestrator.js');

console.log('\n════ SIMULACION DEL ORQUESTADOR ════');
console.log('Base de datos en memoria. Modelo y Higgsfield falsos.');
console.log('No gasta creditos ni toca Supabase.\n');

const result = await runOrchestrator({
  ai: makeStoryAI({ complete: fakeComplete }),
  hf: fakeHf,
  episodesToProduce: 3,
  creditBudget: Number(process.env.SIM_BUDGET ?? 60),
  seed: { premise: 'friends who light a forest', targetAge: '3-6', language: 'en' },
});

for (const s of result.stages) {
  console.log(`  [${String(s.stage).toUpperCase()}]`,
    Object.entries(s).filter(([k]) => k !== 'stage')
      .map(([k, v]) => `${k}=${typeof v === 'string' ? v : JSON.stringify(v)}`).join('  '));
}

console.log('\n──── ESTADO FINAL ────');
const serie = tables.series[0];
console.log(`Serie:       "${serie.title}"`);
console.log(`Personajes:  ${serie.characters.map(c => c.name).join(', ')}`);
console.log(`Estilo:      ${serie.art_style}`);
console.log(`Episodios:   ${tables.episodes.length}`);
for (const e of tables.episodes) {
  console.log(`  ${e.number}. ${e.title.padEnd(24)} [${e.status}]  leccion: ${e.lesson}`);
}
console.log(`\nVideos listos para revision: ${tables.videos.length}`);
for (const v of tables.videos) {
  console.log(`  "${v.title}"`);
  console.log(`     ${v.duration_sec}s · modo=${v.production_mode} · revisado=${v.human_reviewed} · divulgado=${v.ai_disclosed}`);
}
console.log(`\nCreditos gastados: ${result.creditsSpent} de ${process.env.SIM_BUDGET ?? 60} de presupuesto`);
console.log(`Corrida: ${tables.orchestrator_runs[0].status}\n`);
