const https = require('https');
const GHL_KEY = 'pit-022a5206-1196-4066-8957-50cf5634da09';
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

const GERALDINE_ID = 'saGMogKgCH3kmIhq4VlJ';

// Nail service keywords (manicure, pedicure, combos)
const NAIL_KEYWORDS = ['manos', 'pies', 'uñas', 'unas', 'pedicura', 'manicur', 'pedicure',
  'builder', 'baby boomer', 'press on', 'polygel', 'acrílico', 'acrilico', 'rubber',
  'dipping', 'dip powder', 'semipermanente', 'esmaltado', 'evolution', 'diseño', 'diseno', 'garantías', 'garantias'];
// Exclude non-nail services that contain those words
const EXCLUDE = ['pestañas', 'pestanas', 'cejas', 'cabello', 'facial', 'maquillaje', 'depilación', 'depilacion', 'alisado', 'masaje reductor', 'piedras', 'drenaje', 'estrías', 'estrias', 'cosmetología', 'cosmetologia'];

function isNailCalendar(name) {
  const lower = name.toLowerCase();
  if (EXCLUDE.some(kw => lower.includes(kw))) return false;
  return NAIL_KEYWORDS.some(kw => lower.includes(kw));
}

function ghl(method, path, body) {
  return new Promise((res) => {
    const b = body ? JSON.stringify(body) : null;
    const headers = { 'Authorization': 'Bearer ' + GHL_KEY, 'Version': '2021-04-15', 'Content-Type': 'application/json' };
    if (b) headers['Content-Length'] = Buffer.byteLength(b);
    const r = https.request({ hostname: 'services.leadconnectorhq.com', path, method, headers }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => { try { res(JSON.parse(d)); } catch(e) { res({raw: d, status: rr.statusCode}); } });
    });
    if (b) r.write(b);
    r.end();
  });
}

