# CONTRACT-28 — Viajes de la fase laboral (ida/vuelta) — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-28-viajes-fase-laboral.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 68 archivos) |
| Suite de tests | ✅ verde 2× (422 tests) | `node --test tests/test_*.js` — 422/422 ambas corridas, sin flaky |

## Decisión de alcance

Presentada al usuario antes de escribir el contrato (dos alternativas): **solo la transición
laboral (ida/vuelta casa↔trabajo)**, únicamente en días laborales — se descartó explícitamente
modelar la fase de "tiempo libre" y su gasto asociado (mencionado en `DEFINITION.md`) en este
contrato.

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación (escenario de 7 ticks confirmado ejecutando
un prototipo en vivo) y verificación independiente después.

## T1 — Ejecutar viajes de la fase laboral

Entregado: `src/ejecutarViajesFaseLaboral.js` (`ejecutarViajesFaseLaboral()`). Primera
construcción de "la transición entre fases genera picos de tráfico (ida/vuelta laboral)"
(`DEFINITION.md`): para cada uno de 7 ticks (una semana), si `calendarioDeTick(tick).esLaboral`
es verdadero, genera dos viajes reales por una ruta real de tráfico `personas` (casa→trabajo,
trabajo→casa); en fin de semana no genera ningún viaje.

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_viajes_fase_laboral.js`: 2/2 tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 68 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente).
- Suite completa 2× consecutivas: 422/422 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Fase de "tiempo libre" y su gasto asociado a la economía — explícitamente fuera de alcance de
  este contrato.
- Decisión de orquestación de cuándo un viaje pasa a ser multi-tick (ya identificada como
  pendiente en contratos anteriores) sigue sin resolverse — esta tarea asume resolución
  instantánea dentro del mismo tick, igual que toda integración previa.
- Ningún flaky detectado.
