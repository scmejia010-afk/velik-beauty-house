const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
const GHL_KEY = 'pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e';
const LOC_ID = '0zeAaf3V1WrlkbyD4tJo';

function get(path) {
  return new Promise(res => {
    const req = https.request({hostname:'santiagon8nmejia.dominadoresia.com',path,method:'GET',headers:{'X-N8N-API-KEY':KEY}},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)));});req.end();
  });
}
function put(path, body) {
  return new Promise(res => {
    const b = JSON.stringify(body);
    const req = https.request({hostname:'santiagon8nmejia.dominadoresia.com',path,method:'PUT',headers:{'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Content-Length':Buffer.byteLength(b)}},r=>{let d='';r.on('data',c=>d+=c);r.on('end',()=>res(JSON.parse(d)));});req.write(b);req.end();
  });
}

async function run() {
  const wf = await get('/api/v1/workflows/5iucjBh8NXLquwDZ');

  // Rewrite the nodes
  wf.nodes = [
    {
      id: wf.nodes[0].id,
      name: 'Execute Workflow Trigger',
      type: 'n8n-nodes-base.executeWorkflowTrigger',
      typeVersion: 1,
      position: [240, 300],
      parameters: {}
    },
    {
      id: wf.nodes[1].id,
      name: 'Buscar Contacto GHL',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [460, 300],
      parameters: {
        method: 'GET',
        url: `=https://services.leadconnectorhq.com/contacts/?locationId=${LOC_ID}&query={{ $json.query.telefono.replace('@s.whatsapp.net','').replace(/\D/g,'') }}`,
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Authorization', value: `Bearer ${GHL_KEY}` },
            { name: 'Version', value: '2021-07-28' }
          ]
        },
        options: {}
      }
    },
    {
      id: wf.nodes[2].id,
      name: 'Obtener Citas GHL',
      type: 'n8n-nodes-base.httpRequest',
      typeVersion: 4.2,
      position: [680, 300],
      parameters: {
        method: 'GET',
        url: '={{ "https://services.leadconnectorhq.com/contacts/" + $json.contacts[0].id + "/appointments" }}',
        sendHeaders: true,
        headerParameters: {
          parameters: [
            { name: 'Authorization', value: `Bearer ${GHL_KEY}` },
            { name: 'Version', value: '2021-07-28' }
          ]
        },
        options: {}
      }
    },
    {
      id: 'code-format',
      name: 'Formatear Citas',
      type: 'n8n-nodes-base.code',
      typeVersion: 2,
      position: [900, 300],
      parameters: {
        jsCode: `const events = $json.events || [];
const ahora = new Date();

const proximas = events.filter(e => new Date(e.startTime) > ahora && e.status !== 'cancelled');

if (proximas.length === 0) {
  return [{ json: { response: 'No tienes citas próximas agendadas.' } }];
}

const lista = proximas.map((e, i) => {
  const fecha = new Date(e.startTime);
  const opciones = { weekday: 'long', day: 'numeric', month: 'long', timeZone: 'America/Bogota' };
  const hora = fecha.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Bogota' });
  const fechaStr = fecha.toLocaleDateString('es-CO', opciones);
  return \`\${i+1}. *\${e.title}* — \${fechaStr} a las \${hora} | ID: \${e.id}\`;
}).join('\n');

return [{ json: { response: 'Tus citas próximas:\n' + lista, citas: proximas.map(e => ({ id: e.id, titulo: e.title, fecha: e.startTime })) } }];`
      }
    }
  ];

  // Fix connections
  wf.connections = {
    'Execute Workflow Trigger': { main: [[{ node: 'Buscar Contacto GHL', type: 'main', index: 0 }]] },
    'Buscar Contacto GHL': { main: [[{ node: 'Obtener Citas GHL', type: 'main', index: 0 }]] },
    'Obtener Citas GHL': { main: [[{ node: 'Formatear Citas', type: 'main', index: 0 }]] }
  };

  const r = await put('/api/v1/workflows/5iucjBh8NXLquwDZ', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Ver mis citas updated:', r.name || r.message);

  // Now add ver_citas tool to main agent
  const main = await get('/api/v1/workflows/J9oGx0uzXXkJEhh2');
  
  // Check if ver_citas tool already exists
  const existing = main.nodes.find(n => n.name === 'ver_citas');
  if (existing) {
    console.log('ver_citas tool already exists, updating description...');
    existing.parameters.description = 'Busca las citas próximas del cliente en GHL. SIEMPRE usar antes de cancelar. Input JSON: {"telefono": "número del cliente con formato del remoteJid"}';
  } else {
    // Add the tool
    const agentNode = main.nodes.find(n => n.name === 'PROMPT ACTUALIZADO');
    main.nodes.push({
      id: 'ver-citas-tool',
      name: 'ver_citas',
      type: '@n8n/n8n-nodes-langchain.toolWorkflow',
      typeVersion: 2,
      position: [agentNode.position[0] + 200, agentNode.position[1] + 160],
      parameters: {
        name: 'ver_citas',
        description: 'Busca las citas próximas del cliente en GHL. SIEMPRE usar antes de cancelar una cita. Input JSON: {"telefono": "número remoteJid del cliente"}',
        workflowId: { __rl: true, value: '5iucjBh8NXLquwDZ', mode: 'list' },
        workflowInputs: { mappingMode: 'passthrough', value: {} },
        schemaType: 'fromFields',
        inputSource: 'passthrough'
      }
    });

    // Connect tool to agent
    if (!main.connections['ver_citas']) {
      main.connections['ver_citas'] = { ai_tool: [[{ node: 'PROMPT ACTUALIZADO', type: 'ai_tool', index: 0 }]] };
    }
  }

  // Update system prompt to instruct proper cancellation flow
  const agentNode = main.nodes.find(n => n.name === 'PROMPT ACTUALIZADO');
  const currentPrompt = agentNode.parameters.systemMessage || '';
  if (!currentPrompt.includes('ver_citas')) {
    agentNode.parameters.systemMessage = currentPrompt + `

## PROCESO PARA CANCELAR CITA
1. Cuando el cliente quiera cancelar, PRIMERO llama a la herramienta \`ver_citas\` con su teléfono (remoteJid).
2. Muestra las citas encontradas al cliente con formato legible (sin mostrar el ID).
3. Pregunta cuál desea cancelar si tiene varias.
4. Confirma con el cliente antes de cancelar.
5. Solo entonces llama a \`cancelar_cita\` con el ID de la cita correspondiente.
NUNCA pidas al cliente el ID de la cita — es interno y lo obtienes con ver_citas.`;
  }

  const r2 = await put('/api/v1/workflows/J9oGx0uzXXkJEhh2', {
    name: main.name, nodes: main.nodes, connections: main.connections, settings: main.settings || {}
  });
  console.log('Main agent updated:', r2.name || r2.message);
}
run();
