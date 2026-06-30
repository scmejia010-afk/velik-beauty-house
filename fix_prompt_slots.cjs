const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

function get(p) {
  return new Promise(r => {
    https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: p, method: 'GET', headers: { 'X-N8N-API-KEY': KEY } }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => r(JSON.parse(d)));
    }).end();
  });
}
function put(p, b) {
  return new Promise(r => {
    const x = JSON.stringify(b);
    const q = https.request({ hostname: 'santiagon8nmejia.dominadoresia.com', path: p, method: 'PUT', headers: { 'X-N8N-API-KEY': KEY, 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(x) } }, rr => {
      let d = ''; rr.on('data', c => d += c); rr.on('end', () => r(JSON.parse(d)));
    });
    q.write(x); q.end();
  });
}

const OLD_STEP = `2. Una vez el cliente elija la profesional, llama a verificar_disponibilidad con el servicio Y la profesional.
3. Muestra los horarios disponibles SOLO de esa profesional (máximo 5-6 opciones).
4. Cliente elige → pide nombre + teléfono si no los tienes → crear_cita (incluye siempre el campo profesional) → muestra confirmación.`;

const NEW_STEP = `2. Después de elegir la profesional, pregunta qué día y a qué hora le quedaría bien. Ejemplo: "¿Qué día y a qué horita te quedaría bien? 😊"
3. Con esa preferencia, llama a verificar_disponibilidad con el servicio, la profesional y la fecha.
4. ⚠️ NUNCA muestres la lista completa de horarios disponibles (da imagen de agenda vacía). Ofrece SOLO la hora que pidió (si está libre) o las 2-3 opciones MÁS CERCANAS:
   - Si pidió 3 PM y está libre: "¡Perfecto! A las 3 PM tenemos espacio con Carolina ✨ ¿Te la confirmo?"
   - Si pidió 3 PM y NO está libre: "Uy, a las 3 PM ya está reservada, pero me queda un espacio a las 2 PM o a las 4 PM, ¿cuál te queda mejor? 😊"
   - Si no dio hora específica: ofrece máximo 3 opciones repartidas en el día: "Ese día tengo disponible a las 10 AM, 1 PM o 4 PM, ¿cuál prefieres?"
5. Cliente elige → pide nombre + teléfono si no los tienes → crear_cita (incluye siempre el campo profesional) → muestra confirmación.`;

(async () => {
  const wf = await get('/api/v1/workflows/oTWJ2XHBAZCINO7A');
  const agent = wf.nodes.find(x => x.parameters?.options?.systemMessage !== undefined) || wf.nodes.find(x => x.parameters?.systemMessage !== undefined);
  const getM = () => agent.parameters.options?.systemMessage ?? agent.parameters.systemMessage;
  const setM = v => { if (agent.parameters.options?.systemMessage !== undefined) agent.parameters.options.systemMessage = v; else agent.parameters.systemMessage = v; };
  let msg = getM();

  if (msg.includes(OLD_STEP)) {
    msg = msg.replace(OLD_STEP, NEW_STEP);
    setM(msg);
    const r = await put('/api/v1/workflows/oTWJ2XHBAZCINO7A', { name: wf.name, nodes: wf.nodes, connections: wf.connections, settings: wf.settings || {} });
    console.log('Prompt actualizado:', r.name);
  } else {
    console.log('Patrón no encontrado. Fragmento actual del FLUJO:');
    const i = msg.indexOf('FLUJO PARA AGENDAR');
    console.log(msg.slice(i, i + 1200));
  }
})();
