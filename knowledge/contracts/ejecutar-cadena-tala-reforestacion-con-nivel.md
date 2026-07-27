---
type: 'Task Contract'
title: 'Ejecución de cadena tala + reforestación con nivel'
description: 'Funcion de integracion que combina el area de accion por nivel con el ciclo de vida del arbol: tala solo produce si hay un arbol listo en su area, y el arbol se regenera con el tiempo.'
tags: ['motor-arboles', 'motor-integracion', 'flow-city', 'nivel', 'grid']

task: ejecutar-cadena-tala-reforestacion-con-nivel
intent: "Simular varios ticks donde la tala produce madera solo si hay un arbol listo dentro de su area de accion por nivel, y el arbol se regenera con el tiempo."
target: src/ejecutarCadenaTalaReforestacionConNivel.js
signature: "function ejecutarCadenaTalaReforestacionConNivel()"
test_command: "node tests/test_ejecutar_cadena_tala_reforestacion_con_nivel.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_cadena_tala_reforestacion_con_nivel.js"
tests_sha256: "7eb4c831edcdfee91aeb0134ac04ea5eba01aacf516b427a2ea740bed4999d40"
touch_only: ['src/ejecutarCadenaTalaReforestacionConNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena tala + reforestación con nivel

## Intent
Única pieza del [Contrato 38](../../specs/CONTRACT-38-integracion-tala-reforestacion-con-nivel.md):
combina [`radio-area-accion-por-nivel`](./radio-area-accion-por-nivel.md) +
[`esta-en-zona-influencia`](./esta-en-zona-influencia.md) (Contrato 36) con el ciclo de vida
completo del árbol (Contrato 37: [`crear-estado-arboles`](./crear-estado-arboles.md),
[`talar-arbol`](./talar-arbol.md), [`avanzar-ciclo-arbol-tick`](./avanzar-ciclo-arbol-tick.md),
[`tala-produce-en-zona`](./tala-produce-en-zona.md)) sobre una única celda candidata, durante
`6` ticks fijos.

Centro `(5,5)`, nivel `'S'` (radio `2`), celda candidata `(5,5)` (dentro del área de acción por
construcción, distancia `0`). En cada tick: se consulta el estado ANTES de actuar
(`estadoAntes`), se intenta talar (`maderaProducida: 1` si `talaProduceEnZona` es verdadero,
`0` si no), y siempre se avanza el ciclo un tick (`estadoDespues`).

## Interface
```
function ejecutarCadenaTalaReforestacionConNivel()
```
Devuelve `{ centro, nivel, radio, celda, celdaEnAreaDeAccion, historial }`. `historial` tiene
`6` elementos, uno por tick, cada uno `{ tick, estadoAntes, maderaProducida, estadoDespues }`.

## Invariants
- `centro` es `{x:5, y:5}`, `nivel` es `'S'`, `radio` es `2`, `celda` es `{x:5, y:5}`,
  `celdaEnAreaDeAccion` es `true`.
- `historial.length === 6`.
- Tick `0`: `estadoAntes: 'arbol'`, `maderaProducida: 1`, `estadoDespues: 'tocon'` (tala).
- Ticks `1`-`3`: `maderaProducida: 0` en los tres (sin árbol listo); `estadoDespues` pasa por
  `'limpio'` desde el tick `1` en adelante.
- Tick `4`: `estadoDespues: 'arbol'` (el árbol termina de regenerarse).
- Tick `5`: `estadoAntes: 'arbol'`, `maderaProducida: 1`, `estadoDespues: 'tocon'` (segunda
  tala, exactamente `5` ticks después de la primera — el tiempo completo del ciclo).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaTalaReforestacionConNivel().historial[0]` -> `{ tick: 0, estadoAntes: 'arbol',
  maderaProducida: 1, estadoDespues: 'tocon' }`.
- `ejecutarCadenaTalaReforestacionConNivel().historial[5]` -> `{ tick: 5, estadoAntes: 'arbol',
  maderaProducida: 1, estadoDespues: 'tocon' }` (segunda tala posible).
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `radioAreaAccionPorNivel`, `estaEnZonaInfluencia`, `crearEstadoArboles`,
  `talarArbol`, `avanzarCicloArbolTick`, `talaProduceEnZona` — ninguna lógica de distancia,
  ciclo de vida o disponibilidad se reimplementa.
- DO: en cada tick, primero comprobar/talar, y SOLO DESPUÉS avanzar el ciclo (orden fijo: el
  tick en que se tala también avanza su propio contador, ver Examples).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir almacenes, comercio, tesorería, población o calendario — fuera de alcance de
  este contrato.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_tala_reforestacion_con_nivel.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
