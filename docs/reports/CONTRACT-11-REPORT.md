# CONTRACT-11 — Integración con almacenes: bomba → granja — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-11-integracion-almacenes-bomba-granja.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 42 archivos) |
| Suite de tests | ✅ verde 2× (313 tests) | `node --test tests/test_*.js` — 313/313 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `glm-5.2:cloud`**, con contrato + oráculo congelado autorados
por el orquestador antes de la delegación y verificación independiente después (re-corrida de
tests + gate + chequeo de `touch_only` real + corrida en vivo extendida a 4 ticks para
confirmar el bloqueo persistente).

## T1 — Ejecutar la cadena bomba → granja con almacenes

Entregado: `src/ejecutarCadenaBombaGranjaConAlmacen.js`
(`ejecutarCadenaBombaGranjaConAlmacen(numTicks)`). Extiende
[`ejecutarCadenaBombaGranja`](../../src/ejecutarCadenaBombaGranja.js) (Contrato 09, sin tocar)
integrando almacenes reales de ambos nodos (Contrato 10). Escenario calibrado deliberadamente
(capacidad de la granja `20` vs. `8` manzanas/tick, sin retiro) para que el bloqueo por almacén
lleno ocurra de forma determinista en el tercer tick — no una simulación forzada, consecuencia
matemática directa de los valores fijados. Corrida en vivo a 4 ticks confirmó que el bloqueo es
**persistente** (ticks 2 y 3 ambos bloqueados en `16/20`), consistente con que nada retira
manzanas del almacén de la granja en este contrato.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 42 archivos).
- El oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar.
- Tras la entrega de GLM: comparación de mtime confirmó que SOLO el archivo del `touch_only` de
  la tarea fue modificado (más su propio reporte local) — en particular, `ejecutarCadenaBombaGranja.js`
  (Contrato 09) permaneció intacto.
- Corrida en vivo (`node -e ...`) a 4 ticks, más allá del oráculo (que cubre 3), confirmando
  que el bloqueo no es un artefacto puntual sino un estado estable.
- Suite completa 2× consecutivas: 313/313 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- El agua recibida por la granja mientras su almacén de producto está bloqueado se pierde ese
  tick — no hay almacén de materia prima en el alcance de este contrato para retenerla. Es una
  limitación documentada explícitamente en el contrato, no un descubrimiento posterior.
- El almacén de la bomba nunca se ejercitó en estado lleno en este escenario (siempre se vacía
  antes de la siguiente producción) — sigue sin probarse ese camino.
- `retirarStockAlmacen` sobre el almacén de la GRANJA (para simular, por ejemplo, un carro que
  retira manzanas para venderlas) sigue sin integrarse — sería el desbloqueo natural del
  escenario, tema de un contrato futuro (comercio conectado al grid real).
- Ningún flaky detectado.
