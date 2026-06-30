const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function get(p) {
  return new Promise(r => {
    https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: p, method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => { try { r(JSON.parse(d)); } catch(e) { r(d); } });
    }).end();
  });
}

(async () => {
  // Find workflow with booking/crear path
  const wfs = await get('/api/v1/workflows?limit=100');
  const candidates = wfs.data?.filter(w =>
    w.name.toLowerCase().includes('booking') ||
    w.name.toLowerCase().includes('crear') ||
    w.name.toLowerCase().includes('pos') ||
    w.name.toLowerCase().includes('web')
  );
  console.log('Workflows candidatos:');
  candidates?.forEach(w => console.log(w.id, '-', w.name, '| active:', w.active));

  // Also check last executions of any crear workflow
  const crearWf = wfs.data?.find(w => w.id === '3UMIZGQy4HCmBN6v');
  if (crearWf) {
    const execs = await get('/api/v1/executions?workflowId=3UMIZGQy4HCmBN6v&limit=3');
    console.log('\nÚltimas ejecuciones VELIK - Crear Cita:');
    execs.data?.forEach(e => console.log(e.id, e.status, e.startedAt));
  }
})();
