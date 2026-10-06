/**
 * Crear y listar series desde el panel.
 *
 * Antes la premisa vivía en una variable de entorno, lo que obligaba a
 * redesplegar para cambiar de historia. Aquí se escribe y se elige.
 */
import { db } from '../src/lib/db.js';
import { makeStoryAI } from '../src/lib/storytelling.js';
import { completeWithClaude } from '../src/lib/llm.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('series')
      .select('id, title, premise, characters, art_style, setting, status, episode_count, language, target_age')
      .order('created_at', { ascending: false });
    return error ? res.status(500).json({ error: error.message })
                 : res.status(200).json({ series: data });
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'método no permitido' });

  const secret = process.env.PANEL_SECRET;
  if (!secret || req.headers['x-panel-secret'] !== secret) {
    return res.status(401).json({ error: 'no autorizado' });
  }

  const { premise, language = 'en', targetAge = '3-6', accountId = null } = req.body ?? {};
  if (!premise || premise.trim().length < 10) {
    return res.status(400).json({ error: 'describe la historia en al menos 10 caracteres' });
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(400).json({
      error: 'falta ANTHROPIC_API_KEY en las variables de entorno: sin ella no se '
           + 'puede escribir la biblia de personajes',
    });
  }

  try {
    const ai = makeStoryAI({ complete: completeWithClaude });
    // El modelo convierte una idea suelta en una biblia reutilizable:
    // personajes con descripción repetible y un estilo visual fijo. Eso es
    // lo que mantiene la serie coherente entre episodios.
    const draft = await ai.outlineSeries({ premise, targetAge, language });

    const { data, error } = await db.from('series').insert({
      account_id: accountId,
      title: draft.title,
      premise: draft.premise,
      characters: draft.characters,
      setting: draft.setting,
      art_style: draft.artStyle,
      target_age: targetAge,
      language,
      status: 'active',
    }).select().single();
    if (error) throw new Error(error.message);

    res.status(200).json({ series: data });
  } catch (e) {
    console.error('creación de serie falló:', e);
    res.status(500).json({ error: e.message });
  }
}
