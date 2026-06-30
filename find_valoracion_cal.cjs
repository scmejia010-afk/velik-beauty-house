const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: '/api/v1/workflows/XAoMeVFKqLw7KcFX', method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
  let d = ''; rr.on('data', c => d += c); rr.on('end', () => {
    const wf = JSON.parse(d);
    const node = wf.nodes.find(n => n.name === 'Buscar Calendario');
    // Print the full RAW map from the code
    const code = node.parameters.jsCode || node.parameters.functionCode;
    // Find valoracion or color related entries
    const lines = code.split('\n');
    const relevant = lines.filter(l =>
      l.includes('valor') || l.includes('color') || l.includes('6Gq72') || l.includes('cabello')
    );
    console.log('Entradas relevantes en Buscar Calendario:');
    relevant.forEach(l => console.log(l));
  });
}).end();
