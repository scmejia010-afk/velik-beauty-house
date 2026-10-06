/**
 * Cola de revisión humana. En el nicho infantil la revisión no es un
 * lujo: la política de YouTube prohíbe contenido "angustiante" y eso no
 * se detecta automáticamente. El trigger de la base impide encolar
 * cualquier pieza que no haya pasado por aquí.
 */
import { db } from '../src/lib/db.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { data, error } = await db
      .from('videos')
      .select('id, title, hook, script, duration_sec, media_url, authenticity, accounts(handle, platform)')
      .eq('status', 'ready')
      .eq('human_reviewed', false)
      .order('created_at');
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ pending: data });
  }

  if (req.method === 'POST') {
    const { videoId, approved, reviewer, notes } = req.body ?? {};
    if (!videoId || typeof approved !== 'boolean' || !reviewer) {
      return res.status(400).json({ error: 'se requieren videoId, approved y reviewer' });
    }

    if (!approved) {
      const { error } = await db.from('videos')
        .update({ status: 'archived', reviewed_by: reviewer, reviewed_at: new Date().toISOString() })
        .eq('id', videoId);
      return error ? res.status(500).json({ error: error.message })
                   : res.status(200).json({ ok: true, outcome: 'rechazado' });
    }

    const { error } = await db.from('videos').update({
      human_reviewed: true,
      reviewed_by: reviewer,
      reviewed_at: new Date().toISOString(),
      authenticity: { notes },
    }).eq('id', videoId);
    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ ok: true, outcome: 'aprobado, listo para encolar' });
  }

  res.status(405).json({ error: 'método no permitido' });
}
