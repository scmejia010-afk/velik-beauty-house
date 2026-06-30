const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: '/api/v1/workflows/lRc6MNdkw7wRK6Kj', method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
  let d = ''; rr.on('data', c => d += c); rr.on('end', () => {
    const wf = JSON.parse(d);
    const node = wf.nodes.find(n => n.name === 'Crear Cita GHL');
    console.log('Crear Cita GHL params:');
    console.log(JSON.stringify(node?.parameters, null, 2).slice(0, 2000));
  });
}).end();
