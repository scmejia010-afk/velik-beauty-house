import requests
import json
import time

N8N_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8"
N8N_URL = "https://santiagon8nmejia.dominadoresia.com"
GHL_KEY = "pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e"
GHL_LOCATION = "0zeAaf3V1WrlkbyD4tJo"
MAIN_WORKFLOW_ID = "03ruI6r2UcMn9fms"

headers = {"X-N8N-API-KEY": N8N_KEY, "Content-Type": "application/json"}

# ── Calendar ID map (service name normalized -> {id, duration}) ──────────────
CALENDAR_JS = r"""
function normalize(s) {
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[^a-z0-9\s\/\+\(\)]/g,'').trim();
}
const RAW = {
  "manos semipermanente":{"id":"EDiqwAb54xY6nID5yzB8","dur":60},
  "base rubber manos":{"id":"yVTJ5MuqOiTIG6aW4Zzu","dur":60},
  "baby boomer":{"id":"HhrSGv6kTKZOtLwLtLaO","dur":170},
  "recubrimiento polygel/acrilico":{"id":"MmI8fIlxThj3dg3qXB5E","dur":150},
  "retoque de press on":{"id":"rSP0C1qAAvA82qSGwSsz","dur":80},
  "retiro rubber/dipping":{"id":"KDdZgv19rQYsaxXNeIMB","dur":20},
  "esmaltado tradicional manos":{"id":"54RoAHSPDVzWjfk4N2cR","dur":30},
  "extension de sistemas o reparacion c/u en servicio":{"id":"HowlM3DRvUNe4H9AeSLV","dur":15},
  "garantias":{"id":"Oi2Dn1v3MpIR3wn06LyY","dur":30},
  "manos tradicional":{"id":"ItIbYfgFYYvZYQ6Oje0B","dur":45},
  "builder gel":{"id":"58aCvkqxbMBcFFPgZmyk","dur":120},
  "unas esculpidas polygel/acrilico":{"id":"5FzBoBw7GCdwViMPesPC","dur":150},
  "retoque recubrimiento poly/acrilico":{"id":"g7a3uGcoBdAdrffowsY1","dur":100},
  "retiro semipermanente manos":{"id":"CUY39YrfaRmiHvMdGTol","dur":15},
  "limpieza manos":{"id":"yENMASOfLO8JTFgjW23z","dur":30},
  "solo limpieza manos":{"id":"fnJgqRtJlV8VAbEp2veA","dur":30},
  "extension del sistema o reparacion c/u fuera del servicio":{"id":"IaeOZwQoDAm6m1Ysvz41","dur":10},
  "manos evolution":{"id":"uyBy6KxStea3tyJXkxvE","dur":45},
  "unas dip powder + esmaltado semipermanente":{"id":"DIDIge2ItuyDQU3hfjqA","dur":70},
  "retoque esculpidas en polygel/acrilico":{"id":"JuHPG8vMNXKSOiyVNzjR","dur":110},
  "unas press on":{"id":"CwNB6YUweNhSrYOTFElB","dur":90},
  "retiro polygel/acrilico":{"id":"NbDO7tF3rTsVlsNAqweR","dur":30},
  "esmaltado semipermanente manos":{"id":"UdfCTzTMPNhYuemDnWsb","dur":20},
  "masaje relajante de manos":{"id":"74JOMcKwGJTEqfgqo2Ra","dur":7},
  "diseno":{"id":"ZIeJPQLAeo3bM3tLDL8z","dur":10},
  "pies semipermanente":{"id":"szaDqVWMTKAFCVcYjgTh","dur":60},
  "pedicura tradicional + pedi spa":{"id":"MPv75km6l8sal1NKHqtV","dur":60},
  "retiro semipermanente pies":{"id":"FJDuHD0L2DqBLPUeYsqM","dur":20},
  "pies evolution":{"id":"tKn5Hy3A7pKqg7nhVpgC","dur":40},
  "pedicura semi + pedi spa":{"id":"1OpkJJuQoNlATF5hd9Zi","dur":70},
  "tradicional pies":{"id":"XbxF4HF4VH3KNB16sNBU","dur":45},
  "solo limpieza pies":{"id":"rcuBG3bPRNwG11VFqgH2","dur":30},
  "unas semipermanente (manos y pies)":{"id":"0jYIRtI8bl33hIyhVJC1","dur":90},
  "manos semipermanentes y pies tradicional":{"id":"xpyrWObNXPeV2kMJtlIy","dur":120},
  "manos evolution y pies semipermanentes":{"id":"zfKlMG4wsoLWam1yRQCl","dur":100},
  "unas esmaltado tradicional (manos y pies)":{"id":"OYVNrcCxrbSYEd1SbV3f","dur":100},
  "manos semipermanente y pies evo":{"id":"z6VLaBzxm2hxO4JglzOI","dur":120},
  "solo limpieza manos y pies":{"id":"FMTaDks9JBTh1hXZ9k2U","dur":60},
  "evolution (manos y pies)":{"id":"ZLEVvENlOAsJdUVyyLGf","dur":80},
  "manos tradicionales + pies semipermanente":{"id":"iAOrgphopFSqRQt5dxTm","dur":120},
  "retiro semipermanente manos y pies":{"id":"fcpxmqMktM3vzoyrhumR","dur":30},
  "alisado natural argan y coco (corto)":{"id":"tYgB9RKWsWnAY6yzHbzo","dur":300},
  "alisado natural argan y coco (medio)":{"id":"YsyBC5BKtrnN8YQYRDBm","dur":300},
  "terapia capilar de loreal":{"id":"gJhd4efPJ7Zs7Ogybq95","dur":20},
  "cepillado cabello corto":{"id":"AFzeRInudMfQvytS7rYI","dur":30},
  "cepillado cabello extralargo":{"id":"IM2RYaBSfWNytuAmACml","dur":60},
  "color cabello largo":{"id":"SZnHg7E8gOsBB0CxxpAk","dur":90},
  "corte caballero":{"id":"6V88WbxYuumHKt5RBfGO","dur":30},
  "toxina botulinica":{"id":"7G42EdlizK39sGWSRTWO","dur":20},
  "alisado natural de argan y/o coco largo":{"id":"aO1pbT4UQDyqLJwXnPqX","dur":300},
  "ondas":{"id":"pyw2lCLu7OmMz5i1Xj0i","dur":45},
  "cepillado cabello medio":{"id":"BhjqV08NlQwTyAer5Rah","dur":40},
  "color cabello corto":{"id":"tdu7sEKcoUaJGN6TS5dR","dur":60},
  "color cabello extra largo":{"id":"HXfDgBJXCdD5xD7rqgmW","dur":90},
  "corte en capas":{"id":"cYESJstUsKOBcrKLfI61","dur":35},
  "alisado natural argan y/o coco (medio altura del codo)":{"id":"1yG992Jgff0sTUyGHzfQ","dur":300},
  "alisado natural de argan y/o coco extra largo":{"id":"NFFYkmfD3gwaVACAOBxq","dur":300},
  "planchado de cabello":{"id":"eSmQWFTgnrsIhICBidoF","dur":40},
  "cepillado cabello largo":{"id":"zxVN8YcfF9nQh3uOhLcD","dur":45},
  "color cabello medio":{"id":"XEmC3LZdNFLzri44z5fe","dur":60},
  "corte de puntas":{"id":"4aMo5CLViO46g2Q6jnip","dur":30},
  "depilacion de cejas con cera":{"id":"VYpzK2GHuBJ63aO2lSaV","dur":10},
  "depilacion perfilado/cuchilla cejas":{"id":"GcGJ59uvGEDf3LZCyrg2","dur":25},
  "lifting de pestanas":{"id":"Z7WKPMSF94iQoA8Mf9ne","dur":60},
  "depilacion de cejas con hilo":{"id":"ozLRNZ5V55zBOpGxcygz","dur":15},
  "laminado de cejas y lifting de pestanas":{"id":"KuZ6tseSF1WIC3wmAwGj","dur":70},
  "depilacion de cejas con henna":{"id":"n49lc4VkUvtvdtCRcgTB","dur":10},
  "laminado de cejas":{"id":"JGZXM08wqm28dl4qfp9T","dur":50},
  "extension de pestanas pelo a pelo efecto clasica":{"id":"dry2VkC24zeouSdN4VEm","dur":70},
  "extension de pestanas pelo a pelo efecto hibrido":{"id":"dbxPJAla6tTHNv73eo1l","dur":90},
  "extension de pestanas pelo a pelo efecto tecnologico":{"id":"4O1RVMdKaXEUaHqQqVP1","dur":90},
  "retoque pestanas":{"id":"yuikssBrbkVHsArQoe65","dur":60},
  "depilacion rostro completo con hilo":{"id":"hKENNyPe7hZhcz5HGHny","dur":30},
  "depilacion media pierna":{"id":"eRj3f8o8CLcD7i0rIgm3","dur":60},
  "depilacion nariz":{"id":"ZdfgP31Jmj4hWCEezhda","dur":20},
  "depilacion espalda baja":{"id":"9HqMBn6P9DBAsMqZmFit","dur":60},
  "depilacion de gluteos":{"id":"woQv67dSOZkRipYxGaXm","dur":20},
  "depilacion bigote con hilo":{"id":"eHXH3nwnTLLoacCnQKeh","dur":10},
  "depilacion pierna completa":{"id":"cmyFlDKVr8UemAn9N71W","dur":90},
  "depilacion orejas":{"id":"whI104AHCNJGaV35yii2","dur":20},
  "depilacion de pubis completo":{"id":"1vn5jyzI6R8TstZCZhOI","dur":60},
  "depilacion barbilla con hilo":{"id":"9M1FFJKZmz9tPhwEitAb","dur":10},
  "depilacion bigote":{"id":"UKZG99bvj0QCeFJaLNk7","dur":10},
  "depilacion de axilas":{"id":"mSw9Swdz68i0hC5cqNme","dur":18},
  "depilacion linea del bikini":{"id":"mfXJuW1bdCIPV4GgCSx3","dur":45},
  "pestanas punto a punto":{"id":"zT9oLreL1DCiwWDmO1Dx","dur":45},
  "maquillaje social":{"id":"71J4eTC3TIEuDXfsP1Iw","dur":60},
  "maquillaje blindado":{"id":"hdrmUKbZXwO4tbNVsIkb","dur":60},
  "maquillaje halloween":{"id":"PelRqVASPHp0QEu7P5Xs","dur":60},
  "bano de novia brazos":{"id":"OybBhb6gij304Vromp7n","dur":15},
  "masaje relajacion piedras volcanicas + velas":{"id":"q2Iz4gfTyoB3JkRNZ4CZ","dur":60},
  "drenaje linfatico":{"id":"wAwK46EAzP7OMVbVZ4Na","dur":60},
  "paquete 1 masaje reductor":{"id":"kjgB0Whm8mjpYv8I075K","dur":45},
  "paquete 2 masaje reductor":{"id":"8iU9qGnCM5nT6816pEAh","dur":45},
  "paquete 3 masaje reductor":{"id":"uajeiWuAmnwZ9BPA4RlT","dur":45},
  "reestructuracion de estrias":{"id":"9PiZEDHNec91qK58o3de","dur":40},
  "camuflaje de estrias":{"id":"xU7HfkiIbhZwHo1EnrTz","dur":120},
  "limpieza facial especial":{"id":"vxUBF94v8PKqobjUBeZc","dur":90},
  "limpieza facial tradicional":{"id":"fz9614uqbCIz8bLDXYNR","dur":60}
};
const CALENDARS = {};
for (const [k,v] of Object.entries(RAW)) { CALENDARS[normalize(k)] = v; }
"""

