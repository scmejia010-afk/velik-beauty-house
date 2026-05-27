import requests, json, uuid

N8N_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8"
N8N_URL = "https://santiagon8nmejia.dominadoresia.com"
GHL_KEY = "pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e"
GHL_LOCATION = "0zeAaf3V1WrlkbyD4tJo"
FIELD_ID = "jQADlVYn9FI6suN1uJEQ"   # RespuestaIA custom field

id_verificar = "XAoMeVFKqLw7KcFX"
id_crear     = "3UMIZGQy4HCmBN6v"
id_cancelar  = "XFoYOSSdcDleyVMK"

OPENAI_CRED = {"openAiApi": {"id": "3U3vHJuMvh7XLZ1c", "name": "OpenAi account"}}
REDIS_CRED  = {"redis":     {"id": "4jNooyY9Iu3jAA1n", "name": "Redis account"}}
PG_CRED     = {"postgres":  {"id": "z7OkbMzEuoiqZwrO", "name": "Postgres account"}}

headers = {"X-N8N-API-KEY": N8N_KEY, "Content-Type": "application/json"}

def nid():
    return str(uuid.uuid4())

# ── System prompt ──────────────────────────────────────────────────────────────
SYSTEM_PROMPT = """## Identidad

Nombre: Eli

Descripcion: Velik Beauty House es un lugar donde los clientes encuentran todo para cuidarse en un solo lugar. Ofrece spa de unas, tratamientos faciales y corporales, depilacion y servicios de peluqueria como alisados naturales de coco y argan, tintura, corte y cepillado. Es una experiencia de bienestar disenada para consentir al cliente.

Tono: Extremadamente amable, calido, femenino, educado y muy servicial. Utilizas un lenguaje cercano y dulce sin perder el profesionalismo. Te enfocas en que la clienta se sienta tranquila y feliz.

Frases clave: "Hola que gustito saludarte!", "Claro que si, hermosa/hermoso", "Dejame saber", "Vale", "La intencion es que quedes muy contenta", "Con muchisimo gusto", "Quedamos muy atentas".

---

## Herramientas de Agendamiento

Tienes 3 herramientas activas. DEBES usarlas para gestionar citas - NO uses ningun enlace externo:

**verificar_disponibilidad**: cuando el cliente pregunte por horarios o quiera agendar.
  Input: {"servicio": "nombre del servicio", "fecha": "YYYY-MM-DD"}

**crear_cita**: cuando el cliente haya elegido un horario y quiera confirmar.
  Input: {"servicio": "...", "slot_time": "ISO datetime del slot", "cliente_nombre": "Nombre Apellido", "cliente_telefono": "+57XXXXXXXXXX"}

**cancelar_cita**: cuando el cliente quiera cancelar.
  Input: {"appointment_id": "ID de la cita"}

REGLAS DE AGENDAMIENTO:
- Horario Velik: lunes a sabado 9AM-7PM. DOMINGO CERRADO.
- Flujo: verificar_disponibilidad -> mostrar max 5-6 opciones -> cliente elige -> pedir nombre+telefono si no los tienes -> crear_cita -> mostrar confirmacion.
- El telefono SIEMPRE con codigo pais +57 para Colombia.

---

## Instrucciones Generales

1. El nombre del cliente puede llegar al inicio del mensaje como "Nombre del cliente: [nombre]". Usalo directamente si es un nombre real. Si no llega, preguntalo amablemente.

2. Mensaje de bienvenida cuando no hay nombre: "Hola! Que gustito saludarte, bienvenid@ a Velik Beauty House Pueden brindarme su nombre?"

3. NUNCA escribas "[nombre]" como texto literal.

4. Ubicacion: Dg 75 #74-05, Laureles, Medellin.

5. Responde siempre en espanol con emojis suaves y tono femenino calido.

6. Usa la hora actual para el saludo: 05:00-11:59 buenos dias, 12:00-17:59 buenas tardes, 18:00-04:59 buenas noches."""

