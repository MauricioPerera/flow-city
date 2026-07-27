---
type: 'Task Contract'
title: 'Cálculo de ticks que tarda un viaje'
description: 'Funcion pura que calcula cuantos ticks completos tarda un trayecto, dada su distancia total y una velocidad base.'
tags: ['motor-trafico', 'flow-city', 'tick', 'multi-tick']

task: calcular-ticks-viaje
intent: "Calcular cuantos ticks completos tarda un trayecto, dada su distancia total y una velocidad base."
target: src/calcularTicksViaje.js
signature: "function calcularTicksViaje(distanciaTotal, velocidadBase)"
test_command: "node tests/test_calcular_ticks_viaje.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_calcular_ticks_viaje.js"
tests_sha256: "7a53e15cf8e15a75eb4c11f44f53e0cf732f61d6ea2ba200e8300fbf5238d5aa"
touch_only: ['src/calcularTicksViaje.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Cálculo de ticks que tarda un viaje

## Intent
Primera pieza del [Contrato 08](../../specs/CONTRACT-08-viajes-multitick.md): "la distancia
real de un tramo determina cuántos ticks tarda un trayecto" (`DEFINITION.md`, sección "Rutas y
tráfico"). Esta función convierte la `distanciaTotal` de un camino (suma de `longitud` de sus
tramos, tal como la devuelve [`encontrarRuta`](./encontrar-ruta.md)) en la cantidad de ticks
completos que tarda el trayecto, dada una velocidad base (unidades de distancia por tick).

## Interface
```
function calcularTicksViaje(distanciaTotal, velocidadBase)
```
Devuelve un entero `>= 0`.

## Invariants
- El resultado es `Math.ceil(distanciaTotal / velocidadBase)` — redondeo SIEMPRE hacia arriba
  (un trayecto que no completa un tick entero igual ocupa ese tick completo).
- `distanciaTotal === 0` devuelve `0` (llegada inmediata, sin tránsito).
- `distanciaTotal` negativa o no finita: lanza `RangeError`.
- `velocidadBase <= 0` o no finita: lanza `RangeError`.

## Examples
- `calcularTicksViaje(10, 5)` -> `2`
- `calcularTicksViaje(11, 5)` -> `3` (`ceil(2.2)`)
- `calcularTicksViaje(0, 5)` -> `0`
- `calcularTicksViaje(1, 5)` -> `1`
- `calcularTicksViaje(-1, 5)` -> lanza `RangeError`

## Do / Don't
- DO: usar `Math.ceil`, nunca `Math.round` ni `Math.floor` (un trayecto parcial sigue ocupando
  el tick completo).
- DO: tratar `distanciaTotal === 0` como caso trivial de `0` ticks.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: modelar variación de velocidad por saturación dentro de esta función — es solo el
  cálculo de tiempo base, la saturación variable en tránsito queda fuera de este contrato (ver
  condición de aborto en `specs/CONTRACT-08-viajes-multitick.md`).

## Tests
(Los tests están en `tests/test_calcular_ticks_viaje.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
