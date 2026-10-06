import { assertCron } from './_guard.js';
import { runAnalyst } from '../src/agents/analyst.js';

export default async function handler(req, res) {
  if (!assertCron(req, res)) return;
  try {
    res.status(200).json(await runAnalyst({}));
  } catch (e) {
    console.error('analyst falló:', e);
    res.status(500).json({ error: e.message });
  }
}