LOOKUP_JS = CALENDAR_JS + r"""
function lookupService(servicio) {
  const norm = normalize(servicio);
  if (CALENDARS[norm]) return CALENDARS[norm];
  // Partial match
  for (const [k,v] of Object.entries(CALENDARS)) {
    if (k.includes(norm) || norm.includes(k)) return v;
  }
  return null;
}
"""

# ── Helper to POST workflow ───────────────────────────────────────────────────
def create_workflow(payload):
    r = requests.post(f"{N8N_URL}/api/v1/workflows", headers=headers, json=payload)
    r.raise_for_status()
    wf = r.json()
    wf_id = wf.get("id")
    # Activate it
    requests.patch(f"{N8N_URL}/api/v1/workflows/{wf_id}/activate", headers=headers)
    return wf_id

def node(id_, name, type_, params, pos, type_version=1):
    return {"id": id_, "name": name, "type": type_, "typeVersion": type_version,
            "position": pos, "parameters": params}

# ════════════════════════════════════════════════════════════════════════════
# SUBWORKFLOW 1 — Verificar Disponibilidad
# ════════════════════════════════════════════════════════════════════════════
print("Creando: VELIK - Verificar Disponibilidad...")

code_lookup = LOOKUP_JS + r"""
let q = $json.query || {};
if (typeof q === 'string') { try { q = JSON.parse(q); } catch(e) {} }
const servicio = q.servicio || q.service || String(q);
const fecha = q.fecha || new Date().toISOString().split('T')[0];

const cal = lookupService(servicio);
if (!cal) {
  return [{ json: { error: 'Servicio no encontrado: ' + servicio,
    disponibles: Object.keys(CALENDARS).slice(0,10).join(', ') + '...' } }];
}
// Bogota offset = UTC-5
const start = new Date(fecha + 'T00:00:00-05:00');
const end = new Date(start); end.setDate(end.getDate() + 5);
return [{ json: { calendarId: cal.id, servicio, startDate: start.getTime(), endDate: end.getTime() } }];
"""

