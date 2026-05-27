const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

const STAFF = {
  carolina: 'Bn1QrO4ITpYI7wSohG9r',
  laura:    'DEeqUttYKgjjsfNaS1XY',
  luz:      'UzLj5T8ZOrJ8reSig5os',
  vanesa:   'DEeqUttYKgjjsfNaS1XY', // alias for laura vanessa
  vanessa:  'DEeqUttYKgjjsfNaS1XY',
};

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

// ── 1. Main workflow: add "profesional" to tool schemas ──────────────────────
async function fixMainWorkflow() {
  const wf = await get('/api/v1/workflows/oTWJ2XHBAZCINO7A');

  // verificar_disponibilidad tool
  const verTool = wf.nodes.find(x => x.name === 'verificar_disponibilidad');
  if (verTool) {
    const schema = JSON.parse(verTool.parameters.inputSchema);
    if (!schema.properties.profesional) {
      schema.properties.profesional = {
        type: 'string',
        description: 'Nombre de la profesional si el cliente especifica una: carolina, laura, luz. Omitir si no especifica.'
      };
      verTool.parameters.inputSchema = JSON.stringify(schema);
      console.log('✓ verificar_disponibilidad: profesional added to schema');
    } else {
      console.log('· verificar_disponibilidad: profesional already in schema');
    }
  } else {
    console.log('✗ verificar_disponibilidad node not found');
  }

  // crear_cita tool
  const crearTool = wf.nodes.find(x => x.name === 'crear_cita');
  if (crearTool) {
    const schema = JSON.parse(crearTool.parameters.inputSchema);
    if (!schema.properties.profesional) {
      schema.properties.profesional = {
        type: 'string',
        description: 'Nombre de la profesional elegida: carolina, laura, luz. Omitir si no se especificó.'
      };
      crearTool.parameters.inputSchema = JSON.stringify(schema);
      console.log('✓ crear_cita: profesional added to schema');
    } else {
      console.log('· crear_cita: profesional already in schema');
    }
  } else {
    console.log('✗ crear_cita node not found');
  }

  const r = await put('/api/v1/workflows/oTWJ2XHBAZCINO7A', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Main workflow saved:', r.name || r.message);
}

// ── 2. Verificar Disponibilidad: filter free-slots by staffUserId ────────────
async function fixVerificar() {
  const wf = await get('/api/v1/workflows/XAoMeVFKqLw7KcFX');

  // Find the HTTP Request node that calls free-slots
  const httpNode = wf.nodes.find(x =>
    x.type === 'n8n-nodes-base.httpRequest' &&
    JSON.stringify(x.parameters).includes('free-slots')
  );

  if (!httpNode) {
    console.log('✗ free-slots HTTP node not found');
    return;
  }

  console.log('Free-slots node name:', httpNode.name);
  console.log('Current url:', httpNode.parameters.url);

  // Add staffUserId as optional query param using expression
  // Current url is something like: https://services.leadconnectorhq.com/calendars/{{$json.calendarId}}/free-slots?startDate=...
  // We need to append &staffUserId={{staffId}} when profesional is set

  // Check if already has staffUserId
  if (JSON.stringify(httpNode.parameters).includes('staffUserId')) {
    console.log('· free-slots: staffUserId already present');
  } else {
    // Add staffUserId as a query parameter in the node
    if (!httpNode.parameters.sendQuery) {
      httpNode.parameters.sendQuery = true;
    }
    if (!httpNode.parameters.queryParameters) {
      httpNode.parameters.queryParameters = { parameters: [] };
    }
    if (!httpNode.parameters.queryParameters.parameters) {
      httpNode.parameters.queryParameters.parameters = [];
    }

    httpNode.parameters.queryParameters.parameters.push({
      name: 'staffUserId',
      value: "={{ $json.staffUserId || '' }}"
    });
    console.log('✓ free-slots: staffUserId query param added');
  }

  // Also fix the Buscar Calendario / input parsing node to extract profesional → staffUserId
  const buscarNode = wf.nodes.find(x => x.name === 'Buscar Calendario');
  if (buscarNode) {
    const staffJson = JSON.stringify(STAFF);
    const addedCode = `
// Resolve profesional to staffUserId
const STAFF = ${staffJson};
const profRaw = (q.profesional || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').trim();
const staffUserId = STAFF[profRaw] || '';
`;
    if (!buscarNode.parameters.jsCode.includes('staffUserId')) {
      // Append before the return statement
      buscarNode.parameters.jsCode = buscarNode.parameters.jsCode.replace(
        /return \[/,
        addedCode + '\nreturn ['
      );
      // Also add staffUserId to the return object
      buscarNode.parameters.jsCode = buscarNode.parameters.jsCode.replace(
        /fecha: fecha\s*\}\s*\}\s*\]/,
        'fecha: fecha, staffUserId: staffUserId\n  } }]'
      );
      console.log('✓ Buscar Calendario: staffUserId extraction added');
    } else {
      console.log('· Buscar Calendario: staffUserId already present');
    }
  }

  const r = await put('/api/v1/workflows/XAoMeVFKqLw7KcFX', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Verificar workflow saved:', r.name || r.message);
}

// ── 3. Crear Cita: pass userId when profesional specified ────────────────────
async function fixCrear() {
  const wf = await get('/api/v1/workflows/3UMIZGQy4HCmBN6v');
  const n = wf.nodes.find(x => x.name === 'Parsear Datos');

  if (!n) { console.log('✗ Parsear Datos not found'); return; }

  if (n.parameters.jsCode.includes('userId')) {
    console.log('· Parsear Datos: userId already present');
  } else {
    const staffJson = JSON.stringify(STAFF);
    const addCode = `
// Resolve profesional to GHL userId
const STAFF_MAP = ${staffJson};
const profRaw2 = (q.profesional || '').toLowerCase().normalize('NFD').replace(/[\\u0300-\\u036f]/g,'').trim();
const userId = STAFF_MAP[profRaw2] || undefined;
`;
    // Add before the return
    n.parameters.jsCode = n.parameters.jsCode.replace(
      /\/\/ Preserve timezone offset/,
      addCode + '\n// Preserve timezone offset'
    );
    // Add userId to return object
    n.parameters.jsCode = n.parameters.jsCode.replace(
      /nombre, telefono, email\s*\}\s*\}\s*\]/,
      'nombre, telefono, email,\n  ...(userId ? { userId } : {})\n}}];'
    );
    console.log('✓ Parsear Datos: userId resolution added');
  }

  // Also fix Crear Cita GHL node to pass userId if present
  const ghlNode = wf.nodes.find(x => x.name === 'Crear Cita GHL');
  if (ghlNode && ghlNode.parameters.bodyParameters) {
    const params = ghlNode.parameters.bodyParameters.parameters || [];
    if (!params.find(p => p.name === 'userId')) {
      params.push({
        name: 'userId',
        value: "={{ $json.userId || undefined }}"
      });
      console.log('✓ Crear Cita GHL: userId param added');
    } else {
      console.log('· Crear Cita GHL: userId already present');
    }
  }

  const r = await put('/api/v1/workflows/3UMIZGQy4HCmBN6v', {
    name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {}
  });
  console.log('Crear Cita workflow saved:', r.name || r.message);
}

async function run() {
  console.log('\n── Main workflow ──');
  await fixMainWorkflow();
  console.log('\n── Verificar Disponibilidad ──');
  await fixVerificar();
  console.log('\n── Crear Cita ──');
  await fixCrear();
  console.log('\nDone!');
}
run();
