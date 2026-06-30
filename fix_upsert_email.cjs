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
  const wf = await get('/api/v1/workflows/lRc6MNdkw7wRK6Kj');

  // Find Upsert Contacto node
  const node = wf.nodes.find(n => n.name === 'Upsert Contacto');
  if (!node) {
    console.log('Nodos disponibles:', wf.nodes.map(n => n.name));
    return;
  }

  console.log('Upsert Contacto body params:');
  const params = node.parameters?.bodyParameters?.parameters || node.parameters?.body?.parameters || [];
  params.forEach(p => console.log(' -', p.name, ':', p.value));

  // Fix: remove email param if empty, or add condition
  // The email is sent as `={{ $json.body.email }}` which evaluates to "" → causes 422
  // Fix: filter out empty email by using a Code node before, OR by removing email from Upsert and only adding if present

  // Find email parameter and fix it
  const emailParam = params.find(p => p.name === 'email');
  if (emailParam) {
    // Change to only send email if non-empty
    emailParam.value = '={{ $json.body.email && $json.body.email.trim() ? $json.body.email.trim() : undefined }}';
    console.log('\nEmail param actualizado a condicional');
  } else {
    console.log('\nNo se encontró param email — revisar estructura del nodo');
    console.log('node.parameters:', JSON.stringify(node.parameters).slice(0, 800));
    return;
  }

  const settings = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) settings[k] = wf.settings[k];

  const r = await put('/api/v1/workflows/lRc6MNdkw7wRK6Kj', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings
  });
  console.log('Status:', r.status, r.status === 200 ? '✅ Upsert Contacto corregido' : r.body.slice(0,300));
})();
