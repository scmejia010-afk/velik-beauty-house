import requests
import json
import time

API_KEY = "pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e"
LOCATION_ID = "0zeAaf3V1WrlkbyD4tJo"
CAROLINA_ID = "Bn1QrO4ITpYI7wSohG9r"
LAURA_ID = "DEeqUttYKgjjsfNaS1XY"
BASE_URL = "https://services.leadconnectorhq.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Version": "2021-04-15"
}

# Cargar calendarios de Carolina
with open("carolina_calendars.json", encoding="utf-8") as f:
    carolina = json.load(f)

# Servicios que Laura comparte con Carolina (por nombre exacto)
LAURA_SHARED = {
    "MANICURE": [
        "Manos semipermanente", "Base rubber manos", "Baby boomer",
        "Recubrimiento Polygel/Acrilico", "Retoque de press on", "Retiro rubber/dipping",
        "Esmaltado tradicional manos", "Extension de sistemas o reparacion c/u en servicio",
        "Garantias", "Manos tradicional", "Builder Gel", "Unas esculpidas Polygel/Acrilico",
        "Retoque recubrimiento Poly/acrilico", "Retiro semipermanente manos", "Limpieza manos",
        "Solo limpieza manos", "Extension del sistema o reparacion c/u fuera del servicio",
        "Manos Evolution", "Unas Dip Powder + Esmaltado Semipermanente",
        "Retoque esculpidas en Polygel/acrilico", "Unas Press On", "Retiro Polygel/acrilico",
        "Esmaltado semipermanente manos", "Masaje relajante de manos", "Diseno",
    ],
    "PEDICURE": [
        "Pies semipermanente", "Pedicura tradicional + pedi spa", "Retiro semipermanente pies",
        "Pies Evolution", "Pedicura semi + pedi spa", "Tradicional pies", "Solo limpieza pies",
    ],
    "MANICURA Y PEDICURA": [
        "Unas semipermanente (manos y pies)", "Manos semipermanentes y pies tradicional",
        "Manos Evolution y pies semipermanentes", "Unas esmaltado tradicional (manos y pies)",
        "Manos semipermanente y pies Evo", "Solo limpieza manos y pies",
        "Evolution (manos y pies)", "Manos tradicionales + pies semipermanente",
        "Retiro semipermanente manos y pies",
    ],
    "CABELLO": [
        "Toxina botulinica", "Cepillado cabello corto", "Cepillado cabello medio",
        "Cepillado cabello largo",
    ],
    "CEJAS Y PESTANAS": [
        "Depilacion de cejas con cera", "Depilacion perfilado/cuchilla cejas",
        "Laminado de cejas y lifting de pestanas", "Depilacion de cejas con henna",
    ],
    "DEPILACION": [
        "Depilacion media pierna", "Depilacion nariz", "Depilacion espalda baja",
        "Depilacion de gluteos", "Depilacion pierna completa", "Depilacion orejas",
        "Depilacion de pubis completo", "Depilacion bigote", "Depilacion de axilas",
        "Depilacion linea del bikini",
    ],
    "MAQUILLAJE PROFESIONAL": ["Pestanas punto a punto"],
    "CORPORAL": ["Bano de novia brazos"],
}

# Servicios NUEVOS que solo Laura tiene
LAURA_NEW = {
    "CORPORAL": [
        ("Masaje relajacion piedras volcanicas + velas", 60, 140000),
    ]
}

updated_ok = 0
updated_fail = 0
created_ok = 0

# --- PASO 1: Agregar Laura a calendarios compartidos ---
print("=" * 58)
print("  PASO 1: Agregando Laura a calendarios compartidos")
print("=" * 58)

for category, names in LAURA_SHARED.items():
    cal_map = {s["name"]: s for s in carolina.get(category, [])}
    for name in names:
        if name not in cal_map:
            print(f"  SKIP {name} (no encontrado en Carolina)")
            continue
        cal_id = cal_map[name]["id"]
        payload = {
            "teamMembers": [
                {"userId": CAROLINA_ID, "priority": 0.5, "meetingLocationType": "custom"},
                {"userId": LAURA_ID, "priority": 0.5, "meetingLocationType": "custom"},
            ]
        }
        resp = requests.put(f"{BASE_URL}/calendars/{cal_id}", headers=headers, json=payload)
        if resp.status_code in (200, 201):
            print(f"  OK  {name[:50]}")
            updated_ok += 1
        else:
            err = resp.json().get("message", resp.text)[:60]
            print(f"  FAIL {name[:50]} -> {err}")
            updated_fail += 1
        time.sleep(0.3)

# --- PASO 2: Crear calendarios nuevos de Laura ---
print(f"\n{'='*58}")
print("  PASO 2: Creando calendarios nuevos de Laura")
print("=" * 58)

laura_new_calendars = {}

for category, services in LAURA_NEW.items():
    laura_new_calendars[category] = []
    for name, duration, price in services:
        desc = f"${price:,} COP".replace(",", ".") if price > 0 else "Precio a consultar"
        payload = {
            "locationId": LOCATION_ID,
            "name": name,
            "description": desc,
            "slotDuration": duration,
            "slotDurationUnit": "mins",
            "slotInterval": duration,
            "slotIntervalUnit": "mins",
            "calendarType": "service_booking",
            "teamMembers": [
                {"userId": LAURA_ID, "priority": 1, "meetingLocationType": "custom"}
            ]
        }
        resp = requests.post(f"{BASE_URL}/calendars/", headers=headers, json=payload)
        if resp.status_code in (200, 201):
            cal_id = resp.json().get("calendar", {}).get("id", "")
            laura_new_calendars[category].append({"name": name, "id": cal_id, "duration": duration, "price": price})
            print(f"  OK  {name} ({duration}min) -> {cal_id}")
            created_ok += 1
        else:
            print(f"  FAIL {name} -> {resp.text[:80]}")
        time.sleep(0.3)

print(f"\n{'='*58}")
print(f"  Actualizados: {updated_ok}  |  Fallidos: {updated_fail}  |  Creados nuevos: {created_ok}")
print("=" * 58)

# Guardar nuevos calendarios de Laura
with open("laura_new_calendars.json", "w", encoding="utf-8") as f:
    json.dump(laura_new_calendars, f, ensure_ascii=False, indent=2)
print("\nNuevos IDs de Laura guardados en laura_new_calendars.json")
