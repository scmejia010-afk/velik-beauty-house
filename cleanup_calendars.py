import requests
import json
import time
import re

API_KEY = "pit-f7e40478-4e4d-4427-a5d6-7c2ccd453f8e"
LOCATION_ID = "0zeAaf3V1WrlkbyD4tJo"
BASE_URL = "https://services.leadconnectorhq.com"

headers = {
    "Authorization": f"Bearer {API_KEY}",
    "Content-Type": "application/json",
    "Version": "2021-04-15"
}

# ─── PASO 1: IDs a eliminar (duplicados + test + copy) ────────────────────────
TO_DELETE = [
    # Maquillaje social (duplicados)
    "1mVdASGJwZYj6ycghk1j", "9lOaG6hP1RuyiGvDovXm",
    # Maquillaje blindado (duplicados)
    "k79iPCqA8zfoRmgVV2Qz", "wCm9PoG3UiQyQvQv5BKB",
    # Maquillaje halloween (duplicados)
    "dhZgOCZsTlagJLif1b5m", "I1wmJi2rUzikU12Vlv1U",
    # Extension clasica (duplicados)
    "iD3fqSZKJcaChtQNRQaL", "cZ65mUSWWM8zLtnK1XKK",
    # Extension hibrido (duplicados)
    "zMbzzJp8eN8iPAxEmJAN", "zPQubt8BmRSQg3ud1rby",
    # Extension tecnologico (duplicados)
    "v6kx8LDqI0XISTACqT31", "TWgSVTn8BMZkbcfeBgsj",
    # Retoque pestanas (duplicados)
    "cX9pJ8tLxlnX3WaxpO8m", "oZClnBRaqSfHjfHwx9eS",
    # Drenaje linfatico (duplicados)
    "VokQwIWHiVH8Xw6pMLOC", "Cf9phkNQCBxgJuMtjmbp",
    # Paquete 1 masaje reductor (duplicados)
    "Br6sBNbJ8msYToSkoXyX", "PiHnAdFYknnbg9lLc1x3",
    # Paquete 2 masaje reductor (duplicados)
    "VhnXKPVl5kLyiUR8OiYL", "kRIISBS8Olsh0elveV7x",
    # Paquete 3 masaje reductor (duplicados)
    "dtX7yJS5t7l5WWofS907", "MLE4K4V1gRQr11TMQajI",
    # Reestructuracion de estrias (duplicados)
    "4NPBVhEB6FFlbC3umkRA", "kCbgB6EYa6OJDcqBvgJO",
    # Camuflaje de estrias (duplicados)
    "hPWKsRbMitfWbpShqKVi", "92imogtYIxeREhi9Y7EI",
    # Limpieza Facial Especial (duplicados)
    "TpmIgLtZtRpf70A9Xfzj", "h4FDfkIF5ZpWQdJf2Ua2",
    # Limpieza Facial Tradicional (duplicados)
    "3OsAEWNnItfpE8BY00yL", "RQaNoU92q3FcIWxVi9Ku",
    # Calendarios basura
    "2YBmWOt0z3TRolb1HNgt",  # Copy of Unas semipermanente
    "uN2vfHGV5emZcXyEqDNq",  # test
]