function n8n(method, path, body) {
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

async function addToCalendars() {
  console.log('── 1. Calendarios GHL ──');
  const resp = await ghl('GET', '/calendars/?locationId=0zeAaf3V1WrlkbyD4tJo');
  const cals = resp.calendars || [];
  let added = 0, skipped = 0, errors = 0;

  for (const cal of cals) {
    if (!isNailCalendar(cal.name)) { continue; }

    const hasGer = cal.teamMembers?.some(m => m.userId === GERALDINE_ID);
    if (hasGer) { skipped++; continue; }

    // Model new member on an existing one (Carolina's structure)
    const template = cal.teamMembers?.[0];
    if (!template) { console.log('✗ ' + cal.name + ': no team members to model'); errors++; continue; }

    const newMember = {
      userId: GERALDINE_ID,
      selected: true,
      priority: 0.5,
      isZoomAdded: 'false',
      meetingLocationType: template.meetingLocationType || 'custom',
      locationConfigurations: [{
        kind: 'custom',
        location: '',
        meetingId: 'custom_0',
        zoomOauthId: '',
        position: cal.teamMembers.length
      }]
    };

    const updated = { ...cal, teamMembers: [...cal.teamMembers, newMember] };
    const r = await ghl('PUT', '/calendars/' + cal.id, updated);
    if (r.calendar || r.id) { console.log('✓ ' + cal.name); added++; }
    else { console.log('✗ ' + cal.name + ': ' + JSON.stringify(r).slice(0, 100)); errors++; }
  }
  console.log(`Calendarios: ${added} agregados, ${skipped} ya estaba, ${errors} errores`);
}

async function updateN8nStaff() {
  console.log('\n── 2. Mapas STAFF en n8n ──');

  // Verificar Disponibilidad — Buscar Calendario
  const wfV = await n8n('GET', '/api/v1/workflows/XAoMeVFKqLw7KcFX');
  const buscar = wfV.nodes.find(x => x.name === 'Buscar Calendario');
  if (buscar && !buscar.parameters.jsCode.includes('geraldine')) {
    buscar.parameters.jsCode = buscar.parameters.jsCode.replace(
      /(luz:\s*'UzLj5T8ZOrJ8reSig5os',)/,
      "$1\n  geraldine: 'saGMogKgCH3kmIhq4VlJ',"
    );
    await n8n('PUT', '/api/v1/workflows/XAoMeVFKqLw7KcFX', { name: wfV.name, nodes: wfV.nodes, connections: wfV.connections, settings: wfV.settings || {} });
    console.log('✓ Buscar Calendario:', buscar.parameters.jsCode.includes('geraldine') ? 'geraldine agregada' : 'PATRÓN NO ENCONTRADO');
  } else {
    console.log('· Buscar Calendario: ya tiene geraldine o nodo no encontrado');
  }

  // Crear Cita — Parsear Datos
  const wfC = await n8n('GET', '/api/v1/workflows/3UMIZGQy4HCmBN6v');
  const parsear = wfC.nodes.find(x => x.name === 'Parsear Datos');
  if (parsear && !parsear.parameters.jsCode.includes('geraldine')) {
    parsear.parameters.jsCode = parsear.parameters.jsCode.replace(
      /("luz":"UzLj5T8ZOrJ8reSig5os")/,
      '$1,"geraldine":"saGMogKgCH3kmIhq4VlJ"'
    );
    // Also try single-quote style
    parsear.parameters.jsCode = parsear.parameters.jsCode.replace(
      /(luz:\s*'UzLj5T8ZOrJ8reSig5os')(,?)/,
      "$1,\n  geraldine: 'saGMogKgCH3kmIhq4VlJ'$2"
    );
    await n8n('PUT', '/api/v1/workflows/3UMIZGQy4HCmBN6v', { name: wfC.name, nodes: wfC.nodes, connections: wfC.connections, settings: wfC.settings || {} });
    console.log('✓ Parsear Datos:', parsear.parameters.jsCode.includes('geraldine') ? 'geraldine agregada' : 'PATRÓN NO ENCONTRADO');
  } else {
    console.log('· Parsear Datos: ya tiene geraldine o nodo no encontrado');
  }
}

async function updatePrompt() {
  console.log('\n── 3. Prompt de Eli ──');
  const wf = await n8n('GET', '/api/v1/workflows/oTWJ2XHBAZCINO7A');
  const agent = wf.nodes.find(x => x.parameters?.options?.systemMessage !== undefined)
    || wf.nodes.find(x => x.parameters?.systemMessage !== undefined);
  if (!agent) { console.log('✗ Agent no encontrado'); return; }

  const getMsg = () => agent.parameters.options?.systemMessage ?? agent.parameters.systemMessage;
  const setMsg = (v) => { if (agent.parameters.options?.systemMessage !== undefined) agent.parameters.options.systemMessage = v; else agent.parameters.systemMessage = v; };

  let msg = getMsg();
  if (msg.includes('Geraldine')) { console.log('· Prompt ya tiene a Geraldine'); return; }

  msg = msg.replace(
    'Profesionales disponibles: Carolina Paz, Laura Vanessa, Luz Aida.',
    'Profesionales disponibles: Carolina Paz, Laura Vanessa, Luz Aida, Geraldine Berrio.'
  );
  msg = msg.replace(
    'Tenemos a Carolina Paz, Laura Vanessa y Luz Aida 😊',
    'Tenemos a Carolina Paz, Laura Vanessa y Geraldine Berrio 😊'
  );
  msg = msg.replace(
    'NOTA: Luz Aida solo realiza servicios faciales, masajes y tratamientos de estrías. Para los demás servicios ofrece solo a Carolina Paz y Laura Vanessa.',
    'NOTA: Luz Aida solo realiza servicios faciales, masajes y tratamientos de estrías. Geraldine Berrio solo realiza servicios de uñas (manicure, pedicure y combos). Para servicios de uñas ofrece a Carolina Paz, Laura Vanessa y Geraldine Berrio. Para cabello, cejas, pestañas, depilación y maquillaje ofrece solo a Carolina Paz y Laura Vanessa.'
  );
  msg = msg.replace(
    '"profesional": "carolina/laura/luz (opcional)"',
    '"profesional": "carolina/laura/luz/geraldine (opcional)"'
  );

  setMsg(msg);
  const r = await n8n('PUT', '/api/v1/workflows/oTWJ2XHBAZCINO7A', { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {} });
  console.log('✓ Prompt actualizado:', r.name || JSON.stringify(r).slice(0, 100));
}

(async () => {
  await addToCalendars();
  await updateN8nStaff();
  await updatePrompt();
  console.log('\nListo!');
})();
