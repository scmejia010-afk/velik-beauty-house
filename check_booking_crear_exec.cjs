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
  const execs = await get('/api/v1/executions?workflowId=lRc6MNdkw7wRK6Kj&limit=5');
  console.log('Ejecuciones Booking Crear Cita (Web):');
  execs.data?.forEach(e => console.log(e.id, e.status, e.startedAt));

  if (!execs.data?.length) { console.log('Sin ejecuciones'); return; }

  const lastExec = execs.data[0];
  const detail = await get(`/api/v1/executions/${lastExec.id}?includeData=true`);
  const runData = detail.data?.resultData?.runData || {};

  console.log('\n--- Detalle ejecución', lastExec.id, '---');
  for (const [nodeName, runs] of Object.entries(runData)) {
    const run = runs[0];
    if (run?.error) {
      console.log(`ERROR en "${nodeName}":`, JSON.stringify(run.error).slice(0, 600));
    }
    const items = run?.data?.main?.[0];
    if (items?.[0]?.json) {
      const j = items[0].json;
      if (j.statusCode >= 400 || j.error || j.message) {
        console.log(`Output "${nodeName}":`, JSON.stringify(j).slice(0, 400));
      }
    }
  }

  // Input to webhook
  const triggerRun = runData['Webhook']?.[0]?.data?.main?.[0]?.[0]?.json;
  if (triggerRun) console.log('\nInput recibido:', JSON.stringify(triggerRun.body || triggerRun).slice(0, 500));
})();
