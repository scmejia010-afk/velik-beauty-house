// Simula la lógica del nodo "Buscar Calendario" — versión limpia
const RAW = {
  'manos semipermanente':{id:'EDiqwAb54xY6nID5yzB8',dur:60},
  'pedicura tradicional + pedi spa':{id:'MPv75km6l8sal1NKHqtV',dur:60},
  'retiro semipermanente manos':{id:'CUY39YrfaRmiHvMdGTol',dur:15},
  'retiro semipermanente pies':{id:'FJDuHD0L2DqBLPUeYsqM',dur:20},
  'retiro semipermanente manos y pies':{id:'fcpxmqMktM3vzoyrhumR',dur:30},
  'unas semipermanente (manos y pies)':{id:'0jYIRtI8bl33hIyhVJC1',dur:90},
  'unas esmaltado tradicional (manos y pies)':{id:'OYVNrcCxrbSYEd1SbV3f',dur:100},
  'pies semipermanente':{id:'szaDqVWMTKAFCVcYjgTh',dur:60},
  'manos tradicional':{id:'ItIbYfgFYYvZYQ6Oje0B',dur:45},
  'esmaltado tradicional manos':{id:'54RoAHSPDVzWjfk4N2cR',dur:30},
  'tradicional pies':{id:'XbxF4HF4VH3KNB16sNBU',dur:45},
  'recubrimiento polygel/acrilico':{id:'MmI8fIlxThj3dg3qXB5E',dur:150},
  'limpieza facial especial':{id:'vxUBF94v8PKqobjUBeZc',dur:90},
  'depilacion de cejas con cera':{id:'VYpzK2GHuBJ63aO2lSaV',dur:10},
  'extension de pestanas pelo a pelo efecto clasica':{id:'dry2VkC24zeouSdN4VEm',dur:70},
  'maquillaje social':{id:'71J4eTC3TIEuDXfsP1Iw',dur:60},
  'masaje relajacion piedras volcanicas + velas':{id:'q2Iz4gfTyoB3JkRNZ4CZ',dur:60},
  'depilacion media pierna':{id:'eRj3f8o8CLcD7i0rIgm3',dur:60},
  'corte de puntas':{id:'4aMo5CLViO46g2Q6jnip',dur:30},
  'valoracion de cabello':{id:'yePA3PPHJC9Fdu6A6WMt',dur:30},
  'valoracion':{id:'yePA3PPHJC9Fdu6A6WMt',dur:30},
}

const EXTRA = {
  'manicure':'manos semipermanente','manicura':'manos semipermanente',
  'pedicure':'pedicura tradicional + pedi spa','pedicura':'pedicura tradicional + pedi spa',
  'unas':'manos semipermanente','maquillaje':'maquillaje social',
  'cejas':'depilacion de cejas con cera',
  'pestanas':'extension de pestanas pelo a pelo efecto clasica',
  'masaje':'masaje relajacion piedras volcanicas + velas',
  'facial':'limpieza facial especial','limpieza facial':'limpieza facial especial',
  'depilacion':'depilacion media pierna','cabello':'valoracion de cabello',
  'corte de cabello':'corte de puntas',
}

function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9\s\/\+\(\)]/g,'').trim()
}

const CALENDARS = {}
for (const [k,v] of Object.entries(RAW)) CALENDARS[norm(k)] = v
for (const [k,v] of Object.entries(EXTRA)) {
  const kn = norm(k), vn = norm(v)
  if (!CALENDARS[kn] && CALENDARS[vn]) CALENDARS[kn] = CALENDARS[vn]
}

function lookup(servicio) {
  const n = norm(servicio)
  if (CALENDARS[n]) return CALENDARS[n]
  const sorted = Object.entries(CALENDARS).sort((a,b) => b[0].length - a[0].length)
  for (const [k,v] of sorted) { if (n.includes(k)) return v }
  const words = n.split(/\s+/)
  const tienePies   = words.some(w => ['pies','pedicure','pedicura'].includes(w))
  const tieneManos  = words.some(w => ['manos','manicure','manicura'].includes(w))
  const tieneRetiro = words.some(w => ['retiro','quitar','remover','retirar'].includes(w))
  const tieneSemi   = words.some(w => ['semipermanente','semi'].includes(w))
  if      (tieneRetiro && tienePies && tieneManos) return {id:'fcpxmqMktM3vzoyrhumR',dur:30}
  else if (tieneRetiro && tienePies)               return {id:'FJDuHD0L2DqBLPUeYsqM',dur:20}
  else if (tieneRetiro && tieneManos)              return {id:'CUY39YrfaRmiHvMdGTol',dur:15}
  else if (tieneManos && tienePies && tieneSemi)   return {id:'0jYIRtI8bl33hIyhVJC1',dur:90}
  else if (tieneManos && tienePies)                return {id:'OYVNrcCxrbSYEd1SbV3f',dur:100}
  else if (tienePies && tieneSemi)                 return {id:'szaDqVWMTKAFCVcYjgTh',dur:60}
  else if (tienePies)                              return {id:'MPv75km6l8sal1NKHqtV',dur:60}
  else if (tieneManos && tieneSemi)                return {id:'EDiqwAb54xY6nID5yzB8',dur:60}
  else if (tieneManos)                             return {id:'ItIbYfgFYYvZYQ6Oje0B',dur:45}
  return {id:'EDiqwAb54xY6nID5yzB8',dur:60}
}

