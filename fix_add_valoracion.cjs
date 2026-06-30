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

// Lines to insert after the last entry in RAW map (before closing brace)
// Calendar CABELLO: id=zYV9rksCr1rA2hARD5a4, dur=30, for valoracion de cabello
const VALORACION_LINES = `  "valoracion de cabello":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},
  "valoracion cabello":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},
  "valoracion para color":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},
  "valoracion para procedimiento de color":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},
  "valoracion de color":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},
  "valoracion":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},
  "cabello (valoracion)":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},
  "alisado natural de argan y/o coco (medio altura del codo)":{"id":"1yG992Jgff0sTUyGHzfQ","dur":300},`;

const ALLOWED = ['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];
function filterSettings(wf) {
  const s = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) s[k] = wf.settings[k];
  return s;
}

async function fixWorkflow(wfId, nodeName) {
  const wf = await get(`/api/v1/workflows/${wfId}`);
  const node = wf.nodes.find(n => n.name === nodeName);
  if (!node) { console.log('Nodo no encontrado:', nodeName, 'en', wfId); return false; }

  // Check if already has valoracion
  if (node.parameters.jsCode.includes('"valoracion"')) {
    console.log(`${nodeName} en ${wfId} ya tiene valoracion`);
    return false;
  }

  // Insert after the last entry that ends with "}," in the RAW object
  // Find "limpieza facial tradicional" which is the last known entry
  const MARKER = '"limpieza facial tradicional"';
  if (!node.parameters.jsCode.includes(MARKER)) {
    console.log('Marcador no encontrado en', nodeName);
    // Try a different approach - find the closing of RAW object
    // Insert before the closing brace of RAW = {...}
    node.parameters.jsCode = node.parameters.jsCode.replace(
      /("limpieza facial[^"]*":\{"id":"[^"]*","dur":\d+\})/,
      '$1,\n' + VALORACION_LINES.split('\n').filter(l => !l.includes('alisado natural de argan')).join('\n')
    );
  } else {
    // Replace the last entry to add valoracion entries after it
    node.parameters.jsCode = node.parameters.jsCode.replace(
      '"limpieza facial tradicional":{"id":"fz9614uqbCIz8bLDXYNR","dur":60}',
      '"limpieza facial tradicional":{"id":"fz9614uqbCIz8bLDXYNR","dur":60},\n' +
      '  "valoracion de cabello":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},\n' +
      '  "valoracion cabello":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},\n' +
      '  "valoracion para color":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},\n' +
      '  "valoracion para procedimiento de color":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},\n' +
      '  "valoracion de color":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},\n' +
      '  "valoracion":{"id":"zYV9rksCr1rA2hARD5a4","dur":30},\n' +
      '  "valoracion de alisado":{"id":"zYV9rksCr1rA2hARD5a4","dur":30}'
    );
  }

  const r = await put(`/api/v1/workflows/${wfId}`, {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: filterSettings(wf)
  });
  console.log(`${wfId} (${nodeName}) → Status:`, r.status, r.status === 200 ? '✅' : r.body.slice(0,200));
  return r.status === 200;
}

(async () => {
  // Fix verificar_disponibilidad (Buscar Calendario node)
  await fixWorkflow('XAoMeVFKqLw7KcFX', 'Buscar Calendario');
  // Fix crear_cita (Parsear Datos node)
  await fixWorkflow('3UMIZGQy4HCmBN6v', 'Parsear Datos');
  console.log('\nDone. Valoración de cabello ahora usa calendario CABELLO (30 min, Carolina y Laura)');
})();