code_format_slots = r"""
const raw = $json;
const slots_by_date = {};
for (const [key, val] of Object.entries(raw)) {
  if (/^\d{4}-\d{2}-\d{2}$/.test(key) && val.slots) {
    const dateObj = new Date(key + 'T00:00:00-05:00');
    const days = ['domingo','lunes','martes','miercoles','jueves','viernes','sabado'];
    const months = ['ene','feb','mar','abr','may','jun','jul','ago','sep','oct','nov','dic'];
    const label = days[dateObj.getDay()] + ' ' + dateObj.getDate() + ' de ' + months[dateObj.getMonth()];
    const formatted = val.slots.map(s => {
      const t = new Date(s.startTime || s);
      const h = t.getHours(); const m = t.getMinutes();
      const ampm = h >= 12 ? 'PM' : 'AM';
      const h12 = h % 12 || 12;
      return h12 + ':' + String(m).padStart(2,'0') + ' ' + ampm + ' | slot: ' + (s.startTime || s);
    });
    if (formatted.length > 0) slots_by_date[label] = formatted;
  }
}
if (Object.keys(slots_by_date).length === 0) {
  return [{ json: { response: 'No hay disponibilidad en los próximos 5 días para ese servicio. Intenta con otra fecha.' } }];
}
let text = 'Horarios disponibles:\n\n';
for (const [day, times] of Object.entries(slots_by_date)) {
  text += day.charAt(0).toUpperCase() + day.slice(1) + ':\n';
  text += times.slice(0,6).map(t => '  • ' + t.split(' | ')[0]).join('\n') + '\n\n';
}
text += 'Para agendar, dime qué día y hora prefieres y te confirmo la cita.';
return [{ json: { response: text, raw_slots: slots_by_date } }];
"""

