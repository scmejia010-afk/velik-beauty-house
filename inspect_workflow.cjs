const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: '/api/v1/workflows/pxrts3w3K1pMwnKN', method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
  let d = ''; rr.on('data', c => d += c); rr.on('end', () => {
    const wf = JSON.parse(d);
    // Find tool workflows (subworkflow nodes)
    const tools = wf.nodes.filter(n => n.type === 'n8n-nodes-base.toolWorkflow' || n.name.toLowerCase().includes('disponib') || n.name.toLowerCase().includes('slot') || n.name.toLowerCase().includes('verif'));
    console.log('Tool nodes encontrados:');
    tools.forEach(t => {
      console.log('\n--- ', t.name, '---');
      console.log(JSON.stringify(t.parameters, null, 2).slice(0, 800));
    });

    // Also show AI Agent params
    const agent = wf.nodes.find(n => n.name === 'AI Agent');
    if (agent) {
      console.log('\n=== AI Agent type/version ===');
      console.log('type:', agent.type, 'typeVersion:', agent.typeVersion);
    }
  });
}).end();
