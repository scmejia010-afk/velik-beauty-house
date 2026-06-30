const https = require('https')

const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8'
const N8N   = 'santiagon8nmejia.dominadoresia.com'
const WF_ID = '3UMIZGQy4HCmBN6v'

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

const NEW_CODE = `function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[\\u0300-\\u036f]/g,'')
    .replace(/[^a-z0-9\\s\\/\\+\\(\\)]/g,'').trim();
}
const RAW = {
  "manos semipermanente":{"id":"EDiqwAb54xY6nID5yzB8","dur":60},
  "base rubber manos":{"id":"yVTJ5MuqOiTIG6aW4Zzu","dur":60},
  "baby boomer":{"id":"HhrSGv6kTKZOtLwLtLaO","dur":170},
  "recubrimiento polygel/acrilico":{"id":"MmI8fIlxThj3dg3qXB5E","dur":150},
  "retoque de press on":{"id":"rSP0C1qAAvA82qSGwSsz","dur":80},
  "retiro rubber/dipping":{"id":"KDdZgv19rQYsaxXNeIMB","dur":20},
  "esmaltado tradicional manos":{"id":"54RoAHSPDVzWjfk4N2cR","dur":30},
  "extension de sistemas o reparacion c/u en servicio":{"id":"HowlM3DRvUNe4H9AeSLV","dur":15},
  "garantias":{"id":"Oi2Dn1v3MpIR3wn06LyY","dur":30},
  "manos tradicional":{"id":"ItIbYfgFYYvZYQ6Oje0B","dur":45},
  "builder gel":{"id":"58aCvkqxbMBcFFPgZmyk","dur":120},
  "unas esculpidas polygel/acrilico":{"id":"5FzBoBw7GCdwViMPesPC","dur":150},
  "retoque recubrimiento poly/acrilico":{"id":"g7a3uGcoBdAdrffowsY1","dur":100},
  "retiro semipermanente manos":{"id":"CUY39YrfaRmiHvMdGTol","dur":15},
  "limpieza manos":{"id":"yENMASOfLO8JTFgjW23z","dur":30},
  "solo limpieza manos":{"id":"fnJgqRtJlV8VAbEp2veA","dur":30},
  "extension del sistema o reparacion c/u fuera del servicio":{"id":"IaeOZwQoDAm6m1Ysvz41","dur":10},
  "manos evolution":{"id":"uyBy6KxStea3tyJXkxvE","dur":45},
  "unas dip powder + esmaltado semipermanente":{"id":"DIDIge2ItuyDQU3hfjqA","dur":70},
  "retoque esculpidas en polygel/acrilico":{"id":"JuHPG8vMNXKSOiyVNzjR","dur":110},
  "unas press on":{"id":"CwNB6YUweNhSrYOTFElB","dur":90},
  "retiro polygel/acrilico":{"id":"NbDO7tF3rTsVlsNAqweR","dur":30},
  "esmaltado semipermanente manos":{"id":"UdfCTzTMPNhYuemDnWsb","dur":20},
  "masaje relajante de manos":{"id":"74JOMcKwGJTEqfgqo2Ra","dur":7},
  "diseno":{"id":"ZIeJPQLAeo3bM3tLDL8z","dur":10},
  "pies semipermanente":{"id":"szaDqVWMTKAFCVcYjgTh","dur":60},
  "pedicura tradicional + pedi spa":{"id":"MPv75km6l8sal1NKHqtV","dur":60},
  "retiro semipermanente pies":{"id":"FJDuHD0L2DqBLPUeYsqM","dur":20},
  "pies evolution":{"id":"tKn5Hy3A7pKqg7nhVpgC","dur":40},
  "pedicura semi + pedi spa":{"id":"1OpkJJuQoNlATF5hd9Zi","dur":70},
  "tradicional pies":{"id":"XbxF4HF4VH3KNB16sNBU","dur":45},
  "solo limpieza pies":{"id":"rcuBG3bPRNwG11VFqgH2","dur":30},
  "unas semipermanente (manos y pies)":{"id":"0jYIRtI8bl33hIyhVJC1","dur":90},
  "manos semipermanentes y pies tradicional":{"id":"xpyrWObNXPeV2kMJtlIy","dur":120},
  "manos evolution y pies semipermanentes":{"id":"zfKlMG4wsoLWam1yRQCl","dur":100},
  "unas esmaltado tradicional (manos y pies)":{"id":"OYVNrcCxrbSYEd1SbV3f","dur":100},
  "manos semipermanente y pies evo":{"id":"z6VLaBzxm2hxO4JglzOI","dur":120},
  "solo limpieza manos y pies":{"id":"FMTaDks9JBTh1hXZ9k2U","dur":60},
  "evolution (manos y pies)":{"id":"ZLEVvENlOAsJdUVyyLGf","dur":80},
  "manos tradicionales + pies semipermanente":{"id":"iAOrgphopFSqRQt5dxTm","dur":120},
  "retiro semipermanente manos y pies":{"id":"fcpxmqMktM3vzoyrhumR","dur":30},
  "alisado natural argan y coco (corto)":{"id":"tYgB9RKWsWnAY6yzHbzo","dur":300},
  "alisado natural argan y coco (medio)":{"id":"YsyBC5BKtrnN8YQYRDBm","dur":300},
  "terapia capilar de loreal":{"id":"gJhd4efPJ7Zs7Ogybq95","dur":20},
  "cepillado cabello corto":{"id":"AFzeRInudMfQvytS7rYI","dur":30},
  "cepillado cabello extralargo":{"id":"IM2RYaBSfWNytuAmACml","dur":60},
  "color cabello largo":{"id":"SZnHg7E8gOsBB0CxxpAk","dur":90},
  "corte caballero":{"id":"6V88WbxYuumHKt5RBfGO","dur":30},
  "toxina botulinica":{"id":"7G42EdlizK39sGWSRTWO","dur":20},
  "alisado natural de argan y/o coco largo":{"id":"aO1pbT4UQDyqLJwXnPqX","dur":300},
  "ondas":{"id":"pyw2lCLu7OmMz5i1Xj0i","dur":45},
  "cepillado cabello medio":{"id":"BhjqV08NlQwTyAer5Rah","dur":40},
  "color cabello corto":{"id":"tdu7sEKcoUaJGN6TS5dR","dur":60},
  "color cabello extra largo":{"id":"HXfDgBJXCdD5xD7rqgmW","dur":90},
  "corte en capas":{"id":"cYESJstUsKOBcrKLfI61","dur":35},
  "alisado natural argan y/o coco (medio altura del codo)":{"id":"1yG992Jgff0sTUyGHzfQ","dur":300},
  "alisado natural de argan y/o coco extra largo":{"id":"NFFYkmfD3gwaVACAOBxq","dur":300},
  "planchado de cabello":{"id":"eSmQWFTgnrsIhICBidoF","dur":40},
  "cepillado cabello largo":{"id":"zxVN8YcfF9nQh3uOhLcD","dur":45},
  "color cabello medio":{"id":"XEmC3LZdNFLzri44z5fe","dur":60},
  "corte de puntas":{"id":"4aMo5CLViO46g2Q6jnip","dur":30},
  "depilacion de cejas con cera":{"id":"VYpzK2GHuBJ63aO2lSaV","dur":10},
  "depilacion perfilado/cuchilla cejas":{"id":"GcGJ59uvGEDf3LZCyrg2","dur":25},
  "lifting de pestanas":{"id":"Z7WKPMSF94iQoA8Mf9ne","dur":60},
  "depilacion de cejas con hilo":{"id":"ozLRNZ5V55zBOpGxcygz","dur":15},
  "laminado de cejas y lifting de pestanas":{"id":"KuZ6tseSF1WIC3wmAwGj","dur":70},
  "depilacion de cejas con henna":{"id":"n49lc4VkUvtvdtCRcgTB","dur":10},
  "laminado de cejas":{"id":"JGZXM08wqm28dl4qfp9T","dur":50},
  "extension de pestanas pelo a pelo efecto clasica":{"id":"dry2VkC24zeouSdN4VEm","dur":70},
  "extension de pestanas pelo a pelo efecto hibrido":{"id":"dbxPJAla6tTHNv73eo1l","dur":90},
  "extension de pestanas pelo a pelo efecto tecnologico":{"id":"4O1RVMdKaXEUaHqQqVP1","dur":90},
  "retoque pestanas":{"id":"yuikssBrbkVHsArQoe65","dur":60},
  "depilacion rostro completo con hilo":{"id":"hKENNyPe7hZhcz5HGHny","dur":30},
  "depilacion media pierna":{"id":"eRj3f8o8CLcD7i0rIgm3","dur":60},
  "depilacion nariz":{"id":"ZdfgP31Jmj4hWCEezhda","dur":20},
  "depilacion espalda baja":{"id":"9HqMBn6P9DBAsMqZmFit","dur":60},
  "depilacion de gluteos":{"id":"woQv67dSOZkRipYxGaXm","dur":20},
  "depilacion bigote con hilo":{"id":"eHXH3nwnTLLoacCnQKeh","dur":10},
  "depilacion pierna completa":{"id":"cmyFlDKVr8UemAn9N71W","dur":90},
  "depilacion orejas":{"id":"whI104AHCNJGaV35yii2","dur":20},
  "depilacion de pubis completo":{"id":"1vn5jyzI6R8TstZCZhOI","dur":60},
  "depilacion barbilla con hilo":{"id":"9M1FFJKZmz9tPhwEitAb","dur":10},
  "depilacion bigote":{"id":"UKZG99bvj0QCeFJaLNk7","dur":10},
  "depilacion de axilas":{"id":"mSw9Swdz68i0hC5cqNme","dur":18},
  "depilacion linea del bikini":{"id":"mfXJuW1bdCIPV4GgCSx3","dur":45},
  "pestanas punto a punto":{"id":"zT9oLreL1DCiwWDmO1Dx","dur":45},
  "maquillaje social":{"id":"71J4eTC3TIEuDXfsP1Iw","dur":60},
  "maquillaje blindado":{"id":"hdrmUKbZXwO4tbNVsIkb","dur":60},
  "maquillaje halloween":{"id":"PelRqVASPHp0QEu7P5Xs","dur":60},
  "bano de novia brazos":{"id":"OybBhb6gij304Vromp7n","dur":15},
  "masaje relajacion piedras volcanicas + velas":{"id":"q2Iz4gfTyoB3JkRNZ4CZ","dur":60},
  "drenaje linfatico":{"id":"wAwK46EAzP7OMVbVZ4Na","dur":60},
  "paquete 1 masaje reductor":{"id":"kjgB0Whm8mjpYv8I075K","dur":45},
  "paquete 2 masaje reductor":{"id":"8iU9qGnCM5nT6816pEAh","dur":45},
  "paquete 3 masaje reductor":{"id":"uajeiWuAmnwZ9BPA4RlT","dur":45},
  "reestructuracion de estrias":{"id":"9PiZEDHNec91qK58o3de","dur":40},
  "camuflaje de estrias":{"id":"xU7HfkiIbhZwHo1EnrTz","dur":120},
  "limpieza facial especial":{"id":"vxUBF94v8PKqobjUBeZc","dur":90},
  "limpieza facial tradicional":{"id":"fz9614uqbCIz8bLDXYNR","dur":60},
  "valoracion de cabello":{"id":"yePA3PPHJC9Fdu6A6WMt","dur":30},
  "valoracion cabello":{"id":"yePA3PPHJC9Fdu6A6WMt","dur":30},
  "valoracion para color":{"id":"yePA3PPHJC9Fdu6A6WMt","dur":30},
  "valoracion para procedimiento de color":{"id":"yePA3PPHJC9Fdu6A6WMt","dur":30},
  "valoracion de color":{"id":"yePA3PPHJC9Fdu6A6WMt","dur":30},
  "valoracion":{"id":"yePA3PPHJC9Fdu6A6WMt","dur":30},
  "valoracion de alisado":{"id":"yePA3PPHJC9Fdu6A6WMt","dur":30}
};
const PRECIOS = {"EDiqwAb54xY6nID5yzB8":"$60.000","ItIbYfgFYYvZYQ6Oje0B":"$45.000","uyBy6KxStea3tyJXkxvE":"$45.000","58aCvkqxbMBcFFPgZmyk":"$120.000","HhrSGv6kTKZOtLwLtLaO":"$170.000","yVTJ5MuqOiTIG6aW4Zzu":"$60.000","5FzBoBw7GCdwViMPesPC":"$150.000","MmI8fIlxThj3dg3qXB5E":"$150.000","JuHPG8vMNXKSOiyVNzjR":"$110.000","g7a3uGcoBdAdrffowsY1":"$100.000","DIDIge2ItuyDQU3hfjqA":"$70.000","CwNB6YUweNhSrYOTFElB":"$90.000","rSP0C1qAAvA82qSGwSsz":"$80.000","UdfCTzTMPNhYuemDnWsb":"$20.000","54RoAHSPDVzWjfk4N2cR":"$30.000","CUY39YrfaRmiHvMdGTol":"$15.000","KDdZgv19rQYsaxXNeIMB":"$20.000","NbDO7tF3rTsVlsNAqweR":"$30.000","yENMASOfLO8JTFgjW23z":"$30.000","74JOMcKwGJTEqfgqo2Ra":"$7.000","ZIeJPQLAeo3bM3tLDL8z":"$10.000","Oi2Dn1v3MpIR3wn06LyY":"$0","HowlM3DRvUNe4H9AeSLV":"$15.000","IaeOZwQoDAm6m1Ysvz41":"$10.000","fnJgqRtJlV8VAbEp2veA":"$30.000","szaDqVWMTKAFCVcYjgTh":"$60.000","MPv75km6l8sal1NKHqtV":"$60.000","1OpkJJuQoNlATF5hd9Zi":"$70.000","tKn5Hy3A7pKqg7nhVpgC":"$40.000","XbxF4HF4VH3KNB16sNBU":"$45.000","FJDuHD0L2DqBLPUeYsqM":"$20.000","rcuBG3bPRNwG11VFqgH2":"$30.000","0jYIRtI8bl33hIyhVJC1":"$90.000","xpyrWObNXPeV2kMJtlIy":"$120.000","zfKlMG4wsoLWam1yRQCl":"$100.000","OYVNrcCxrbSYEd1SbV3f":"$100.000","z6VLaBzxm2hxO4JglzOI":"$120.000","ZLEVvENlOAsJdUVyyLGf":"$80.000","iAOrgphopFSqRQt5dxTm":"$120.000","FMTaDks9JBTh1hXZ9k2U":"$60.000","fcpxmqMktM3vzoyrhumR":"$30.000","tYgB9RKWsWnAY6yzHbzo":"$300.000","YsyBC5BKtrnN8YQYRDBm":"$300.000","aO1pbT4UQDyqLJwXnPqX":"$300.000","NFFYkmfD3gwaVACAOBxq":"$300.000","1yG992Jgff0sTUyGHzfQ":"$300.000","tdu7sEKcoUaJGN6TS5dR":"$60.000","XEmC3LZdNFLzri44z5fe":"$60.000","SZnHg7E8gOsBB0CxxpAk":"$90.000","HXfDgBJXCdD5xD7rqgmW":"$90.000","AFzeRInudMfQvytS7rYI":"$30.000","BhjqV08NlQwTyAer5Rah":"$40.000","zxVN8YcfF9nQh3uOhLcD":"$45.000","IM2RYaBSfWNytuAmACml":"$60.000","eSmQWFTgnrsIhICBidoF":"$40.000","pyw2lCLu7OmMz5i1Xj0i":"$45.000","cYESJstUsKOBcrKLfI61":"$35.000","4aMo5CLViO46g2Q6jnip":"$30.000","6V88WbxYuumHKt5RBfGO":"$30.000","gJhd4efPJ7Zs7Ogybq95":"$20.000","7G42EdlizK39sGWSRTWO":"$20.000","Z7WKPMSF94iQoA8Mf9ne":"$60.000","JGZXM08wqm28dl4qfp9T":"$50.000","KuZ6tseSF1WIC3wmAwGj":"$70.000","dry2VkC24zeouSdN4VEm":"$70.000","dbxPJAla6tTHNv73eo1l":"$90.000","4O1RVMdKaXEUaHqQqVP1":"$90.000","yuikssBrbkVHsArQoe65":"$60.000","zT9oLreL1DCiwWDmO1Dx":"$45.000","VYpzK2GHuBJ63aO2lSaV":"$10.000","ozLRNZ5V55zBOpGxcygz":"$15.000","n49lc4VkUvtvdtCRcgTB":"$10.000","GcGJ59uvGEDf3LZCyrg2":"$25.000","cmyFlDKVr8UemAn9N71W":"$90.000","eRj3f8o8CLcD7i0rIgm3":"$60.000","mfXJuW1bdCIPV4GgCSx3":"$45.000","1vn5jyzI6R8TstZCZhOI":"$60.000","mSw9Swdz68i0hC5cqNme":"$18.000","9HqMBn6P9DBAsMqZmFit":"$60.000","woQv67dSOZkRipYxGaXm":"$20.000","UKZG99bvj0QCeFJaLNk7":"$10.000","eHXH3nwnTLLoacCnQKeh":"$10.000","9M1FFJKZmz9tPhwEitAb":"$10.000","whI104AHCNJGaV35yii2":"$20.000","ZdfgP31Jmj4hWCEezhda":"$20.000","hKENNyPe7hZhcz5HGHny":"$30.000","71J4eTC3TIEuDXfsP1Iw":"$60.000","hdrmUKbZXwO4tbNVsIkb":"$60.000","PelRqVASPHp0QEu7P5Xs":"$60.000","OybBhb6gij304Vromp7n":"$15.000","wAwK46EAzP7OMVbVZ4Na":"$60.000","q2Iz4gfTyoB3JkRNZ4CZ":"$60.000","kjgB0Whm8mjpYv8I075K":"$45.000","8iU9qGnCM5nT6816pEAh":"$45.000","uajeiWuAmnwZ9BPA4RlT":"$45.000","9PiZEDHNec91qK58o3de":"$40.000","xU7HfkiIbhZwHo1EnrTz":"$120.000","vxUBF94v8PKqobjUBeZc":"$90.000","fz9614uqbCIz8bLDXYNR":"$60.000","6Gq72d3MJ8FqYsWYEeWD":"$30.000"};

// Mapa normalizado de calendarios
const CALENDARS = {};
for (const [k,v] of Object.entries(RAW)) { CALENDARS[normalize(k)] = v; }

// Aliases para términos genéricos
const EXTRA = {
  'manicure':'manos semipermanente','manicura':'manos semipermanente',
  'pedicure':'pedicura tradicional + pedi spa','pedicura':'pedicura tradicional + pedi spa',
  'unas':'manos semipermanente','maquillaje':'maquillaje social',
  'cejas':'depilacion de cejas con cera',
  'pestanas':'extension de pestanas pelo a pelo efecto clasica',
  'extensiones de pestanas':'extension de pestanas pelo a pelo efecto clasica',
  'masaje':'masaje relajacion piedras volcanicas + velas',
  'masaje relajante':'masaje relajacion piedras volcanicas + velas',
  'facial':'limpieza facial especial','limpieza facial':'limpieza facial especial',
  'depilacion':'depilacion media pierna',
  'cabello':'valoracion de cabello',
  'corte de cabello':'corte de puntas',
};
for (const [k,v] of Object.entries(EXTRA)) {
  const kn = normalize(k), vn = normalize(v);
  if (!CALENDARS[kn] && CALENDARS[vn]) CALENDARS[kn] = CALENDARS[vn];
}

function lookupService(servicio) {
  const norm = normalize(servicio);
  // 1. Exact
  if (CALENDARS[norm]) return CALENDARS[norm];
  // 2. Partial — clave más larga primero para máxima especificidad
  const sorted = Object.entries(CALENDARS).sort((a,b) => b[0].length - a[0].length);
  for (const [k,v] of sorted) { if (norm.includes(k)) return v; }
  // 3. Fallback por palabras clave
  const words = norm.split(/\\s+/);
  const tienePies   = words.some(w => ['pies','pedicure','pedicura'].includes(w));
  const tieneManos  = words.some(w => ['manos','manicure','manicura'].includes(w));
  const tieneRetiro = words.some(w => ['retiro','quitar','remover','retirar'].includes(w));
  const tieneSemi   = words.some(w => ['semipermanente','semi'].includes(w));
  if      (tieneRetiro && tienePies && tieneManos) return {id:'fcpxmqMktM3vzoyrhumR',dur:30};
  else if (tieneRetiro && tienePies)               return {id:'FJDuHD0L2DqBLPUeYsqM',dur:20};
  else if (tieneRetiro && tieneManos)              return {id:'CUY39YrfaRmiHvMdGTol',dur:15};
  else if (tieneManos && tienePies && tieneSemi)   return {id:'0jYIRtI8bl33hIyhVJC1',dur:90};
  else if (tieneManos && tienePies)                return {id:'OYVNrcCxrbSYEd1SbV3f',dur:100};
  else if (tienePies && tieneSemi)                 return {id:'szaDqVWMTKAFCVcYjgTh',dur:60};
  else if (tienePies)                              return {id:'MPv75km6l8sal1NKHqtV',dur:60};
  else if (tieneManos && tieneSemi)                return {id:'EDiqwAb54xY6nID5yzB8',dur:60};
  else if (tieneManos)                             return {id:'ItIbYfgFYYvZYQ6Oje0B',dur:45};
  // 4. Fallback absoluto — siempre agenda algo
  return {id:'EDiqwAb54xY6nID5yzB8',dur:60};
}

// --- Parse input ---
let q = $json.query || {};
if (typeof q === 'string') { try { q = JSON.parse(q); } catch(e) {} }

const servicio  = q.servicio || q.service || 'manos semipermanente';
const slotTime  = q.slot_time || q.startTime || q.hora || '';
// Normalizar formato de hora
let slotNorm = slotTime.replace(' ', 'T');
if (!/[+-]\\d{2}:\\d{2}$/.test(slotNorm) && !slotNorm.endsWith('Z')) {
  slotNorm += '-05:00';
}

// BLINDAJE: nombre con fallback, telefono y email OPCIONALES
const nombre   = q.cliente_nombre || q.nombre || q.name || 'Cliente';
const telefono = q.cliente_telefono || q.telefono || q.phone || '';
const email    = q.cliente_email || q.email || '';

// Solo falla si no hay hora — sin hora es imposible agendar
if (!slotTime) {
  return [{ json: { error: 'Falta slot_time. Usa verificar_disponibilidad primero para elegir un horario.' } }];
}

const cal = lookupService(servicio);

const startDt = new Date(slotNorm);
if (isNaN(startDt)) {
  return [{ json: { error: 'slot_time invalido: ' + slotTime } }];
}

// Calcular endTime
const tzMatch = slotNorm.match(/([+-]\\d{2}:\\d{2})$/);
const tz = tzMatch ? tzMatch[1] : '-05:00';
const sign = tz[0] === '+' ? 1 : -1;
const [tzH, tzM] = tz.slice(1).split(':').map(Number);
const offsetMs = sign * (tzH * 60 + tzM) * 60000;
const endDt = new Date(startDt.getTime() + cal.dur * 60000 + offsetMs);
const pad = x => String(x).padStart(2,'0');
const endISO = endDt.getUTCFullYear()+'-'+pad(endDt.getUTCMonth()+1)+'-'+pad(endDt.getUTCDate())+'T'+pad(endDt.getUTCHours())+':'+pad(endDt.getUTCMinutes())+':00'+tz;

// Resolver profesional
const STAFF_MAP = {
  "carolina":"Bn1QrO4ITpYI7wSohG9r","carolina paz":"Bn1QrO4ITpYI7wSohG9r",
  "laura":"DEeqUttYKgjjsfNaS1XY","laura vanessa":"DEeqUttYKgjjsfNaS1XY",
  "vanesa":"DEeqUttYKgjjsfNaS1XY","vanessa":"DEeqUttYKgjjsfNaS1XY",
  "luz":"UzLj5T8ZOrJ8reSig5os","luz aida":"UzLj5T8ZOrJ8reSig5os","aida":"UzLj5T8ZOrJ8reSig5os",
  "geraldine":"saGMogKgCH3kmIhq4VlJ"
};
const profRaw = normalize(q.profesional || '');
const userId = STAFF_MAP[profRaw] || STAFF_MAP[profRaw.split(' ')[0]] || undefined;

return [{ json: {
  calendarId: cal.id,
  servicio,
  duracion: cal.dur,
  precio: PRECIOS[cal.id] || '',
  startTime: slotNorm,
  endTime: endISO,
  nombre,
  telefono,  // puede ser vacío — GHL acepta contactos sin teléfono
  email,
  ...(userId ? { userId } : {})
} }];`

async function main() {
  const wf = await req('GET', `/api/v1/workflows/${WF_ID}`)
  if (wf.message) return console.error('Error GET:', wf.message)

  const nodeIdx = wf.nodes.findIndex(n => n.name === 'Parsear Datos')
  wf.nodes[nodeIdx].parameters.jsCode = NEW_CODE

  const body = { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings, staticData: wf.staticData || null }
  const result = await req('PUT', `/api/v1/workflows/${WF_ID}`, body)
  if (result.id) {
    console.log('✅ VELIK - Crear Cita blindado:')
    console.log('   - Teléfono ya no es obligatorio')
    console.log('   - Servicio siempre resuelve (fallback total)')
    console.log('   - Solo falla si falta slot_time (sin hora es imposible agendar)')
  } else {
    console.error('❌', JSON.stringify(result).substring(0, 400))
  }
}

main().catch(console.error)
