const https = require('https')
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8'
const N8N = 'santiagon8nmejia.dominadoresia.com'
const WF_ID = 'XAoMeVFKqLw7KcFX'
function req(method, path) {
  return new Promise((resolve, reject) => {
    https.request({ hostname: N8N, path, method, headers: { 'X-N8N-API-KEY': KEY } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)))
    }).on('error', reject).end()
  })
}
req('GET', `/api/v1/workflows/${WF_ID}`).then(wf => {
  const node = wf.nodes.find(n => n.name === 'Buscar Calendario')
  console.log(node.parameters.jsCode)
})
