/**
 * Prueba en seco de la lógica que no depende de la base de datos:
 * los prompts de la serie y las compuertas de validación.
 *
 * El orquestador completo requiere Supabase y credenciales reales; esto
 * verifica que la lógica de decisión es correcta antes de conectar nada.
 */
import { SERIES_PROMPT, EPISODES_PROMPT, EPISODE_SCRIPT_PROMPT, makeStoryAI } from '../src/lib/storytelling.js';
import { checkAuthenticity } from '../src/lib/kids.js';
import { validateForMonetization } from '../src/lib/quota.js';

let fail = 0;
const check = (name, cond, detail = '') => {
  console.log(`  ${cond ? 'OK  ' : 'FALLA'} ${name}${detail ? ' — ' + detail : ''}`);
  if (!cond) fail++;
};

console.log('\n=== Prompts de la serie ===');
const series = {
  title: 'The Lantern Grove', premise: 'Three friends light the forest at dusk.',
  characters: [{ name: 'Pip', appearance: 'small round owl, teal feathers, yellow scarf' }],
  setting: 'a forest of glass trees', art_style: 'soft gouache, warm dusk palette',
  target_age: '3-6',
};
const sp = SERIES_PROMPT({ premise: 'friends in a forest', targetAge: '3-6', language: 'en' });
check('SERIES_PROMPT pide biblia de personajes', sp.includes('appearance'));
check('SERIES_PROMPT exige estilo reutilizable', sp.includes('artStyle'));
check('SERIES_PROMPT prohibe contenido angustiante', sp.toLowerCase().includes('distressing'));

const ep = EPISODES_PROMPT({ series, startAt: 4, count: 2, previously: ['3. Rain: they fixed a lamp'] });
check('EPISODES_PROMPT continua el arco', ep.includes('Previously') && ep.includes('3. Rain'));
check('EPISODES_PROMPT prohibe reusar estructura', ep.includes('template-based'));

const scr = EPISODE_SCRIPT_PROMPT({ series, episode: { number: 4, title: 'The Lost Scarf', lesson: 'sharing', synopsis: 'x' }, minDurationSec: 70 });
check('SCRIPT_PROMPT exige duracion minima', scr.includes('70 seconds'));
check('SCRIPT_PROMPT repite apariencia por escena', scr.includes('verbatim'));
check('SCRIPT_PROMPT pide hook de 3 segundos', scr.includes('3 seconds'));

console.log('\n=== Recalculo de duracion (el modelo la reporta mal) ===');
const ai = makeStoryAI({
  complete: async () => JSON.stringify({
    title: 'The Lost Scarf', hook: 'Pip cannot find his scarf!',
    scenes: [
      { imagePrompt: 'a', narration: 'one', seconds: 8 },
      { imagePrompt: 'b', narration: 'two', seconds: 9 },
    ],
    durationSec: 999,   // valor incorrecto a propósito
  }),
});
const draft = await ai.writeEpisode({ series, episode: { number: 4 }, minDurationSec: 70 });
check('duracion recalculada desde las escenas', draft.durationSec === 17, `obtuvo ${draft.durationSec}`);
check('narracion unida desde las escenas', draft.narration === 'one two');

console.log('\n=== Compuerta de monetizacion ===');
check('rechaza 17s en TikTok', !validateForMonetization({ duration_sec: 17 }, 'tiktok').ok);
check('acepta 75s en TikTok', validateForMonetization({ duration_sec: 75 }, 'tiktok').ok);

console.log('\n=== Compuerta de autenticidad ===');
const prev = [{ title: 'Ep 1', hook: 'Pip cannot find his scarf!', script: 'pip searched everywhere around the glass forest looking under every lantern' }];
const dup = checkAuthenticity(
  { title: 'Ep 2', hook: 'Pip cannot find his scarf!', script: 'pip searched everywhere around the glass forest looking under every lantern', ai_generated: true, ai_disclosed: true, human_reviewed: true },
  prev
);
check('bloquea episodio duplicado', !dup.ok, `${dup.problems.length} problemas`);

const fresh = checkAuthenticity(
  { title: 'Ep 2', hook: 'A glass tree went dark tonight.', script: 'the tallest tree stopped glowing so the friends climbed to discover a sleeping firefly inside', ai_generated: true, ai_disclosed: true, human_reviewed: true },
  prev
);
check('acepta episodio genuinamente distinto', fresh.ok, fresh.problems.join('; '));

const undisclosed = checkAuthenticity(
  { title: 'Ep 3', hook: 'z', script: 'completely different words here about counting stars', ai_generated: true, ai_disclosed: false, human_reviewed: true },
  prev
);
check('bloquea falta de divulgacion de IA', !undisclosed.ok);

console.log(fail ? `\n${fail} verificaciones fallaron\n` : '\nTodas las verificaciones pasaron\n');
process.exit(fail ? 1 : 0);