# ── JavaScript code strings ────────────────────────────────────────────────────
CODE_HORA = r"""
const now = new Date();
const opts = { timeZone: 'America/Bogota', hour: '2-digit', minute: '2-digit', hour12: false };
const hora = now.toLocaleTimeString('es-CO', opts);
return [{ json: { hora_actual: hora } }];
""".strip()

CODE_PREP = r"""
const msgs = $('Redis1').item.json.mensajes;
const hora = $('Hora Colombia').item.json.hora_actual;
const body = $('Webhook').item.json.body || {};
const contactName = body.contact_name || body.full_name || body.name || '';

let texto = '';
if (Array.isArray(msgs)) {
  texto = msgs.map(m => {
    try { const p = JSON.parse(m); return p.content || m; } catch(e) { return m; }
  }).filter(Boolean).join(' ');
} else {
  texto = String(msgs || body.message?.body || body.message?.text || '');
}

const prefix = contactName ? 'Nombre del cliente: ' + contactName + '\n' : '';
const horaStr = 'Hora actual en Colombia: ' + hora + '\n';
return [{ json: { mensaje_completo: horaStr + prefix + texto } }];
""".strip()

CODE_SPLIT = r"""
const output = $('AI Agent').first().json.output || '';
const clean = output.replace(/\\n/g, '\n').trim();

function splitBlocks(text, maxLen) {
  const paras = text.split(/\n{2,}/);
  const parts = [];
  let cur = '';
  for (const p of paras) {
    const candidate = cur ? cur + '\n\n' + p : p;
    if (candidate.length > maxLen && cur) {
      parts.push(cur.trim());
      cur = p;
    } else {
      cur = candidate;
    }
  }
  if (cur.trim()) parts.push(cur.trim());
  return parts;
}

const blocks = splitBlocks(clean, 1500);
return [{ json: {
  parte_1: blocks[0] || '',
  parte_2: blocks[1] || '',
  parte_3: blocks[2] || ''
} }];
""".strip()

# ── Node builders ──────────────────────────────────────────────────────────────
nodes = []
connections = {}

def add(n):
    nodes.append(n)

def connect(src, dst, si=0, di=0, t="main"):
    if src not in connections:
        connections[src] = {}
    if t not in connections[src]:
        connections[src][t] = []
    while len(connections[src][t]) <= si:
        connections[src][t].append([])
    connections[src][t][si].append({"node": dst, "type": t, "index": di})

# ── Nodes ──────────────────────────────────────────────────────────────────────
WH      = "Webhook"
IDC     = "Obtener ID Chat"
HORA    = "Hora Colombia"
RPUSH   = "Redis Push"
WAIT1   = "Wait 20s"
RGET    = "Redis1"
IF_DD   = "If Dedup"
NOOP    = "Ignorar"
RDEL    = "Redis Delete"
CPREP   = "Preparar Mensaje"
AGENT   = "AI Agent"
LLM     = "OpenAI Chat Model"
MEM     = "Postgres Chat Memory"
SPLIT   = "Split Respuesta"
IF1     = "If Parte 1"
HTTP1   = "Enviar Respuesta 1"
WAITA   = "Wait A"
IF2     = "If Parte 2"
HTTP2   = "Enviar Respuesta 2"
WAITB   = "Wait B"
IF3     = "If Parte 3"
HTTP3   = "Enviar Respuesta 3"
TOOL_V  = "verificar_disponibilidad"
TOOL_C  = "crear_cita"
TOOL_X  = "cancelar_cita"

GHL_HEADERS = {
    "parameters": [
        {"name": "Authorization", "value": f"Bearer {GHL_KEY}"},
        {"name": "Version",       "value": "2021-04-15"},
        {"name": "Content-Type",  "value": "application/json"}
    ]
}

def http_update_field(parte_node):
    return {
        "method": "PUT",
        "url": "={{ 'https://services.leadconnectorhq.com/contacts/' + $('Webhook').item.json.body.contact_id }}",
        "sendHeaders": True,
        "headerParameters": GHL_HEADERS,
        "sendBody": True,
        "specifyBody": "json",
        "jsonBody": "={{ JSON.stringify({ customFields: [{ id: '" + FIELD_ID + "', field_value: $('" + parte_node + "').item.json." + parte_node.split()[-1].lower().replace(" ","_") + " }] }) }}",
        "options": {}
    }

