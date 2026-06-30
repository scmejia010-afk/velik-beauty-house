const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: '/api/v1/workflows/lRc6MNdkw7wRK6Kj', method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
  let d = ''; rr.on('data', c => d += c); rr.on('end', () => {
    const wf = JSON.parse(d);
    console.log('Nodos en Booking Crear Cita (Web):');
    wf.nodes.forEach(n => {
      console.log('\n---', n.name, '|', n.type);
      if (n.parameters?.bodyParameters?.parameters) {
        n.parameters.bodyParameters.parameters.forEach(p => console.log('  body:', p.name, '=', p.value?.slice?.(0,80) || p.value));
      }
      if (n.parameters?.jsCode) console.log('  code:', n.parameters.jsCode.slice(0, 200));
    });
  });
}).end();
