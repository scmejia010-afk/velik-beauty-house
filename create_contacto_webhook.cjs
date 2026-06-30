const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const SUPA_SERVICE = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxb3p0enpuc3hodmN6a2Fub3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA1OTg3NSwiZXhwIjoyMDk1NjM1ODc1fQ.2Jxnj_q9ni2p8H4wuOP-u9QIDTYkkjdenaTPDjjQFmc';

function req(method, path, body) {
  return new Promise((res) => {
    const b = body ? JSON.stringify(body) : null;
    const headers = { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json' };
    if (b) headers['Content-Length'] = Buffer.byteLength(b);
    const r = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method, headers }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => { try { res(JSON.parse(d)); } catch (e) { res(d); } });
    });
    if (b) r.write(b);
    r.end();
  });
}

const workflow = {
  name: 'VELIK - Crear Contacto (POS)',
  nodes: [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'velik-crear-contacto',
        responseMode: 'lastNode',
        options: {}
      },
      id: 'wh-contacto-01',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: [0, 0],
      webhookId: 'velik-crear-contacto'
    },
    {
      parameters: {
        method: 'POST',
        url: 'https://aqoztzznsxhvczkanorr.supabase.co/rest/v1/contactos',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'apikey', value: SUPA_SERVICE },
            { name: 'Authorization', value: 'Bearer ' + SUPA_SERVICE },
            { name: 'Prefer', value: 'return=representation' }
          ]
        },
        sendBody: true,
        specifyBody: 'keypair',
        bodyParameters: {
          parameters: [
            { name: 'nombres', value: '={{ $json.body.nombres }}' },
            { name: 'apellidos', value: '={{ $json.body.apellidos || null }}' },
            { name: 'telefono', value: '={{ $json.body.telefono }}' },
            { name: 'email', value: '={{ $json.body.email || null }}' }
          ]
        },
        options: {}
      },
      id: 'http-supa-01',
      name: 'Insertar Supabase',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [220, 0]
    },
    {
      parameters: {
        method: 'POST',
        url: 'https://services.leadconnectorhq.com/contacts/upsert',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Authorization', value: 'Bearer pit-022a5206-1196-4066-8957-50cf5634da09' },
            { name: 'Version', value: '2021-07-28' }
          ]
        },
        sendBody: true,
        specifyBody: 'keypair',
        bodyParameters: {
          parameters: [
            { name: 'locationId', value: '0zeAaf3V1WrlkbyD4tJo' },
            { name: 'firstName', value: "={{ $('Webhook').item.json.body.nombres }}" },
            { name: 'lastName', value: "={{ $('Webhook').item.json.body.apellidos || '' }}" },
            { name: 'phone', value: "={{ $('Webhook').item.json.body.telefono }}" },
            { name: 'email', value: "={{ $('Webhook').item.json.body.email || undefined }}" },
            { name: 'source', value: 'POS - Velik Beauty' }
          ]
        },
        options: {}
      },
      id: 'http-ghl-01',
      name: 'Upsert GHL',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [440, 0]
    },
    {
      parameters: {
        jsCode: `// Return the Supabase contact row (with id) so POS can select it
const supaRow = $('Insertar Supabase').item.json;
const row = Array.isArray(supaRow) ? supaRow[0] : supaRow;
return [{ json: row }];`
      },
      id: 'code-resp-01',
      name: 'Responder Contacto',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [660, 0]
    }
  ],
  connections: {
    'Webhook': { main: [[{ node: 'Insertar Supabase', type: 'main', index: 0 }]] },
    'Insertar Supabase': { main: [[{ node: 'Upsert GHL', type: 'main', index: 0 }]] },
    'Upsert GHL': { main: [[{ node: 'Responder Contacto', type: 'main', index: 0 }]] }
  },
  settings: {}
};

(async () => {
  const created = await req('POST', '/api/v1/workflows', workflow);
  if (!created.id) { console.log('Error:', JSON.stringify(created).slice(0, 300)); return; }
  console.log('Workflow creado:', created.id, '-', created.name);
  const act = await req('POST', `/api/v1/workflows/${created.id}/activate`);
  console.log('Activado:', act.active === true);
  console.log('URL: https://santiagon8nmejia.dominadoresia.com/webhook/velik-crear-contacto');
})();
