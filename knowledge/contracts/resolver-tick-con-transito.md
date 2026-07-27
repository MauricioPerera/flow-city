---
type: 'Task Contract'
title: 'Resolución de un tick con viajes multi-tick'
description: 'Funcion que reinicia cargas, acumula la de todos los viajes en transito activos y avanza cada uno un tick, separando los que llegan de los que siguen en transito.'
tags: ['motor-trafico', 'flow-city', 'tick', 'multi-tick']

task: resolver-tick-con-transito
intent: "Resolver un tick de viajes en transito activos, acumulando su carga antes de avanzarlos, y separar los que llegan de los que siguen en transito."
target: src/resolverTickConTransito.js
signature: "function resolverTickConTransito(grafo, viajesEnTransito)"
test_command: "node tests/test_resolver_tick_con_transito.js"
budget:
  max_cyclomatic_complexity: 12
  max_nesting_depth: 3
tests: "tests/test_resolver_tick_con_transito.js"
tests_sha256: "724faab673b485765b873e86fa554a850654c760f7a4b6a3c4bcf96bab2c3398"
touch_only: ['src/resolverTickConTransito.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Resolución de un tick con viajes multi-tick

## Intent
Cuarta y última pieza del [Contrato 08](../../specs/CONTRACT-08-viajes-multitick.md): integra
[`avanzarViajeTick`](./avanzar-viaje-tick.md) con el patrón de acumulación de
[`resolverTick`](./resolver-tick.md) (Contrato 04) para un conjunto de viajes en tránsito
activos este tick — sean recién iniciados con
[`iniciarViajeEnTransito`](./iniciar-viaje-en-transito.md) o continuando de ticks anteriores.
Reinicia la carga de todos los tramos del grafo, registra la carga del `camino` COMPLETO de
CADA viaje (todo trayecto en tránsito ocupa capacidad en sus tramos mientras dura, según
`DEFINITION.md`) antes de avanzar ninguno, y recién entonces avanza cada viaje un tick.

La decisión de CUÁNDO convertir un viaje recién solicitado en un viaje en tránsito (con
`calcularTicksViaje` + `iniciarViajeEnTransito`) es responsabilidad de quien orquesta el juego,
no de esta función — esta función solo opera sobre el conjunto ya unificado de viajes en
tránsito activos.

## Interface
```
function resolverTickConTransito(grafo, viajesEnTransito)
```
`viajesEnTransito` es un array de objetos `{ camino, tipoTrafico, cantidad, ticksRestantes }`
(misma forma que `iniciarViajeEnTransito`/`avanzarViajeTick`). Devuelve `{ llegados,
enTransito }`: `llegados` es un array de `{ camino, tipoTrafico, cantidad, entregado }` (uno por
cada viaje que llegó este tick, en el mismo orden que `viajesEnTransito`); `enTransito` es un
array de los nuevos estados (`{ camino, tipoTrafico, cantidad, ticksRestantes }`) de los viajes
que siguen en tránsito, también en el mismo orden relativo.

## Invariants
- Al inicio de cada llamada, `cargaActual` de TODOS los tramos del grafo se reinicia a `0` antes
  de acumular los viajes de este tick (dos llamadas sucesivas no arrastran carga del tick
  anterior).
- La carga de TODOS los viajes se acumula (sobre cada tramo de su `camino` completo) ANTES de
  que cualquiera de ellos se avance — el resultado de saturación no depende del orden de
  `viajesEnTransito`.
- Cada elemento de `viajesEnTransito` se valida con los mismos invariantes de
  `avanzarViajeTick`/`iniciarViajeEnTransito` ANTES de mutar ningún tramo del grafo — un viaje
  malformado lanza `RangeError` sin efectos secundarios sobre el grafo.
- `viajesEnTransito` vacío (`[]`) es válido: devuelve `{ llegados: [], enTransito: [] }`.
- `viajesEnTransito` no-array, o `grafo` `null`/no-objeto: lanza `RangeError`.

## Examples
- `resolverTickConTransito(grafo, [])` -> `{ llegados: [], enTransito: [] }`
- Un viaje con `ticksRestantes: 2` -> aparece en `enTransito` con `ticksRestantes: 1`.
- Un viaje con `ticksRestantes: 1` sin saturación -> aparece en `llegados` con `entregado`
  igual a su `cantidad` original.
- Dos viajes de `15` y `5` que llegan sobre el MISMO tramo de capacidad `10` -> ambos en
  `llegados`, con `entregado` `7.5` y `2.5` respectivamente (pérdida proporcional sobre la
  carga total agregada, igual que `resolverTick`).

## Do / Don't
- DO: validar la forma de TODOS los viajes antes de tocar el grafo (todo-o-nada).
- DO: registrar la carga del `camino` COMPLETO de cada viaje, no solo un tramo.
- DON'T: usar red, `require` de paquetes externos (salvo `registrarCargaTramo` y
  `avanzarViajeTick`, módulos hermanos del proyecto), ni acceso a estado global.
- DON'T: avanzar un viaje antes de que la carga de TODOS los viajes de este tick esté
  registrada.

## Tests
(Los tests están en `tests/test_resolver_tick_con_transito.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
