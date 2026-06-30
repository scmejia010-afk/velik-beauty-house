const https = require('https');
const fs = require('fs');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const NEW_PROMPT = fs.readFileSync('prompt_eli_fusionado.txt', 'utf8');
const ALLOWED = ['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];

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

async function applyPrompt(wfId) {
  const wf = await get(`/api/v1/workflows/${wfId}`);
  const agent = wf.nodes.find(n => n.name === 'AI Agent');
  if (!agent) { console.log(wfId, '— AI Agent no encontrado'); return; }

  if (agent.parameters.systemMessage !== undefined) agent.parameters.systemMessage = NEW_PROMPT;
  else agent.parameters.systemMessage = NEW_PROMPT;

  const settings = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) settings[k] = wf.settings[k];
  const r = await put(`/api/v1/workflows/${wfId}`, { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings });
  console.log(wfId, '→', r.status === 200 ? '✅' : r.body.slice(0, 200));
}

(async () => {
  await applyPrompt('oTWJ2XHBAZCINO7A'); // VELIK BEAUTY HOUSE - GHL
  await applyPrompt('pxrts3w3K1pMwnKN'); // VELIK GHL NUEVO
})();
