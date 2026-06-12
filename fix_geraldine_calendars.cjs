const https = require('https');
const GHL_KEY = 'pit-022a5206-1196-4066-8957-50cf5634da09';
const GERALDINE_ID = 'saGMogKgCH3kmIhq4VlJ';
const LUZ_ID = 'UzLj5T8ZOrJ8reSig5os';

const NAIL_KEYWORDS = ['manos', 'pies', 'uñas', 'unas', 'pedicura', 'manicur', 'pedicure',
  'builder', 'baby boomer', 'press on', 'polygel', 'acrílico', 'acrilico', 'rubber',
  'dipping', 'dip powder', 'semipermanente', 'esmaltado', 'evolution', 'diseño', 'diseno', 'garantías', 'garantias'];
const EXCLUDE = ['pestañas', 'pestanas', 'cejas', 'cabello', 'facial', 'maquillaje', 'depilación', 'depilacion', 'alisado', 'masaje reductor', 'piedras', 'drenaje', 'estrías', 'estrias', 'cosmetología', 'cosmetologia'];

function isNailCalendar(name) {
  const lower = name.toLowerCase();
  if (EXCLUDE.some(kw => lower.includes(kw))) return false;
  return NAIL_KEYWORDS.some(kw => lower.includes(kw));
}

function ghl(method, path, body) {
  return new Promise((res) => {
    const b = body ? JSON.stringify(body) : null;
    const headers = { 'Authorization': 'Bearer ' + GHL_KEY, 'Version': '2021-04-15', 'Content-Type': 'application/json' };
    if (b) headers['Content-Length'] = Buffer.byteLength(b);
    const r = https.request({ hostname: 'services.leadconnectorhq.com', path, method, headers }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => { try { res({status: rr.statusCode, data: JSON.parse(d)}); } catch(e) { res({status: rr.statusCode, raw: d}); } });
    });
    if (b) r.write(b);
    r.end();
  });
}

(async () => {
  // First: verify whether Luz removal actually persisted (check one calendar)
  const check = await ghl('GET', '/calendars/EDiqwAb54xY6nID5yzB8'); // Manos semipermanente
  const checkCal = check.data.calendar || check.data;
  const luzStill = checkCal.teamMembers?.some(m => m.userId === LUZ_ID);
  console.log('Verificación Luz en "Manos semipermanente":', luzStill ? '⚠️ TODAVÍA ESTÁ (el script anterior no funcionó)' : '✓ removida correctamente');

  const resp = await ghl('GET', '/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo');
  const cals = resp.data.calendars || [];
  let added = 0, skipped = 0, errors = 0, luzRemoved = 0;

  for (const cal of cals) {
    const isNail = isNailCalendar(cal.name);
    let members = cal.teamMembers || [];
    let changed = false;

    // Add Geraldine to nail calendars
    if (isNail && !members.some(m => m.userId === GERALDINE_ID)) {
      const template = members[0];
      if (template) {
        members = [...members, {
          userId: GERALDINE_ID,
          selected: true,
          priority: 0.5,
          isZoomAdded: 'false',
          meetingLocationType: 'custom',
          locationConfigurations: [{ kind: 'custom', location: '', meetingId: 'custom_0', zoomOauthId: '', position: members.length }]
        }];
        changed = true;
      }
    }

    // Re-apply Luz removal if it didn't persist (non facial/massage calendars)
    const LUZ_KEEP = ['facial', 'masaje relajación', 'masaje relajacion', 'piedras', 'drenaje', 'reductor', 'estrías', 'estrias'];
    const keepLuz = LUZ_KEEP.some(kw => cal.name.toLowerCase().includes(kw));
    if (!keepLuz && members.some(m => m.userId === LUZ_ID)) {
      members = members.filter(m => m.userId !== LUZ_ID);
      changed = true;
      luzRemoved++;
    }

    if (!changed) { skipped++; continue; }

    // PUT only teamMembers
    const r = await ghl('PUT', '/calendars/' + cal.id, { teamMembers: members });
    if (r.status === 200 || r.status === 201) {
      console.log('✓ ' + cal.name + (isNail ? ' [+Geraldine]' : '') + (members.length < (cal.teamMembers||[]).length + (isNail?1:0) ? ' [-Luz]' : ''));
      added++;
    } else {
      console.log('✗ ' + cal.name + ' [' + r.status + ']: ' + JSON.stringify(r.data || r.raw).slice(0, 150));
      errors++;
    }
  }

  console.log(`\nResultado: ${added} actualizados, ${skipped} sin cambios, ${errors} errores, Luz re-removida de ${luzRemoved}`);
})();
