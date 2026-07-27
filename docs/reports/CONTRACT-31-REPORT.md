# CONTRACT-31 — Decisión de orquestación de viaje (instantáneo vs. tránsito) — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-31-decision-orquestacion-viaje.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 72 archivos) |
| Suite de tests | ✅ verde 2× (434 tests) | `node --test tests/test_*.js` — 434/434 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación y verificación independiente después. Al
prototipar el escenario en vivo, la primera elección de coordenadas colisionó
(`verticeEntrada(0,0,'este') === verticeEntrada(1,1,'oeste')`, ambas `'1,1'`) — corregida antes
de escribir el oráculo, reubicando la ruta larga en celdas distantes.

## T1 — Ejecutar decisión de orquestación de viaje

Entregado: `src/ejecutarDecisionOrquestacionViaje.js`
(`ejecutarDecisionOrquestacionViaje()`). Cierra el último pendiente del roadmap: el propio
contrato de `resolver-tick-con-transito` (Contrato 08) había dejado explícito que la decisión de
cuándo un viaje pasa a ser multi-tick "queda del lado de quien orquesta". Esta función es esa
orquestación: usa `calcularTicksViaje` sobre la `distanciaTotal` real de una ruta
(`encontrarRuta`) para bifurcar entre resolución instantánea (`resolverViaje`, `ticks <= 1`) y
tránsito multi-tick (`iniciarViajeEnTransito` + llamadas repetidas a
`resolverTickConTransito`, `ticks > 1`), demostrando ambas ramas en el mismo escenario: una ruta
corta (distancia `5`, `1` tick) y una larga (distancia `25`, `3` ticks).

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_decision_orquestacion_viaje.js`: 2/2 tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 72 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente) — ninguna integración anterior (Contrato 08 incluido) fue
  tocada.
- Suite completa 2× consecutivas: 434/434 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Este contrato aísla la decisión instantáneo-vs-tránsito de cualquier otra mecánica (sin
  producción, comercio, tesorería, población ni calendario) — combinarla con una cadena
  económica real completa queda como trabajo futuro si se desea.
- Con esta tarea se cierra el último pendiente explícito conocido del roadmap acumulado del
  proyecto.
- Ningún flaky detectado.
