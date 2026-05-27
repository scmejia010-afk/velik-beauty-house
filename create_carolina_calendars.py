import requests
import json
import time
import re

API_KEY = "pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e"
LOCATION_ID = "0zeAaf3V1WrlkbyD4tJo"
CAROLINA_ID = "Bn1QrO4ITpYI7wSohG9r"
BASE_URL = "https://services.leadconnectorhq.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Version": "2021-04-15"
}

# Lunes(1) a Sabado(6): 9AM - 7PM | Domingo: no disponible
OPEN_HOURS = [
    {
        "daysOfTheWeek": [1, 2, 3, 4, 5, 6],
        "hours": [{"openHour": 9, "openMinute": 0, "closeHour": 19, "closeMinute": 0}]
    }
]

# Carolina Paz — todos sus servicios por categoria
# (nombre, duracion_mins, precio_cop)
SERVICES = {
    "MANICURE": [
        ("Manos semipermanente", 60, 60000),
        ("Base rubber manos", 60, 85000),
        ("Baby boomer", 170, 160000),
        ("Recubrimiento Polygel/Acrilico", 150, 100000),
        ("Retoque de press on", 80, 85000),
        ("Retiro rubber/dipping", 20, 20000),
        ("Esmaltado tradicional manos", 30, 25000),
        ("Extension de sistemas o reparacion c/u en servicio", 15, 10000),
        ("Garantias", 30, 0),
        ("Manos tradicional", 45, 35000),
        ("Builder Gel", 120, 85000),
        ("Unas esculpidas Polygel/Acrilico", 150, 140000),
        ("Retoque recubrimiento Poly/acrilico", 100, 90000),
        ("Retiro semipermanente manos", 15, 15000),
        ("Limpieza manos", 30, 25000),
        ("Solo limpieza manos", 30, 25000),
        ("Extension del sistema o reparacion c/u fuera del servicio", 10, 15000),
        ("Manos Evolution", 45, 40000),
        ("Unas Dip Powder + Esmaltado Semipermanente", 70, 85000),
        ("Retoque esculpidas en Polygel/acrilico", 110, 100000),
        ("Unas Press On", 90, 100000),
        ("Retiro Polygel/acrilico", 30, 25000),
        ("Esmaltado semipermanente manos", 20, 40000),
        ("Masaje relajante de manos", 7, 25000),
        ("Diseno", 10, 0),
    ],
    "PEDICURE": [
        ("Pies semipermanente", 60, 60000),
        ("Pedicura tradicional + pedi spa", 60, 85000),
        ("Retiro semipermanente pies", 20, 15000),
        ("Pies Evolution", 40, 45000),
        ("Pedicura semi + pedi spa", 70, 105000),
        ("Tradicional pies", 45, 40000),
        ("Solo limpieza pies", 30, 30000),
    ],
    "MANICURA Y PEDICURA": [
        ("Unas semipermanente (manos y pies)", 90, 120000),
        ("Manos semipermanentes y pies tradicional", 120, 100000),
        ("Manos Evolution y pies semipermanentes", 100, 100000),
        ("Unas esmaltado tradicional (manos y pies)", 100, 75000),
        ("Manos semipermanente y pies Evo", 120, 105000),
        ("Solo limpieza manos y pies", 60, 50000),
        ("Evolution (manos y pies)", 80, 85000),
        ("Manos tradicionales + pies semipermanente", 120, 95000),
        ("Retiro semipermanente manos y pies", 30, 30000),
    ],
    "CABELLO": [
        ("Alisado natural argan y coco (corto)", 300, 250000),
        ("Alisado natural argan y coco (medio)", 300, 290000),
        ("Terapia capilar de LOreal", 20, 120000),
        ("Cepillado cabello corto", 30, 50000),
        ("Cepillado cabello extralargo", 60, 120000),
        ("Color cabello largo", 90, 290000),
        ("Corte caballero", 30, 50000),
        ("Toxina botulinica", 20, 0),
        ("Alisado natural de argan y/o coco largo", 300, 400000),
        ("Ondas", 45, 70000),
        ("Cepillado cabello medio", 40, 70000),
        ("Color cabello corto", 60, 150000),
        ("Color cabello extra largo", 90, 360000),
        ("Corte en capas", 35, 70000),
        ("Alisado natural argan y/o coco (medio, altura del codo)", 300, 380000),
        ("Alisado natural de argan y/o coco extra largo", 300, 430000),
        ("Planchado de cabello", 40, 50000),
        ("Cepillado cabello largo", 45, 90000),
        ("Color cabello medio", 60, 220000),
        ("Corte de puntas", 30, 45000),
    ],
    "CEJAS Y PESTANAS": [
        ("Depilacion de cejas con cera", 10, 25000),
        ("Depilacion perfilado/cuchilla cejas", 25, 20000),
        ("Lifting de pestanas", 60, 120000),
        ("Depilacion de cejas con hilo", 15, 30000),
        ("Laminado de cejas y lifting de pestanas", 70, 200000),
        ("Depilacion de cejas con henna", 10, 55000),
        ("Laminado de cejas", 50, 100000),
    ],
    "DEPILACION": [
        ("Depilacion rostro completo con hilo", 30, 100000),
        ("Depilacion media pierna", 60, 50000),
        ("Depilacion nariz", 20, 20000),
        ("Depilacion espalda baja", 60, 50000),
        ("Depilacion de gluteos", 20, 35000),
        ("Depilacion bigote con hilo", 10, 25000),
        ("Depilacion pierna completa", 90, 100000),
        ("Depilacion orejas", 20, 20000),
        ("Depilacion de pubis completo", 60, 80000),
        ("Depilacion barbilla con hilo", 10, 20000),
        ("Depilacion bigote", 10, 20000),
        ("Depilacion de axilas", 18, 35000),
        ("Depilacion linea del bikini", 45, 45000),
    ],
    "MAQUILLAJE PROFESIONAL": [
        ("Pestanas punto a punto", 45, 50000),
    ],
    "CORPORAL": [
        ("Bano de novia brazos", 15, 30000),
    ],
}

def slugify(text):
    text = text.lower()
    text = re.sub(r'[aeiou]', lambda m: m.group(), text)
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s/]+', '-', text.strip())
    return text[:50]

created = {}
total_ok = 0
total_fail = 0

for category, service_list in SERVICES.items():
    print(f"\n{'='*55}")
    print(f"  {category} — {len(service_list)} servicios")
    print('='*55)
    created[category] = []

    for name, duration, price in service_list:
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
                {
                    "userId": CAROLINA_ID,
                    "priority": 1,
                    "meetingLocationType": "custom"
                }
            ]
        }

        resp = requests.post(f"{BASE_URL}/calendars/", headers=headers, json=payload)

        if resp.status_code in (200, 201):
            cal = resp.json().get("calendar", {})
            cal_id = cal.get("id", "")
            created[category].append({
                "name": name,
                "id": cal_id,
                "duration": duration,
                "price": price
            })
            print(f"  OK {name[:45]:<45} {duration:>3}min  -> {cal_id}")
            total_ok += 1
        else:
            err = resp.json().get("message", resp.text)[:80]
            print(f"  FAIL {name[:45]:<45} -> {err}")
            total_fail += 1

        time.sleep(0.35)

print(f"\n{'='*55}")
print(f"  TOTAL CREADOS: {total_ok}  |  FALLIDOS: {total_fail}")
print('='*55)

with open("carolina_calendars.json", "w", encoding="utf-8") as f:
    json.dump(created, f, ensure_ascii=False, indent=2)

print("\nIDs guardados en carolina_calendars.json")
