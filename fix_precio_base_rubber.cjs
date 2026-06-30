const https = require('https')

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8'
const N8N = 'santiagon8nmejia.dominadoresia.com'

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const r = https.request({
      hostname: N8N, path, method,
      headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json',
        ...(payload ? {'Content-Length': Buffer.byteLength(payload)} : {}) }
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)))
    })
    r.on('error', reject)
    if (payload) r.write(payload)
    r.end()
  })
}

async function fixWorkflow(wfId, wfName) {
  const wf = await req('GET', `/api/v1/workflows/${wfId}`)
  if (wf.message) return console.error('Error GET', wfId, wf.message)

  let changed = false
  for (const node of wf.nodes) {
    if (node.parameters?.jsCode && node.parameters.jsCode.includes('yVTJ5MuqOiTIG6aW4Zzu')) {
      node.parameters.jsCode = node.parameters.jsCode.replace(
        /"yVTJ5MuqOiTIG6aW4Zzu":"[^"]*"/g,
        '"yVTJ5MuqOiTIG6aW4Zzu":"$85.000"'
      )
      changed = true
    }
  }

  if (!changed) { console.log('⚠️', wfName, '- no encontró el precio'); return }

  const body = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings, staticData: wf.staticData || null }
  const result = await req('PUT', `/api/v1/workflows/${wfId}`, body)
  console.log(result.id ? `✅ ${wfName} actualizado` : `❌ ${wfName}: ${JSON.stringify(result).substring(0,200)}`)
}

async function main() {
  await fixWorkflow('3UMIZGQy4HCmBN6v', 'VELIK - Crear Cita')
  await fixWorkflow('XAoMeVFKqLw7KcFX', 'VELIK - Verificar Disponibilidad')
}
main().catch(console.error)
