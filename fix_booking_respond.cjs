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

async function fixWorkflow(id, label) {
  const wf = await get(`/api/v1/workflows/${id}`);

  const respondNode = wf.nodes.find(x => x.type === 'n8n-nodes-base.respondToWebhook');
  if (!respondNode) { console.log(`✗ ${label}: respond node not found`); return; }

  // Fix: use firstIncomingItem instead of manual JSON.stringify
  respondNode.parameters = {
    respondWith: "firstIncomingItem",
    options: {
      responseHeaders: {
        entries: [
          { name: "Access-Control-Allow-Origin", value: "*" },
          { name: "Access-Control-Allow-Methods", value: "GET, POST, OPTIONS" },
          { name: "Access-Control-Allow-Headers", value: "Content-Type" },
          { name: "Content-Type", value: "application/json" }
        ]
      }
    }
  };

  const r = await put(`/api/v1/workflows/${id}`, {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log(`✓ ${label} saved:`, r.name || r.message);
}

async function run() {
  await fixWorkflow('jpOw212sgiLhBhuJ', 'Booking Slots');
  await fixWorkflow('lRc6MNdkw7wRK6Kj', 'Booking Crear');
}
run();
