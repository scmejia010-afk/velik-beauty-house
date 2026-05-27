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

  const oldReturn = `return [{ json: {
  calendarId: cal.id, servicio, duracion: cal.dur,
  startTime: startDt.toISOString(), endTime: endDt.toISOString(),
  nombre, telefono, email
}}];`;

  const newReturn = `// Preserve timezone offset from slot string
const tzMatch = slotTime.match(/([+-]\\d{2}:\\d{2})$/);
const tz = tzMatch ? tzMatch[1] : '-05:00';
const sign = tz[0] === '+' ? 1 : -1;
const [tzH, tzM] = tz.slice(1).split(':').map(Number);
const offsetMs = sign * (tzH * 60 + tzM) * 60000;
const endDt2 = new Date(startDt.getTime() + cal.dur * 60000 + offsetMs);
const pad = x => String(x).padStart(2,'0');
const endISO = endDt2.getUTCFullYear()+'-'+pad(endDt2.getUTCMonth()+1)+'-'+pad(endDt2.getUTCDate())+'T'+pad(endDt2.getUTCHours())+':'+pad(endDt2.getUTCMinutes())+':00'+tz;

return [{ json: {
  calendarId: cal.id, servicio, duracion: cal.dur,
  startTime: slotTime,
  endTime: endISO,
  nombre, telefono, email
}}];`;

  if (!n.parameters.jsCode.includes('startDt.toISOString()')) {
    console.log('Pattern not found — already fixed or different code');
    return;
  }

  n.parameters.jsCode = n.parameters.jsCode.replace(oldReturn, newReturn);
  console.log('Fix applied:', n.parameters.jsCode.includes('Preserve timezone'));

  const r = await put('/api/v1/workflows/3UMIZGQy4HCmBN6v', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Saved:', r.name || r.message);
}
run();
