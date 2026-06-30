const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: '/api/v1/workflows/XAoMeVFKqLw7KcFX', method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
  let d = ''; rr.on('data', c => d += c); rr.on('end', () => {
    const wf = JSON.parse(d);
    console.log('Workflow:', wf.name);
    wf.nodes.forEach(n => {
      console.log('\n--- Node:', n.name, '| Type:', n.type);
      if (n.parameters?.jsCode) console.log('Code:', n.parameters.jsCode.slice(0, 600));
      if (n.parameters?.url) console.log('URL:', n.parameters.url);
      if (n.parameters?.respondWith !== undefined) console.log('respondWith:', n.parameters.respondWith);
    });
  });
}).end();
