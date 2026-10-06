/**
 * Los endpoints de cron quedan expuestos públicamente en Vercel.
 * Sin esta verificación cualquiera puede disparar publicaciones y quemar
 * el cupo diario, que no se recupera hasta el día siguiente.
 */
export function assertCron(req, res) {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    res.status(500).json({ error: 'CRON_SECRET no configurado' });
    return false;
  }
  if (req.headers.authorization !== `Bearer ${expected}`) {
    res.status(401).json({ error: 'no autorizado' });
    return false;
  }
  return true;
}
