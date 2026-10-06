/**
 * Puente a Higgsfield para producción por imágenes.
 *
 * Esta es la decisión económica central del proyecto: generar imágenes fijas
 * y animarlas por software cuesta ~10 créditos por episodio, contra ~84 si
 * se genera video. Con cupo mensual limitado, esa diferencia es la que
 * decide si el proyecto produce 10 piezas al mes o 90.
 *
 * El ensamblaje (paneo y zoom sobre imagen fija, sincronizado con la
 * narración) es procesamiento de video local: no consume créditos.
 */
const BASE = process.env.HIGGSFIELD_API_BASE ?? 'https://api.higgsfield.ai';

function requireKey() {
  const key = process.env.HIGGSFIELD_API_KEY;
  if (!key) throw new Error('falta HIGGSFIELD_API_KEY');
  return key;
}

async function call(path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${requireKey()}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Higgsfield ${path} ${res.status}: ${JSON.stringify(json)}`);
  return json;
}

export function makeHiggsfield() {
  return {
    /**
     * Las imágenes se generan en lote. El estilo y la descripción de los
     * personajes vienen repetidos en cada prompt desde el orquestador: el
     * modelo de imagen no recuerda episodios anteriores, así que la
     * coherencia visual de la serie depende de esa repetición literal.
     */
    async generateImageBatch(scenes) {
      const { jobs } = await call('/v1/images/batch', {
        items: scenes.map(s => ({ prompt: s.prompt, aspect_ratio: '9:16' })),
      });
      return jobs;
    },

    async generateAudio({ text, voiceId }) {
      return call('/v1/audio', { text, voice_id: voiceId });
    },

    /**
     * Ensamblaje local con ffmpeg: paneo/zoom sobre cada imagen por la
     * duración de su narración, concatenado y mezclado con el audio.
     * No consume créditos — por eso este formato cambia la economía.
     */
    async assembleFromImages({ images, audio, durations }) {
      if (images.length !== durations.length) {
        throw new Error(`desajuste: ${images.length} imágenes y ${durations.length} duraciones`);
      }
      return call('/v1/assemble', {
        images: images.map(i => i.url ?? i),
        audio_url: audio.url ?? audio,
        durations,
        effect: 'ken_burns',
        aspect_ratio: '9:16',
      });
    },
  };
}
