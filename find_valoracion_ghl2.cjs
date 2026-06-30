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
  // Try without limit param
  const res = await ghl('/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo');
  console.log('Response keys:', Object.keys(res));
  console.log('Total calendarios:', res.calendars?.length || JSON.stringify(res).slice(0, 300));

  if (res.calendars?.length) {
    const valoracion = res.calendars.filter(c =>
      c.name.toLowerCase().includes('valor') ||
      c.name.toLowerCase().includes('color') ||
      c.name.toLowerCase().includes('cabello')
    );
    console.log('\nCalendarios relacionados:');
    valoracion.forEach(c => console.log(c.id, '-', c.name));
  }
})();
