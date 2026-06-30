const https = require('https');
const GHL_TOKEN = 'pit-022a5206-1196-4066-8957-50cf5634da09';
const CAL_ID = 'yePA3PPHJC9Fdu6A6WMt';
const GERALDINE_ID = 'saGMogKgCH3kmIhq4VlJ';

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
  // Get current calendar
  const res = await ghl('GET', `/calendars/${CAL_ID}`, null);
  const cal = res.body?.calendar;
  if (!cal) { console.log('Error:', JSON.stringify(res.body).slice(0,300)); return; }

  console.log('Team members actuales:', cal.teamMembers?.map(m => m.userId));

  // Add Geraldine if not already there
  const already = cal.teamMembers?.find(m => m.userId === GERALDINE_ID);
  if (already) { console.log('Geraldine ya está en el calendario'); return; }

  const newTeam = [
    ...(cal.teamMembers || []),
    {
      userId: GERALDINE_ID,
      priority: 0.5,
      selected: true,
      isZoomAdded: 'false',
      locationConfigurations: [{ position: 0, kind: 'custom', meetingId: 'custom_0', location: '' }]
    }
  ];

  const upd = await ghl('PUT', `/calendars/${CAL_ID}`, {
    locationId: '0zeAaf3V1WrlkbyD4tJo',
    name: cal.name,
    teamMembers: newTeam
  });
  console.log('Update status:', upd.status);
  if (upd.status === 200) {
    console.log('✅ Geraldine agregada a Valoración de Cabello');
  } else {
    console.log('Error:', JSON.stringify(upd.body).slice(0,400));
  }
})();
