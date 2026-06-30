const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: '/api/v1/workflows/3UMIZGQy4HCmBN6v', method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
  let d = ''; rr.on('data', c => d += c); rr.on('end', () => {
    const wf = JSON.parse(d);
    const parsear = wf.nodes.find(n => n.name === 'Parsear Datos');
    console.log('Parsear Datos code:');
    console.log(parsear?.parameters?.jsCode || parsear?.parameters?.functionCode || JSON.stringify(parsear?.parameters).slice(0,2000));
  });
}).end();
