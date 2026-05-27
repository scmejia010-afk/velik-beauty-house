const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const GHL_KEY = 'pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e';
const LOCATION_ID = '0zeAaf3V1WrlkbyD4tJo';

function req(method, path, body) {
  return new Promise((res) => {
    const b = body ? JSON.stringify(body) : null;
    const opts = {
      hostname: 'santiagon8nmejia.dominadoresia.com',
      path, method,
      headers: { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json' }
    };
    if (b) opts.headers['Content-Length'] = Buffer.byteLength(b);
    const r = https.request(opts, resp => {
      let d = ''; resp.on('data', c => d += c); resp.on('end', () => {
        try { res(JSON.parse(d)); } catch(e) { res({ raw: d }); }
      });
    });
    if (b) r.write(b);
    r.end();
  });
}

const slotsWorkflow = {
  name: "VELIK - Booking Slots (Web)",
  nodes: [
    {
      id: "1", name: "Webhook",
      type: "n8n-nodes-base.webhook", typeVersion: 2,
      position: [240, 300],
      parameters: { httpMethod: "GET", path: "booking/slots", responseMode: "responseNode", options: {} },
      webhookId: "velik-booking-slots"
    },
    {
      id: "2", name: "Free Slots GHL",
      type: "n8n-nodes-base.httpRequest", typeVersion: 4.2,
      position: [480, 300],
      parameters: {
        method: "GET",
        url: "=https://services.leadconnectorhq.com/calendars/{{ $json.query.calendarId }}/free-slots",
        sendHeaders: true,
        headerParameters: { parameters: [
          { name: "Authorization", value: `Bearer ${GHL_KEY}` },
          { name: "Version", value: "2021-04-15" }
        ]},
        sendQuery: true,
        queryParameters: { parameters: [
          { name: "startDate", value: "={{ $json.query.startDate }}" },
          { name: "endDate", value: "={{ $json.query.endDate }}" },
          { name: "timezone", value: "America/Bogota" },
          { name: "userId", value: "={{ $json.query.userId || undefined }}" }
        ]},
        options: {}
      }
    },
    {
      id: "3", name: "Formatear Slots",
      type: "n8n-nodes-base.code", typeVersion: 2,
      position: [720, 300],
      parameters: {
        jsCode: `const raw = $json;
const slots = [];
for (const [date, val] of Object.entries(raw)) {
  if (!val || !val.slots) continue;
  for (const slotStr of val.slots) {
    const match = slotStr.match(/T(\\d{2}):(\\d{2}):/);
    if (!match) continue;
    const h24 = parseInt(match[1]);
    const min = match[2];
    const ampm = h24 >= 12 ? 'PM' : 'AM';
    const h12 = h24 % 12 || 12;
    slots.push({ label: h12 + ':' + min + ' ' + ampm, date, slot: slotStr });
  }
}
return [{ json: { slots } }];`
      }
    },
    {
      id: "4", name: "Respond",
      type: "n8n-nodes-base.respondToWebhook", typeVersion: 1.1,
      position: [960, 300],
      parameters: {
        respondWith: "json",
        responseBody: "={{ JSON.stringify($json) }}",
        options: { responseHeaders: { entries: [
          { name: "Access-Control-Allow-Origin", value: "*" },
          { name: "Content-Type", value: "application/json" }
        ]}}
      }
    }
  ],
  connections: {
    "Webhook":        { main: [[{ node: "Free Slots GHL",   type: "main", index: 0 }]] },
    "Free Slots GHL": { main: [[{ node: "Formatear Slots",  type: "main", index: 0 }]] },
    "Formatear Slots":{ main: [[{ node: "Respond",          type: "main", index: 0 }]] }
  },
  settings: { executionOrder: "v1" }
};

const crearWorkflow = {
  name: "VELIK - Booking Crear Cita (Web)",
  nodes: [
    {
      id: "1", name: "Webhook",
      type: "n8n-nodes-base.webhook", typeVersion: 2,
      position: [240, 300],
      parameters: { httpMethod: "POST", path: "booking/crear", responseMode: "responseNode", options: {} },
      webhookId: "velik-booking-crear"
    },
    {
      id: "2", name: "Upsert Contacto",
      type: "n8n-nodes-base.httpRequest", typeVersion: 4.2,
      position: [480, 300],
      parameters: {
        method: "POST",
        url: "https://services.leadconnectorhq.com/contacts/upsert",
        sendHeaders: true,
        headerParameters: { parameters: [
          { name: "Authorization", value: `Bearer ${GHL_KEY}` },
          { name: "Version", value: "2021-04-15" },
          { name: "Content-Type", value: "application/json" }
        ]},
        sendBody: true,
        specifyBody: "keypair",
        bodyParameters: { parameters: [
          { name: "locationId", value: LOCATION_ID },
          { name: "firstName", value: "={{ $json.body.nombre.split(' ')[0] }}" },
          { name: "lastName",  value: "={{ $json.body.nombre.split(' ').slice(1).join(' ') || '' }}" },
          { name: "phone",     value: "={{ $json.body.telefono }}" },
          { name: "email",     value: "={{ $json.body.email || '' }}" }
        ]},
        options: {}
      }
    },
    {
      id: "3", name: "Parsear Datos",
      type: "n8n-nodes-base.code", typeVersion: 2,
      position: [720, 300],
      parameters: {
        jsCode: `const body = $('Webhook').first().json.body;
const contactId = $json.contact?.id || $json.id;
let slotNorm = (body.slot || '').replace(' ', 'T');
if (!/[+-]\\d{2}:\\d{2}$/.test(slotNorm)) slotNorm += '-05:00';
const tzMatch = slotNorm.match(/([+-]\\d{2}:\\d{2})$/);
const tz = tzMatch ? tzMatch[1] : '-05:00';
const sign = tz[0] === '+' ? 1 : -1;
const [tzH, tzM] = tz.slice(1).split(':').map(Number);
const offsetMs = sign * (tzH * 60 + tzM) * 60000;
const startDt = new Date(slotNorm);
const duracion = parseInt(body.duracion) || 60;
const endLocal = new Date(startDt.getTime() + duracion * 60000 + offsetMs);
const pad = x => String(x).padStart(2,'0');
const endISO = endLocal.getUTCFullYear()+'-'+pad(endLocal.getUTCMonth()+1)+'-'+pad(endLocal.getUTCDate())+'T'+pad(endLocal.getUTCHours())+':'+pad(endLocal.getUTCMinutes())+':00'+tz;
return [{ json: {
  calendarId: body.calendarId, contactId,
  startTime: slotNorm, endTime: endISO,
  titulo: body.servicio + ' - ' + body.nombre,
  userId: body.userId || undefined
} }];`
      }
    },
    {
      id: "4", name: "Crear Cita GHL",
      type: "n8n-nodes-base.httpRequest", typeVersion: 4.2,
      position: [960, 300],
      parameters: {
        method: "POST",
        url: "https://services.leadconnectorhq.com/calendars/events/appointments",
        sendHeaders: true,
        headerParameters: { parameters: [
          { name: "Authorization", value: `Bearer ${GHL_KEY}` },
          { name: "Version", value: "2021-04-15" },
          { name: "Content-Type", value: "application/json" }
        ]},
        sendBody: true,
        specifyBody: "keypair",
        bodyParameters: { parameters: [
          { name: "calendarId",         value: "={{ $json.calendarId }}" },
          { name: "locationId",         value: LOCATION_ID },
          { name: "contactId",          value: "={{ $json.contactId }}" },
          { name: "startTime",          value: "={{ $json.startTime }}" },
          { name: "endTime",            value: "={{ $json.endTime }}" },
          { name: "title",              value: "={{ $json.titulo }}" },
          { name: "appointmentStatus",  value: "confirmed" },
          { name: "userId",             value: "={{ $json.userId || undefined }}" }
        ]},
        options: {}
      }
    },
    {
      id: "5", name: "Respond",
      type: "n8n-nodes-base.respondToWebhook", typeVersion: 1.1,
      position: [1200, 300],
      parameters: {
        respondWith: "json",
        responseBody: "={{ JSON.stringify({ ok: true, appointmentId: $json.id || $json.appointmentId, message: 'Cita confirmada' }) }}",
        options: { responseHeaders: { entries: [
          { name: "Access-Control-Allow-Origin", value: "*" },
          { name: "Content-Type", value: "application/json" }
        ]}}
      }
    }
  ],
  connections: {
    "Webhook":        { main: [[{ node: "Upsert Contacto", type: "main", index: 0 }]] },
    "Upsert Contacto":{ main: [[{ node: "Parsear Datos",   type: "main", index: 0 }]] },
    "Parsear Datos":  { main: [[{ node: "Crear Cita GHL",  type: "main", index: 0 }]] },
    "Crear Cita GHL": { main: [[{ node: "Respond",         type: "main", index: 0 }]] }
  },
  settings: { executionOrder: "v1" }
};

async function run() {
  console.log('Creating slots workflow...');
  const r1 = await req('POST', '/api/v1/workflows', slotsWorkflow);
  if (!r1.id) { console.log('Error:', JSON.stringify(r1)); return; }
  console.log('Created:', r1.id, r1.name);
  const a1 = await req('POST', `/api/v1/workflows/${r1.id}/activate`);
  console.log('Activated:', a1.active ?? JSON.stringify(a1));

  console.log('\nCreating crear workflow...');
  const r2 = await req('POST', '/api/v1/workflows', crearWorkflow);
  if (!r2.id) { console.log('Error:', JSON.stringify(r2)); return; }
  console.log('Created:', r2.id, r2.name);
  const a2 = await req('POST', `/api/v1/workflows/${r2.id}/activate`);
  console.log('Activated:', a2.active ?? JSON.stringify(a2));

  console.log('\n── URLs listas para usar ──');
  console.log('GET  https://santiagon8nmejia.dominadoresia.com/webhook/booking/slots?calendarId=XXX&startDate=TIMESTAMP&endDate=TIMESTAMP&userId=OPC');
  console.log('POST https://santiagon8nmejia.dominadoresia.com/webhook/booking/crear');
  console.log('     Body: { calendarId, slot, nombre, telefono, email, servicio, duracion, userId }');
}
run();
