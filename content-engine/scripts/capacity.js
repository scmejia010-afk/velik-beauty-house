/** Dimensiona el sistema antes de construir más: capacidad e ingreso esperado. */
import { PLATFORM_LIMITS, dailyCapacity } from '../src/lib/limits.js';
import { projectKidsRevenue, KIDS_RPM } from '../src/lib/kids.js';

const SETUP = [
  { platform: 'facebook',  count: 5 },
  { platform: 'tiktok',    count: 5 },
  { platform: 'youtube',   count: 3 },
  { platform: 'instagram', count: 5 },
];

const accounts = SETUP.flatMap(s =>
  Array.from({ length: s.count }, () => ({ active: true, platform: s.platform }))
);

console.log('=== Capacidad diaria de publicación ===');
for (const s of SETUP) {
  const perDay = PLATFORM_LIMITS[s.platform].postsPerDay;
  console.log(`  ${s.platform.padEnd(10)} ${s.count} cuentas x ${perDay}/dia = ${s.count * perDay}`);
}
console.log(`  TOTAL: ${dailyCapacity(accounts)} piezas/dia\n`);

console.log('=== Ingreso mensual estimado, nicho infantil, 3000 vistas/pieza ===');
for (const s of SETUP) {
  const key = s.platform === 'youtube' ? 'youtube_long' : s.platform;
  if (!KIDS_RPM[key]) continue;
  const p = projectKidsRevenue({
    platform: key,
    postsPerDay: s.count * PLATFORM_LIMITS[s.platform].postsPerDay,
    viewsPerPost: 3000,
  });
  console.log(`  ${s.platform.padEnd(10)} USD ${String(p.low).padStart(8)} – ${p.high}`);
}
console.log('\nNota: COPPA aplicado. El RPM infantil es ~80% menor que el de');
console.log('audiencia general por la prohibicion de anuncios personalizados.');

// ---------------------------------------------------------------
// Realidad vs techo teórico
// ---------------------------------------------------------------
// Las cifras de arriba son el LÍMITE DE LA API, no una proyección.
// Tres cuellos de botella reales las reducen drásticamente:
//
// 1. Revisión humana. Obligatoria en nicho infantil. Una persona revisa
//    unas 30-40 piezas/día con atención real. Ese es el techo del sistema,
//    no las 593 de la API.
// 2. Costo de producción. Cada pieza de 70s consume créditos de Higgsfield.
//    A escala, el costo de generación puede superar el ingreso.
// 3. Vistas por pieza. 3000 vistas sostenidas en TODAS las piezas es
//    optimista. Lo normal es una distribución de cola larga: la mayoría
//    bajo 500 vistas y unas pocas que despegan.

const REALISTIC = { reviewedPerDay: 35, avgViews: 800 };

console.log('\n=== Escenario realista ===');
console.log(`  ${REALISTIC.reviewedPerDay} piezas/dia (techo de revision humana)`);
console.log(`  ${REALISTIC.avgViews} vistas promedio/pieza\n`);

const real = projectKidsRevenue({
  platform: 'facebook',
  postsPerDay: REALISTIC.reviewedPerDay,
  viewsPerPost: REALISTIC.avgViews,
});
console.log(`  Facebook (la de mayor RPM): USD ${real.low} – ${real.high} /mes`);
console.log('\n  Contra esto hay que restar creditos de Higgsfield y las horas');
console.log('  de revision. Medir el margen real en el primer mes antes de');
console.log('  escalar el numero de cuentas.');
