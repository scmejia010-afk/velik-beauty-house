const https = require('https');
const N8N_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8';

console.log(`
Para configurar recordatorios automáticos en n8n:

1. CREAR NUEVO WORKFLOW: "VELIK - Recordatorios Automáticos"

2. NODO 1 - Webhook (Trigger):
   - URL: /webhook/ghl-cita-creada
   - Método: POST

3. NODO 2 - Code (Procesar cita):
   const INTERVALOS = {
     'MANICURA': 18,
     'PEDICURA': 18,
     'CABELLO': 30,
     'FACIAL': 45,
     'MASAJES': 30,
     'DEPILACION': 21,
     'CEJAS': 30,
     'PESTANAS': 28,
     'MAQUILLAJE': 30,
     'GARANTIAS': 14,
     'OTRO': 30
   };

   const body = $json;
   const categoria = body.categoria; // Viene de GHL description
   const fechaCita = new Date(body.appointmentStart);
   const diasIntervalo = INTERVALOS[categoria] || 30;

   // Calcular fecha de recordatorio
   const fechaRecordatorio = new Date(fechaCita);
   fechaRecordatorio.setDate(fechaRecordatorio.getDate() + diasIntervalo);

   return [{
     json: {
       cliente_nombre: body.clienteName,
       cliente_telefono: body.clientePhone,
       categoria: categoria,
       fecha_cita: fechaCita.toISOString(),
       fecha_recordatorio: fechaRecordatorio.toISOString(),
       dias_intervalo: diasIntervalo,
       timestamp_recordatorio: fechaRecordatorio.getTime()
     }
   }];

4. NODO 3 - Schedule (Delay hasta fecha recordatorio):
   - Trigger type: "At specific time"
   - Time: {{ $json.fecha_recordatorio }}

5. NODO 4 - Code (Generar mensaje):
   const msg = \`Hola \${$json.cliente_nombre}! 👋\n\nYa pasó un tiempo desde tu última cita de \${$json.categoria.toLowerCase()}. ¿Qué te parece volver a consentirte? 💅✨\n\nReserva ahora: https://link.msgsndr.com/widget/booking/0zeAaf3V1WrlkbyD4tJo\n\n- Velik Beauty House 🤍\`;

   return [{ json: { mensaje: msg, telefono: $json.cliente_telefono } }];

6. NODO 5 - HTTP Request (Enviar por WhatsApp - GHL):
   URL: https://services.leadconnectorhq.com/conversations/messages
   Method: POST
   Headers:
     Authorization: Bearer pit-022a5206-1196-4066-8957-50cf5634da09
     Version: 2021-04-15
   Body:
     {
       "contactId": {{ body.contactId }},
       "conversationProviderId": "WHATSAPP",
       "message": "{{ $json.mensaje }}"
     }

---

NOTA: El webhook se dispara desde GHL cuando se crea una cita.
Para conectar GHL → n8n, ve a GHL:
  Configuración → Webhooks → Nuevo
  Event: "Cita creada"
  URL: https://santiagon8nmejia.dominadoresia.com/webhook/ghl-cita-creada
  Fields to send: appointmentStart, clienteName, clientePhone, contactId, calendarDescription
`);
