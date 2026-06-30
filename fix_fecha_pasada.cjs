const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function get(p) {
  return new Promise(r => {
    https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: p, method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => r(JSON.parse(d)));
    }).end();
  });
}
function put(p, b) {
  return new Promise(r => {
    const x = JSON.stringify(b);
    const q = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: p, method: 'PUT', headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(x) } }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => r({ status: rr.statusCode, body: d }));
    });
    q.write(x); q.end();
  });
}
const ALLOWED = ['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];

(async () => {
  const wf = await get('/api/v1/workflows/XAoMeVFKqLw7KcFX');
  const node = wf.nodes.find(n => n.name === 'Buscar Calendario');
  let code = node.parameters.jsCode;

  // Replace the line that sets fecha as fallback to today, adding past-date correction
  const OLD = `fecha = fecha || new Date().toISOString().split('T')[0];`;
  const NEW = `fecha = fecha || new Date().toISOString().split('T')[0];
// Corrección automática: si el AI manda fecha pasada, usar hoy (Colombia)
{
  const hoy = new Date(new Date().toLocaleString('en-US', { timeZone: 'America/Bogota' }));
  hoy.setHours(0,0,0,0);
  const pad = n => String(n).padStart(2,'0');
  const hoyStr = hoy.getFullYear()+'-'+pad(hoy.getMonth()+1)+'-'+pad(hoy.getDate());
  const fechaDate = new Date(fecha + 'T00:00:00');
  if (fechaDate < hoy) {
    console.log('⚠️ Fecha pasada corregida:', fecha, '→', hoyStr);
    fecha = hoyStr;
  }
}`;

  if (!code.includes(OLD)) {
    console.log('Marcador no encontrado'); return;
  }
  if (code.includes('Fecha pasada corregida')) {
    console.log('Ya tiene el fix'); return;
  }

  node.parameters.jsCode = code.replace(OLD, NEW);

  const settings = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) settings[k] = wf.settings[k];
  const r = await put('/api/v1/workflows/XAoMeVFKqLw7KcFX', { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings });
  console.log('Status:', r.status === 200 ? '✅ Fecha pasada corregida automáticamente en Buscar Calendario' : r.body.slice(0,200));
})();
