// Sedes participantes de la campaña PowerShakes (deduplicadas)
export const SEDES_POWERSHAKES = [
  "Tesoro",
  "San Lucas",
  "Viva Envigado",
  "Mero",
  "Amsterdam Terraza",
  "Sedes Club",
  "Wake",
  "Amsterdam",
  "Envigado",
  "Aguacatala",
  "Laureles",
  "Santa Barbara",
  "La 93",
] as const;

// Vigencia de la campaña: 1 de julio - 31 de agosto de 2026
export const CAMPANA_INICIO = new Date("2026-07-01T00:00:00-05:00");
export const CAMPANA_FIN = new Date("2026-08-31T23:59:59-05:00");

export function campanaActiva(fecha: Date = new Date()): boolean {
  return fecha >= CAMPANA_INICIO && fecha <= CAMPANA_FIN;
}

// Caracteres sin ambigüedad visual (sin 0/O, 1/I/L) para que el código
// se pueda leer y digitar a mano sin errores en el punto de canje.
const ALFABETO_CODIGO = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function generarCodigo(longitud = 6): string {
  const bytes = new Uint8Array(longitud);
  crypto.getRandomValues(bytes);
  let sufijo = "";
  for (const byte of bytes) {
    sufijo += ALFABETO_CODIGO[byte % ALFABETO_CODIGO.length];
  }
  return `PS-${sufijo}`;
}

export function normalizarCodigo(codigo: string): string {
  return codigo.trim().toUpperCase().replace(/\s+/g, "");
}
