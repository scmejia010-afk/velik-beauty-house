import { assertCron } from './_guard.js';
import { runOrchestrator } from '../src/agents/orchestrator.js';
import { makeStoryAI } from '../src/lib/storytelling.js';
import { makeHiggsfield } from '../src/lib/higgsfield.js';
import { completeWithClaude } from '../src/lib/llm.js';

export default async function handler(req, res) {
  if (!assertCron(req, res)) return;
  try {
    const result = await runOrchestrator({
      ai: makeStoryAI({ complete: completeWithClaude }),
      hf: makeHiggsfield(),
      seriesId: req.query?.seriesId ?? process.env.ACTIVE_SERIES_ID ?? null,
      episodesToProduce: Number(req.query?.episodes ?? 3),
      // Tope por corrida. Con cupo mensual limitado, una corrida sin tope
      // puede consumirlo entero.
      creditBudget: Number(process.env.CREDIT_BUDGET_PER_RUN ?? 100),
      seed: {
        premise: process.env.SERIES_PREMISE,
        targetAge: '3-6',
        language: 'en',
        accountId: process.env.DEFAULT_ACCOUNT_ID,
      },
    });
    res.status(200).json(result);
  } catch (e) {
    console.error('orquestador falló:', e);
    res.status(500).json({ error: e.message });
  }
}
