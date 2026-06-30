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
  console.log('=== VELIK - Crear Cita ===')
  wf.nodes.forEach(n => {
    console.log('\n--- Nodo:', n.name, '(' + n.type + ') ---')
    if (n.parameters?.jsCode) console.log(n.parameters.jsCode.substring(0, 800))
    else if (n.parameters?.url) console.log('URL:', n.parameters.url)
    else if (n.parameters?.resource) console.log('resource:', n.parameters.resource, 'operation:', n.parameters.operation)
    else if (n.parameters?.conditions) console.log('conditions:', JSON.stringify(n.parameters.conditions).substring(0, 200))
    else console.log(JSON.stringify(n.parameters || {}).substring(0, 300))
  })
}
main().catch(console.error)
