# CONTRACT-27 — Mantenimiento condicionado al calendario — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-27-mantenimiento-por-dia-laboral.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 67 archivos) |
| Suite de tests | ✅ verde 2× (420 tests) | `node --test tests/test_*.js` — 420/420 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación (escenario de 8 ticks confirmado ejecutando
un prototipo en vivo, no a mano) y verificación independiente después.

## T1 — Ejecutar cadena con mantenimiento condicionado al calendario

Entregado: `src/ejecutarCadenaMantenimientoCalendario.js`
(`ejecutarCadenaMantenimientoCalendario()`). Cierra el efecto económico real del calendario que
el Contrato 24 dejó explícitamente fuera de alcance: el mantenimiento periódico se cobra
ÚNICAMENTE en ticks donde `calendarioDeTick(tick).esLaboral === true`; en fin de semana se
salta por completo, sin acumularse ni cobrarse doble después. Producción y comercio no cambian
por el calendario — solo el mantenimiento.

Resultado sobre 8 ticks (lunes a lunes): tesorería sube `13`/tick en día laboral (`+16` venta
`-3` mantenimiento) y `16`/tick en fin de semana (sin descuento), saldo final `110`.

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_cadena_mantenimiento_calendario.js`: 2/2 tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 67 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente) — ninguna integración anterior fue tocada.
- Suite completa 2× consecutivas: 420/420 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Impacto de estación en producción (clima, mencionado en `DEFINITION.md`) sigue sin
  construirse.
- Este contrato no combina el mantenimiento condicionado con construcción real con costo,
  degradación ni población — alcance deliberadamente aislado para probar solo esta regla.
- Ningún flaky detectado.
