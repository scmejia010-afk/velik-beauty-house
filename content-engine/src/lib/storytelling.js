/**
 * Prompts de la serie narrativa.
 *
 * El objetivo de estos prompts no es "generar contenido infantil": es
 * generar una SERIE — personajes que vuelven, un mundo consistente, un
 * arco que avanza. Eso es lo que distingue una serie de contenido de
 * plantilla ante la política de YouTube, y lo que hace que un niño pida
 * el siguiente episodio.
 */

export const SERIES_PROMPT = ({ premise, targetAge, language }) => `
Design an original animated series for children aged ${targetAge}, in ${language}.

${premise ? `Starting premise: ${premise}` : 'Invent an original premise.'}

Return JSON:
{
  "title": "distinctive series title, not generic",
  "premise": "one paragraph: the world, the stakes, why a child returns",
  "characters": [
    {
      "name": "",
      "role": "protagonist | companion | mentor | foil",
      "appearance": "specific, repeatable visual description - this exact
                     text goes into every image prompt, so it must be
                     concrete: colors, shape, clothing, distinguishing feature",
      "personality": "",
      "voice": "how they speak - vocabulary level, rhythm, catchphrase"
    }
  ],
  "setting": "the recurring place, described so it can be drawn the same way twice",
  "artStyle": "a single reusable style string appended to every image prompt.
               Name medium, palette, lighting, line quality. Must be specific
               enough that two images made a week apart look like the same show."
}

Requirements:
- 3 to 4 characters. More than that and a preschooler loses track.
- Every appearance description must be concrete enough to redraw identically.
- The premise must support at least 20 episodes without repeating itself.
- No frightening or distressing elements: these are disqualifying under
  platform policy for children's content, not merely undesirable.
`.trim();

export const EPISODES_PROMPT = ({ series, startAt, count, previously }) => `
Outline episodes ${startAt} to ${startAt + count - 1} of "${series.title}".

Series premise: ${series.premise}
Characters: ${JSON.stringify(series.characters)}
Setting: ${series.setting}

${previously?.length ? `Previously:\n${previously.join('\n')}` : 'This is the beginning of the series.'}

Return JSON array:
[{ "number": ${startAt}, "title": "", "lesson": "what the child learns",
   "synopsis": "2-3 sentences: a problem, an attempt, a resolution" }]

Requirements:
- Each episode must have its OWN problem. Do not reuse the structure of a
  previous episode with different nouns swapped in - that is exactly what
  platform policy classifies as template-based content.
- The lesson must be concrete and age-appropriate: sharing, counting to five,
  naming colors, trying again after failing.
- Carry something forward from earlier episodes. Continuity is why the
  series works and why a viewer comes back.
`.trim();

export const EPISODE_SCRIPT_PROMPT = ({ series, episode, minDurationSec }) => `
Write episode ${episode.number} of "${series.title}": "${episode.title}".

Lesson: ${episode.lesson}
Synopsis: ${episode.synopsis}
Characters: ${JSON.stringify(series.characters)}
Setting: ${series.setting}

The episode is produced as still illustrations with narration over them,
so each scene is ONE image plus the narration spoken over it.

Return JSON:
{
  "title": "",
  "hook": "the first spoken line. It must land within 3 seconds and make a
           child stay. This single line decides the reach of the episode.",
  "scenes": [
    {
      "imagePrompt": "what to draw. Include the full appearance text of every
                      character present, verbatim from the character bible -
                      the image model has no memory of previous episodes.",
      "narration": "what is spoken over this image",
      "seconds": 8
    }
  ],
  "durationSec": 0
}

Requirements:
- Total duration at least ${minDurationSec} seconds. Below 60 the episode
  earns nothing on TikTok or Facebook, however well it performs.
- 8 to 12 scenes. Each scene 6 to 10 seconds.
- Narration pace: roughly 2 words per second for this age group. Faster and
  they stop following.
- Every character's appearance text must be repeated verbatim in each
  imagePrompt where they appear. This is what keeps the series visually
  coherent across episodes made on different days.
- Vocabulary for ages ${series.target_age}. Short sentences.
- Nothing frightening, sad without resolution, or distressing.
`.trim();

/**
 * Envoltorio sobre un modelo de lenguaje. El orquestador recibe esto como
 * `ai` y no sabe qué proveedor hay detrás.
 */
export function makeStoryAI({ complete }) {
  const json = async (prompt, label) => {
    const raw = await complete(prompt);
    try {
      // Los modelos a veces envuelven el JSON en un bloque de código.
      const cleaned = raw.trim().replace(/^```(?:json)?\s*|\s*```$/g, '');
      return JSON.parse(cleaned);
    } catch {
      throw new Error(`${label}: la respuesta no es JSON válido: ${raw.slice(0, 200)}`);
    }
  };

  return {
    outlineSeries: args => json(SERIES_PROMPT(args), 'outlineSeries'),
    outlineEpisodes: args => json(EPISODES_PROMPT(args), 'outlineEpisodes'),
    writeEpisode: async args => {
      const draft = await json(EPISODE_SCRIPT_PROMPT(args), 'writeEpisode');
      // El modelo suele reportar mal la duración total: la recalculamos.
      draft.durationSec = (draft.scenes ?? []).reduce((a, s) => a + (s.seconds ?? 0), 0);
      draft.narration = (draft.scenes ?? []).map(s => s.narration).join(' ');
      return draft;
    },
  };
}
