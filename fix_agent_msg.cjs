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

(async () => {
  const wf = await get('/api/v1/workflows/pxrts3w3K1pMwnKN');
  const agent = wf.nodes.find(n => n.name === 'AI Agent');

  agent.parameters.text = "=⚠️ FECHA DE HOY (Colombia): {{ new Date($now).toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'America/Bogota' }) }} — usa esta fecha para calcular 'mañana', 'el jueves', etc. NUNCA uses fechas pasadas.\n\nmensaje del usuario:\n{{ $('Edit Fields').item.json.mensaje_usuario }}\nchat id: {{ $('Obtener ID Chat1').item.json.message.chat.id }}";

  // n8n 2.x rejects extra settings keys — send only the allowed ones
  const ALLOWED = ['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];
  const settings = {};
  for (const k of ALLOWED) if (wf.settings && wf.settings[k] !== undefined) settings[k] = wf.settings[k];

  const r = await put('/api/v1/workflows/pxrts3w3K1pMwnKN', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings
  });
  console.log('Status:', r.status);
  console.log('Body:', r.body.slice(0, 300));
})();
