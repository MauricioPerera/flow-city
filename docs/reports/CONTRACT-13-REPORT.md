# CONTRACT-13 — Consecuencias de la quiebra — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-13-consecuencias-quiebra.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 46 archivos) |
| Suite de tests | ✅ verde 2× (338 tests) | `node --test tests/test_*.js` — 338/338 ambas corridas, sin flaky |

## Delegación

Las 3 tareas (T1-T3) fueron **implementadas por `glm-5.2:cloud`**, con contrato + oráculo
congelado autorados por el orquestador antes de cada delegación y verificación independiente
después de cada una.

## T1 — Actualizar contador de quiebra

Entregado: `src/actualizarContadorQuiebra.js` (`actualizarContadorQuiebra(contadorActual,
saldoTesoreria)`). Confirmó en conversación: degradación **progresiva** (contador de ticks
consecutivos en quiebra), no instantánea. Saldo exactamente `0` cuenta como quiebra.

## T2 — Nodo degradado

Entregado: `src/estaNodoDegradado.js` (`estaNodoDegradado(contadorQuiebra, umbral)`).
Comparación simple `>=` contra un umbral configurable — sin niveles intermedios de severidad.

## T3 — Aplicar degradación a la producción

Entregado: `src/aplicarDegradacionProduccion.js` (`aplicarDegradacionProduccion(produccionPotencial,
degradado)`). Confirmó en conversación: efecto = **producción a la mitad** (`Math.floor`),
reversible, no producción en cero.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 46 archivos) — corrido tras cada una de las 3 implementaciones.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar, en las 3 tareas.
- Tras cada entrega de GLM: comparación de mtime confirmó que SOLO el archivo del `touch_only`
  de la tarea fue modificado (más su propio reporte local).
- Suite completa 2× consecutivas: 338/338 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Estas 3 funciones son piezas de cálculo puro, todavía sin integrar a ninguna cadena real
  (`ejecutarCadenaBombaGranjaComercio` u otra) — no hay ninguna integración que efectivamente
  aplique la degradación cuando la tesorería de un escenario real cae a 0 o negativo. Sería la
  integración natural de un contrato futuro.
- El umbral de ticks para degradar y el factor de reducción (mitad) son valores confirmados en
  conversación, no derivados de una regla de balance de `DEFINITION.md` — quedan como
  parámetros a ajustar cuando exista una integración real que los ejercite.
- Ningún flaky detectado.
