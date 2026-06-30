const https = require('https')

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8'
const N8N = 'santiagon8nmejia.dominadoresia.com'
const WF_ID = 'XAoMeVFKqLw7KcFX'

function req(method, path, body) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null
    const r = https.request({
      hostname: N8N, path, method,
      headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json', ...(payload ? { 'Content-Length': Buffer.byteLength(payload) } : {}) }
    }, res => {
      let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d)))
    })
    r.on('error', reject)
    if (payload) r.write(payload)
    r.end()
  })
}

async function main() {
  const wf = await req('GET', `/api/v1/workflows/${WF_ID}`)
  if (wf.message) return console.error('Error:', wf.message)

  const nodeIdx = wf.nodes.findIndex(n => n.name === 'Buscar Calendario')
  const node = wf.nodes[nodeIdx]
  let code = node.parameters.jsCode

  // Reemplazar el bloque "if (!cal) { return error }" por un fallback total
  const oldError = `if (!cal) {
  return [{ json: { error: 'Servicio no encontrado: ' + servicio,
    disponibles: Object.keys(CALENDARS).slice(0,10).join(', ') + '...' } }];
}`

  const newFallback = `if (!cal) {
  // Fallback final: siempre agendar con el servicio más cercano
  const words = servNorm.split(/\\s+/);
  const tienePies   = words.some(w => ['pies','pedicure','pedicura'].includes(w));
  const tieneManos  = words.some(w => ['manos','manicure','manicura'].includes(w));
  const tieneRetiro = words.some(w => ['retiro','quitar','remover','retirar'].includes(w));
  const tieneSemi   = words.some(w => ['semipermanente','semi'].includes(w));
  if (tieneRetiro && tienePies && tieneManos) {
    cal = {id:'fcpxmqMktM3vzoyrhumR', dur:30};
  } else if (tieneRetiro && tienePies) {
    cal = {id:'FJDuHD0L2DqBLPUeYsqM', dur:20};
  } else if (tieneRetiro && tieneManos) {
    cal = {id:'KDdZgv19rQYsaxXNeIMB', dur:20};
  } else if (tieneManos && tienePies && tieneSemi) {
    cal = {id:'0jYIRtI8bl33hIyhVJC1', dur:90};
  } else if (tieneManos && tienePies) {
    cal = {id:'OYVNrcCxrbSYEd1SbV3f', dur:100};
  } else if (tienePies && tieneSemi) {
    cal = {id:'szaDqVWMTKAFCVcYjgTh', dur:60};
  } else if (tienePies) {
    cal = {id:'XbxF4HF4VH3KNB16sNBU', dur:45};
  } else if (tieneManos && tieneSemi) {
    cal = {id:'EDiqwAb54xY6nID5yzB8', dur:60};
  } else if (tieneManos) {
    cal = {id:'54RoAHSPDVzWjfk4N2cR', dur:30};
  } else {
    // Fallback absoluto: manos semipermanente (servicio más común)
    cal = {id:'EDiqwAb54xY6nID5yzB8', dur:60};
  }
}`

  // Primero limpiar el fallback anterior si quedó duplicado
  let updated = code
  if (updated.includes('// FALLBACK: buscar por palabras clave')) {
    updated = updated.replace(/\/\/ FALLBACK: buscar por palabras clave[\s\S]*?^\}/m, '')
    updated = updated.replace(/\nif \(!cal\) \{\n\s*\/\/ FALLBACK[\s\S]*?\n\}\n\nif \(!cal\)/, '\nif (!cal)')
  }

  // Reemplazar el bloque de error por el fallback total
  updated = updated.replace(oldError, newFallback)

  if (updated === code) {
    console.log('⚠️ No se encontró el bloque exacto. Mostrando líneas con "!cal":')
    code.split('\n').filter(l => l.includes('!cal')).forEach(l => console.log(l))
    return
  }

  wf.nodes[nodeIdx].parameters.jsCode = updated

  const body = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings, staticData: wf.staticData || null }
  const result = await req('PUT', `/api/v1/workflows/${WF_ID}`, body)
  if (result.id) {
    console.log('✅ Fallback total aplicado — nunca más fallará por servicio no encontrado')
  } else {
    console.error('❌ Error:', JSON.stringify(result).substring(0, 300))
  }
}

main().catch(console.error)