wf_verificar = {
    "name": "VELIK - Verificar Disponibilidad",
    "nodes": [
        node("trig1", "Trigger", "n8n-nodes-base.executeWorkflowTrigger",
             {"inputSource": "passthrough"}, [0, 0], 1.1),
        node("code1", "Buscar Calendario", "n8n-nodes-base.code",
             {"jsCode": code_lookup}, [220, 0], 2),
        node("http1", "Free Slots GHL", "n8n-nodes-base.httpRequest", {
            "method": "GET",
            "url": "=https://services.leadconnectorhq.com/calendars/{{ $json.calendarId }}/free-slots",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Bearer {GHL_KEY}"},
                {"name": "Version", "value": "2021-04-15"}
            ]},
            "sendQuery": True,
            "queryParameters": {"parameters": [
                {"name": "startDate", "value": "={{ $json.startDate }}"},
                {"name": "endDate", "value": "={{ $json.endDate }}"},
                {"name": "timezone", "value": "America/Bogota"}
            ]},
            "options": {}
        }, [460, 0], 4.2),
        node("code2", "Formatear Slots", "n8n-nodes-base.code",
             {"jsCode": code_format_slots}, [700, 0], 2),
    ],
    "connections": {
        "Trigger": {"main": [[{"node": "Buscar Calendario", "type": "main", "index": 0}]]},
        "Buscar Calendario": {"main": [[{"node": "Free Slots GHL", "type": "main", "index": 0}]]},
        "Free Slots GHL": {"main": [[{"node": "Formatear Slots", "type": "main", "index": 0}]]},
    },
    "settings": {"executionOrder": "v1"}
}

