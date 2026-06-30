const https = require('https');
const GHL_TOKEN = 'pit-022a5206-1196-4066-8957-50cf5634da09';
const LOCATION_ID = '0zeAaf3V1WrlkbyD4tJo';

const PROS = [
  { nombre: 'Carolina Paz',     id: 'Bn1QrO4ITpYI7wSohG9r' },
  { nombre: 'Laura Vanessa',    id: 'DEeqUttYKgjjsfNaS1XY' },
  { nombre: 'Luz Aida',         id: 'UzLj5T8ZOrJ8reSig5os' },
  { nombre: 'Geraldine Berrio', id: 'saGMogKgCH3kmIhq4VlJ' },
];

function ghl(path) {
  return new Promise(r => {
    https.request({
      hostname: 'services.leadconnectorhq.com', path, method: 'GET',
      headers: { 'Authorization': 'Bearer ' + GHL_TOKEN, 'Version': '2021-07-28' }
    }, rr => {
      let d = ''; rr.on('data', c => d += c);
      rr.on('end', () => { try { r(JSON.parse(d)); } catch(e) { r(d); } });
    }).end();
  });
}

(async () => {
  for (const p of PROS) {
    const res = await ghl(`/users/${p.id}`);
    const u = res;
    console.log(`\n👤 ${p.nombre}`);
    console.log(`   Email: ${u.email || '—'}`);
    console.log(`   Nombre en GHL: ${u.firstName || ''} ${u.lastName || ''}`);
    console.log(`   ID: ${p.id}`);
    console.log(`   Rol: ${u.roles?.role || u.role || '—'}`);
  }
  console.log('\n🔐 URL de acceso: https://app.funnelsmart.pro');
  console.log('   (Las contraseñas se configuraron al crear los usuarios — si no se recuerdan, usar "Olvidé mi contraseña" en el login)');
})();
