const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function req(method, path, body) {
  return new Promise((res) => {
    const b = body ? JSON.stringify(body) : null;
    const headers = { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json' };
    if (b) headers['Content-Length'] = Buffer.byteLength(b);
    const r = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method, headers }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => { try { res(JSON.parse(d)); } catch(e) { res(d); } });
    });
    if (b) r.write(b);
    r.end();
  });
}

const workflow = {
  name: 'VELIK - Actualizar Estado Cita',
  nodes: [
    {
      parameters: {
        httpMethod: 'POST',
        path: 'velik-cita-status',
        responseMode: 'lastNode',
        options: {}
      },
      id: 'wh-trigger-001',
      name: 'Webhook',
      type: 'n8n-nodes-base.webhook',
      typeVersion: 1,
      position: [0, 0],
      webhookId: 'velik-cita-status'
    },
    {
      parameters: {
        method: 'PUT',
        url: '=https://services.leadconnectorhq.com/calendars/events/appointments/{{ $json.body.appointmentId }}',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Authorization', value: 'Bearer pit-022a5206-1196-4066-8957-50cf5634da09' },
            { name: 'Version', value: '2021-04-15' },
            { name: 'Content-Type', value: 'application/json' }
          ]
        },
        sendBody: true,
        specifyBody: 'keypair',
        bodyParameters: {
          parameters: [
            { name: 'appointmentStatus', value: '={{ $json.body.status }}' }
          ]
        },
        options: {}
      },
      id: 'http-ghl-001',
      name: 'Actualizar Estado GHL',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [220, 0]
    }
  ],
  connections: {
    'Webhook': {
      main: [[{ node: 'Actualizar Estado GHL', type: 'main', index: 0 }]]
    }
  },
  settings: {}
};

async function run() {
  const created = await req('POST', '/api/v1/workflows', workflow);
  if (!created.id) { console.log('Error:', JSON.stringify(created)); return; }
  console.log('Workflow creado:', created.id, '-', created.name);

  const activated = await req('POST', `/api/v1/workflows/${created.id}/activate`);
  console.log('Activado:', activated.active === true ? 'sí' : JSON.stringify(activated).slice(0, 200));

  console.log('\nWebhook URL: https://santiagon8nmejia.dominadoresia.com/webhook/velik-cita-status');
}
run();
