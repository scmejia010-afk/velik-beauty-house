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

// ---------------------------------------------------------------
// Escenario de créditos incluidos en el plan
// ---------------------------------------------------------------
// Si el plan incluye N créditos/mes sin costo adicional, el costo marginal
// es cero hasta agotarlos. La pregunta deja de ser "¿cuánto cuesta una
// pieza?" y pasa a ser "¿cuántas piezas rinde el cupo mensual?".
//
// El cupo se vuelve el cuello de botella real del sistema, por delante de
// los límites de las APIs (593/día) y de la revisión humana (~35/día).

const MONTHLY_CREDITS = 900;

const FORMATS = [
  { label: 'Video generado, 70s', creditsPerPiece: 84 },
  // Imágenes + narración + animación por software (Ken Burns, no generación).
  // 4 imágenes a ~2 créditos + audio. El audio es barato comparado con video.
  { label: 'Imagenes + voz, 70s', creditsPerPiece: 10 },
];

console.log(`\n=== CUPO MENSUAL: ${MONTHLY_CREDITS} creditos incluidos ===\n`);

for (const f of FORMATS) {
  const pieces = Math.floor(MONTHLY_CREDITS / f.creditsPerPiece);
  console.log(`${f.label}  (${f.creditsPerPiece} creditos/pieza)`);
  console.log(`  Alcanza para ${pieces} piezas/mes  (~${(pieces / 30).toFixed(1)}/dia)`);

  for (const s of [
    { label: 'infantil RPM 0.33', rpm: 0.33 },
    { label: 'infantil RPM 3.00', rpm: 3.00 },
    { label: 'general  RPM 7.00', rpm: 7.00 },
  ]) {
    const monthly = revenuePerPiece(pieces * 800, s.rpm);
    console.log(`    ${s.label.padEnd(20)} -> USD ${monthly}/mes con 800 vistas/pieza`);
  }
  console.log('');
}

console.log('Nota: con creditos incluidos el margen es positivo por definicion');
console.log('(costo marginal cero), pero el INGRESO ABSOLUTO lo limita el cupo.');
console.log('900 creditos no son un negocio: son un presupuesto de validacion.');
