const https = require('https');

const GHL_KEY = 'pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e';

const DURATIONS = {
  "manos semipermanente": 60, "base rubber manos": 60, "baby boomer": 170,
  "recubrimiento polygel/acrilico": 150, "retoque de press on": 80,
  "retiro rubber/dipping": 20, "extension de sistemas o reparacion c/u en servicio": 15,
  "manos tradicional": 45, "builder gel": 30, "unas esculpidas polygel/acrilico": 150,
  "retoque recubrimiento poly/acrilico": 100, "retiro semipermanente manos": 15,
  "extension del sistema o reparacion c/u fuera del servicio": 10,
  "manos evolution": 45, "unas dip powder + esmaltado semipermanente": 70,
  "retoque esculpidas en polygel/acrilico": 110, "unas press on": 90,
  "esmaltado semipermanente manos": 20, "masaje relajante de manos": 7,
  "diseno": 10, "pies semipermanente": 60, "pedicura tradicional + pedi spa": 60,
  "retiro semipermanente pies": 20, "pies evolution": 40, "pedicura semi + pedi spa": 70,
  "tradicional pies": 45, "unas semipermanente (manos y pies)": 90,
  "manos semipermanentes y pies tradicional": 120, "manos evolution y pies semipermanentes": 100,
  "unas esmaltado tradicional (manos y pies)": 100, "manos semipermanente y pies evo": 120,
  "solo limpieza manos y pies": 60, "evolution (manos y pies)": 80,
  "manos tradicionales + pies semipermanente": 120,
  "alisado natural argan y coco (corto)": 300, "alisado natural argan y coco (medio)": 300,
  "terapia capilar de loreal": 20, "cepillado cabello extralargo": 60,
  "color cabello largo": 90, "alisado natural de argan y/o coco largo": 300,
  "ondas": 45, "cepillado cabello medio": 40, "color cabello corto": 60,
  "color cabello extra largo": 90, "corte en capas": 35,
  "alisado natural argan y/o coco (medio altura del codo)": 300,
  "alisado natural de argan y/o coco extra largo": 300, "planchado de cabello": 40,
  "cepillado cabello largo": 45, "color cabello medio": 60,
  "depilacion de cejas con cera": 10, "depilacion perfilado/cuchilla cejas": 25,
  "lifting de pestanas": 60, "depilacion de cejas con hilo": 15,
  "laminado de cejas y lifting de pestanas": 70, "depilacion de cejas con henna": 10,
  "laminado de cejas": 50, "extension de pestanas pelo a pelo (efecto clasica)": 70,
  "extension de pestanas pelo a pelo (efecto hibrido)": 90,
  "extension de pestanas pelo a pelo (efecto tecnologico)": 90,
  "retoque pestanas": 60, "depilacion media pierna": 60, "depilacion nariz": 20,
  "depilacion espalda baja": 60, "depilacion de gluteos": 20,
  "depilacion bigote con hilo": 10, "depilacion pierna completa": 90,
  "depilacion orejas": 20, "depilacion de pubis completo": 60,
  "depilacion barbilla con hilo": 10, "depilacion bigote": 10,
  "depilacion de axilas": 18, "depilacion linea del bikini": 45,
  "pestanas punto a punto": 45, "maquillaje social": 60, "maquillaje blindado": 60,
  "maquillaje halloween": 60, "bano de novia brazos": 15,
  "masaje relajacion piedras volcanicas + velas": 60, "drenaje linfatico": 60,
  "paquete 1 masaje reductor": 45, "paquete 2 masaje reductor": 45,
  "paquete 3 masaje reductor": 45, "reestructuracion de estrias": 40,
  "camuflaje de estrias": 120, "limpieza facial especial": 90,
  "limpieza facial tradicional": 60
};

function normalize(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9\s\/\+\(\)]/g,'').trim();
}

function fetchCalendars() {
  return new Promise((resolve) => {
    const options = {
      hostname: 'services.leadconnectorhq.com',
      path: '/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo',
      method: 'GET',
      headers: { 'Authorization': `Bearer ${GHL_KEY}`, 'Version': '2021-04-15' }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d).calendars));
    });
    req.end();
  });
}

function updateCalendar(cal) {
  return new Promise((resolve) => {
    const name = normalize(cal.name);
    const dur = DURATIONS[name] || 30;
    if (dur === cal.slotDuration) return resolve({ name: cal.name, skipped: true });

    const body = JSON.stringify({ slotDuration: dur, slotInterval: dur });
    const options = {
      hostname: 'services.leadconnectorhq.com',
      path: `/calendars/${cal.id}`,
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${GHL_KEY}`, 'Version': '2021-04-15', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) }
    };
    const req = https.request(options, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve({ name: cal.name, status: res.statusCode, dur }));
    });
    req.on('error', e => resolve({ name: cal.name, error: e.message }));
    req.write(body); req.end();
  });
}

async function run() {
  console.log('Fetching calendars...');
  const cals = await fetchCalendars();
  console.log(`Found ${cals.length} calendars\n`);
  let updated = 0, skipped = 0, errors = 0;
  for (let i = 0; i < cals.length; i += 5) {
    const results = await Promise.all(cals.slice(i, i+5).map(updateCalendar));
    results.forEach(r => {
      if (r.skipped) skipped++;
      else if (r.error) { console.log('ERROR:', r.name, r.error); errors++; }
      else { console.log(`${r.status===200?'✓':'✗'} ${r.name} → ${r.dur} min [${r.status}]`); updated++; }
    });
  }
  console.log(`\nDone: ${updated} updated, ${skipped} already correct, ${errors} errors`);
}
run();
