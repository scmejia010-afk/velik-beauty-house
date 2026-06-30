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
  // Check both active Eli workflows
  for (const wfId of ['pxrts3w3K1pMwnKN', 'oTWJ2XHBAZCINO7A']) {
    const execs = await get(`/api/v1/executions?workflowId=${wfId}&limit=1`);
    const ex = execs.data?.[0];
    if (!ex) continue;
    console.log(`\n=== Workflow ${wfId} | ${ex.status} | ${ex.startedAt} ===`);
    const detail = await get(`/api/v1/executions/${ex.id}?includeData=true`);
    const runData = detail.data?.resultData?.runData || {};
    for (const [nodeName, runs] of Object.entries(runData)) {
      const out = runs[0]?.data?.main?.[0]?.[0]?.json;
      if (!out) continue;
      if (nodeName === 'AI Agent' || nodeName.includes('Agent')) {
        console.log(`\nAI Agent output:`, JSON.stringify(out).slice(0, 400));
      }
      if (out?.error || out?.fecha || out?.servicio) {
        console.log(`\n[${nodeName}]:`, JSON.stringify(out).slice(0, 300));
      }
    }
  }
})();
