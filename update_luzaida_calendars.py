import requests
import json
import time

API_KEY = "pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e"
LOCATION_ID = "0zeAaf3V1WrlkbyD4tJo"
CAROLINA_ID = "Bn1QrO4ITpYI7wSohG9r"
LAURA_ID = "DEeqUttYKgjjsfNaS1XY"
LUZAIDA_ID = "UzLj5T8ZOrJ8reSig5os"
BASE_URL = "https://services.leadconnectorhq.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Version": "2021-04-15"
}

with open("carolina_calendars.json", encoding="utf-8") as f:
    carolina = json.load(f)

with open("laura_new_calendars.json", encoding="utf-8") as f:
    laura_new = json.load(f)

# ID del nuevo calendario de Laura que Luz Aida tambien atiende
LAURA_MASAJE_ID = laura_new["CORPORAL"][0]["id"]  # Masaje relajacion piedras volcanicas + velas

# Servicios compartidos que Luz Aida atiende (ya existen en carolina_calendars.json)
LUZ_SHARED = {
    "MANICURE": [
        "Manos semipermanente", "Base rubber manos", "Baby boomer",
        "Recubrimiento Polygel/Acrilico", "Retoque de press on", "Retiro rubber/dipping",
        "Esmaltado tradicional manos", "Extension de sistemas o reparacion c/u en servicio",
        "Garantias", "Manos tradicional", "Retoque recubrimiento Poly/acrilico",
        "Retiro semipermanente manos", "Limpieza manos", "Solo limpieza manos",
        "Extension del sistema o reparacion c/u fuera del servicio", "Manos Evolution",
        "Unas Dip Powder + Esmaltado Semipermanente", "Retoque esculpidas en Polygel/acrilico",
        "Unas Press On", "Retiro Polygel/acrilico", "Esmaltado semipermanente manos",
        "Masaje relajante de manos", "Diseno",
    ],
    "PEDICURE": [
        "Pies semipermanente", "Pedicura tradicional + pedi spa", "Retiro semipermanente pies",
        "Pies Evolution", "Pedicura semi + pedi spa", "Tradicional pies",
    ],
    "MANICURA Y PEDICURA": [
        "Unas semipermanente (manos y pies)", "Manos semipermanentes y pies tradicional",
        "Manos Evolution y pies semipermanentes", "Unas esmaltado tradicional (manos y pies)",
        "Manos semipermanente y pies Evo", "Solo limpieza manos y pies",
        "Evolution (manos y pies)", "Manos tradicionales + pies semipermanente",
        "Retiro semipermanente manos y pies",
    ],
    "CABELLO": [
        "Alisado natural argan y coco (corto)", "Alisado natural argan y coco (medio)",
        "Terapia capilar de LOreal", "Cepillado cabello corto", "Cepillado cabello extralargo",
        "Toxina botulinica", "Alisado natural de argan y/o coco largo", "Ondas",
        "Cepillado cabello medio", "Alisado natural argan y/o coco (medio, altura del codo)",
        "Alisado natural de argan y/o coco extra largo", "Planchado de cabello",
        "Cepillado cabello largo", "Corte de puntas",
    ],
    "CEJAS Y PESTANAS": [
        "Depilacion de cejas con cera", "Depilacion perfilado/cuchilla cejas",
        "Lifting de pestanas", "Laminado de cejas y lifting de pestanas",
        "Depilacion de cejas con henna", "Laminado de cejas",
    ],
    "DEPILACION": [
        "Depilacion media pierna", "Depilacion nariz", "Depilacion espalda baja",
        "Depilacion de gluteos", "Depilacion pierna completa", "Depilacion orejas",
        "Depilacion de pubis completo", "Depilacion bigote", "Depilacion de axilas",
        "Depilacion linea del bikini",
    ],
}

