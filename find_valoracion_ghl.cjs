const https = require('https');
const GHL_TOKEN = 'pit-022a5206-1196-4066-8957-50cf5634da09';

function ghl(path) {
  return new Promise(r => {
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path,
      method: 'GET',
      headers: { 'Authorization': 'Bearer ' + GHL_TOKEN, 'Version': '2021-07-28' }
    }, rr => {
      let d = ''; rr.on('data', c => d += c);
      rr.on('end', () => { try { r(JSON.parse(d)); } catch(e) { r(d); } });
    });
    req.end();
  });
}

(async () => {
  const res = await ghl('/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo&limit=200');
  const cals = res.calendars || [];
  console.log('Total calendarios:', cals.length);
  const valoracion = cals.filter(c =>
    c.name.toLowerCase().includes('valor') ||
    c.name.toLowerCase().includes('color') ||
    c.name.toLowerCase().includes('cabello')
  );
  console.log('\nCalendarios relacionados con valoracion/color/cabello:');
  valoracion.forEach(c => console.log(c.id, '-', c.name));
})();
