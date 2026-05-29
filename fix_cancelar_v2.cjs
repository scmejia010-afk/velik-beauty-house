const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const GHL = 'pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e';
const LOC = '0zeAaf3V1WrlkbyD4tJo';

function get(path) {
  return new Promise(res => {
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }); req.end();
  });
}
function put(path, body) {
  return new Promise(res => {
    const b = JSON.stringify(body);
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'PUT', headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    }); req.write(b); req.end();
  });
}

async function run() {
  const wf = await get('/api/v1/workflows/XFoYOSSdcDleyVMK');

  const parsearCode = `
let q = $json.query || {};
if (typeof q === 'string') { try { q = JSON.parse(q); } catch(e) {} }
const telefono = (q.telefono || '').replace('@s.whatsapp.net','').replace(/\\D/g,'');
const seleccion = q.seleccion ? parseInt(q.seleccion) : null;
if (!telefono) return [{ json: { response: 'No pude identificar tu número.' } }];
return [{ json: { telefono, seleccion } }];
`;

  const logicCode = `
const events = $json.events || [];
const ahora = new Date();
const proximas = events.filter(e => new Date(e.startTime) > ahora && e.appointmentStatus !== 'cancelled' && e.status !== 'cancelled');
const inputData = $('Parsear Input').first().json;
const seleccion = inputData.seleccion;

if (proximas.length === 0) {
  return [{ json: { response: 'No tienes citas próximas para cancelar.', accion: 'listar' } }];
}

if (!seleccion) {
  const lista = proximas.map((e,i) => {
    const fecha = new Date(e.startTime);
    const fechaStr = fecha.toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long',timeZone:'America/Bogota'});
    const hora = fecha.toLocaleTimeString('es-CO',{hour:'2-digit',minute:'2-digit',timeZone:'America/Bogota'});
    return (i+1)+'. '+e.title.split(' - ')[0]+' — '+fechaStr+' a las '+hora;
  }).join('\\n');
  return [{ json: { response: 'Tienes estas citas próximas:\\n'+lista+'\\n\\n¿Cuál deseas cancelar? Responde con el número.', accion: 'listar' } }];
}

const idx = seleccion - 1;
if (idx < 0 || idx >= proximas.length) {
  return [{ json: { response: 'Número inválido. Elige entre 1 y '+proximas.length+'.', accion: 'error' } }];
}
const cita = proximas[idx];
return [{ json: { appointment_id: cita.id, titulo: cita.title.split(' - ')[0], accion: 'cancelar' } }];
`;

  const respOkCode = `
const titulo = $('Lógica Cancelar').first().json.titulo;
return [{ json: { response: '✅ Tu cita de *'+titulo+'* ha sido cancelada exitosamente.' } }];
`;

  const nodes = [
    { id: wf.nodes[0].id, name: 'Trigger', type: 'n8n-nodes-base.executeWorkflowTrigger', typeVersion: 1, position: [200, 300], parameters: {} },
    { id: 'parse', name: 'Parsear Input', type: 'n8n-nodes-base.code', typeVersion: 2, position: [400, 300], parameters: { jsCode: parsearCode } },
    { id: 'buscar', name: 'Buscar Contacto', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [620, 300], parameters: {
      method: 'GET',
      url: '=https://services.leadconnectorhq.com/contacts/?locationId=' + LOC + '&query={{ $json.telefono }}',
      sendHeaders: true,
      headerParameters: { parameters: [{ name: 'Authorization', value: 'Bearer ' + GHL }, { name: 'Version', value: '2021-07-28' }] },
      options: {}
    }},
    { id: 'citas', name: 'Obtener Citas', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [840, 300], parameters: {
      method: 'GET',
      url: '={{ "https://services.leadconnectorhq.com/contacts/" + $json.contacts[0].id + "/appointments" }}',
      sendHeaders: true,
      headerParameters: { parameters: [{ name: 'Authorization', value: 'Bearer ' + GHL }, { name: 'Version', value: '2021-07-28' }] },
      options: {}
    }},
    { id: 'logic', name: 'Lógica Cancelar', type: 'n8n-nodes-base.code', typeVersion: 2, position: [1060, 300], parameters: { jsCode: logicCode } },
    { id: 'ifcancel', name: 'Es Cancelar?', type: 'n8n-nodes-base.if', typeVersion: 2, position: [1280, 300], parameters: {
      conditions: { options: { caseSensitive: true }, conditions: [{ id: '1', leftValue: '={{ $json.accion }}', rightValue: 'cancelar', operator: { type: 'string', operation: 'equals' } }] }
    }},
    { id: 'cancelghl', name: 'Cancelar en GHL', type: 'n8n-nodes-base.httpRequest', typeVersion: 4.2, position: [1500, 180], parameters: {
      method: 'PUT',
      url: '={{ "https://services.leadconnectorhq.com/calendars/events/appointments/" + $json.appointment_id }}',
      sendHeaders: true,
      headerParameters: { parameters: [{ name: 'Authorization', value: 'Bearer ' + GHL }, { name: 'Version', value: '2021-04-15' }] },
      sendBody: true,
      specifyBody: 'keypair',
      bodyParameters: { parameters: [{ name: 'appointmentStatus', value: 'cancelled' }] },
      options: {}
    }},
    { id: 'respok', name: 'Respuesta OK', type: 'n8n-nodes-base.code', typeVersion: 2, position: [1720, 180], parameters: { jsCode: respOkCode } },
    { id: 'resplist', name: 'Respuesta Lista', type: 'n8n-nodes-base.set', typeVersion: 3.4, position: [1500, 420], parameters: { mode: 'passthrough' } }
  ];

  const connections = {
    'Trigger':         { main: [[{ node: 'Parsear Input',   type: 'main', index: 0 }]] },
    'Parsear Input':   { main: [[{ node: 'Buscar Contacto', type: 'main', index: 0 }]] },
    'Buscar Contacto': { main: [[{ node: 'Obtener Citas',   type: 'main', index: 0 }]] },
    'Obtener Citas':   { main: [[{ node: 'Lógica Cancelar', type: 'main', index: 0 }]] },
    'Lógica Cancelar': { main: [[{ node: 'Es Cancelar?',    type: 'main', index: 0 }]] },
    'Es Cancelar?':    { main: [[{ node: 'Cancelar en GHL', type: 'main', index: 0 }], [{ node: 'Respuesta Lista', type: 'main', index: 0 }]] },
    'Cancelar en GHL': { main: [[{ node: 'Respuesta OK',    type: 'main', index: 0 }]] }
  };

  const r = await put('/api/v1/workflows/XFoYOSSdcDleyVMK', { name: wf.name, nodes, connections, settings: {} });
  console.log('Cancelar workflow:', r.name || r.message);

  // Update main agent tool description and prompt
  const main = await get('/api/v1/workflows/J9oGx0uzXXkJEhh2');
  const cancelTool = main.nodes.find(n => n.name === 'cancelar_cita');
  cancelTool.parameters.description = 'Gestiona cancelación de citas en 2 pasos. Paso 1 — llama con {"telefono":"<remoteJid>"} para ver la lista de citas. Paso 2 — cuando el cliente indique cuál cancelar, llama con {"telefono":"<remoteJid>","seleccion":<número>}. NUNCA uses appointment_id directamente.';

  const agentNode = main.nodes.find(n => n.name === 'PROMPT ACTUALIZADO');
  let prompt = agentNode.parameters.systemMessage || '';
  // Remove previous cancel instructions
  ['## REGLA CRÍTICA', '## PROCESO PARA CANCELAR', '## CANCELAR CITA'].forEach(marker => {
    const idx = prompt.indexOf(marker);
    if (idx !== -1) prompt = prompt.substring(0, idx).trim();
  });

  agentNode.parameters.systemMessage = prompt + `

## CANCELAR CITA
1. Llama cancelar_cita con {"telefono": "<remoteJid del cliente>"} → devuelve lista numerada de citas.
2. Muéstrasela al cliente y pregunta cuál cancelar.
3. Cuando el cliente diga el número, llama cancelar_cita con {"telefono": "<remoteJid>", "seleccion": <número>}.
4. Confirma al cliente con el mensaje que devuelve el tool.`;

  const r2 = await put('/api/v1/workflows/J9oGx0uzXXkJEhh2', { name: main.name, nodes: main.nodes, connections: main.connections, settings: main.settings || {} });
  console.log('Agent:', r2.name || r2.message);
}
run();