# ─── PASO 2: Correcciones tipograficas ───────────────────────────────────────
# Lista de reemplazos en orden de aplicacion.
# Usar pares (exacto_viejo, exacto_nuevo) sobre el nombre completo del calendario.
REPLACEMENTS = [
    # Palabras sueltas con tildes o enie faltantes
    ("Unas ", "Uñas "),
    ("Unas\t", "Uñas\t"),
    ("/Unas", "/Uñas"),
    ("(manos y pies)", "(manos y pies)"),   # ya correcto, no tocar
    ("Pestanas", "Pestañas"),
    ("pestanas", "pestañas"),
    ("Depilacion", "Depilación"),
    ("Extension", "Extensión"),
    ("Garantias", "Garantías"),
    ("Diseno", "Diseño"),
    ("Bano ", "Baño "),
    ("relajacion", "relajación"),
    ("volcanicas", "volcánicas"),
    ("linfatico", "linfático"),
    ("estrias", "estrías"),
    ("Reestructuracion", "Reestructuración"),
    ("Camuflaje", "Camuflaje"),   # ya correcto
    ("reparacion", "reparación"),
    ("tecnologico", "tecnológico"),
    ("clasica", "clásica"),
    ("hibrido", "híbrido"),
    ("linea del", "línea del"),
    ("gluteos", "glúteos"),
    ("botulinica", "botulínica"),
    ("Acrilico", "Acrílico"),
    ("acrilico", "acrílico"),
    ("LOreal", "L'Oréal"),
    ("argan", "argán"),
    ("Argan", "Argán"),
    # Categorias de grupo
    ("CEJAS Y PESTA�AS", "CEJAS Y PESTAÑAS"),
    ("DEPILACI�N", "DEPILACIÓN"),
    ("COSMETOLOG�A FACIAL", "COSMETOLOGÍA FACIAL"),
    # Casos especiales que quedaron con unicode roto en el txt
    ("PESTA\x3fAS", "PESTAÑAS"),
    ("DEPILACI\x3fN", "DEPILACIÓN"),
    ("COSMETOLOG\x3fA", "COSMETOLOGÍA"),
]

def fix_name(name):
    result = name
    for old, new in REPLACEMENTS:
        result = result.replace(old, new)
    return result


# ─── Cargar calendarios desde archivo local ───────────────────────────────────
print("Cargando calendarios desde all_calendars.txt...")
all_cals = []
with open("all_calendars.txt", encoding="cp1252") as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        parts = line.split("|", 1)
        if len(parts) == 2:
            all_cals.append({"id": parts[0], "name": parts[1]})
print(f"Total cargados: {len(all_cals)}")

# ─── PASO 1: Eliminar duplicados / basura ─────────────────────────────────────
print(f"\n{'='*60}")
print("  PASO 1: Eliminando duplicados y calendarios basura")
print("="*60)

del_ok = 0
del_fail = 0
to_delete_set = set(TO_DELETE)

for cal_id in TO_DELETE:
    resp = requests.delete(f"{BASE_URL}/calendars/{cal_id}", headers=headers)
    if resp.status_code in (200, 201, 204):
        print(f"  BORRADO  {cal_id}")
        del_ok += 1
    else:
        msg = ""
        try:
            msg = resp.json().get("message", resp.text)[:60]
        except Exception:
            msg = resp.text[:60]
        print(f"  FALLO    {cal_id} -> {msg}")
        del_fail += 1
    time.sleep(0.25)

print(f"\n  Borrados: {del_ok}  |  Fallos: {del_fail}")

# ─── PASO 2: Corregir tipografia ─────────────────────────────────────────────
print(f"\n{'='*60}")
print("  PASO 2: Corrigiendo tipografia en nombres")
print("="*60)

upd_ok = 0
upd_skip = 0
upd_fail = 0

for cal in all_cals:
    cal_id = cal.get("id", "")
    if cal_id in to_delete_set:
        continue  # ya se borro

    old_name = cal.get("name", "")
    new_name = fix_name(old_name)

    if new_name == old_name:
        upd_skip += 1
        continue

    print(f"  [{cal_id}]")
    print(f"    ANTES : {old_name}")
    print(f"    DESPUES: {new_name}")

    payload = {"name": new_name}
    resp = requests.put(f"{BASE_URL}/calendars/{cal_id}", headers=headers, json=payload)
    if resp.status_code in (200, 201):
        print(f"    OK")
        upd_ok += 1
    else:
        try:
            msg = resp.json().get("message", resp.text)[:80]
        except Exception:
            msg = resp.text[:80]
        print(f"    FALLO -> {msg}")
        upd_fail += 1
    time.sleep(0.3)

print(f"\n{'='*60}")
print(f"  Tipografia: {upd_ok} corregidos  |  {upd_skip} sin cambios  |  {upd_fail} fallos")
print(f"  Borrados:   {del_ok} eliminados  |  {del_fail} fallos")
print("="*60)
