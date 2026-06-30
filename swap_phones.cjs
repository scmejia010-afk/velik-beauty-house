const https = require('https');
const GHL_TOKEN = 'pit-022a5206-1196-4066-8957-50cf5634da09';

function ghl(method, path, body) {
  return new Promise(r => {
    const b = body ? JSON.stringify(body) : null;
    const headers = { 'Authorization': 'Bearer ' + GHL_TOKEN, 'Version': '2021-07-28', 'Content-Type': 'application/json' };
    if (b) headers['Content-Length'] = Buffer.byteLength(b);
    const req = https.request({ hostname: 'services.leadconnectorhq.com', path, method, headers }, rr => {
      let d = ''; rr.on('data', c => d += c);
      rr.on('end', () => { try { r(JSON.parse(d)); } catch(e) { r(d); } });
    });
    if (b) req.write(b);
    req.end();
  });
}

const CAROLINA_ID = 'Bn1QrO4ITpYI7wSohG9r';
const LAURA_ID    = 'DEeqUttYKgjjsfNaS1XY';

(async () => {
  const carolina = await ghl('GET', `/users/${CAROLINA_ID}`, null);
  const laura    = await ghl('GET', `/users/${LAURA_ID}`, null);

  console.log('Carolina teléfono actual:', carolina.phone);
  console.log('Laura teléfono actual:   ', laura.phone);

  if (!carolina.phone && !laura.phone) { console.log('Sin teléfonos registrados'); return; }

  // Swap
  const r1 = await ghl('PUT', `/users/${CAROLINA_ID}`, { phone: laura.phone });
  const r2 = await ghl('PUT', `/users/${LAURA_ID}`,    { phone: carolina.phone });

  console.log('\nCarolina → ahora tiene:', r1.phone, r1.email ? '✅' : JSON.stringify(r1).slice(0,100));
  console.log('Laura    → ahora tiene:', r2.phone, r2.email ? '✅' : JSON.stringify(r2).slice(0,100));
})();
