const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function get(path) {
  return new Promise((res) => {
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'GET', headers: { 'X-N8N-API-KEY': N8N_KEY } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.end();
  });
}

function put(path, body) {
  return new Promise((res) => {
    const b = JSON.stringify(body);
    const req = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path, method: 'PUT', headers: { 'X-N8N-API-KEY': N8N_KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(b) } }, r => {
      let d = ''; r.on('data', c => d += c); r.on('end', () => res(JSON.parse(d)));
    });
    req.write(b); req.end();
  });
}

// ── 1. Verificar Disponibilidad: staffUserId → userId in output + re-add query param ──
async function fixVerificar() {
  const wf = await get('/api/v1/workflows/XAoMeVFKqLw7KcFX');

  // Fix Buscar Calendario: rename staffUserId → userId in return
  const buscar = wf.nodes.find(x => x.name === 'Buscar Calendario');
  if (buscar) {
    buscar.parameters.jsCode = buscar.parameters.jsCode.replace(
      'staffUserId\n} }];',
      'userId: staffUserId\n} }];'
    );
    // Also handle if it's just staffUserId without rename
    if (!buscar.parameters.jsCode.includes('userId: staffUserId')) {
      buscar.parameters.jsCode = buscar.parameters.jsCode.replace(
        /staffUserId\s*\}\s*\}\s*\]\s*;?$/m,
        'userId: staffUserId\n} }];'
      );
    }
    console.log('Buscar Calendario userId key:', buscar.parameters.jsCode.includes('userId: staffUserId') ? '✓' : '— checking alt pattern');
    console.log('Last 200 chars:', buscar.parameters.jsCode.slice(-200));
  }

  // Fix Free Slots GHL: add userId query param (only when non-empty)
  const httpNode = wf.nodes.find(x =>
    x.type === 'n8n-nodes-base.httpRequest' &&
    JSON.stringify(x.parameters).includes('free-slots')
  );
  if (httpNode) {
    if (!httpNode.parameters.queryParameters) httpNode.parameters.queryParameters = { parameters: [] };
    if (!httpNode.parameters.queryParameters.parameters) httpNode.parameters.queryParameters.parameters = [];

    const existing = httpNode.parameters.queryParameters.parameters.find(p => p.name === 'userId');
    if (!existing) {
      httpNode.parameters.queryParameters.parameters.push({
        name: 'userId',
        value: "={{ $json.userId || undefined }}"
      });
      console.log('✓ Free Slots: userId param added');
    } else {
      existing.value = "={{ $json.userId || undefined }}";
      console.log('· Free Slots: userId param updated');
    }
  }

  const r = await put('/api/v1/workflows/XAoMeVFKqLw7KcFX', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Verificar saved:', r.name || r.message);
}

// ── 2. Main workflow: update system prompt to ask professional first ──────────
async function fixPrompt() {
  const wf = await get('/api/v1/workflows/oTWJ2XHBAZCINO7A');

  const agentNode = wf.nodes.find(x =>
    x.type === '@n8n/n8n-nodes-langchain.agent' ||
    (x.parameters && x.parameters.systemMessage)
  );

  if (!agentNode) { console.log('✗ agent node not found'); return; }

  const OLD_PROF_INSTRUCTION = '';
  const PROF_BLOCK = `
⚠️ FLUJO PARA AGENDAR CITAS:
1. Cuando el cliente pida un servicio, PRIMERO pregunta con cuál profesional desea ser atendida.
   Profesionales disponibles: Carolina Paz, Laura Vanessa, Luz Aida.
   Ejemplo: "¿Con cuál de nuestras profesionales te gustarías ser atendida? Tenemos a Carolina Paz, Laura Vanessa y Luz Aida 😊"
2. Una vez el cliente elija la profesional, llama a verificar_disponibilidad con el servicio Y la profesional.
3. Muestra los horarios disponibles SOLO de esa profesional.
4. Al crear la cita, incluye siempre el campo profesional con el nombre elegido.

Si el cliente ya menciona la profesional desde el inicio (ej: "quiero manos con Carolina"), no la preguntes de nuevo.
`;

  const sysMsg = agentNode.parameters.systemMessage || agentNode.parameters.text || '';

  if (sysMsg.includes('FLUJO PARA AGENDAR')) {
    console.log('· Prompt: professional flow already present');
    return;
  }

  // Insert after the date line
  const dateMarker = '⚠️ FECHA ACTUAL';
  if (sysMsg.includes(dateMarker)) {
    const insertAfter = sysMsg.indexOf('\n', sysMsg.indexOf(dateMarker)) + 1;
    const newMsg = sysMsg.slice(0, insertAfter) + PROF_BLOCK + sysMsg.slice(insertAfter);
    if (agentNode.parameters.systemMessage !== undefined) agentNode.parameters.systemMessage = newMsg;
    else agentNode.parameters.text = newMsg;
    console.log('✓ Prompt: professional flow added');
  } else {
    // Prepend
    const newMsg = PROF_BLOCK + '\n' + sysMsg;
    if (agentNode.parameters.systemMessage !== undefined) agentNode.parameters.systemMessage = newMsg;
    else agentNode.parameters.text = newMsg;
    console.log('✓ Prompt: professional flow prepended');
  }

  const r = await put('/api/v1/workflows/oTWJ2XHBAZCINO7A', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Main workflow saved:', r.name || r.message);
}

async function run() {
  console.log('── Verificar Disponibilidad ──');
  await fixVerificar();
  console.log('\n── System Prompt ──');
  await fixPrompt();
  console.log('\nDone!');
}
run();
