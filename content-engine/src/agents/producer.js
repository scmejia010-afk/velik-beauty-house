/**
 * Agente 3 — Producer. Producción audiovisual vía Higgsfield.
 *
 * Una pieza de +70s no sale de una sola generación: se arma por secuencias
 * y se le monta la voz de la cuenta. Cada cuenta tiene su propia voz del
 * banco `voices` para que los canales no suenen iguales — si suenan iguales,
 * la política de contenido de plantilla aplica a la red entera, no a un video.
 */
import { db } from '../lib/db.js';

const SEGMENT_SEC = 10;

export async function runProducer({ hf, limit = 5 }) {
  const { data: videos, error } = await db
    .from('videos')
    .select('id, title, hook, script, duration_sec, account_id, accounts(voice_id, language)')
    .eq('status', 'draft')
    .limit(limit);
  if (error) throw new Error(`no se pudieron leer los guiones: ${error.message}`);

  const out = { produced: 0, failed: [] };

  for (const video of videos ?? []) {
    await db.from('videos').update({ status: 'generating' }).eq('id', video.id);
    try {
      const segments = Math.ceil(video.duration_sec / SEGMENT_SEC);
      const scenes = splitScript(video.script, segments);

      // Filtro de viralidad ANTES de gastar cupo de publicación:
      // descartar aquí cuesta créditos; descartar después cuesta un slot
      // de los 15 diarios, que no se recupera.
      const clips = await hf.generateVideoBatch(
        scenes.map(s => ({ prompt: s, duration: SEGMENT_SEC }))
      );

      const voice = await hf.generateAudio({
        text: video.script,
        voiceId: video.accounts?.voice_id,
      });

      const media = await hf.assemble({ clips, audio: voice, targetSec: video.duration_sec });

      const { error: upErr } = await db.from('videos')
        .update({ status: 'ready', media_url: media.url, hf_job_id: media.jobId })
        .eq('id', video.id);
      if (upErr) throw new Error(upErr.message);
      out.produced++;
    } catch (e) {
      await db.from('videos')
        .update({ status: 'failed' })
        .eq('id', video.id);
      out.failed.push({ id: video.id, error: e.message });
    }
  }
  return out;
}

/** Reparte el guion en escenas por frase, equilibrando la duración. */
function splitScript(script, segments) {
  const sentences = script.split(/(?<=[.!?])\s+/).filter(Boolean);
  if (sentences.length <= segments) return sentences;
  const perSegment = Math.ceil(sentences.length / segments);
  return Array.from({ length: segments }, (_, i) =>
    sentences.slice(i * perSegment, (i + 1) * perSegment).join(' ')
  ).filter(Boolean);
}
