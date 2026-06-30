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

// calendarId → nuevo precio
const FIXES = {
  'ItIbYfgFYYvZYQ6Oje0B': '$40.000', // Manos Tradicional: $45 → $40
  'tKn5Hy3A7pKqg7nhVpgC': '$45.000', // Pies Evolution:    $40 → $45
  'XbxF4HF4VH3KNB16sNBU': '$40.000', // Tradicional Pies:  $45 → $40
}

async function fixWorkflow(wfId, wfName) {
  const wf = await req('GET', `/api/v1/workflows/${wfId}`)
  if (wf.message) return console.error('Error GET', wfId, wf.message)

  let changed = false
  for (const node of wf.nodes) {
    if (!node.parameters?.jsCode) continue
    let code = node.parameters.jsCode
    for (const [id, precio] of Object.entries(FIXES)) {
      const regex = new RegExp(`"${id}":"[^"]*"`, 'g')
      const newCode = code.replace(regex, `"${id}":"${precio}"`)
      if (newCode !== code) { code = newCode; changed = true }
    }
    node.parameters.jsCode = code
  }

  if (!changed) { console.log('⚠️', wfName, '- no encontró los IDs'); return }
  const body = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings, staticData: wf.staticData || null }
  const result = await req('PUT', `/api/v1/workflows/${wfId}`, body)
  console.log(result.id ? `✅ ${wfName}` : `❌ ${wfName}: ${JSON.stringify(result).substring(0,200)}`)
}

async function main() {
  await Promise.all([
    fixWorkflow('3UMIZGQy4HCmBN6v', 'VELIK - Crear Cita'),
    fixWorkflow('XAoMeVFKqLw7KcFX', 'VELIK - Verificar Disponibilidad'),
  ])
}
main().catch(console.error)
