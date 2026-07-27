# CONTRACT-25 — Población dinámica junto con la degradación — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-25-cadena-poblacion-dinamica.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 65 archivos) |
| Suite de tests | ✅ verde 2× (416 tests) | `node --test tests/test_*.js` — 416/416 ambas corridas, sin flaky |

## Hallazgo de viabilidad (detectado antes de escribir el oráculo)

Al prototipar en vivo (antes de delegar), la población variable rompió un supuesto no
documentado: `poblacion * NECESIDAD_PER_CAPITA` deja de ser entero (ej. `11 * 0.2 = 2.2`), y el
remanente que se intenta guardar en almacén tampoco — `agregarStockAlmacen`/
`retirarStockAlmacen` exigen enteros. Presentado al usuario entre dos alternativas; elegida:
truncar (`Math.floor`) el remanente que va al almacén, no la necesidad de la población.

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación. Dada la complejidad (dos loops de
retroalimentación combinados, con aritmética de punto flotante), el orquestador trazó el
escenario COMPLETO de 10 ticks ejecutando un prototipo en vivo (`node -e`) antes de congelar el
oráculo — no a mano.

## T1 — Ejecutar cadena con población dinámica y degradación combinadas

Entregado: `src/ejecutarCadenaPoblacionDinamica.js` (`ejecutarCadenaPoblacionDinamica()`).
Cierra el pendiente explícito del Contrato 19: la población ahora se recompone al final de
CADA tick con su propio índice de cobertura, y ese valor alimenta la necesidad del tick
siguiente — combinando por primera vez los dos loops completos (población y degradación) en la
misma simulación.

**Hallazgo emergente confirmado en vivo (10 ticks)**: a diferencia del Contrato 19 (donde la
población fija nunca permitía salir del colapso), aquí la población SÍ reacciona — decrece
mientras la cobertura es baja (`11 → 9 → 8 → 7 → 6 → 5`) hasta estabilizarse en `5`, tamaño
donde la producción degradada cubre el `100%` de su necesidad (`indiceCobertura: 1` desde el
tick 7). Sin embargo la TESORERÍA nunca se recupera: sin excedente para vender desde el tick 1,
el saldo cae indefinidamente por mantenimiento puro (`saldo final: -56`). Es la primera
integración donde la población se "adapta" a la degradación sin que eso rescate la economía.

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_cadena_poblacion_dinamica.js`: 2/2 tests verdes, incluyendo el
  `deepEqual` completo de los 10 ticks (valores de punto flotante coincidentes bit a bit con el
  prototipo del orquestador).
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 65 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente) — `ejecutarCadenaCompletaConPoblacion.js` (Contrato 19)
  no fue tocado.
- Suite completa 2× consecutivas: 416/416 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- El hallazgo de "población estable pero tesorería sin recuperación" es específico de esta
  calibración (necesidad `0.2`/cápita, tasa `0.1`, umbral de quiebra `2`) — no es una propiedad
  general del sistema.
- La decisión de redondeo (`floor` en el remanente, no en la necesidad) es válida para este
  escenario; una simulación con otros valores de necesidad/población podría requerir revisar la
  misma decisión.
- Ningún flaky detectado.