# Build jsonBody per-part referencing Split Respuesta
def http_body(part_key):
    return (
        "={ \"customFields\": [{ \"id\": \"" + FIELD_ID + "\", "
        "\"field_value\": \"{{ $('Split Respuesta').item.json." + part_key + " }}\" }] }"
    )

add({"id": nid(), "name": WH,    "type": "n8n-nodes-base.webhook",
     "typeVersion": 2, "position": [0, 300],
     "parameters": {"httpMethod": "POST", "path": "velik-ghl", "options": {}}})

add({"id": nid(), "name": IDC,   "type": "n8n-nodes-base.set",
     "typeVersion": 3.4, "position": [220, 300],
     "parameters": {"assignments": {"assignments": [
         {"id": nid(), "name": "message.chat.id",
          "value": "={{ $json.body.contact_id }}", "type": "string"}
     ]}, "options": {}}})

add({"id": nid(), "name": HORA,  "type": "n8n-nodes-base.code",
     "typeVersion": 2, "position": [440, 300],
     "parameters": {"jsCode": CODE_HORA}})

add({"id": nid(), "name": RPUSH, "type": "n8n-nodes-base.redis",
     "typeVersion": 1, "position": [660, 300], "credentials": REDIS_CRED,
     "parameters": {
         "operation": "push",
         "list": "={{ $('Obtener ID Chat').item.json['message']['chat']['id'] }}",
         "messageData": "={{ JSON.stringify({ type: $('Webhook').item.json.body.message?.type || 'text', content: $('Webhook').item.json.body.message?.body || $('Webhook').item.json.body.message?.text || '', timestamp: Date.now() }) }}"
     }})

add({"id": nid(), "name": WAIT1, "type": "n8n-nodes-base.wait",
     "typeVersion": 1.1, "position": [880, 300], "webhookId": nid(),
     "parameters": {"amount": 20, "unit": "seconds"}})

add({"id": nid(), "name": RGET,  "type": "n8n-nodes-base.redis",
     "typeVersion": 1, "position": [1100, 300], "credentials": REDIS_CRED,
     "parameters": {
         "operation": "get", "propertyName": "mensajes",
         "key": "={{ $('Obtener ID Chat').item.json['message']['chat']['id'] }}",
         "options": {}
     }})

add({"id": nid(), "name": IF_DD, "type": "n8n-nodes-base.if",
     "typeVersion": 2.2, "position": [1320, 300],
     "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
         "conditions": [{"id": nid(),
             "leftValue": "={{ $json.mensajes.last() }}",
             "rightValue": "={{ $('Webhook').item.json.body.message?.body || '' }}",
             "operator": {"type": "string", "operation": "equals"}}],
         "combinator": "and"}, "options": {}}})

add({"id": nid(), "name": NOOP,  "type": "n8n-nodes-base.noOp",
     "typeVersion": 1, "position": [1540, 500], "parameters": {}})

add({"id": nid(), "name": RDEL,  "type": "n8n-nodes-base.redis",
     "typeVersion": 1, "position": [1540, 300], "credentials": REDIS_CRED,
     "parameters": {"operation": "delete",
                    "key": "={{ $('Obtener ID Chat').item.json['message']['chat']['id'] }}"}})

add({"id": nid(), "name": CPREP, "type": "n8n-nodes-base.code",
     "typeVersion": 2, "position": [1760, 300],
     "parameters": {"jsCode": CODE_PREP}})

add({"id": nid(), "name": AGENT, "type": "@n8n/n8n-nodes-langchain.agent",
     "typeVersion": 1.8, "position": [1980, 300],
     "parameters": {
         "text": "={{ $('Preparar Mensaje').item.json.mensaje_completo }}",
         "options": {"systemMessage": SYSTEM_PROMPT}
     }})

