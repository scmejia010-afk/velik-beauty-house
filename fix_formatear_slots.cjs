const https = require('https');
const KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';
function get(p){return new Promise(r=>{https.request({hostname:'santiagon8nmejia.dominadoresia.com',path:p,method:'GET',headers:{'X-N8N-API-KEY':KEY}},rr=>{let d='';rr.on('data',c=>d+=c);rr.on('end',()=>r(JSON.parse(d)));}).end();})}
function put(p,b){return new Promise(r=>{const x=JSON.stringify(b);const q=https.request({hostname:'santiagon8nmejia.dominadoresia.com',path:p,method:'PUT',headers:{'X-N8N-API-KEY':KEY,'Content-Type':'application/json','Content-Length':Buffer.byteLength(x)}},rr=>{let d='';rr.on('data',c=>d+=c);rr.on('end',()=>r({status:rr.statusCode,body:d}));});q.write(x);q.end();})}
const ALLOWED=['saveExecutionProgress','saveManualExecutions','saveDataErrorExecution','saveDataSuccessExecution','executionTimeout','errorWorkflow','timezone','executionOrder'];

const NEW_CODE = `const raw = $json;
const slots_by_date = {};
for (const [key, val] of Object.entries(raw)) {
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(key) && val.slots) {
    const dateObj = new Date(key + 'T00:00:00-05:00');
    const days = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const label = days[dateObj.getDay()] + ' ' + dateObj.getDate() + ' de ' + months[dateObj.getMonth()];
    const allSlots = val.slots.map(s => {
      const slotStr = s.startTime || s;
      const match = slotStr.match(/T(\\d{2}):(\\d{2}):/);
      if (!match) return null;
      const h24 = parseInt(match[1]);
      const min = parseInt(match[2]);
      const ampm = h24 >= 12 ? 'PM' : 'AM';
      const h12 = h24 % 12 || 12;
      const minStr = String(min).padStart(2, '0');
      return { label: h12 + ':' + minStr + ' ' + ampm, slot: slotStr, h24, min };
    }).filter(Boolean);
    if (allSlots.length > 0) slots_by_date[label] = allSlots;
  }
}
if (Object.keys(slots_by_date).length === 0) {
  return [{ json: { response: 'No hay disponibilidad en los proximos 5 dias para ese servicio. Puedes intentar con otra fecha o pedirme que revise la semana siguiente.' } }];
}

const raw_slots = {};
let text = 'Horarios disponibles (muestra representativa):\\n\\n';
for (const [day, slots] of Object.entries(slots_by_date)) {
  raw_slots[day] = slots.map(s => s.slot);

  let picks = [];
  if (slots.length <= 4) {
    picks = [...slots];
  } else {
    // 4 franjas fijas: primera >=9AM, primera >=12PM, primera >=3PM, ULTIMA del dia
    const morning   = slots.find(s => s.h24 >= 9 && s.h24 < 12);
    const midday    = slots.find(s => s.h24 >= 12 && s.h24 < 15);
    const afternoon = slots.find(s => s.h24 >= 15 && s.h24 < 18);
    const last      = slots[slots.length - 1]; // último disponible (ej: 6:30 PM)
    const added = new Set();
    for (const s of [morning, midday, afternoon, last]) {
      if (s && !added.has(s.slot)) { picks.push(s); added.add(s.slot); }
    }
  }

  text += day.charAt(0).toUpperCase() + day.slice(1) + ':\\n';
  text += picks.map(s => '  - ' + s.label + ' | slot: ' + s.slot).join('\\n') + '\\n\\n';
}
text += 'INSTRUCCIÓN PARA EL AGENTE: Estos son horarios representativos. Si el cliente pide una hora específica (ej: "las 6 PM"), busca en raw_slots el slot más cercano — NO digas que no hay sin revisar raw_slots. Si hay disponibilidad a esa hora, confirma al cliente y agenda.';
return [{ json: { response: text, raw_slots } }];`;

(async()=>{
  const wf = await get('/api/v1/workflows/XAoMeVFKqLw7KcFX');
  const node = wf.nodes.find(n=>n.name==='Formatear Slots');
  node.parameters.jsCode = NEW_CODE;
  const settings={};
  for(const k of ALLOWED) if(wf.settings?.[k]!==undefined) settings[k]=wf.settings[k];
  const r = await put('/api/v1/workflows/XAoMeVFKqLw7KcFX',{name:wf.name,nodes:wf.nodes,connections:wf.connections,settings});
  console.log(r.status===200?'✅ Formatear Slots: último slot del día como opción de noche':r.body.slice(0,300));
})();