id_verificar = create_workflow(wf_verificar)
print(f"  OK -> {id_verificar}")
time.sleep(1)

# ════════════════════════════════════════════════════════════════════════════
# SUBWORKFLOW 2 — Crear Cita
# ════════════════════════════════════════════════════════════════════════════
print("Creando: VELIK - Crear Cita...")

code_parse_cita = LOOKUP_JS + r"""
let q = $json.query || {};
if (typeof q === 'string') { try { q = JSON.parse(q); } catch(e) {} }

const servicio  = q.servicio || q.service || '';
const slotTime  = q.slot_time || q.startTime || q.hora || '';
const nombre    = q.cliente_nombre || q.nombre || 'Cliente';
const telefono  = q.cliente_telefono || q.telefono || '';
const email     = q.cliente_email || q.email || '';

const cal = lookupService(servicio);
if (!cal) return [{ json: { error: 'Servicio no encontrado: ' + servicio } }];
if (!slotTime) return [{ json: { error: 'Falta slot_time. Usa verificar_disponibilidad primero.' } }];
if (!telefono) return [{ json: { error: 'Falta cliente_telefono para crear la cita.' } }];

// Parse slot time and compute end
const startDt = new Date(slotTime);
if (isNaN(startDt)) return [{ json: { error: 'slot_time inválido: ' + slotTime } }];
const endDt = new Date(startDt.getTime() + cal.dur * 60000);

return [{ json: {
  calendarId: cal.id, servicio, duracion: cal.dur,
  startTime: startDt.toISOString(), endTime: endDt.toISOString(),
  nombre, telefono, email
}}];
"""

code_create_result = r"""
const appt = $('Crear Cita GHL').item.json;
const apptId = appt.appointment?.id || appt.id || 'N/A';
const start = new Date($('Parsear Datos').item.json.startTime);
const opts = { weekday:'long', day:'numeric', month:'long',
               hour:'2-digit', minute:'2-digit', timeZone:'America/Bogota' };
const fechaHora = start.toLocaleString('es-CO', opts);
const servicio = $('Parsear Datos').item.json.servicio;
const nombre = $('Parsear Datos').item.json.nombre;

return [{ json: {
  response: `✅ ¡Cita confirmada, ${nombre}! 🌸\n\n📅 *${servicio}*\n🕐 ${fechaHora}\n📍 Dg 75 #74-05, Laureles, Medellín\n\nID de cita: ${apptId}\n\n¡Te esperamos con mucho cariño! 💚`,
  appointment_id: apptId
}}];
"""

