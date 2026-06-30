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
  // Listar workflows para encontrar "Crear Cita"
  const wfs = await req('/api/v1/workflows?limit=50')
  const lista = wfs.data || wfs
  lista.forEach(w => console.log(w.id, '-', w.name))
}
main().catch(console.error)
