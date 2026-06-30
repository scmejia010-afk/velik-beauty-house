const fs = require('fs')
const path = require('path')

const input = fs.readFileSync(path.join(__dirname, 'CLIENTES-VELIK-NEW.csv'), 'latin1')
const lines = input.split('\n').map(l => l.trim()).filter(l => l)

// Skip header
const rows = lines.slice(1)

const out = ['First Name,Last Name,Phone,Email']

for (const line of rows) {
  const cols = line.split(';')
  const email    = (cols[0] || '').trim()
  const nombre   = (cols[1] || '').trim()
  const apellido = (cols[2] || '').trim()
  const telefono = (cols[5] || '').trim()

  if (!nombre) continue

  // Clean phone: remove spaces, only keep + and digits
  const phone = telefono.replace(/[^\d+]/g, '')

  // Escape CSV fields
  const esc = v => v.includes(',') ? `"${v}"` : v

  out.push(`${esc(nombre)},${esc(apellido)},${phone},${email}`)
}

const outPath = path.join(__dirname, 'todos_clientes_ghl.csv')
fs.writeFileSync(outPath, out.join('\n'), 'utf8')
console.log(`✅ ${out.length - 1} contactos exportados → todos_clientes_ghl.csv`)
