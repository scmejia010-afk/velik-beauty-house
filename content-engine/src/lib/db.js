import { createClient } from '@supabase/supabase-js';

let client = null;

/**
 * Permite sustituir el cliente por uno falso en pruebas y simulaciones.
 * Sin esta costura, la cadena del orquestador solo se puede ejercitar
 * contra una base real, lo que la vuelve imposible de probar en seco.
 */
export function setDbClient(fake) {
  client = fake;
}

function real() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      'faltan SUPABASE_URL y SUPABASE_SERVICE_ROLE_KEY. Los agentes corren '
      + 'en servidor y necesitan la clave de servicio, no la anónima.'
    );
  }
  return createClient(url, key, { auth: { persistSession: false } });
}

/** Inicialización diferida: importar este módulo no exige credenciales. */
export const db = new Proxy({}, {
  get(_, prop) {
    client ??= real();
    const value = client[prop];
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
