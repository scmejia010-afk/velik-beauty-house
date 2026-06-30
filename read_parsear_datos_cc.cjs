const https = require('https')
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8'
const N8N = 'santiagon8nmejia.dominadoresia.com'

function req(path) {
  return new Promise((resolve, reject) => {
    https.request({ hostname: N8N, path, method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)))
    }).on('error', reject).end()
  })
}

async function main() {
  const wf = await req('/api/v1/workflows/3UMIZGQy4HCmBN6v')
  const node = wf.nodes.find(n => n.name === 'Parsear Datos')
  console.log(node.parameters.jsCode)
}
main().catch(console.error)
