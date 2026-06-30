const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const SUPA = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxb3p0enpuc3hodmN6a2Fub3JyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MDA1OTg3NSwiZXhwIjoyMDk1NjM1ODc1fQ.2Jxnj_q9ni2p8H4wuOP-u9QIDTYkkjdenaTPDjjQFmc';

function get(p){return new Promise(r=>{https.request({hostname:'santiagon8nmejia.dominadoresia.com',path:p,method:'GET',headers:{'X-N8N-API-KEY':KEY}},rr=>{let d='';rr.on('data',c=>d+=c);rr.on('end',()=>r(JSON.parse(d)));}).end();})}
function put(p,b){return new Promise(r=>{const x=JSON.stringify(b);const q=https.request({hostname:'santiagon8nmejia.dominadoresia.com',path:p,method:'PUT',headers:{'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Content-Length':Buffer.byteLength(x)}},rr=>{let d='';rr.on('data',c=>d+=c);rr.on('end',()=>r({status:rr.statusCode,body:d}));});q.write(x);q.end();})}

const ALLOWED = ['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];

(async () => {
  const wf = await get('/api/v1/workflows/3UMIZGQy4HCmBN6v');

  // Verificar que no exista ya
  if (wf.nodes.find(n => n.name === 'Guardar Contacto Supabase')) {
    console.log('⚠️  Nodo ya existe, saliendo');
    return;
  }

  // Nuevo nodo: upsert contacto en Supabase contactos
  const nuevoNodo = {
    id: 'guardar-contacto-supa',
    name: 'Guardar Contacto Supabase',
    type: 'n8n-nodes-base.httpRequest',
    typeVersion: 4.2,
    position: [1100, 400],
    parameters: {
      method: 'POST',
      url: 'https://aqoztzznsxhvczkanorr.supabase.co/rest/v1/contactos',
      sendHeaders: true,
      headerParameters: {
        parameters: [
          { name: 'apikey',        value: SUPA },
          { name: 'Authorization', value: 'Bearer ' + SUPA },
          { name: 'Content-Type',  value: 'application/json' },
          { name: 'Prefer',        value: 'resolution=merge-duplicates,return=minimal' }
        ]
      },
      sendBody: true,
      specifyBody: 'json',
      jsonBody: `={
  "nombres": "{{ $('Parsear Datos').item.json.nombre.split(' ')[0] }}",
  "apellidos": "{{ $('Parsear Datos').item.json.nombre.split(' ').slice(1).join(' ') || null }}",
  "telefono": "{{ $('Parsear Datos').item.json.telefono }}",
  "email": "{{ $('Parsear Datos').item.json.email || null }}"
}`,
      options: {}
    }
  };

  wf.nodes.push(nuevoNodo);

  // Conectar: después de "Upsert Contacto" → "Guardar Contacto Supabase"
  if (!wf.connections['Upsert Contacto']) wf.connections['Upsert Contacto'] = { main: [[]] };
  const upsertConns = wf.connections['Upsert Contacto'].main[0];
  upsertConns.push({ node: 'Guardar Contacto Supabase', type: 'main', index: 0 });

  const settings = {};
  for (const k of ALLOWED) if (wf.settings?.[k] !== undefined) settings[k] = wf.settings[k];

  const r = await put('/api/v1/workflows/3UMIZGQy4HCmBN6v', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings
  });

  console.log(r.status === 200
    ? '✅ Nodo agregado: ahora cada cita creada por el agente guarda el contacto en Supabase'
    : '❌ Error: ' + r.body.slice(0, 300));
})();
