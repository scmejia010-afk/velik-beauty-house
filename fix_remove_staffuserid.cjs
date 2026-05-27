const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function get(path) {
  return new Promise((res) => {
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'GET', headers: { 'X-N8N-API-KEY': N8N_KEY } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.end();
  });
}

function put(path, body) {
  return new Promise((res) => {
    const b = JSON.stringify(body);
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'PUT', headers: { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.write(b); req.end();
  });
}

async function run() {
  const wf = await get('/api/v1/workflows/XAoMeVFKqLw7KcFX');

  const httpNode = wf.nodes.find(x =>
    x.type === 'n8n-nodes-base.httpRequest' &&
    JSON.stringify(x.parameters).includes('free-slots')
  );

  if (!httpNode) { console.log('node not found'); return; }

  // Remove staffUserId from query parameters
  if (httpNode.parameters.queryParameters && httpNode.parameters.queryParameters.parameters) {
    const before = httpNode.parameters.queryParameters.parameters.length;
    httpNode.parameters.queryParameters.parameters =
      httpNode.parameters.queryParameters.parameters.filter(p => p.name !== 'staffUserId');
    const after = httpNode.parameters.queryParameters.parameters.length;
    console.log(`Removed ${before - after} staffUserId param(s)`);
  }

  const r = await put('/api/v1/workflows/XAoMeVFKqLw7KcFX', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Saved:', r.name || r.message);
}
run();
