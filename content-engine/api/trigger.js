/**
 * Disparo manual del orquestador desde el panel.
 *
 * Protegido con el mismo secreto que los crons: este endpoint gasta
 * créditos, así que no puede quedar abierto.
 */
import { runOrchestrator } from '../src/agents/orchestrator.js';
import { makeStoryAI } from '../src/lib/storytelling.js';
import { makeHiggsfield } from '../src/lib/higgsfield.js';
import { completeWithClaude } from '../src/lib/llm.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'método no permitido' });

  const secret = process.env.PANEL_SECRET;
  if (!secret || req.headers['x-panel-secret'] !== secret) {
    return res.status(401).json({ error: 'no autorizado' });
  }

  const { seriesId, episodes = 3, creditBudget = 30, premise } = req.body ?? {};
  try {
    const result = await runOrchestrator({
      ai: makeStoryAI({ complete: completeWithClaude }),
      hf: makeHiggsfield(),
      seriesId: seriesId ?? null,
      episodesToProduce: Number(episodes),
      // Tope conservador por defecto: un disparo manual accidental no
      // debe poder consumir el cupo del mes.
      creditBudget: Number(creditBudget),
      seed: { premise, targetAge: '3-6', language: 'en' },
    });
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
