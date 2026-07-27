# CONTRACT-29 — Impacto de estación en producción (clima) — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-29-impacto-estacion-produccion.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 70 archivos) |
| Suite de tests | ✅ verde 2× (430 tests) | `node --test tests/test_*.js` — 430/430 ambas corridas, sin flaky |

## Decisión de alcance

Presentada al usuario antes de escribir el contrato (dos alternativas): el clima afecta,
mediante un multiplicador fijo por estación, ÚNICAMENTE la producción de la granja (verano
`x1.5`, invierno `x0.5`, otoño/primavera `x1`) — se descartó explícitamente aplicar el mismo
multiplicador a la bomba de agua u otras construcciones basadas en recursos naturales.

## Delegación

Dos tareas, **implementadas por `pool` (Poolside CLI)**, con contratos + oráculos congelados
autorados por el orquestador antes de cada delegación y verificación independiente después.

## T1 — Calcular multiplicador de clima

Entregado: `src/calcularMultiplicadorClima.js` (`calcularMultiplicadorClima(estacion)`). Mapeo
puro estación → multiplicador, con `RangeError` para cualquier valor fuera de las 4 estaciones
válidas.

## T2 — Ejecutar producción estacional

Entregado: `src/ejecutarProduccionEstacional.js` (`ejecutarProduccionEstacional()`). Corre la
cadena bomba→granja en `4` ticks representativos (`0`/`84`/`168`/`252` = otoño/invierno/
primavera/verano, confirmados en vivo contra `calendarioDeTick` antes de delegar) y aplica el
multiplicador de T1 a la producción cruda de la granja. Alcance deliberado: no recorre los `336`
ticks de un año completo — muestrea un tick por estación.

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `6/6` (T1) y `2/2` (T2) tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: `OK: todos los
  contratos son validos`, 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado.
- Suite completa 2× consecutivas al cierre: 430/430 ambas, exit 0, sin discrepancia entre
  corridas.

## Pendientes / ítems de seguimiento

- El multiplicador de clima no se combina todavía con almacenes, comercio, tesorería,
  degradación ni población en la misma integración — alcance deliberadamente aislado.
- Fase de tiempo libre y su gasto asociado, y decisión de orquestación de viajes multi-tick,
  siguen pendientes de contratos anteriores.
- Ningún flaky detectado.
