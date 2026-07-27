# Contrato 29 — Impacto de estación en producción (clima)

Prerrequisitos: Contrato 04 (`calendario-de-tick`, ciclo de estaciones `['otono', 'invierno',
'primavera', 'verano']`, `84` ticks cada una). `DEFINITION.md` (sección "Calendario"):
"Estación = 3 meses (otoño, invierno, primavera, verano), con impacto propio en clima y por
tanto en producción" — nunca antes construido.

Decisión de alcance (confirmada explícitamente por el usuario, entre dos alternativas
presentadas): el clima afecta, mediante un multiplicador fijo por estación, ÚNICAMENTE la
producción de la granja (agricultura) — verano `x1.5` (bonus de cosecha), invierno `x0.5`
(penalización), otoño/primavera `x1` (neutral). La bomba de agua, reforestación y cualquier
otra construcción NO cambian por estación en este contrato.

Alcance deliberadamente acotado: dado que una estación dura `84` ticks (`336` por año), el
oráculo NO recorre un año completo tick a tick — muestrea un tick representativo de cada
estación (`0` = otoño, `84` = invierno, `168` = primavera, `252` = verano, confirmados contra
`calendarioDeTick`), demostrando el efecto sin ejecutar cientos de ticks redundantes.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Calcular multiplicador de clima

FIX/OBJETIVO: función pura `calcularMultiplicadorClima(estacion)` en
`src/calcularMultiplicadorClima.js`, con oráculo congelado en
`tests/test_calcular_multiplicador_clima.js`. Devuelve `1.5` para `'verano'`, `0.5` para
`'invierno'`, `1` para `'otono'` y `'primavera'`; lanza `RangeError` para cualquier otro valor.

Task contract: `knowledge/contracts/calcular-multiplicador-clima.md`.

## T2 — Ejecutar producción estacional

FIX/OBJETIVO: función `ejecutarProduccionEstacional()` (sin parámetros) que, para los `4` ticks
representativos (`0`, `84`, `168`, `252`), corre la cadena bomba→granja (misma que el Contrato
09: `produccionFija: 4`, ratio `1:2`) y aplica `calcularMultiplicadorClima` a la producción
cruda de la granja según la estación de ese tick.

Task contract: `knowledge/contracts/ejecutar-produccion-estacional.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_calcular_multiplicador_clima.js` exit 0.
- [ ] T2: `node tests/test_ejecutar_produccion_estacional.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `calcular-multiplicador-clima` y `ejecutar-produccion-estacional`.
- [ ] Final del contrato (T1 y T2 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/calcularMultiplicadorClima.js`,
  `tests/test_calcular_multiplicador_clima.js`,
  `knowledge/contracts/calcular-multiplicador-clima.md`. T2 → `src/ejecutarProduccionEstacional.js`,
  `tests/test_ejecutar_produccion_estacional.js`,
  `knowledge/contracts/ejecutar-produccion-estacional.md` (conjunto disjunto de T1). NO tocar
  ninguna integración anterior ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `calendarioDeTick` no reporta exactamente las estaciones esperadas en los ticks
  `0`/`84`/`168`/`252` (indicaría un cambio en el ciclo de estaciones) → PARAR, documentar, no
  ajustar el oráculo a un resultado inesperado sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador confirmó en vivo (`node -e`) que `calendarioDeTick(0/84/
  168/252)` produce exactamente `otono/invierno/primavera/verano` antes de escribir el oráculo
  de T2.
- [x] Perímetro de T1 declarado y disjunto de T2.
- [x] Condición de aborto explícita para el contrato (arriba).
