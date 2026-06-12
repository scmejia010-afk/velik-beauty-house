const https = require('https');
const GHL_KEY = 'pit-022a5206-1196-4066-8957-50cf5634da09';

const CATEGORIES = {
  MANICURA: ['manos semipermanente', 'builder gel', 'manos tradicional', 'base rubber', 'press on', 'polygel', 'acrílico', 'esmaltado manos', 'retoque', 'extension', 'retiro', 'limpieza manos'],
  PEDICURA: ['pies semipermanente', 'pedicura', 'pies evolution', 'pies tradicional', 'esmaltado', 'retiro semipermanente pies', 'limpieza pies'],
  CABELLO: ['alisado', 'color cabello', 'corte', 'cepillado', 'ondas', 'planchado', 'terapia capilar', 'corte caballero'],
  FACIAL: ['limpieza facial', 'toxina botulínica'],
  MASAJES: ['masaje', 'drenaje linfático', 'paquete', 'piedras volcánicas'],
  DEPILACION: ['depilación'],
  CEJAS: ['cejas', 'laminado'],
  PESTANAS: ['pestañas', 'lifting'],
  MAQUILLAJE: ['maquillaje'],
  CORPORAL: ['reestructuración estrías', 'camuflaje estrías'],
  GARANTIAS: ['garantía']
};

function categorize(name) {
  const lower = name.toLowerCase();
  for (const [cat, keywords] of Object.entries(CATEGORIES)) {
    if (keywords.some(kw => lower.includes(kw))) {
      return cat;
    }
  }
  return 'OTRO';
}

function get(path) {
  return new Promise((res) => {
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + GHL_KEY, 'Version': '2021-04-15' }
    }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.end();
  });
}

function put(path, body) {
  return new Promise((res) => {
    const b = JSON.stringify(body);
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path,
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer ' + GHL_KEY,
        'Version': '2021-04-15',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(b)
      }
    }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.write(b); req.end();
  });
}

async function run() {
  console.log('Fetching all calendars...');
  const calsResp = await get('/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo');
  const allCals = calsResp.calendars || [];

  console.log(`Found ${allCals.length} calendars\n`);

  let updated = 0, errors = 0;
  const results = {};

  for (const cal of allCals) {
    try {
      const cat = categorize(cal.name);
      const newDesc = `[${cat}] ${cal.description || ''}`.trim();

      if (newDesc === cal.description) {
        continue; // Ya tiene la categoría
      }

      const updated_cal = { ...cal, description: newDesc };
      await put('/calendars/' + cal.id, updated_cal);

      if (!results[cat]) results[cat] = 0;
      results[cat]++;
      console.log(`✓ ${cat}: ${cal.name}`);
      updated++;

    } catch (e) {
      console.log(`✗ ${cal.name}: ${e.message}`);
      errors++;
    }
  }

  console.log('\n=== RESUMEN POR CATEGORÍA ===');
  Object.entries(results).sort().forEach(([cat, count]) => {
    console.log(`${cat}: ${count} calendarios`);
  });
  console.log(`\nTotal: ${updated} actualizados, ${errors} errores`);
}

run();
