const https = require('https');
const fs = require('fs');
const GHL_KEY = 'pit-022a5206-1196-4066-8957-50cf5634da09';
const LOC = '0zeAaf3V1WrlkbyD4tJo';
const SUPA_URL = 'aqoztzznsxhvczkanorr.supabase.co';
const SUPA_KEY = 'sb_publishable_4SmHQewYKJIv3-GUz4pvPA_jx1eY9U0';

const CALS = {
  'manos semipermanente': { id: 'EDiqwAb54xY6nID5yzB8', dur: 60 },
  'pies evolution': { id: 'tKn5Hy3A7pKqg7nhVpgC', dur: 40 },
  'base rubber manos': { id: 'yVTJ5MuqOiTIG6aW4Zzu', dur: 60 },
  'unas esmaltado tradicional (manos y pies)': { id: 'OYVNrcCxrbSYEd1SbV3f', dur: 100 },
  'evolution (manos y pies)': { id: 'ZLEVvENlOAsJdUVyyLGf', dur: 80 },
  'masaje relajacion piedras volcanicas + velas': { id: 'q2Iz4gfTyoB3JkRNZ4CZ', dur: 60 },
  'pies semi permanente': { id: 'szaDqVWMTKAFCVcYjgTh', dur: 60 },
  'pies semipermanente': { id: 'szaDqVWMTKAFCVcYjgTh', dur: 60 },
};

const PROS = {
  'laura': { id: 'DEeqUttYKgjjsfNaS1XY', nombre: 'Laura Vanessa' },
  'luz': { id: 'UzLj5T8ZOrJ8reSig5os', nombre: 'Luz Aida' },
  'carolina': { id: 'Bn1QrO4ITpYI7wSohG9r', nombre: 'Carolina Paz' },
  'geraldine': { id: 'saGMogKgCH3kmIhq4VlJ', nombre: 'Geraldine Berrio' },
};

function norm(s) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
}

function req(hostname, method, path, body, headers) {
  return new Promise((res) => {
    const b = body ? JSON.stringify(body) : null;
    const h = { ...headers, 'Content-Type': 'application/json' };
    if (b) h['Content-Length'] = Buffer.byteLength(b);
    const r = https.request({ hostname, path, method, headers: h }, rr => {
      let d = ''; rr.on('data', c => d += c);
      rr.on('end', () => { try { res({ status: rr.statusCode, data: JSON.parse(d) }); } catch (e) { res({ status: rr.statusCode, raw: d }); } });
    });
    if (b) r.write(b);
    r.end();
  });
}

const ghlH = { 'Authorization': 'Bearer ' + GHL_KEY, 'Version': '2021-04-15' };
const supaH = { 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY, 'Prefer': 'resolution=merge-duplicates' };

async function run() {
  const csv = fs.readFileSync('reservas_migracion.csv', 'utf8');
  const lines = csv.split('\n').slice(1).filter(l => l.trim());

  console.log(`${lines.length} reservas en el CSV\n`);
  let ok = 0, fail = 0;

  for (const line of lines) {
    const c = line.split(';');
    const [fechaHora, , , , , , , nombre, apellido, email, telefono, , servicio, precio] = c;
    const prestador = c[17] || '';

    // Parse fecha DD/MM/YYYY HH:mm
    const m = fechaHora.match(/(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})/);
    if (!m) { console.log('✗ Fecha inválida:', fechaHora); fail++; continue; }
    const [, dd, MM, yyyy, hh, min] = m;
    const startISO = `${yyyy}-${MM}-${dd}T${hh}:${min}:00-05:00`;

    // Find calendar
    const servNorm = norm(servicio);
    const cal = CALS[servNorm];
    if (!cal) { console.log('✗ Servicio no mapeado:', servicio); fail++; continue; }

    // End time (preserving -05:00)
    const startDt = new Date(startISO);
    const endDt = new Date(startDt.getTime() + cal.dur * 60000 - 5 * 3600000 * -1); // careful
    // Simpler: compute end clock time directly
    const totalMin = parseInt(hh) * 60 + parseInt(min) + cal.dur;
    const endH = String(Math.floor(totalMin / 60)).padStart(2, '0');
    const endM = String(totalMin % 60).padStart(2, '0');
    const endISO = `${yyyy}-${MM}-${dd}T${endH}:${endM}:00-05:00`;

    // Find professional
    const proKey = Object.keys(PROS).find(k => norm(prestador).includes(k));
    const pro = proKey ? PROS[proKey] : null;
    if (!pro) { console.log('✗ Profesional no mapeada:', prestador); fail++; continue; }

    const fullName = `${nombre.trim()} ${apellido.replace('*', '').trim()}`.trim();

    // 1. Upsert contact
    const contactBody = { locationId: LOC, firstName: nombre.trim(), lastName: apellido.replace('*', '').trim(), phone: telefono.trim() };
    if (email && email.includes('@')) contactBody.email = email.trim();
    const cRes = await req('services.leadconnectorhq.com', 'POST', '/contacts/upsert', contactBody, ghlH);
    const contactId = cRes.data?.contact?.id;
    if (!contactId) { console.log('✗ Contacto falló:', fullName, JSON.stringify(cRes.data).slice(0, 100)); fail++; continue; }

    // 2. Create appointment
    const apptBody = {
      calendarId: cal.id,
      locationId: LOC,
      contactId,
      startTime: startISO,
      endTime: endISO,
      title: `${servicio.trim()} - ${fullName}`,
      appointmentStatus: 'confirmed',
      assignedUserId: pro.id,
      ignoreFreeSlotValidation: true,
    };
    const aRes = await req('services.leadconnectorhq.com', 'POST', '/calendars/events/appointments', apptBody, ghlH);
    const apptId = aRes.data?.id;
    if (!apptId) { console.log('✗ Cita falló:', fullName, fechaHora, JSON.stringify(aRes.data).slice(0, 150)); fail++; continue; }

    // 3. Insert into Supabase (for POS)
    const supaBody = {
      id: apptId,
      fecha: `${yyyy}-${MM}-${dd}`,
      start_time: startISO,
      end_time: endISO,
      titulo: `${servicio.trim()} - ${fullName}`,
      cliente_nombre: fullName,
      cliente_telefono: telefono.trim(),
      contact_id: contactId,
      profesional_id: pro.id,
      profesional_nombre: pro.nombre,
      calendar_id: cal.id,
      precio: '$' + Number(precio).toLocaleString('es-CO'),
      status: 'confirmed',
    };
    const sRes = await req(SUPA_URL, 'POST', '/rest/v1/citas', supaBody, supaH);
    const supaOk = sRes.status === 201 || sRes.status === 200;

    console.log(`✓ ${dd}/${MM} ${hh}:${min} | ${fullName} | ${servicio.trim()} | ${pro.nombre}${supaOk ? '' : ' (⚠️ Supabase: ' + sRes.status + ')'}`);
    ok++;
  }

  console.log(`\nResultado: ${ok} citas creadas, ${fail} fallidas`);
}
run();
