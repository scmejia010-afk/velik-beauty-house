const https = require('https');
const GHL_TOKEN = 'pit-022a5206-1196-4066-8957-50cf5634da09';

function ghl(path) {
  return new Promise(r => {
    const req = https.request({
      hostname: 'services.leadconnectorhq.com',
      path, method: 'GET',
      headers: { 'Authorization': 'Bearer ' + GHL_TOKEN, 'Version': '2021-07-28' }
    }, rr => {
      let d = ''; rr.on('data', c => d += c);
      rr.on('end', () => { try { r(JSON.parse(d)); } catch(e) { r(d); } });
    });
    req.end();
  });
}

(async () => {
  // Check CABELLO calendar
  const res = await ghl('/calendars/zYV9rksCr1rA2hARD5a4');
  const c = res.calendar;
  console.log('Nombre:', c?.name);
  console.log('Duración slot:', c?.slotDuration);
  console.log('Descripción:', c?.description);
  console.log('Team members:', c?.teamMembers?.map(m => m.userId));
  console.log('Event type:', c?.eventType);
})();
