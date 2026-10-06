# Riesgos del nicho infantil en inglés

Investigación 2026-10. Dos restricciones severas que no aplican a otros
nichos y que condicionan todo el proyecto.

## 1. COPPA recorta el ingreso hasta un 80%

Todo contenido marcado "made for kids" no puede servir anuncios
personalizados, solo contextuales. El efecto medido:

| Métrica | Contenido infantil | Audiencia general |
|---|---|---|
| CPM | ~$1.59 | $5–15 |
| Tasa monetizada | 32% | — |
| **RPM** | **~$0.33–3.00** | $5–15 (hasta $40 en finanzas/tecnología) |

Además, la etiqueta desactiva memberships, Super Chat, comentarios, end
screens y campanita: se pierden las dos palancas de RPM que compensan en
otros nichos.

**Dato aprovechable:** los Shorts infantiles tienen 45.7% de playback
monetizado contra 12.1% del formato largo. Proporcionalmente monetizan
mejor de lo que su RPM sugiere.

## 2. Política de contenido inauténtico

En enero de 2026 YouTube terminó 16 canales que acumulaban **4.700 millones
de vistas y 35 millones de suscriptores**, por contenido "generado en masa,
repetitivo o basado en plantillas". El contenido infantil producido con IA
es el arquetipo exacto de lo que persigue esa política.

La política **no penaliza usar IA**. Penaliza lo repetitivo, de plantilla y
de baja calidad, sin importar cómo se produjo. La frase operativa: *IA como
herramienta es aceptable; IA como creador entero, no.*

### Mitigaciones implementadas en el código

| Riesgo | Mitigación | Dónde |
|---|---|---|
| Guiones de plantilla | Similitud Jaccard >60% contra las 50 piezas recientes bloquea la pieza | `src/lib/kids.js` |
| Hooks repetidos | Comparación exacta contra piezas recientes | `src/lib/kids.js` |
| Falta de divulgación de IA | `containsSyntheticMedia` en YouTube; campo obligatorio en BD | `src/lib/platforms/youtube.js` |
| Contenido angustiante | Revisión humana obligatoria, forzada por trigger de base de datos | `db/002_kids.sql` |
| Canales que suenan iguales | Una voz distinta por cuenta desde el banco `voices` | `src/agents/producer.js` |

La revisión humana es la mitigación más importante y la que no se puede
automatizar. El trigger `publications_require_review` impide encolar
cualquier pieza sin revisar: es una restricción de base de datos, no una
convención que se pueda olvidar.

## Implicación estratégica

El volumen no es la estrategia ganadora en este nicho — es precisamente lo
que activa el enforcement. La ruta viable es **menos piezas, más
diferenciadas, con revisión real**, y Facebook como plataforma principal
por su RPM superior.

El techo del sistema no es el límite de las APIs (593 piezas/día) sino la
capacidad de revisión humana (~35/día). Diseñar para 35 y hacerlas buenas.
