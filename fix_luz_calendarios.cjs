const https = require('https');
const GHL_KEY = 'pit-022a5206-1196-4066-8957-50cf5634da09';

const LUZ_ID = 'UzLj5T8ZOrJ8reSig5os';

// Servicios que SÍ atenderá Luz
const LUZ_SERVICES = {
  'vxUBF94v8PKqobjUBeZc': 'limpieza facial especial',
  'fz9614uqbCIz8bLDXYNR': 'limpieza facial tradicional',
  'q2Iz4gfTyoB3JkRNZ4CZ': 'masaje relajacion piedras volcanicas + velas',
  'wAwK46EAzP7OMVbVZ4Na': 'drenaje linfatico',
  'kjgB0Whm8mjpYv8I075K': 'paquete 1 masaje reductor',
  '8iU9qGnCM5nT6816pEAh': 'paquete 2 masaje reductor',
  'uajeiWuAmnwZ9BPA4RlT': 'paquete 3 masaje reductor',
  '9PiZEDHNec91qK58o3de': 'reestructuracion de estrias',
  'xU7HfkiIbhZwHo1EnrTz': 'camuflaje de estrias',
};

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
      headers: { 'Authorization': 'Bearer ' + GHL_KEY, 'Version': '2021-04-15', 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) }
    }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.write(b); req.end();
  });
}

async function run() {
  // Get all calendars from location
  const calsResp = await get('/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo');
  const allCals = calsResp.calendars || [];

  console.log(`Found ${allCals.length} calendars\n`);

  let updated = 0, skipped = 0, errors = 0;

  for (const cal of allCals) {
    try {
      const shouldKeepLuz = LUZ_SERVICES[cal.id];
      const hasLuz = cal.teamMembers?.some(m => m.userId === LUZ_ID);

      if (!hasLuz) {
        // Luz no está asignada
        skipped++;
        continue;
      }

      if (shouldKeepLuz) {
        // Dejar a Luz
        console.log(`· ${cal.name}: Luz stays (facial/massage service)`);
        skipped++;
        continue;
      }

      // Remover a Luz
      const filtered = cal.teamMembers.filter(m => m.userId !== LUZ_ID);
      const updated_cal = { ...cal, teamMembers: filtered };

      await put('/calendars/' + cal.id, updated_cal);
      console.log(`✓ ${cal.name}: Luz removed`);
      updated++;

    } catch (e) {
      console.log(`✗ ${cal.name}: ${e.message}`);
      errors++;
    }
  }

  console.log(`\nDone: ${updated} updated, ${skipped} unchanged/skipped, ${errors} errors`);
}

run();
