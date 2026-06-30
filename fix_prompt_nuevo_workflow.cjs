const https = require('https');
const fs = require('fs');
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

const NEW_PROMPT = fs.readFileSync('prompt_eli_fusionado.txt', 'utf8');

(async () => {
  const wf = await get('/api/v1/workflows/pxrts3w3K1pMwnKN');
  const agent = wf.nodes.find(n => n.name === 'AI Agent');

  if (!agent) { console.log('No se encontró nodo AI Agent'); return; }

  // Show current system message length
  const currentPrompt = agent.parameters.systemMessage || agent.parameters.options?.systemMessage || '';
  console.log('Prompt actual (primeros 200 chars):', currentPrompt.slice(0, 200));
  console.log('Longitud actual:', currentPrompt.length);
  console.log('Longitud nuevo prompt:', NEW_PROMPT.length);

  // Update system message
  if (agent.parameters.systemMessage !== undefined) {
    agent.parameters.systemMessage = NEW_PROMPT;
  } else if (agent.parameters.options?.systemMessage !== undefined) {
    agent.parameters.options.systemMessage = NEW_PROMPT;
  } else {
    agent.parameters.systemMessage = NEW_PROMPT;
  }

  // Fix user message too (from previous fix)
  agent.parameters.text = "=mensaje del usuario:\n{{ $('Edit Fields').item.json.mensaje_usuario }}\nchat id: {{ $('Obtener ID Chat1').item.json.message.chat.id }}";

  const ALLOWED = ['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];
  const settings = {};
  for (const k of ALLOWED) if (wf.settings && wf.settings[k] !== undefined) settings[k] = wf.settings[k];

  const r = await put('/api/v1/workflows/pxrts3w3K1pMwnKN', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings
  });
  console.log('Status:', r.status);
  if (r.status === 200) {
    console.log('✅ Prompt actualizado exitosamente en VELIK GHL NUEVO');
  } else {
    console.log('Body:', r.body.slice(0, 500));
  }
})();
