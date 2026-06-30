const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
// Supabase service role key (valid JWT)
const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxb3p0enpuc3hodmN6a2Fub3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA1OTg3NSwiZXhwIjoyMDk1NjM1ODc1fQ.2Jxnj_q9ni2p8H4wuOP-u9QIDTYkkjdenaTPDjjQFmc';

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
  const wf = await get('/api/v1/workflows/lRc6MNdkw7wRK6Kj');
  const node = wf.nodes.find(n => n.name === 'Guardar Supabase Web');
  if (!node) { console.log('Nodo no encontrado'); return; }

  console.log('Headers actuales:');
  const headers = node.parameters?.headerParameters?.parameters || [];
  headers.forEach(h => console.log(' ', h.name, ':', h.value?.slice?.(0, 60)));

  // Fix any broken JWT in apikey and Authorization headers
  let fixed = false;
  for (const h of headers) {
    if ((h.name === 'apikey' || h.name === 'Authorization') && !h.value.includes('.')) {
      console.log('Corrigiendo header:', h.name);
      h.value = h.name === 'apikey' ? SUPA_KEY : 'Bearer ' + SUPA_KEY;
      fixed = true;
    }
    // Also fix if Authorization doesn't have Bearer prefix properly
    if (h.name === 'Authorization' && h.value && !h.value.startsWith('Bearer ')) {
      h.value = 'Bearer ' + SUPA_KEY;
      fixed = true;
    }
    if (h.name === 'apikey' && h.value && h.value.split('.').length !== 3) {
      h.value = SUPA_KEY;
      fixed = true;
    }
    if (h.name === 'Authorization' && h.value && h.value.replace('Bearer ', '').split('.').length !== 3) {
      h.value = 'Bearer ' + SUPA_KEY;
      fixed = true;
    }
  }

  if (!fixed) { console.log('No se detectó JWT roto — revisando URL...'); }

  const settings = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) settings[k] = wf.settings[k];

  const r = await put('/api/v1/workflows/lRc6MNdkw7wRK6Kj', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings
  });
  console.log('Status:', r.status, r.status === 200 ? '✅' : r.body.slice(0,200));
})();
