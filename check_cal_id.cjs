// Check what calendar 6Gq72d3MJ8FqYsWYEeWD is via GHL API
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
  // Try to get the specific calendar
  const cal = await ghl('/calendars/6Gq72d3MJ8FqYsWYEeWD');
  console.log('Calendar 6Gq72d3MJ8FqYsWYEeWD:', JSON.stringify(cal).slice(0, 500));
})();
