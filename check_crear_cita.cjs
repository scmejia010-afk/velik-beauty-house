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
  // First find the crear_cita workflow
  const wfs = await get('/api/v1/workflows?limit=50');
  const crearWf = wfs.data?.find(w => w.name.toLowerCase().includes('crear') && w.name.toLowerCase().includes('cita'));
  if (!crearWf) {
    console.log('Workflows disponibles:', wfs.data?.map(w => w.id + ' - ' + w.name).join('\n'));
    return;
  }
  console.log('Workflow crear cita:', crearWf.id, '-', crearWf.name);

  // Get last executions
  const execs = await get(`/api/v1/executions?workflowId=${crearWf.id}&limit=5`);
  if (!execs.data?.length) { console.log('No hay ejecuciones'); return; }

  for (const ex of execs.data.slice(0, 3)) {
    console.log('\n--- Ejecución', ex.id, '| Status:', ex.status, '| Fecha:', ex.startedAt);
    const detail = await get(`/api/v1/executions/${ex.id}`);
    if (detail.data?.resultData?.runData) {
      for (const [nodeName, runs] of Object.entries(detail.data.resultData.runData)) {
        const run = runs[0];
        if (run?.error) {
          console.log('ERROR en nodo "' + nodeName + '":', JSON.stringify(run.error).slice(0, 400));
        }
        if (run?.data?.main?.[0]?.[0]?.json) {
          const j = run.data.main[0][0].json;
          if (j.statusCode >= 400 || j.error || j.message) {
            console.log('Respuesta nodo "' + nodeName + '":', JSON.stringify(j).slice(0, 400));
          }
        }
      }
    }
  }
})();
