import { createClient } from '@supabase/supabase-js';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  throw new Error(
    'faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY. '
    + 'Los agentes corren en servidor y necesitan la clave de servicio, '
    + 'no la anónima.'
  );
}

export const db = createClient(url, key, { auth: { persistSession: false } });
