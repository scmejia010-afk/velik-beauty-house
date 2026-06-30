const https = require('https')

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8'
const N8N   = 'santiagon8nmejia.dominadoresia.com'
const WF_ID = 'XAoMeVFKqLw7KcFX'

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

// Nuevo bloque de búsqueda parcial — reemplaza la sección vieja
const OLD_PARTIAL = `  if (!cal) {
    for (const [k, v] of Object.entries(CALENDARS)) {
      if (servNorm.includes(k) || k.includes(servNorm)) {
        cal = v; break;
      }
    }
  }`

const NEW_PARTIAL = `  if (!cal) {
    // Ordenar por clave más larga primero → match más específico gana
    const sorted = Object.entries(CALENDARS).sort((a,b) => b[0].length - a[0].length);
    for (const [k, v] of sorted) {
      if (servNorm.includes(k)) { cal = v; break; }
    }
  }`

async function main() {
  const wf = await req('GET', `/api/v1/workflows/${WF_ID}`)
  if (wf.message) return console.error('Error GET:', wf.message)

  const nodeIdx = wf.nodes.findIndex(n => n.name === 'Buscar Calendario')
  const node = wf.nodes[nodeIdx]
  let code = node.parameters.jsCode

  if (!code.includes('for (const [k, v] of Object.entries(CALENDARS))')) {
    console.log('⚠️ No se encontró el bloque de búsqueda parcial esperado')
    console.log('Líneas con "Object.entries":')
    code.split('\n').filter(l => l.includes('Object.entries')).forEach(l => console.log(l))
    return
  }

  const updated = code.replace(OLD_PARTIAL, NEW_PARTIAL)

  if (updated === code) {
    console.log('⚠️ No coincidió el bloque exacto. Verificar espaciado.')
    console.log(JSON.stringify(code.substring(code.indexOf('if (!cal)'), code.indexOf('if (!cal)') + 300)))
    return
  }

  wf.nodes[nodeIdx].parameters.jsCode = updated
  const body = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings, staticData: wf.staticData || null }
  const result = await req('PUT', `/api/v1/workflows/${WF_ID}`, body)
  if (result.id) {
    console.log('✅ Búsqueda parcial mejorada — match más específico gana')
  } else {
    console.error('❌', JSON.stringify(result).substring(0, 300))
  }
}

main().catch(console.error)
