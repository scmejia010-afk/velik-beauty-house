const https = require('https');
const GHL_TOKEN = 'pit-022a5206-1196-4066-8957-50cf5634da09';
const CAL_ID = 'yePA3PPHJC9Fdu6A6WMt';
const CAROLINA_ID = 'Bn1QrO4ITpYI7wSohG9r';

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
  const upd = await ghl('PUT', `/calendars/${CAL_ID}`, {
    name: 'Valoración de Cabello',
    teamMembers: [
      {
        userId: CAROLINA_ID,
        priority: 1,
        selected: true,
        isZoomAdded: 'false',
        locationConfigurations: [{ position: 0, kind: 'custom', meetingId: 'custom_0', location: '' }]
      }
    ]
  });
  console.log('Status:', upd.status);
  if (upd.status === 200) {
    console.log('✅ Valoración de Cabello ahora solo tiene a Carolina');
  } else {
    console.log('Error:', JSON.stringify(upd.body).slice(0,400));
  }
})();