const NOMBRES = {
  'EDiqwAb54xY6nID5yzB8':'Manos Semipermanente','ItIbYfgFYYvZYQ6Oje0B':'Manos Tradicional',
  '54RoAHSPDVzWjfk4N2cR':'Esmaltado Tradicional Manos','szaDqVWMTKAFCVcYjgTh':'Pies Semipermanente',
  'MPv75km6l8sal1NKHqtV':'Pedicura Tradicional + Pedi Spa','XbxF4HF4VH3KNB16sNBU':'Tradicional Pies',
  'CUY39YrfaRmiHvMdGTol':'Retiro Semi Manos','FJDuHD0L2DqBLPUeYsqM':'Retiro Semi Pies',
  'fcpxmqMktM3vzoyrhumR':'Retiro Semi Manos+Pies','0jYIRtI8bl33hIyhVJC1':'Uñas Semi Manos+Pies',
  'OYVNrcCxrbSYEd1SbV3f':'Uñas Tradicional Manos+Pies','MmI8fIlxThj3dg3qXB5E':'Polygel/Acrílico',
  'vxUBF94v8PKqobjUBeZc':'Limpieza Facial Especial','VYpzK2GHuBJ63aO2lSaV':'Depilación Cejas Cera',
  'dry2VkC24zeouSdN4VEm':'Extensión Pestañas Clásica','71J4eTC3TIEuDXfsP1Iw':'Maquillaje Social',
  'q2Iz4gfTyoB3JkRNZ4CZ':'Masaje Relajante','eRj3f8o8CLcD7i0rIgm3':'Depilación Media Pierna',
  '4aMo5CLViO46g2Q6jnip':'Corte de Puntas','yePA3PPHJC9Fdu6A6WMt':'Valoración Cabello',
}

const casos = [
  // Exactos
  ['manos semipermanente',                                   'Manos Semipermanente'],
  ['pies semipermanente',                                    'Pies Semipermanente'],
  ['manos tradicional',                                      'Manos Tradicional'],
  ['recubrimiento polygel/acrilico',                         'Polygel/Acrílico'],
  // Genéricos (via EXTRA)
  ['manicure',                                               'Manos Semipermanente'],
  ['pedicure',                                               'Pedicura Tradicional + Pedi Spa'],
  ['pedicure tradicional',                                   'Pedicura Tradicional + Pedi Spa'],
  ['unas',                                                   'Manos Semipermanente'],
  ['maquillaje',                                             'Maquillaje Social'],
  ['facial',                                                 'Limpieza Facial Especial'],
  ['cejas',                                                  'Depilación Cejas Cera'],
  ['masaje',                                                 'Masaje Relajante'],
  ['cabello',                                                'Valoración Cabello'],
  ['corte de cabello',                                       'Corte de Puntas'],
  ['corte de cabello corto',                                 'Corte de Puntas'],
  // Pies variants
  ['arreglo de pies',                                        'Pedicura Tradicional + Pedi Spa'],
  ['limpieza de pies',                                       'Pedicura Tradicional + Pedi Spa'],
  // Retiros
  ['retiro semipermanente pies',                             'Retiro Semi Pies'],
  ['quitar semipermanente pies',                             'Retiro Semi Pies'],
  ['remover semipermanente manos',                           'Retiro Semi Manos'],
  ['arreglo de pies y quitar semipermanente de manos y pies','Retiro Semi Manos+Pies'],
  // Combos
  ['manos y pies',                                           'Uñas Tradicional Manos+Pies'],
  ['manicure y pedicure',                                    'Uñas Tradicional Manos+Pies'],
  ['esmaltado manos y pies semipermanente',                  'Uñas Semi Manos+Pies'],
  // Totalmente desconocidos
  ['tratamiento de cejas',                                   'Manos Semipermanente'],
  ['algo que no existe para nada',                           'Manos Semipermanente'],
]

let ok = 0, fail = 0
console.log('━'.repeat(70))
for (const [input, expected] of casos) {
  const cal = lookup(input)
  const nombre = NOMBRES[cal.id] || cal.id
  const pass = nombre === expected
  if (pass) ok++; else fail++
  console.log(`${pass ? '✅' : '❌'} "${input}"`)
  if (!pass) console.log(`   Esperado: ${expected}`)
  console.log(`   → ${nombre} (${cal.dur}min)`)
}
console.log('━'.repeat(70))
console.log(`${ok}/${ok+fail} correctos${fail > 0 ? ` — ${fail} fallo(s)` : ' — TODO OK 🎉'}`)
