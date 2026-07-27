# CONTRACT-18 — Escenario de escasez real — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-18-escasez-real.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 56 archivos) |
| Suite de tests | ✅ verde 2× (382 tests) | `node --test tests/test_*.js` — 382/382 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación (escenario trazado a mano con números
elegidos para dar resultados exactos, sin ambigüedad de punto flotante) y verificación
independiente después.

## T1 — Ejecutar cadena con escasez real

Entregado: `src/ejecutarCadenaConEscasez.js` (`ejecutarCadenaConEscasez()`). Extiende el
Contrato 17 al caso contrario: `4` casas (población `40`) contra la misma producción fija de la
bomba (`4` agua/tick). La población, con prioridad, agota toda el agua producida (cobertura
`0.5`), no queda remanente para la granja, que en consecuencia no produce nada (cobertura de
comida `0`). Índice combinado `0` (mínimo) → decrecimiento poblacional real: `40 → 36` en un
solo tick, sin venta ni ingreso. Primer caso del proyecto donde el loop
producción↔población↔economía se demuestra en sentido NEGATIVO, cerrando el ítem de
seguimiento explícito del Contrato 17.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 56 archivos).
- El oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real,
  basado en un trazado manual independiente que confirmó la aritmética exacta (`0.5`, `0`,
  `-4`) antes de delegar.
- Tras la entrega: comparación de mtime confirmó que SOLO el archivo del `touch_only` de la
  tarea fue modificado (más su propio reporte local) — `ejecutarCadenaConPoblacionReal.js`
  (Contrato 17) permaneció intacto.
- Suite completa 2× consecutivas: 382/382 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Este es un único tick de escasez, no un ciclo multi-tick — no se probó si la población sigue
  decreciendo indefinidamente, se estabiliza, o eventualmente colapsa a 0 (¿qué pasa con
  `calcularCrecimientoPoblacion` cuando `poblacionActual` llega a 0? no se ejercitó).
- No hay almacenes ni degradación de nodos en este escenario — una combinación con los
  Contratos 11/15 podría mostrar cómo la escasez de población interactúa con la quiebra de la
  tesorería (sin ventas, sin ingreso, sin poder pagar mantenimiento).
- Ningún flaky detectado.
