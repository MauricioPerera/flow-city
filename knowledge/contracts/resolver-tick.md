---
type: 'Task Contract'
title: 'Resolución de un tick completo de tráfico'
description: 'Funcion que agrupa multiples viajes simultaneos de un tick, acumulando toda la carga por tramo antes de aplicar saturacion.'
tags: ['motor-trafico', 'flow-city', 'trafico', 'tick']

task: resolver-tick
intent: "Resolver un conjunto de viajes simultaneos de un mismo tick, acumulando toda la carga por tramo antes de aplicar saturacion a cada viaje."
target: src/resolverTick.js
signature: "function resolverTick(grafo, viajes)"
test_command: "node tests/test_resolver_tick.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_resolver_tick.js"
tests_sha256: "b73eefc0e275210a0a366bd2cc3a76f2c384118f35f46ff4ee91e3076ae27b97"
touch_only: ['src/resolverTick.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Resolución de un tick completo de tráfico

## Intent
Cuarta y última pieza del [Contrato 04](../../specs/CONTRACT-04-motor-trafico-tick.md): dado un
conjunto de viajes que ocurren en el MISMO tick, la saturación de cada tramo debe reflejar la
carga TOTAL agregada de todos esos viajes — no el resultado de resolverlos uno por uno en
cualquier orden de llegada (eso daría resultados distintos e incorrectos según el orden). Esta
función orquesta las tres piezas anteriores: reinicia la carga de todos los tramos del grafo,
acumula la carga de TODOS los viajes con [`registrarCargaTramo`](./registrar-carga-tramo.md)
(vía sus rutas de [`encontrarRuta`](./encontrar-ruta.md)), y recién entonces resuelve cada
viaje con [`resolverViaje`](./resolver-viaje.md) para que todos vean la misma `cargaActual`
final del tick. Ver [DEFINITION.md](../../DEFINITION.md), sección "Rutas y tráfico".

Un viaje `origen === destino` o sin ruta posible no aporta carga a ningún tramo (no hay tramos
que atravesar), y no afecta la acumulación de los demás viajes del tick.

## Interface
```
function resolverTick(grafo, viajes)
```
`viajes` es un array de `{ origen, destino, tipoTrafico, cantidad }`. Devuelve un array de
resultados de [`resolverViaje`](./resolver-viaje.md) (`{ camino, entregado,
factorVelocidadMinimo }`), en el mismo orden que `viajes`. Muta `grafo` (reinicia y reasigna
`cargaActual` de sus tramos).

## Invariants
- Al inicio de cada llamada, `cargaActual` de TODOS los tramos del grafo se reinicia a `0`
  antes de acumular los viajes de este tick (dos llamadas sucesivas sobre el mismo grafo no
  arrastran carga del tick anterior).
- La carga de todos los viajes que comparten un tramo se acumula ANTES de que cualquiera de
  ellos calcule su saturación — el resultado no depende del orden de `viajes`.
- El array de resultados tiene la misma longitud y el mismo orden que `viajes`.
- Un viaje sin ruta posible produce `{ camino: null, entregado: 0, factorVelocidadMinimo: null
  }` sin afectar la carga de otros tramos.
- `viajes` no-array, o cualquier elemento no-objeto: lanza `RangeError`.
- `viajes` vacío (`[]`) es válido: devuelve `[]`.

## Examples
- Dos viajes por tramos distintos, sin solaparse: cada uno se entrega completo, sin saturación.
- Dos viajes de `15` y `5` sobre el MISMO tramo de capacidad `10`: carga total `20` ->
  `factorVelocidad: 0.5`, `fraccionPerdida: 0.5` -> el primero entrega `7.5`, el segundo `2.5`
  (si se resolvieran por separado sin acumular, el resultado sería distinto e incorrecto).
- `resolverTick(grafo, [])` -> `[]`
- Llamar dos veces seguidas con el mismo grafo y viajes que no saturan: ambas llamadas dan el
  mismo resultado (la carga del primer tick no se arrastra al segundo).

## Do / Don't
- DO: reiniciar `cargaActual` de TODOS los tramos antes de acumular, en cada llamada.
- DO: acumular la carga de TODOS los viajes (fase 1) antes de resolver cualquiera de ellos
  (fase 2) — nunca intercalar acumulación y resolución viaje por viaje.
- DON'T: usar red, `require` de paquetes externos (salvo módulos hermanos del proyecto), ni
  acceso a estado global.
- DON'T: dejar que un viaje sin ruta lance una excepción que interrumpa la resolución de los
  demás viajes del tick.

## Tests
(Los tests están en `tests/test_resolver_tick.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