# Servicios NUEVOS que solo Luz Aida atiende
LUZ_NEW = {
    "CEJAS Y PESTANAS": [
        ("Extension de pestanas pelo a pelo (efecto clasica)", 70, 160000),
        ("Extension de pestanas pelo a pelo (efecto hibrido)", 90, 180000),
        ("Extension de pestanas pelo a pelo (efecto tecnologico)", 90, 200000),
        ("Retoque pestanas", 60, 80000),
    ],
    "MAQUILLAJE PROFESIONAL": [
        ("Maquillaje social", 60, 170000),
        ("Maquillaje blindado", 60, 200000),
        ("Maquillaje halloween", 60, 230000),
    ],
    "CORPORAL": [
        ("Drenaje linfatico", 60, 100000),
        ("Paquete 1 masaje reductor", 45, 450000),
        ("Paquete 2 masaje reductor", 45, 650000),
        ("Paquete 3 masaje reductor", 45, 850000),
        ("Reestructuracion de estrias", 40, 400000),
        ("Camuflaje de estrias", 120, 1600000),
    ],
    "COSMETOLOGIA FACIAL": [
        ("Limpieza Facial Especial", 90, 150000),
        ("Limpieza Facial Tradicional", 60, 100000),
    ],
}

updated_ok = 0
updated_fail = 0
created_ok = 0

# --- PASO 1: Agregar Luz Aida a calendarios compartidos (Carolina + Laura + Luz) ---
print("=" * 60)
print("  PASO 1: Agregando Luz Aida a calendarios compartidos")
print("=" * 60)

def update_calendar(cal_id, name, members):
    payload = {"teamMembers": members}
    resp = requests.put(f"{BASE_URL}/calendars/{cal_id}", headers=headers, json=payload)
    return resp.status_code in (200, 201), resp

for category, names in LUZ_SHARED.items():
    cal_map = {s["name"]: s for s in carolina.get(category, [])}
    for name in names:
        if name not in cal_map:
            print(f"  SKIP {name}")
            continue
        cal_id = cal_map[name]["id"]
        # Estos calendarios ya tienen Carolina y Laura, agregamos Luz Aida
        members = [
            {"userId": CAROLINA_ID, "priority": 0.5, "meetingLocationType": "custom"},
            {"userId": LAURA_ID, "priority": 0.5, "meetingLocationType": "custom"},
            {"userId": LUZAIDA_ID, "priority": 0.5, "meetingLocationType": "custom"},
        ]
        ok, resp = update_calendar(cal_id, name, members)
        if ok:
            print(f"  OK  {name[:55]}")
            updated_ok += 1
        else:
            print(f"  FAIL {name[:55]} -> {resp.text[:60]}")
            updated_fail += 1
        time.sleep(0.3)

# Agregar Luz Aida al calendario "Masaje relajacion piedras volcanicas + velas" de Laura
print(f"\n  Agregando Luz Aida a: Masaje relajacion piedras volcanicas + velas")
members = [
    {"userId": LAURA_ID, "priority": 0.5, "meetingLocationType": "custom"},
    {"userId": LUZAIDA_ID, "priority": 0.5, "meetingLocationType": "custom"},
]
ok, resp = update_calendar(LAURA_MASAJE_ID, "Masaje relajacion piedras...", members)
if ok:
    print(f"  OK  Masaje relajacion piedras volcanicas + velas")
    updated_ok += 1
else:
    print(f"  FAIL -> {resp.text[:60]}")
    updated_fail += 1

# --- PASO 2: Crear calendarios nuevos de Luz Aida ---
print(f"\n{'='*60}")
print("  PASO 2: Creando calendarios exclusivos de Luz Aida")
print("=" * 60)

luz_new_calendars = {}

for category, services in LUZ_NEW.items():
    luz_new_calendars[category] = []
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
                {"userId": LUZAIDA_ID, "priority": 1, "meetingLocationType": "custom"}
            ]
        }
        resp = requests.post(f"{BASE_URL}/calendars/", headers=headers, json=payload)
        if resp.status_code in (200, 201):
            cal_id = resp.json().get("calendar", {}).get("id", "")
            luz_new_calendars[category].append({"name": name, "id": cal_id, "duration": duration, "price": price})
            print(f"  OK  {name[:50]} ({duration}min) -> {cal_id}")
            created_ok += 1
        else:
            print(f"  FAIL {name} -> {resp.text[:80]}")
        time.sleep(0.3)

print(f"\n{'='*60}")
print(f"  Actualizados: {updated_ok}  |  Fallidos: {updated_fail}  |  Creados: {created_ok}")
print("=" * 60)

with open("luzaida_new_calendars.json", "w", encoding="utf-8") as f:
    json.dump(luz_new_calendars, f, ensure_ascii=False, indent=2)
print("\nNuevos IDs de Luz Aida guardados en luzaida_new_calendars.json")
