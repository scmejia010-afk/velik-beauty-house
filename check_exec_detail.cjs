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
  const detail = await get('/api/v1/executions/227872?includeData=true');
  const runData = detail.data?.resultData?.runData || {};

  for (const [nodeName, runs] of Object.entries(runData)) {
    const run = runs[0];
    console.log('\n=== Nodo:', nodeName, '===');

    if (run?.error) console.log('ERROR:', JSON.stringify(run.error).slice(0, 600));

    // Input data
    const inputItems = run?.data?.main?.[0];
    if (inputItems?.[0]?.json) {
      console.log('Output:', JSON.stringify(inputItems[0].json).slice(0, 500));
    }
  }

  // Also check the last node error
  const lastError = detail.data?.resultData?.error;
  if (lastError) console.log('\nLAST ERROR:', JSON.stringify(lastError).slice(0, 500));
})();
