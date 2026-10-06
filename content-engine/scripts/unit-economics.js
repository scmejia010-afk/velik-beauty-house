/**
 * Economía unitaria. La pregunta que decide el proyecto:
 * ¿cuesta menos producir una pieza de lo que esa pieza genera?
 *
 * Costos reales del plan Higgsfield (consultado 2026-10):
 *   Plan Plus actual: 506 créditos disponibles.
 *   Top-up: 4000 créditos = USD 190  → ~21 créditos por dólar
 *   Plan Ultra anual: 3000 créditos/mes = USD 99/mes
 *   Referencia del plan: 3000 créditos ≈ 500 videos Kling → ~6 créditos/clip de 5s
 */

const CREDITS_PER_DOLLAR = 21;        // mejor tarifa de top-up
const CREDITS_PER_CLIP_5S = 6;        // 3000 créditos ≈ 500 videos
const CLIP_SEC = 5;

function productionCost(durationSec) {
  const clips = Math.ceil(durationSec / CLIP_SEC);
  const credits = clips * CREDITS_PER_CLIP_5S;
  return { clips, credits, usd: +(credits / CREDITS_PER_DOLLAR).toFixed(2) };
}

function revenuePerPiece(views, rpm) {
  return +((views / 1000) * rpm).toFixed(2);
}

function breakEvenViews(costUsd, rpm) {
  return Math.round((costUsd / rpm) * 1000);
}

const DURATION = 70;  // mínimo viable para monetizar en TikTok/Facebook
const cost = productionCost(DURATION);

console.log('=== COSTO DE PRODUCCION, pieza de 70s ===');
console.log(`  ${cost.clips} clips x ${CREDITS_PER_CLIP_5S} creditos = ${cost.credits} creditos`);
console.log(`  USD ${cost.usd} por pieza (solo video, sin voz ni ensamblaje)\n`);

console.log('=== INGRESO POR PIEZA, nicho infantil ===');
const SCENARIOS = [
  { label: 'YouTube infantil (COPPA, bajo)', rpm: 0.33 },
  { label: 'YouTube infantil (COPPA, alto)', rpm: 3.00 },
  { label: 'Facebook infantil (bajo)',       rpm: 0.50 },
  { label: 'Facebook infantil (alto)',       rpm: 3.00 },
];
for (const s of SCENARIOS) {
  const r800 = revenuePerPiece(800, s.rpm);
  const be = breakEvenViews(cost.usd, s.rpm);
  const verdict = r800 >= cost.usd ? 'RENTABLE' : 'PIERDE';
  console.log(
    `  ${s.label.padEnd(34)} RPM ${String(s.rpm).padStart(5)}`
    + ` | 800 vistas = USD ${String(r800).padStart(5)}`
    + ` | equilibrio: ${String(be).padStart(6)} vistas | ${verdict}`
  );
}

console.log('\n=== COMPARACION: mismo sistema, audiencia general ===');
for (const s of [
  { label: 'General, ingles, RPM bajo',  rpm: 5.00 },
  { label: 'General, ingles, RPM medio', rpm: 10.00 },
]) {
  const r800 = revenuePerPiece(800, s.rpm);
  console.log(
    `  ${s.label.padEnd(34)} RPM ${String(s.rpm).padStart(5)}`
    + ` | 800 vistas = USD ${String(r800).padStart(5)}`
    + ` | equilibrio: ${String(breakEvenViews(cost.usd, s.rpm)).padStart(6)} vistas`
    + ` | ${r800 >= cost.usd ? 'RENTABLE' : 'PIERDE'}`
  );
}

console.log('\n=== ALTERNATIVA: produccion barata (imagenes + voz, sin video generado) ===');
// Una pieza de imagen fija animada + narracion cuesta una fraccion:
// ~4 imagenes (Nano Banana, incluido en el plan) + audio.
const CHEAP_USD = 0.40;
console.log(`  Costo estimado: USD ${CHEAP_USD} por pieza (10x menos)`);
for (const s of [{ label: 'Infantil, RPM 0.33', rpm: 0.33 }, { label: 'Infantil, RPM 3.00', rpm: 3.00 }]) {
  const r800 = revenuePerPiece(800, s.rpm);
  console.log(
    `  ${s.label.padEnd(34)} | 800 vistas = USD ${String(r800).padStart(5)}`
    + ` | equilibrio: ${String(breakEvenViews(CHEAP_USD, s.rpm)).padStart(6)} vistas`
    + ` | ${r800 >= CHEAP_USD ? 'RENTABLE' : 'PIERDE'}`
  );
}
