# CONTRACT-24 — Cadena real con calendario integrado — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-24-cadena-con-calendario.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 64 archivos) |
| Suite de tests | ✅ verde 2× (414 tests) | `node --test tests/test_*.js` — 414/414 ambas corridas, sin flaky |

## Decisión de alcance

Presentada al usuario antes de escribir el contrato (dos alternativas): **solo trazabilidad,
sin nueva mecánica económica** — se descartó explícitamente atar el mantenimiento periódico al
día laboral (alternativa mencionada pero fuera de alcance de este contrato).

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación (valores del oráculo obtenidos ejecutando en
vivo `ejecutarCadenaBombaGranjaComercio(8)` + `calendarioDeTick` antes de congelar el test) y
verificación independiente después.

## T1 — Ejecutar cadena real con calendario integrado

Entregado: `src/ejecutarCadenaConCalendario.js` (`ejecutarCadenaConCalendario()`). Corre la
cadena real ya existente `ejecutarCadenaBombaGranjaComercio(8)` sin modificarla y decora cada
entrada de su `historial` con `calendario: calendarioDeTick(tick)`. Ningún valor económico
cambia; se demuestra el ciclo semanal completo (`esLaboral: false` en sábado/domingo, avance de
`semanaDelMes` en el tick 7).

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_cadena_con_calendario.js`: 2/2 tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 64 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente) — ni `ejecutarCadenaBombaGranjaComercio.js` ni
  `calendarioDeTick.js` fueron tocados.
- Suite completa 2× consecutivas: 414/414 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Mantenimiento condicionado a día laboral (u otro efecto económico real del calendario) sigue
  sin construirse — alcance explícitamente descartado en esta tarea.
- Impacto de estación en producción (clima, mencionado en `DEFINITION.md`) tampoco construido.
- Ningún flaky detectado.
