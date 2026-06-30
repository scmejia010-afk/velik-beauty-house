const https = require('https');
const GHL_TOKEN = 'pit-022a5206-1196-4066-8957-50cf5634da09';

function ghl(method, path, body) {
  return new Promise(r => {
    const b = body ? JSON.stringify(body) : null;
    const headers = { 'Authorization': 'Bearer ' + GHL_TOKEN, 'Version': '2021-07-28', 'Content-Type': 'application/json' };
    if (b) headers['Content-Length'] = Buffer.byteLength(b);
    const req = https.request({ hostname: 'services.leadconnectorhq.com', path, method, headers }, rr => {
      let d = ''; rr.on('data', c => d += c);
      rr.on('end', () => { try { r({ status: rr.statusCode, body: JSON.parse(d) }); } catch(e) { r({ status: rr.statusCode, body: d }); } });
    });
    if (b) req.write(b);
    req.end();
  });
}

(async () => {
  const calBody = {
    locationId: '0zeAaf3V1WrlkbyD4tJo',
    name: 'Valoración de Cabello',
    description: 'Valoración presencial para color y alisado. $30.000 descontables del servicio.',
    slotDuration: 30,
    slotBuffer: 0,
    appoinmentPerSlot: 1,
    isActive: true,
    autoConfirm: true,
    calendarType: 'round_robin',
    eventType: 'RoundRobin_OptimizeForEqualDistribution',
    teamMembers: [
      {
        userId: 'Bn1QrO4ITpYI7wSohG9r',
        priority: 0.5,
        selected: true,
        isZoomAdded: 'false',
        locationConfigurations: [{ position: 0, kind: 'custom', meetingId: 'custom_0', location: '' }]
      },
      {
        userId: 'DEeqUttYKgjjsfNaS1XY',
        priority: 0.5,
        selected: true,
        isZoomAdded: 'false',
        locationConfigurations: [{ position: 0, kind: 'custom', meetingId: 'custom_0', location: '' }]
      }
    ]
  };

  const res = await ghl('POST', '/calendars/', calBody);
  console.log('Create Status:', res.status);
  if (res.body?.calendar?.id) {
    const calId = res.body.calendar.id;
    console.log('✅ Calendario creado:', calId, '-', res.body.calendar.name);
    console.log('\nAhora actualiza los workflows con este ID.');
  } else {
    console.log('Body:', JSON.stringify(res.body).slice(0, 600));
  }
})();
