---
type: 'Task Contract'
title: 'Avance de un viaje en tránsito, un tick'
description: 'Funcion que avanza un tick el estado de un viaje en transito, resolviendo su llegada con perdida proporcional de saturacion cuando el contador de ticks llega a 0.'
tags: ['motor-trafico', 'flow-city', 'tick', 'multi-tick']

task: avanzar-viaje-tick
intent: "Avanzar un tick el estado de un viaje en transito, resolviendo su llegada con la perdida proporcional de saturacion cuando corresponda."
target: src/avanzarViajeTick.js
signature: "function avanzarViajeTick(viajeEnTransito, grafo)"
test_command: "node tests/test_avanzar_viaje_tick.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_avanzar_viaje_tick.js"
tests_sha256: "f4dbe5ac5696d08783fd1eeb3cbebb84b871df6666822b96ba7c490b6fb6def0"
touch_only: ['src/avanzarViajeTick.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Avance de un viaje en tránsito, un tick

## Intent
Tercera pieza del [Contrato 08](../../specs/CONTRACT-08-viajes-multitick.md): dado el estado de
un viaje en tránsito (de [`iniciarViajeEnTransito`](./iniciar-viaje-en-transito.md)), avanza un
tick. Si todavía quedan ticks después de decrementar, el viaje sigue en tránsito (mismo
`camino`/`tipoTrafico`/`cantidad`, `ticksRestantes` decrementado en 1). Si el contador llega a
`0` en este tick, el viaje LLEGA: se calcula `entregado` recorriendo cada tramo del `camino` con
el mismo modelo de pérdida proporcional que [`resolverViaje`](./resolver-viaje.md) (Contrato
04) — lee `cargaActual` de cada tramo (asumiendo que ya fue registrada para este tick por quien
orquesta, responsabilidad de T4), aplica
[`calcularSaturacion`](./calcular-saturacion.md), y compone las pérdidas de tramos consecutivos
multiplicándolas.

A diferencia de `resolverViaje`, esta función NO llama a
[`encontrarRuta`](./encontrar-ruta.md): el `camino` ya está fijo desde que el viaje empezó su
tránsito, y se recorre directamente sobre `grafo[origen][destino]` por cada segmento.

## Interface
```
function avanzarViajeTick(viajeEnTransito, grafo)
```
`viajeEnTransito` es `{ camino, tipoTrafico, cantidad, ticksRestantes }` (misma forma que
devuelve `iniciarViajeEnTransito`). Devuelve `{ llego, estado, entregado }`.

## Invariants
- Si `ticksRestantes - 1 > 0`: `{ llego: false, estado: { ...viajeEnTransito, ticksRestantes:
  ticksRestantes - 1 }, entregado: null }`.
- Si `ticksRestantes - 1 === 0`: `{ llego: true, estado: null, entregado: <número calculado> }`.
- El `entregado` al llegar es `cantidad` multiplicada por `(1 - fraccionPerdida)` de cada tramo
  del `camino`, compuestas (multiplicadas entre sí) — mismo modelo que `resolverViaje`.
- `viajeEnTransito` con forma inválida (mismos invariantes que
  [`iniciarViajeEnTransito`](./iniciar-viaje-en-transito.md): `camino` no-array o `< 2`
  elementos, `tipoTrafico` fuera de `['mercaderia','personas']`, `cantidad` no entero positivo,
  `ticksRestantes` no entero positivo): lanza `RangeError`.
- `grafo` `null` o no-objeto: lanza `RangeError`.
- Si algún segmento consecutivo del `camino` no tiene tramo registrado en `grafo` (`grafo[a][b]`
  no existe): lanza `RangeError` — un `camino` inconsistente con el grafo actual no se resuelve
  en silencio.

## Examples
- `ticksRestantes: 2` -> `{ llego: false, estado: {..., ticksRestantes: 1}, entregado: null }`
- `ticksRestantes: 1`, tramo sin saturación -> `{ llego: true, estado: null, entregado:
  cantidad }`
- `ticksRestantes: 1`, tramo con `cargaActual: 20` y `capacidad: 10` -> `entregado = cantidad *
  0.5`
- `avanzarViajeTick(null, grafo)` -> lanza `RangeError`

## Do / Don't
- DO: reusar `calcularSaturacion` para el cálculo por tramo, igual que `resolverViaje`.
- DO: recorrer `grafo[camino[i]][camino[i+1]]` directamente, sin volver a llamar
  `encontrarRuta`.
- DON'T: usar red, `require` de paquetes externos (salvo `calcularSaturacion`, módulo hermano),
  ni acceso a estado global.
- DON'T: registrar carga sobre los tramos desde esta función — leer `cargaActual` es de esta
  tarea, acumularla es de T4 (integración de tick).

## Tests
(Los tests están en `tests/test_avanzar_viaje_tick.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