add({"id": nid(), "name": LLM,   "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
     "typeVersion": 1.2, "position": [1760, 520], "credentials": OPENAI_CRED,
     "parameters": {"model": {"__rl": True, "value": "gpt-4o-mini", "mode": "list"}, "options": {}}})

add({"id": nid(), "name": MEM,   "type": "@n8n/n8n-nodes-langchain.memoryPostgresChat",
     "typeVersion": 1.3, "position": [1980, 520], "credentials": PG_CRED,
     "parameters": {
         "sessionIdType": "customKey",
         "sessionKey": "={{ $('Obtener ID Chat').item.json['message']['chat']['id'] }}",
         "tableName": "velik_beauty_ia",
         "contextWindowLength": 15
     }})

add({"id": nid(), "name": SPLIT, "type": "n8n-nodes-base.code",
     "typeVersion": 2, "position": [2200, 300],
     "parameters": {"jsCode": CODE_SPLIT}})

add({"id": nid(), "name": IF1,   "type": "n8n-nodes-base.if",
     "typeVersion": 2.2, "position": [2420, 300],
     "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
         "conditions": [{"id": nid(), "leftValue": "={{ $json.parte_1 }}",
             "rightValue": "", "operator": {"type": "string", "operation": "notEmpty", "singleValue": True}}],
         "combinator": "and"}, "options": {}}})

add({"id": nid(), "name": HTTP1, "type": "n8n-nodes-base.httpRequest",
     "typeVersion": 4.2, "position": [2640, 200],
     "parameters": {
         "method": "PUT",
         "url": "={{ 'https://services.leadconnectorhq.com/contacts/' + $('Webhook').item.json.body.contact_id }}",
         "sendHeaders": True, "headerParameters": GHL_HEADERS,
         "sendBody": True, "specifyBody": "json",
         "jsonBody": http_body("parte_1"),
         "options": {}
     }})

add({"id": nid(), "name": WAITA, "type": "n8n-nodes-base.wait",
     "typeVersion": 1.1, "position": [2860, 200], "webhookId": nid(),
     "parameters": {"amount": 2, "unit": "seconds"}})

add({"id": nid(), "name": IF2,   "type": "n8n-nodes-base.if",
     "typeVersion": 2.2, "position": [3080, 200],
     "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
         "conditions": [{"id": nid(), "leftValue": "={{ $('Split Respuesta').item.json.parte_2 }}",
             "rightValue": "", "operator": {"type": "string", "operation": "notEmpty", "singleValue": True}}],
         "combinator": "and"}, "options": {}}})

add({"id": nid(), "name": HTTP2, "type": "n8n-nodes-base.httpRequest",
     "typeVersion": 4.2, "position": [3300, 100],
     "parameters": {
         "method": "PUT",
         "url": "={{ 'https://services.leadconnectorhq.com/contacts/' + $('Webhook').item.json.body.contact_id }}",
         "sendHeaders": True, "headerParameters": GHL_HEADERS,
         "sendBody": True, "specifyBody": "json",
         "jsonBody": http_body("parte_2"),
         "options": {}
     }})

add({"id": nid(), "name": WAITB, "type": "n8n-nodes-base.wait",
     "typeVersion": 1.1, "position": [3520, 100], "webhookId": nid(),
     "parameters": {"amount": 2, "unit": "seconds"}})

add({"id": nid(), "name": IF3,   "type": "n8n-nodes-base.if",
     "typeVersion": 2.2, "position": [3740, 100],
     "parameters": {"conditions": {"options": {"caseSensitive": True, "leftValue": "", "typeValidation": "strict", "version": 2},
         "conditions": [{"id": nid(), "leftValue": "={{ $('Split Respuesta').item.json.parte_3 }}",
             "rightValue": "", "operator": {"type": "string", "operation": "notEmpty", "singleValue": True}}],
         "combinator": "and"}, "options": {}}})

add({"id": nid(), "name": HTTP3, "type": "n8n-nodes-base.httpRequest",
     "typeVersion": 4.2, "position": [3960, 0],
     "parameters": {
         "method": "PUT",
         "url": "={{ 'https://services.leadconnectorhq.com/contacts/' + $('Webhook').item.json.body.contact_id }}",
         "sendHeaders": True, "headerParameters": GHL_HEADERS,
         "sendBody": True, "specifyBody": "json",
         "jsonBody": http_body("parte_3"),
         "options": {}
     }})

