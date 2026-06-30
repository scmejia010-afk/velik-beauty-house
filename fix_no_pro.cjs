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

// Aliases for generic/category terms the AI might send
const ALIASES_SNIPPET = `
// Aliases para términos genéricos que el AI puede enviar
const ALIASES = {
  // Faciales
  "facial": "limpieza facial especial",
  "faciales": "limpieza facial especial",
  "limpieza facial": "limpieza facial especial",
  // Masajes
  "masaje": "masaje relajacion piedras volcanicas + velas",
  "masajes": "masaje relajacion piedras volcanicas + velas",
  "masaje relajante": "masaje relajacion piedras volcanicas + velas",
  // Uñas genéricas
  "unas": "manos semipermanente",
  "manicure": "manos semipermanente",
  "pedicure": "pies semipermanente",
  // Valoración
  "valoracion": "valoracion de cabello",
  "valoracion cabello": "valoracion de cabello",
  "valoracion de color": "valoracion de cabello",
  "valoracion para color": "valoracion de cabello",
  "valoracion para procedimiento de color": "valoracion de cabello",
  // Cosmetología
  "cosmetologia facial": "limpieza facial especial",
  "cosmetologia": "limpieza facial especial",
  // Depilación genérica
  "depilacion": "depilacion media pierna",
  // Extensiones
  "extensiones de pestanas": "extension de pestanas pelo a pelo efecto clasica",
  "extensiones pestanas": "extension de pestanas pelo a pelo efecto clasica",
  "extensiones": "extension de pestanas pelo a pelo efecto clasica",
  // Cejas
  "cejas": "depilacion de cejas con cera",
  "laminado cejas": "laminado de cejas",
  // Cabello general
  "cabello": "valoracion de cabello",
  // Maquillaje
  "maquillaje": "maquillaje social",
};

function lookupService(servicio) {
  const norm = normalize(servicio);
  // 1. Exact match
  if (CALENDARS[norm]) return CALENDARS[norm];
  // 2. Alias match
  if (ALIASES[norm]) {
    const aliasNorm = normalize(ALIASES[norm]);
    if (CALENDARS[aliasNorm]) return CALENDARS[aliasNorm];
  }
  // 3. Partial match (norm includes key or key includes norm)
  for (const [k, v] of Object.entries(CALENDARS)) {
    if (k.includes(norm) || norm.includes(k)) return v;
  }
  // 4. Try without trailing 's' (faciales → facial, masajes → masaje)
  const stem = norm.endsWith('s') ? norm.slice(0, -1) : norm + 's';
  if (ALIASES[stem]) {
    const aliasNorm = normalize(ALIASES[stem]);
    if (CALENDARS[aliasNorm]) return CALENDARS[aliasNorm];
  }
  for (const [k, v] of Object.entries(CALENDARS)) {
    if (k.includes(stem) || stem.includes(k)) return v;
  }
  return null;
}`;

const ALLOWED = ['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];
function filterSettings(wf) {
  const s = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) s[k] = wf.settings[k];
  return s;
}

async function fixWorkflow(wfId, nodeName, lookupFnName) {
  const wf = await get(`/api/v1/workflows/${wfId}`);
  const node = wf.nodes.find(n => n.name === nodeName);
  if (!node) { console.log('Nodo no encontrado:', nodeName); return; }

  let code = node.parameters.jsCode;

  // Check if already patched
  if (code.includes('const ALIASES =')) {
    console.log(`${wfId}/${nodeName}: ya tiene ALIASES`);
    return;
  }

  // Insert ALIASES + new lookupService after CALENDARS is built
  // Find the line that builds CALENDARS from RAW
  const insertMarker = 'for (const [k,v] of Object.entries(RAW)) { CALENDARS[normalize(k)] = v; }';
  if (!code.includes(insertMarker)) {
    console.log(`${wfId}/${nodeName}: marcador no encontrado, buscando alternativa...`);
    // Try finding the existing lookupService function
    const fnMarker = 'function lookupService';
    if (code.includes(fnMarker)) {
      // Replace the existing lookupService with our improved version
      const fnStart = code.indexOf(fnMarker);
      // Find end of the function (next blank line after closing brace)
      let braceCount = 0, fnEnd = fnStart;
      for (let i = fnStart; i < code.length; i++) {
        if (code[i] === '{') braceCount++;
        else if (code[i] === '}') { braceCount--; if (braceCount === 0) { fnEnd = i + 1; break; } }
      }
      const oldFn = code.slice(fnStart, fnEnd);
      code = code.slice(0, fnStart) + ALIASES_SNIPPET + code.slice(fnEnd);
      node.parameters.jsCode = code;
    } else {
      console.log('No se pudo parchear:', wfId, nodeName);
      return;
    }
  } else {
    // Insert after CALENDARS build line
    code = code.replace(insertMarker, insertMarker + '\n' + ALIASES_SNIPPET);
    node.parameters.jsCode = code;
  }

  const r = await put(`/api/v1/workflows/${wfId}`, {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: filterSettings(wf)
  });
  console.log(`${wfId} (${nodeName}) → ${r.status === 200 ? '✅' : r.body.slice(0, 200)}`);
}

(async () => {
  await fixWorkflow('XAoMeVFKqLw7KcFX', 'Buscar Calendario');
  await fixWorkflow('3UMIZGQy4HCmBN6v', 'Parsear Datos');
})();
