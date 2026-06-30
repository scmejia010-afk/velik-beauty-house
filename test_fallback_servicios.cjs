const https = require('https')

const WEBHOOK = 'santiagon8nmejia.dominadoresia.com'
const PATH = '/webhook/booking/slots'

const casos = [
  // Servicios exactos que ya funcionaban
  'manos semipermanente',
  'recubrimiento polygel/acrilico',
  // Pedicure
  'pedicure tradicional',
  'pedicure',
  'pies semipermanente',
  'tradicional pies',
  // Servicios compuestos raros
  'arreglo de pies y quitar semipermanente de manos y pies',
  'arreglo pies',
  'limpieza de pies',
  'retiro semipermanente pies',
  'quitar uñas de pies',
  // Combos
  'manos y pies',
  'manicure y pedicure',
  'esmaltado manos y pies',
  // Servicios totalmente desconocidos
  'tratamiento de cejas',
  'corte de cabello',
  'algo que no existe',
]

async function testServicio(servicio) {
  return new Promise((resolve) => {
    const params = new URLSearchParams({
      calendarId: 'test',
      servicio,
      fecha: '2026-06-18',
      startDate: Date.now().toString(),
      endDate: (Date.now() + 7 * 24 * 3600000).toString(),
    })

    https.get({
      hostname: WEBHOOK,
      path: `${PATH}?${params}`,
    }, res => {
      let d = ''
      res.on('data', c => d += c)
      res.on('end', () => {
        try {
          const r = JSON.parse(d)
          const ok = !r.error && !r[0]?.error
          const err = r.error || r[0]?.error || ''
          const calId = r.calendarId || r[0]?.calendarId || r[0]?.json?.calendarId || ''
          resolve({ servicio, ok, calId: calId.substring(0, 12), err: err.substring(0, 50) })
        } catch {
          resolve({ servicio, ok: false, err: d.substring(0, 80) })
        }
      })
    }).on('error', e => resolve({ servicio, ok: false, err: e.message }))
  })
}

async function main() {
  console.log('Probando fallback con', casos.length, 'servicios...\n')
  for (const s of casos) {
    const r = await testServicio(s)
    const estado = r.ok ? '✅' : '❌'
    console.log(`${estado} "${s}"`)
    if (!r.ok) console.log(`   → ${r.err}`)
    if (r.calId) console.log(`   calendarId: ${r.calId}...`)
  }
}

main()
