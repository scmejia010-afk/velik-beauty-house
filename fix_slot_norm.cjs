const https = require('https');
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function get(path) {
  return new Promise((res) => {
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'GET', headers: { 'X-N8N-API-KEY': API_KEY } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.end();
  });
}

function put(path, body) {
  return new Promise((res) => {
    const b = JSON.stringify(body);
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'PUT', headers: { 'X-N8N-API-KEY': API_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.write(b); req.end();
  });
}

async function run() {
  const wf = await get('/api/v1/workflows/3UMIZGQy4HCmBN6v');
  const n = wf.nodes.find(x => x.name === 'Parsear Datos');

  // Old: uses slotTime directly without normalizing timezone
  const oldLines = `const slotTime  = q.slot_time || q.startTime || q.hora || '';`;

  // New: same read + normalize right after
  const newLines = `const slotTime  = q.slot_time || q.startTime || q.hora || '';
// Normalize: replace space separator with T, append -05:00 if no timezone
let slotNorm = slotTime.replace(' ', 'T');
if (!/[+-]\\d{2}:\\d{2}$/.test(slotNorm) && !slotNorm.endsWith('Z')) {
  slotNorm += '-05:00';
}`;

  if (!n.parameters.jsCode.includes(oldLines)) {
    console.log('Pattern not found — code may be different:\n');
    console.log(n.parameters.jsCode.slice(0, 500));
    return;
  }

  // Also replace startTime: slotTime with slotNorm, and the tzMatch line to use slotNorm
  let code = n.parameters.jsCode.replace(oldLines, newLines);

  // Replace usages: startTime: slotTime → startTime: slotNorm
  code = code.replace('startTime: slotTime,', 'startTime: slotNorm,');

  // Replace tzMatch to use slotNorm instead of slotTime
  code = code.replace(
    'const tzMatch = slotTime.match(/([+-]\\d{2}:\\d{2})$/);',
    'const tzMatch = slotNorm.match(/([+-]\\d{2}:\\d{2})$/);'
  );

  // Replace new Date(slotTime) or new Date(slotNorm if already changed) for startDt
  // The previous fix_timezone_crear script set startDt = new Date(slotTime) implicitly
  // via existing code — let's find and fix it
  code = code.replace(
    'const startDt = new Date(slotTime)',
    'const startDt = new Date(slotNorm)'
  );

  n.parameters.jsCode = code;
  console.log('slotNorm fix applied:', code.includes('slotNorm'));
  console.log('startTime uses slotNorm:', code.includes('startTime: slotNorm'));

  const r = await put('/api/v1/workflows/3UMIZGQy4HCmBN6v', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Saved:', r.name || r.message);
}
run();
