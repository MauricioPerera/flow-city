# CONTRACT-19 — Integración completa con población real — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-19-integracion-completa-poblacion.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 57 archivos) |
| Suite de tests | ✅ verde 2× (388 tests) | `node --test tests/test_*.js` — 388/388 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación. Dada la complejidad (combina 9 contratos
previos), el orquestador trazó a mano el escenario COMPLETO de 4 ticks antes de escribir el
oráculo. La implementación de `pool` siguió el algoritmo paso a paso tal como se especificó,
sin desviaciones.

## T1 — Ejecutar cadena completa con población real

Entregado: `src/ejecutarCadenaCompletaConPoblacion.js`
(`ejecutarCadenaCompletaConPoblacion(numTicks)`). Combina construcción con costo (Contrato 14),
almacenes (Contrato 10/11), degradación por quiebra (Contrato 13/15) y población real con
prioridad sobre la producción (Contrato 17), todo junto por primera vez.

**Hallazgo emergente confirmado, tanto a mano como en vivo (10 ticks)**: a diferencia del
Contrato 15 (que se recuperaba de la degradación), en este escenario la degradación **nunca se
revierte**. Razón: una vez que la bomba se degrada (`4 → 2` agua), la población consume
exactamente el 100% del agua degradada para cubrir su propia necesidad, dejando `0` para la
granja. La granja no vuelve a producir mientras dure la degradación, el comercio deja de
vender, y sin ingreso el saldo cae indefinidamente por puro mantenimiento (`-3`/tick,
verificado hasta el tick `9`: saldo `-52`). Es la primera integración del proyecto que muestra
un colapso económico permanente e irreversible con los valores fijados — consistente con
"sandbox sin derrota formal" (`DEFINITION.md`: el juego no termina, pero nada garantiza que se
recupere).

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 57 archivos).
- El oráculo (tabla `ESPERADO_4_TICKS`, campo por campo) se escribió y selló (`tests_sha256`)
  ANTES de existir la implementación real, basado en un trazado manual independiente del
  orquestador.
- Tras la entrega: comparación de mtime confirmó que SOLO el archivo del `touch_only` de la
  tarea fue modificado (más su propio reporte local) — ninguna integración anterior (Contratos
  09, 11, 15, 16, 17, 18) fue tocada.
- Corrida en vivo (`node -e ...`) a 10 ticks, más allá del oráculo (que cubre 4), confirmando
  que el colapso sin recuperación es un estado estable, no un artefacto de pocos ticks.
- Suite completa 2× consecutivas: 388/388 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- La población es un conteo FIJO durante la simulación (decisión de alcance documentada
  explícitamente en el contrato) — no se compone tick a tick junto con la degradación. Una
  integración futura podría encadenar ambos loops de retroalimentación completos (población
  cambiante Y degradación simultáneas), con el riesgo de complejidad combinatoria que eso
  implica para el trazado manual.
- El hallazgo de "colapso sin recuperación" es específico de estos valores (necesidad
  `0.2`/cápita exactamente igual a la mitad de la producción degradada de la bomba) — no es una
  propiedad general del sistema, sino una consecuencia de esta calibración particular. Vale la
  pena señalarlo para quien ajuste balance más adelante.
- Ningún flaky detectado.
