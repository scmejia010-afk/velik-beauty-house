# Desde dónde se maneja todo

Tres superficies, por orden de uso diario.

## 1. El panel web — la operación del día a día

`public/index.html`, servido por Vercel junto a los endpoints. Es un solo
archivo sin paso de compilación: se despliega con el resto del proyecto.

Lee tu Supabase a través de `/api/status`, así que la clave de servicio se
queda en el servidor y nunca llega al navegador.

Qué muestra y qué permite hacer:

| Sección | Para qué |
|---|---|
| Resumen | Series, episodios, pendientes, cola, vistas y RPM |
| **Esperando tu revisión** | Ver, **aprobar** o **rechazar** cada episodio. Es la única etapa que exige una persona |
| Cupo de hoy | Cuánto queda por cuenta. Si está agotado, hoy no se publica más |
| Cola de publicación | Qué sale, cuándo, y el motivo de lo que se saltó |
| Series y episodios | El arco completo con el estado de cada episodio |
| Corridas | Qué hizo el orquestador, en qué etapa y cuántos créditos gastó |

El botón **Producir 3 episodios** dispara el orquestador con un tope de 30
créditos. Ese tope es deliberado: un clic accidental no puede consumir el
cupo del mes. El botón exige `PANEL_SECRET` porque gasta créditos.

## 2. La terminal — verificación y dimensionamiento

```bash
npm run simulate        # la cadena completa con datos falsos, sin gastar créditos
npm run dry-run         # verifica las compuertas de validación
npm run unit-economics  # rentabilidad con las tarifas reales
npm run capacity        # cuántas piezas/día aguanta el sistema
```

`simulate` es la forma de ver el orquestador funcionando sin credenciales
ni gasto. Útil antes de cada cambio.

## 3. Automático — los crons de Vercel

Definidos en `vercel.json`. Corren sin que nadie los dispare:

| Cron | Horario | Qué hace |
|---|---|---|
| orchestrator | 05:00 | Produce episodios nuevos |
| scout | 06:00 | Temas y ángulos |
| writer | 06:30 | Guiones |
| producer | cada 2 h | Producción pendiente |
| **publisher** | **cada 15 min** | Publica lo aprobado, respetando cupo |
| analyst | 07:00 | Métricas y diagnóstico de geografía |

Todos exigen `CRON_SECRET`: en Vercel las rutas quedan públicas, y un
disparo ajeno puede quemar el cupo del día.

El publisher solo publica lo que tú aprobaste. Mientras no revises, el
sistema produce y se detiene.

## Supabase como respaldo

El editor de tablas de Supabase sirve para lo que el panel no cubre
todavía: registrar cuentas con sus tokens, y corregir datos a mano. Las
tablas son `accounts`, `series`, `episodes`, `videos`, `publications`,
`quota_usage`, `metrics`.
