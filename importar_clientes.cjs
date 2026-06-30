// Importar clientes desde CSV a Supabase contactos
const fs = require('fs')
const path = require('path')

const SUPABASE_URL = 'https://aqoztzznsxhvczkanorr.supabase.co'
const SERVICE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxb3p0enpuc3hodmN6a2Fub3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA1OTg3NSwiZXhwIjoyMDk1NjM1ODc1fQ.2Jxnj_q9ni2p8H4wuOP-u9QIDTYkkjdenaTPDjjQFmc'

// Leer CSV (puede tener BOM y encoding latin)
const csvPath = path.join(__dirname, 'CLIENTES-VELIK-NEW.csv')
let raw = fs.readFileSync(csvPath, 'latin1')
// Quitar BOM si existe
raw = raw.replace(/^﻿/, '').replace(/^ï»¿/, '')

const lines = raw.split('\n').filter(l => l.trim())
// Saltar encabezado
const rows = lines.slice(1)

const contactos = []
const vistos = new Set() // deduplicar por teléfono

for (const line of rows) {
  const cols = line.split(';')
  const email   = (cols[0] || '').trim()
  const nombres = (cols[1] || '').trim()
  const apellidos = (cols[2] || '').trim()
  const telefono = (cols[5] || '').trim()

  // Saltar si no tiene nombre
  if (!nombres || nombres.length < 2) continue
  // Saltar entradas de prueba / sistema
  if (['prueba', 'agendapro', 'ejemplo', 'usuario', 'usuaria', 'velik', 'pedir apellido', 'semipermanente', 'retiro', 'pies', 'mixta', 'ee', 'dr', 'n'].includes(nombres.toLowerCase())) continue
  if (apellidos.toLowerCase().includes('agendapro') || apellidos.toLowerCase().includes('ejemplo') || apellidos.toLowerCase().includes('prueba')) continue

  // Normalizar teléfono
  let tel = telefono
  if (tel && !tel.startsWith('+')) tel = '+' + tel
  // Saltar teléfonos basura
  if (tel && (tel === '+5700000000' || tel === '+57000000000' || tel === '+57999999999' || tel === '+57999999990' || tel === '+1888' || tel === '+1830' || tel === '+5700' || tel === '+5733')) tel = ''

  // Clave de deduplicación: teléfono (si existe) o nombre+apellido
  const key = tel || `${nombres.toLowerCase()}|${apellidos.toLowerCase()}`
  if (vistos.has(key)) continue
  vistos.add(key)

  contactos.push({
    nombres,
    apellidos: apellidos || null,
    telefono: tel || null,
    email: email || null,
  })
}

console.log(`📋 Total contactos únicos a importar: ${contactos.length}`)

async function importar() {
  let insertados = 0
  let errores = 0
  const BATCH = 100

  for (let i = 0; i < contactos.length; i += BATCH) {
    const batch = contactos.slice(i, i + BATCH)
    const res = await fetch(`${SUPABASE_URL}/rest/v1/contactos`, {
      method: 'POST',
      headers: {
        'apikey': SERVICE_KEY,
        'Authorization': `Bearer ${SERVICE_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=ignore-duplicates,return=minimal',
      },
      body: JSON.stringify(batch),
    })

    if (res.ok || res.status === 201) {
      insertados += batch.length
      process.stdout.write(`\r✅ ${insertados}/${contactos.length}`)
    } else {
      const err = await res.text()
      console.error(`\n❌ Error batch ${i}-${i+BATCH}:`, err)
      errores += batch.length
    }
  }

  console.log(`\n\n🎉 Importación completa: ${insertados} procesados, ${errores} con error`)
}

importar().catch(console.error)
