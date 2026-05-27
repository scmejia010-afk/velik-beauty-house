const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function get(path) {
  return new Promise((res) => {
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'GET', headers: { 'X-N8N-API-KEY': N8N_KEY } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.end();
  });
}

function put(path, body) {
  return new Promise((res) => {
    const b = JSON.stringify(body);
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'PUT', headers: { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.write(b); req.end();
  });
}

const NEW_CODE = `
function normalize(s) {
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
  "limpieza facial tradicional":{"id":"fz9614uqbCIz8bLDXYNR","dur":60}
};

const STAFF = {
  carolina: 'Bn1QrO4ITpYI7wSohG9r',
  laura:    'DEeqUttYKgjjsfNaS1XY',
  luz:      'UzLj5T8ZOrJ8reSig5os',
  vanesa:   'DEeqUttYKgjjsfNaS1XY',
  vanessa:  'DEeqUttYKgjjsfNaS1XY'
};

const CALENDARS = {};
for (const [k,v] of Object.entries(RAW)) { CALENDARS[normalize(k)] = v; }

function lookupService(servicio) {
  const norm = normalize(servicio);
  if (CALENDARS[norm]) return CALENDARS[norm];
  for (const [k,v] of Object.entries(CALENDARS)) {
    if (k.includes(norm) || norm.includes(k)) return v;
  }
  return null;
}

// Parse input
let raw = $json;
let q = raw.query !== undefined ? raw.query : raw;
if (typeof q === 'string') { try { q = JSON.parse(q); } catch(e) {} }

let servicio = '';
let fecha = '';
let profesional = '';

if (typeof q === 'string') {
  servicio = q;
} else if (q && typeof q === 'object') {
  servicio = q.servicio || q.service || q.nombre || q.name || '';
  fecha = q.fecha || q.date || '';
  profesional = q.profesional || '';
  if (typeof servicio === 'object') {
    servicio = servicio.servicio || servicio.service || JSON.stringify(servicio);
  }
}

if (!servicio) {
  return [{ json: { error: 'No se pudo extraer el servicio. Input recibido: ' + JSON.stringify(raw) } }];
}

fecha = fecha || new Date().toISOString().split('T')[0];

const cal = lookupService(servicio);
if (!cal) {
  return [{ json: { error: 'Servicio no encontrado: ' + servicio,
    disponibles: Object.keys(CALENDARS).slice(0,10).join(', ') + '...' } }];
}

// Resolve professional name to staffUserId
const profKey = normalize(profesional);
const staffUserId = STAFF[profKey] || '';

// Bogota offset = UTC-5
const start = new Date(fecha + 'T00:00:00-05:00');
const end = new Date(start); end.setDate(end.getDate() + 5);

return [{ json: {
  calendarId: cal.id,
  servicio,
  startDate: start.getTime(),
  endDate: end.getTime(),
  staffUserId
} }];
`.trim();

async function run() {
  const wf = await get('/api/v1/workflows/XAoMeVFKqLw7KcFX');
  const n = wf.nodes.find(x => x.name === 'Buscar Calendario');
  n.parameters.jsCode = NEW_CODE;

  // Also fix Free Slots GHL: only send staffUserId when non-empty
  const httpNode = wf.nodes.find(x =>
    x.type === 'n8n-nodes-base.httpRequest' &&
    JSON.stringify(x.parameters).includes('free-slots')
  );
  if (httpNode && httpNode.parameters.queryParameters) {
    const params = httpNode.parameters.queryParameters.parameters || [];
    const staffParam = params.find(p => p.name === 'staffUserId');
    if (staffParam) {
      // Only send when non-empty — use n8n expression with conditional
      staffParam.value = "={{ $json.staffUserId || undefined }}";
      console.log('· staffUserId param already present, value updated');
    }
  }

  const r = await put('/api/v1/workflows/XAoMeVFKqLw7KcFX', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Saved:', r.name || r.message);
}
run();
