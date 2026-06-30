const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const NEW_CAL_ID = 'yePA3PPHJC9Fdu6A6WMt';
const OLD_CAL_ID = 'zYV9rksCr1rA2hARD5a4'; // CABELLO temp

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
function filterSettings(wf) {
  const s = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) s[k] = wf.settings[k];
  return s;
}

async function updateWf(wfId, nodeName) {
  const wf = await get(`/api/v1/workflows/${wfId}`);
  const node = wf.nodes.find(n => n.name === nodeName);
  if (!node) { console.log('Nodo no encontrado:', nodeName); return; }

  // Replace old temp calendar ID with real valoracion ID
  const before = node.parameters.jsCode;
  node.parameters.jsCode = node.parameters.jsCode.replaceAll(OLD_CAL_ID, NEW_CAL_ID);

  if (before === node.parameters.jsCode) {
    console.log(`${wfId}/${nodeName}: ya usa el ID correcto o no tiene el temp ID`);
    return;
  }

  const r = await put(`/api/v1/workflows/${wfId}`, {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: filterSettings(wf)
  });
  console.log(`${wfId} (${nodeName}) → Status:`, r.status, r.status === 200 ? '✅' : r.body.slice(0,200));
}

(async () => {
  await updateWf('XAoMeVFKqLw7KcFX', 'Buscar Calendario');
  await updateWf('3UMIZGQy4HCmBN6v', 'Parsear Datos');
  console.log('\n✅ Valoración de Cabello apunta al calendario correcto:', NEW_CAL_ID);
})();