# Tools
add({"id": nid(), "name": TOOL_V, "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
     "typeVersion": 2, "position": [1760, 740],
     "parameters": {
         "name": "verificar_disponibilidad",
         "description": 'Verifica horarios disponibles para un servicio de Velik Beauty House. Usar cuando el cliente pregunte por disponibilidad. Input JSON: {"servicio": "nombre del servicio", "fecha": "YYYY-MM-DD"}',
         "workflowId": {"__rl": True, "value": id_verificar, "mode": "list"},
         "workflowInputs": {"mappingMode": "passthrough", "value": {}},
         "schemaType": "fromFields", "inputSource": "passthrough"
     }})

add({"id": nid(), "name": TOOL_C, "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
     "typeVersion": 2, "position": [1980, 740],
     "parameters": {
         "name": "crear_cita",
         "description": 'Crea una cita en GHL para Velik Beauty House. Usar cuando el cliente confirme horario. Input JSON: {"servicio":"...","slot_time":"ISO datetime","cliente_nombre":"Nombre Apellido","cliente_telefono":"+57..."}',
         "workflowId": {"__rl": True, "value": id_crear, "mode": "list"},
         "workflowInputs": {"mappingMode": "passthrough", "value": {}},
         "schemaType": "fromFields", "inputSource": "passthrough"
     }})

add({"id": nid(), "name": TOOL_X, "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
     "typeVersion": 2, "position": [2200, 740],
     "parameters": {
         "name": "cancelar_cita",
         "description": 'Cancela una cita de Velik Beauty House. Input JSON: {"appointment_id": "ID de la cita"}',
         "workflowId": {"__rl": True, "value": id_cancelar, "mode": "list"},
         "workflowInputs": {"mappingMode": "passthrough", "value": {}},
         "schemaType": "fromFields", "inputSource": "passthrough"
     }})

# ── Connections ────────────────────────────────────────────────────────────────
connect(WH,    IDC)
connect(IDC,   HORA)
connect(HORA,  RPUSH)
connect(RPUSH, WAIT1)
connect(WAIT1, RGET)
connect(RGET,  IF_DD)
connect(IF_DD, RDEL,  si=0)   # true  → process
connect(IF_DD, NOOP,  si=1)   # false → ignore
connect(RDEL,  CPREP)
connect(CPREP, AGENT)
connect(AGENT, SPLIT)
connect(SPLIT, IF1)
connect(IF1,   HTTP1, si=0)   # parte_1 exists
connect(IF1,   NOOP,  si=1)   # parte_1 empty
connect(HTTP1, WAITA)
connect(WAITA, IF2)
connect(IF2,   HTTP2, si=0)   # parte_2 exists
connect(HTTP2, WAITB)
connect(WAITB, IF3)
connect(IF3,   HTTP3, si=0)   # parte_3 exists

# AI sub-connections
connect(LLM,    AGENT, t="ai_languageModel")
connect(MEM,    AGENT, t="ai_memory")
connect(TOOL_V, AGENT, t="ai_tool")
connect(TOOL_C, AGENT, t="ai_tool")
connect(TOOL_X, AGENT, t="ai_tool")

# ── Create workflow ────────────────────────────────────────────────────────────
payload = {
    "name": "VELIK BEAUTY HOUSE - GHL",
    "nodes": nodes,
    "connections": connections,
    "settings": {"executionOrder": "v1"}
}

r = requests.post(f"{N8N_URL}/api/v1/workflows", headers=headers, json=payload)
print(f"Status: {r.status_code}")
if r.status_code in (200, 201):
    wid = r.json().get("id")
    print(f"Workflow creado: {wid}")
    r2 = requests.post(f"{N8N_URL}/api/v1/workflows/{wid}/activate", headers=headers)
    print(f"Activate: {r2.status_code} {r2.text[:100]}")
else:
    print(r.text[:800])
