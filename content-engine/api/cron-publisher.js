import { assertCron } from './_guard.js';
import { runPublisher } from '../src/agents/publisher.js';

export default async function handler(req, res) {
  if (!assertCron(req, res)) return;
  try {
    res.status(200).json(await runPublisher({}));
  } catch (e) {
    console.error('publisher falló:', e);
    res.status(500).json({ error: e.message });
  }
}
