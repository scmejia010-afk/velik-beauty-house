import requests, json

N8N_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkN2M4MDliMS0yYjkzLTQ5ZTAtOGIzOS0xYTAyZmI5YjQxYzQiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiYjhlYjE2OTUtMGU1MC00Zjk3LTg3YTctMTFkN2RmMDkxYzAzIiwiaWF0IjoxNzc5NTYwOTIzfQ.6lxRrJY8otM7ZOK14U66RJZXGsDU901nkqz6ZLODJV8"
N8N_URL = "https://santiagon8nmejia.dominadoresia.com"
headers = {"X-N8N-API-KEY": N8N_KEY, "Content-Type": "application/json"}

r = requests.get(f"{N8N_URL}/api/v1/workflows/XAoMeVFKqLw7KcFX", headers=headers)
wf = r.json()

NEW_PARSE = """
// Robust input parsing — handles string, object, or nested query
let raw = $json;
let q = raw.query !== undefined ? raw.query : raw;

if (typeof q === 'string') {
  try { q = JSON.parse(q); } catch(e) {}
}

let servicio = '';
let fecha = '';

if (typeof q === 'string') {
  servicio = q;
} else if (q && typeof q === 'object') {
  servicio = q.servicio || q.service || q.nombre || q.name || '';
  fecha = q.fecha || q.date || '';
  if (typeof servicio === 'object') {
    servicio = servicio.servicio || servicio.service || JSON.stringify(servicio);
  }
}

if (!servicio) {
  return [{ json: { error: 'No se pudo extraer el servicio. Input recibido: ' + JSON.stringify(raw) } }];
}

fecha = fecha || new Date().toISOString().split('T')[0];
"""

for n in wf["nodes"]:
    if n["name"] == "Buscar Calendario":
        old = n["parameters"]["jsCode"]
        # Replace the first parsing block
        old_block = (
            "let q = $json.query || {};\n"
            "if (typeof q === 'string') { try { q = JSON.parse(q); } catch(e) {} }\n"
            "const servicio = q.servicio || q.service || String(q);\n"
            "const fecha = q.fecha || new Date().toISOString().split('T')[0];"
        )
        n["parameters"]["jsCode"] = old.replace(old_block, NEW_PARSE.strip())
        print("Buscar Calendario actualizado")
        break

payload = {"name": wf["name"], "nodes": wf["nodes"], "connections": wf["connections"], "settings": wf.get("settings", {})}
r2 = requests.put(f"{N8N_URL}/api/v1/workflows/XAoMeVFKqLw7KcFX", headers=headers, json=payload)
print("Update:", r2.status_code)