wf_crear = {
    "name": "VELIK - Crear Cita",
    "nodes": [
        node("trig2", "Trigger", "n8n-nodes-base.executeWorkflowTrigger",
             {"inputSource": "passthrough"}, [0, 0], 1.1),
        node("code3", "Parsear Datos", "n8n-nodes-base.code",
             {"jsCode": code_parse_cita}, [220, 0], 2),
        node("http2", "Upsert Contacto", "n8n-nodes-base.httpRequest", {
            "method": "POST",
            "url": "https://services.leadconnectorhq.com/contacts/upsert",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Bearer {GHL_KEY}"},
                {"name": "Version", "value": "2021-04-15"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": f'={{"locationId":"{GHL_LOCATION}","phone":"={{{{ $json.telefono }}}}","firstName":"={{{{ $json.nombre.split(\\\" \\\")[0] }}}}","lastName":"={{{{ $json.nombre.split(\\\" \\\").slice(1).join(\\\" \\\") || \\\"\\\" }}}}"}}',
            "options": {}
        }, [460, 0], 4.2),
        node("http3", "Crear Cita GHL", "n8n-nodes-base.httpRequest", {
            "method": "POST",
            "url": "https://services.leadconnectorhq.com/calendars/events/appointments",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Bearer {GHL_KEY}"},
                {"name": "Version", "value": "2021-04-15"},
                {"name": "Content-Type", "value": "application/json"}
            ]},
            "sendBody": True,
            "specifyBody": "json",
            "jsonBody": f'={{"calendarId":"={{{{ $(\'Parsear Datos\').item.json.calendarId }}}}","locationId":"{GHL_LOCATION}","contactId":"={{{{ $json.contact.id }}}}","startTime":"={{{{ $(\'Parsear Datos\').item.json.startTime }}}}","endTime":"={{{{ $(\'Parsear Datos\').item.json.endTime }}}}","title":"={{{{ $(\'Parsear Datos\').item.json.servicio }}}} - {{{{ $(\'Parsear Datos\').item.json.nombre }}}}","appointmentStatus":"new","status":"confirmed"}}',
            "options": {}
        }, [700, 0], 4.2),
        node("code4", "Formatear Respuesta", "n8n-nodes-base.code",
             {"jsCode": code_create_result}, [940, 0], 2),
    ],
    "connections": {
        "Trigger": {"main": [[{"node": "Parsear Datos", "type": "main", "index": 0}]]},
        "Parsear Datos": {"main": [[{"node": "Upsert Contacto", "type": "main", "index": 0}]]},
        "Upsert Contacto": {"main": [[{"node": "Crear Cita GHL", "type": "main", "index": 0}]]},
        "Crear Cita GHL": {"main": [[{"node": "Formatear Respuesta", "type": "main", "index": 0}]]},
    },
    "settings": {"executionOrder": "v1"}
}

id_crear = create_workflow(wf_crear)
print(f"  OK -> {id_crear}")
time.sleep(1)

# ════════════════════════════════════════════════════════════════════════════
# SUBWORKFLOW 3 — Cancelar Cita
# ════════════════════════════════════════════════════════════════════════════
print("Creando: VELIK - Cancelar Cita...")

code_cancelar = r"""
let q = $json.query || {};
if (typeof q === 'string') { try { q = JSON.parse(q); } catch(e) {} }
const apptId = q.appointment_id || q.cita_id || String(q);
if (!apptId || apptId === '[object Object]') {
  return [{ json: { response: 'Necesito el ID de la cita para cancelarla. ¿Me puedes indicar cuál es?' } }];
}
return [{ json: { appointment_id: apptId } }];
"""

code_cancel_result = r"""
const status = $json.status || $json.message || 'cancelada';
return [{ json: { response: '✅ Tu cita ha sido cancelada exitosamente. ¡Quedamos atentas para cuando quieras reagendar! 🌸' } }];
"""

wf_cancelar = {
    "name": "VELIK - Cancelar Cita",
    "nodes": [
        node("trig3", "Trigger", "n8n-nodes-base.executeWorkflowTrigger",
             {"inputSource": "passthrough"}, [0, 0], 1.1),
        node("code5", "Parsear ID", "n8n-nodes-base.code",
             {"jsCode": code_cancelar}, [220, 0], 2),
        node("http4", "Cancelar en GHL", "n8n-nodes-base.httpRequest", {
            "method": "DELETE",
            "url": "=https://services.leadconnectorhq.com/calendars/events/appointments/{{ $json.appointment_id }}",
            "sendHeaders": True,
            "headerParameters": {"parameters": [
                {"name": "Authorization", "value": f"Bearer {GHL_KEY}"},
                {"name": "Version", "value": "2021-04-15"}
            ]},
            "options": {}
        }, [460, 0], 4.2),
        node("code6", "Respuesta Cancel", "n8n-nodes-base.code",
             {"jsCode": code_cancel_result}, [700, 0], 2),
    ],
    "connections": {
        "Trigger": {"main": [[{"node": "Parsear ID", "type": "main", "index": 0}]]},
        "Parsear ID": {"main": [[{"node": "Cancelar en GHL", "type": "main", "index": 0}]]},
        "Cancelar en GHL": {"main": [[{"node": "Respuesta Cancel", "type": "main", "index": 0}]]},
    },
    "settings": {"executionOrder": "v1"}
}

id_cancelar = create_workflow(wf_cancelar)
print(f"  OK -> {id_cancelar}")
time.sleep(1)

# ════════════════════════════════════════════════════════════════════════════
# ACTUALIZAR MAIN WORKFLOW — agregar tools al agente
# ════════════════════════════════════════════════════════════════════════════
print(f"\nActualizando workflow principal ({MAIN_WORKFLOW_ID})...")

r = requests.get(f"{N8N_URL}/api/v1/workflows/{MAIN_WORKFLOW_ID}", headers=headers)
main_wf = r.json()
nodes_list = main_wf["nodes"]
connections = main_wf["connections"]

# Find agent node ID
agent_id = None
for n in nodes_list:
    if n.get("name") == "PROMPT ACTUALIZADO":
        agent_id = n["id"]
        # Update system prompt — replace AgendaPro link section
        old_prompt = n["parameters"]["options"].get("systemMessage", "")
        new_booking_section = """
## Herramientas de Agendamiento (USAR SIEMPRE)

Tienes acceso a 3 herramientas conectadas. DEBES usarlas en lugar del enlace de AgendaPro:

1. **verificar_disponibilidad** — Llama cuando el cliente pregunte por horarios, disponibilidad,
   o quiera agendar. Pasa: { "servicio": "nombre exacto del servicio", "fecha": "YYYY-MM-DD" }

2. **crear_cita** — Llama cuando el cliente haya elegido horario y quiera confirmar.
   Pasa: { "servicio": "...", "slot_time": "ISO del slot elegido", "cliente_nombre": "...",
   "cliente_telefono": "+57XXXXXXXXXX" }

3. **cancelar_cita** — Llama cuando el cliente quiera cancelar.
   Pasa: { "appointment_id": "ID de la cita" }

REGLAS DE AGENDAMIENTO:
- Horario de atención: lunes a sábado 9:00 AM – 7:00 PM. Domingo CERRADO.
- Cuando el cliente quiera agendar: primero llama verificar_disponibilidad con el servicio y fecha.
- Muestra los horarios disponibles de forma amable (máximo 5-6 opciones).
- Cuando el cliente elija horario: pide nombre completo y teléfono si no los tienes.
- Llama crear_cita con los datos completos → muestra la confirmación que devuelve la herramienta.
- NO envíes el enlace de AgendaPro. Las citas se crean directamente en nuestro sistema.
- El teléfono debe incluir código de país (+57 para Colombia).
"""
        # Replace AgendaPro booking section
        updated_prompt = old_prompt.replace(
            "https://velik.site.agendapro.com/co/sucursal/297109",
            "[SISTEMA INTERNO DE AGENDAMIENTO — ver instrucciones de herramientas arriba]"
        )
        # Add booking tools section before ## Información para Abonos
        if "## Información para Abonos" in updated_prompt:
            updated_prompt = updated_prompt.replace(
                "## Información para Abonos",
                new_booking_section + "\n## Información para Abonos"
            )
        elif "## Reglas de Agendamiento" in updated_prompt:
            updated_prompt = updated_prompt.replace(
                "## Reglas de Agendamiento",
                new_booking_section + "\n## Reglas de Agendamiento"
            )
        else:
            updated_prompt = new_booking_section + "\n" + updated_prompt

        n["parameters"]["options"]["systemMessage"] = updated_prompt
        print(f"  Agente encontrado: {agent_id}")
        break

if not agent_id:
    print("  ERROR: No se encontró el nodo PROMPT ACTUALIZADO")
    exit(1)

# Add 3 toolWorkflow nodes
tool_nodes = [
    {
        "id": "tool_verificar",
        "name": "verificar_disponibilidad",
        "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
        "typeVersion": 2,
        "position": [2200, 800],
        "parameters": {
            "name": "verificar_disponibilidad",
            "description": "Verifica horarios disponibles para un servicio de Velik. Úsala cuando el cliente pregunte por disponibilidad u horarios. Input: JSON con 'servicio' (nombre del servicio) y 'fecha' (YYYY-MM-DD).",
            "workflowId": {"__rl": True, "value": id_verificar, "mode": "list"},
            "workflowInputs": {"mappingMode": "passthrough", "value": {}},
            "schemaType": "fromFields",
            "inputSource": "passthrough"
        }
    },
    {
        "id": "tool_crear",
        "name": "crear_cita",
        "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
        "typeVersion": 2,
        "position": [2400, 800],
        "parameters": {
            "name": "crear_cita",
            "description": "Crea una cita en GHL para Velik. Úsala cuando el cliente haya elegido horario y quiera confirmar. Input: JSON con 'servicio', 'slot_time' (ISO datetime del slot), 'cliente_nombre' y 'cliente_telefono' (+57XXXXXXXXXX).",
            "workflowId": {"__rl": True, "value": id_crear, "mode": "list"},
            "workflowInputs": {"mappingMode": "passthrough", "value": {}},
            "schemaType": "fromFields",
            "inputSource": "passthrough"
        }
    },
    {
        "id": "tool_cancelar",
        "name": "cancelar_cita",
        "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
        "typeVersion": 2,
        "position": [2600, 800],
        "parameters": {
            "name": "cancelar_cita",
            "description": "Cancela una cita en GHL de Velik. Úsala cuando el cliente quiera cancelar su cita. Input: JSON con 'appointment_id' (el ID de la cita a cancelar).",
            "workflowId": {"__rl": True, "value": id_cancelar, "mode": "list"},
            "workflowInputs": {"mappingMode": "passthrough", "value": {}},
            "schemaType": "fromFields",
            "inputSource": "passthrough"
        }
    }
]

nodes_list.extend(tool_nodes)

# Connect tools to agent as ai_tool
for tool in tool_nodes:
    tname = tool["name"]
    if tname not in connections:
        connections[tname] = {}
    connections[tname]["ai_tool"] = [[{"node": "PROMPT ACTUALIZADO", "type": "ai_tool", "index": 0}]]

main_wf["nodes"] = nodes_list
main_wf["connections"] = connections

# Remove fields that cause 400 errors on PUT
for field in ["id", "createdAt", "updatedAt", "versionId", "meta", "tags"]:
    main_wf.pop(field, None)

r2 = requests.put(f"{N8N_URL}/api/v1/workflows/{MAIN_WORKFLOW_ID}",
                  headers=headers, json=main_wf)

if r2.status_code in (200, 201):
    print(f"  Workflow principal actualizado correctamente!")
else:
    print(f"  ERROR {r2.status_code}: {r2.text[:300]}")

print(f"""
{'='*60}
RESUMEN
{'='*60}
  VELIK - Verificar Disponibilidad : {id_verificar}
  VELIK - Crear Cita               : {id_crear}
  VELIK - Cancelar Cita            : {id_cancelar}
  Workflow principal actualizado   : {MAIN_WORKFLOW_ID}
{'='*60}
""")
