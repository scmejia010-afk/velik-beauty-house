const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const SUPA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxb3p0enpuc3hodmN6a2Fub3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA1OTg3NSwiZXhwIjoyMDk1NjM1ODc1fQ.2Jxnj_q9ni2p8H4wuOP-u9QIDTYkkjdenaTPDjjQFmc';

function req(method, path, body) {
  return new Promise(res => {
    const b = body ? JSON.stringify(body) : null;
    const h = { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json' };
    if (b) h['Content-Length'] = Buffer.byteLength(b);
    const r = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method, headers: h }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => { try { res(JSON.parse(d)) } catch (e) { res(d) } });
    });
    if (b) r.write(b); r.end();
  });
}

const PARSEAR_CODE = `
const body = $json.body || $json;
const c = body.contact || body;
const nombres = (c.firstName || c.first_name || '').trim();
const apellidos = (c.lastName || c.last_name || '').trim() || null;
let tel = (c.phone || c.phone1 || '').replace(/\\s/g, '');
if (tel && !tel.startsWith('+')) tel = '+57' + tel.replace(/\\D/g, '');
const email = (c.email || '').trim().toLowerCase() || null;
if (!nombres) return [{ json: { skip: true } }];
return [{ json: { nombres, apellidos, telefono: tel || null, email, skip: false } }];
`.trim();

const BODY_CODE = `
const j = $json;
return [{ json: {
  nombres: j.nombres,
  apellidos: j.apellidos || null,
  telefono: j.telefono || null,
  email: j.email || null
}}];
`.trim();

const wf = {
  name: 'VELIK - GHL Contacto → Supabase',
  nodes: [
    {
      id: 'n1', name: 'Webhook GHL', type: 'n8n-nodes-base.webhook', typeVersion: 1,
      position: [0, 0], webhookId: 'velik-ghl-sync-contacto',
      parameters: { httpMethod: 'POST', path: 'velik-ghl-sync-contacto', responseMode: 'lastNode', options: {} }
    },
    {
      id: 'n2', name: 'Parsear GHL', type: 'n8n-nodes-base.code', typeVersion: 2,
      position: [220, 0],
      parameters: { jsCode: PARSEAR_CODE }
    },
    {
      id: 'n3', name: 'Tiene nombre', type: 'n8n-nodes-base.if', typeVersion: 1,
      position: [440, 0],
      parameters: { conditions: { boolean: [{ value1: '={{ $json.skip }}', value2: false }] } }
    },
    {
      id: 'n4', name: 'Preparar Body', type: 'n8n-nodes-base.code', typeVersion: 2,
      position: [660, -80],
      parameters: { jsCode: BODY_CODE }
    },
    {
      id: 'n5', name: 'Upsert Supabase', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2,
      position: [880, -80],
      parameters: {
        method: 'POST',
        url: 'https://aqoztzznsxhvczkanorr.supabase.co/rest/v1/contactos',
        sendHeaders: true,
        headerParameters: { parameters: [
          { name: 'apikey', value: SUPA },
          { name: 'Authorization', value: 'Bearer ' + SUPA },
          { name: 'Content-Type', value: 'application/json' },
          { name: 'Prefer', value: 'resolution=merge-duplicates,return=minimal' }
        ]},
        sendBody: true,
        contentType: 'json',
        body: '={{ JSON.stringify($json) }}',
        options: {}
      }
    },
    {
      id: 'n6', name: 'OK', type: 'n8n-nodes-base.respondToWebhook', typeVersion: 1,
      position: [1100, 0],
      parameters: { respondWith: 'json', responseBody: '{"ok":true}' }
    }
  ],
  connections: {
    'Webhook GHL':   { main: [[{ node: 'Parsear GHL',    type: 'main', index: 0 }]] },
    'Parsear GHL':   { main: [[{ node: 'Tiene nombre',   type: 'main', index: 0 }]] },
    'Tiene nombre':  { main: [
      [{ node: 'Preparar Body', type: 'main', index: 0 }],
      [{ node: 'OK',            type: 'main', index: 0 }]
    ]},
    'Preparar Body': { main: [[{ node: 'Upsert Supabase', type: 'main', index: 0 }]] },
    'Upsert Supabase': { main: [[{ node: 'OK', type: 'main', index: 0 }]] }
  },
  settings: { executionOrder: 'v1' }
};

(async () => {
  const r = await req('POST', '/api/v1/workflows', wf);
  if (!r.id) { console.log('Error:', JSON.stringify(r).slice(0, 300)); return; }
  console.log('✅ Workflow creado:', r.id, '-', r.name);
  const act = await req('POST', `/api/v1/workflows/${r.id}/activate`);
  console.log('⚡ Activo:', act.active === true ? 'SÍ' : 'NO');
  console.log('\n🔗 URL webhook para GHL:');
  console.log('https://santiagon8nmejia.dominadoresia.com/webhook/velik-ghl-sync-contacto');
  console.log('\n📋 En GHL: Settings → Integrations → Webhooks → Add Webhook');
  console.log('   URL: https://santiagon8nmejia.dominadoresia.com/webhook/velik-ghl-sync-contacto');
  console.log('   Events: Contact Created, Contact Updated');
})();
