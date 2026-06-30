// Detectar y eliminar contactos duplicados en Supabase
const SUPABASE_URL = 'https://aqoztzznsxhvczkanorr.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxb3p0enpuc3hodmN6a2Fub3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA1OTg3NSwiZXhwIjoyMDk1NjM1ODc1fQ.2Jxnj_q9ni2p8H4wuOP-u9QIDTYkkjdenaTPDjjQFmc'

async function get(url) {
  const res = await fetch(url, {
    headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` }
  })
  return res.json()
}

async function del(ids) {
  if (!ids.length) return
  const res = await fetch(`${SUPABASE_URL}/rest/v1/contactos?id=in.(${ids.join(',')})`, {
    method: 'DELETE',
    headers: { 'apikey': SERVICE_KEY, 'Authorization': `Bearer ${SERVICE_KEY}` }
  })
  return res.ok
}

async function main() {
  // Traer todos los contactos
  console.log('📥 Descargando contactos...')
  let todos = []
  let offset = 0
  while (true) {
    const batch = await get(`${SUPABASE_URL}/rest/v1/contactos?select=id,nombres,apellidos,telefono,email&order=id.asc&limit=1000&offset=${offset}`)
    if (!batch.length) break
    todos = todos.concat(batch)
    offset += 1000
    if (batch.length < 1000) break
  }
  console.log(`Total en BD: ${todos.length}`)

  const aEliminar = new Set()

  // --- DUPLICADOS POR TELÉFONO ---
  const porTel = {}
  for (const c of todos) {
    if (!c.telefono) continue
    const tel = c.telefono.replace(/\s/g, '')
    if (!porTel[tel]) porTel[tel] = []
    porTel[tel].push(c)
  }

  let dupsTel = 0
  for (const [tel, grupo] of Object.entries(porTel)) {
    if (grupo.length < 2) continue
    // Quedar con el que tenga más datos (email preferido, nombre más largo)
    grupo.sort((a, b) => {
      const scoreA = (a.email ? 2 : 0) + (a.apellidos ? 1 : 0)
      const scoreB = (b.email ? 2 : 0) + (b.apellidos ? 1 : 0)
      return scoreB - scoreA || a.id - b.id
    })
    const keeper = grupo[0]
    for (const c of grupo.slice(1)) {
      aEliminar.add(c.id)
      dupsTel++
    }
    if (grupo.length > 1) {
      console.log(`  📱 Tel ${tel}: quedan con "${keeper.nombres} ${keeper.apellidos||''}" (id ${keeper.id}), eliminando ${grupo.length-1}`)
    }
  }

  // --- DUPLICADOS POR NOMBRE (sin teléfono o teléfonos distintos) ---
  const porNombre = {}
  for (const c of todos) {
    if (aEliminar.has(c.id)) continue
    const key = `${c.nombres.toLowerCase().trim()}|${(c.apellidos||'').toLowerCase().trim()}`
    if (key === '|') continue // sin nombre
    if (!porNombre[key]) porNombre[key] = []
    porNombre[key].push(c)
  }

  let dupsNombre = 0
  for (const [nombre, grupo] of Object.entries(porNombre)) {
    if (grupo.length < 2) continue
    grupo.sort((a, b) => {
      const scoreA = (a.telefono ? 2 : 0) + (a.email ? 1 : 0)
      const scoreB = (b.telefono ? 2 : 0) + (b.email ? 1 : 0)
      return scoreB - scoreA || a.id - b.id
    })
    const keeper = grupo[0]
    for (const c of grupo.slice(1)) {
      aEliminar.add(c.id)
      dupsNombre++
    }
    console.log(`  👤 Nombre "${nombre}": quedan con id ${keeper.id}, eliminando ${grupo.length-1}`)
  }

  console.log(`\n📊 Resumen:`)
  console.log(`  Duplicados por teléfono: ${dupsTel}`)
  console.log(`  Duplicados por nombre:   ${dupsNombre}`)
  console.log(`  Total a eliminar:        ${aEliminar.size}`)
  console.log(`  Quedarán:               ${todos.length - aEliminar.size}`)

  if (!aEliminar.size) {
    console.log('\n✅ No hay duplicados.')
    return
  }

  console.log('\n🗑️  Eliminando...')
  const ids = [...aEliminar]
  const BATCH = 100
  for (let i = 0; i < ids.length; i += BATCH) {
    await del(ids.slice(i, i + BATCH))
    process.stdout.write(`\r  ${Math.min(i + BATCH, ids.length)}/${ids.length}`)
  }
  console.log('\n✅ Duplicados eliminados.')
}

main().catch(console.error)
