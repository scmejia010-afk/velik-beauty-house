# Poner el panel en línea y verlo desde el celular

Tres pasos. Al final tienes una dirección web que abres desde el teléfono
y te deja revisar y aprobar episodios desde donde estés.

Todo lo que sigue lo haces tú: yo no tengo acceso a tus cuentas.

---

## 1. Base de datos en Supabase

1. Entra a `supabase.com` → **New project**. Anota la contraseña que te pide.
2. Cuando termine de crearse, ve a **SQL Editor** → **New query**.
3. Copia y ejecuta, **en este orden**, el contenido de:
   - `db/schema.sql`
   - `db/functions.sql`
   - `db/002_kids.sql`
   - `db/003_series.sql`
   - `db/004_media.sql`
4. Ve a **Settings → API** y deja esa página abierta: de ahí salen dos
   valores que necesitas en el paso 3.
   - `Project URL`
   - `service_role` (la clave secreta, no la `anon`)

---

## 2. Desplegar en Vercel

1. Entra a `vercel.com` y conecta tu cuenta de GitHub.
2. **Add New → Project** → elige el repositorio `velik-beauty-house`.
3. En la configuración del proyecto:
   - **Branch**: `content-engine`
   - **Root Directory**: `content-engine`
   - **Framework Preset**: Other
   - Build Command y Output Directory: déjalos vacíos
4. Todavía **no** le des Deploy. Primero el paso 3.

---

## 3. Variables de entorno

En Vercel, **Settings → Environment Variables**, agrega:

| Nombre | De dónde sale |
|---|---|
| `SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` |
| `ANTHROPIC_API_KEY` | `console.anthropic.com` → API Keys |
| `HIGGSFIELD_API_KEY` | Tu cuenta de Higgsfield |
| `CRON_SECRET` | Inventa una cadena larga al azar |
| `PANEL_SECRET` | Inventa otra, distinta |

Las claves van **solo aquí**. Nunca en el código, nunca en un chat.

Ahora sí: **Deploy**.

---

## 4. Abrirlo en el celular

Vercel te da una dirección tipo `tu-proyecto.vercel.app`. Ábrela en el
teléfono y **agrégala a la pantalla de inicio**:

- **iPhone**: Safari → compartir → "Añadir a pantalla de inicio"
- **Android**: Chrome → menú ⋮ → "Añadir a pantalla principal"

Queda como una app más. Desde ahí:

- Ves las **escenas de cada episodio**; tocas una y se abre grande
- **Apruebas o rechazas** con el dedo
- Ves el **cupo de hoy** por cuenta
- Ves qué está **en cola** y qué ya salió

El botón **Encender 3 episodios** pide `PANEL_SECRET`. Para activarlo en
tu teléfono, abre el panel, entra a la consola del navegador y ejecuta una
vez:

```js
localStorage.setItem('panel-secret', 'el valor que pusiste en Vercel')
```

Queda guardado solo en ese teléfono.

---

## Antes de la primera corrida

Falta registrar al menos una cuenta. Todavía se hace a mano: Supabase →
**Table Editor** → tabla `accounts` → **Insert row**:

| Campo | Ejemplo |
|---|---|
| `label` | `lanterngrove-fb` |
| `platform` | `facebook` |
| `handle` | el ID de tu página |
| `niche` | `preschool` |
| `language` | `en` |
| `target_market` | `US` |
| `access_token` | el token de esa página |
| `made_for_kids` | `true` |

Un token **por cuenta**: el límite de Meta es por token, no por cuenta.

Esto es lo que resuelve el OAuth que falta construir. Mientras tanto, a mano.

---

## Si algo falla

- **El panel carga pero dice "sin enlace con el servidor"** → faltan
  `SUPABASE_URL` o `SUPABASE_SERVICE_ROLE_KEY` en Vercel.
- **Las secciones salen vacías** → la base está bien conectada pero no hay
  datos todavía. Normal antes de la primera corrida.
- **"Encender" responde no autorizado** → falta el `panel-secret` guardado
  en ese teléfono, o no coincide con el de Vercel.
