---
type: 'Task Contract'
title: 'Inicio del estado de un viaje en tránsito'
description: 'Funcion pura que crea el estado inicial de un viaje que va a tardar mas de 1 tick en llegar a destino.'
tags: ['motor-trafico', 'flow-city', 'tick', 'multi-tick']

task: iniciar-viaje-en-transito
intent: "Crear el estado inicial de un viaje que va a tardar mas de 1 tick en llegar a destino."
target: src/iniciarViajeEnTransito.js
signature: "function iniciarViajeEnTransito(camino, tipoTrafico, cantidad, ticksRestantes)"
test_command: "node tests/test_iniciar_viaje_en_transito.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_iniciar_viaje_en_transito.js"
tests_sha256: "5773a5122d7c19f3dd338d42c44f0ae878bea6fa19f3cefc632da1a7305001b0"
touch_only: ['src/iniciarViajeEnTransito.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Inicio del estado de un viaje en tránsito

## Intent
Segunda pieza del [Contrato 08](../../specs/CONTRACT-08-viajes-multitick.md): cuando
[`calcularTicksViaje`](./calcular-ticks-viaje.md) determina que un trayecto tarda más de 1
tick, hace falta un estado persistente que sobreviva entre llamadas a la resolución de tick
(T4) — esta función lo crea. Ver [DEFINITION.md](../../DEFINITION.md), sección "Rutas y
tráfico".

## Interface
```
function iniciarViajeEnTransito(camino, tipoTrafico, cantidad, ticksRestantes)
```
Devuelve `{ camino, tipoTrafico, cantidad, ticksRestantes }`.

## Invariants
- Los 4 campos del objeto devuelto son exactamente los 4 argumentos recibidos, sin
  transformación.
- `camino` debe ser un array de al menos 2 elementos (un viaje en tránsito implica
  desplazamiento real entre al menos dos vértices); si no, lanza `RangeError`.
- `tipoTrafico` debe ser `'mercaderia'` o `'personas'` (nunca `'ambos'`); si no, lanza
  `RangeError`.
- `cantidad` debe ser un entero positivo; si no, lanza `RangeError`.
- `ticksRestantes` debe ser un entero positivo (`>= 1`); si no, lanza `RangeError` (un viaje que
  resuelve en `0` ticks no necesita este estado — se resuelve instantáneamente con
  [`resolverViaje`](./resolver-viaje.md)).

## Examples
- `iniciarViajeEnTransito(['A','B','C'], 'mercaderia', 10, 3)` -> `{ camino: ['A','B','C'],
  tipoTrafico: 'mercaderia', cantidad: 10, ticksRestantes: 3 }`
- `iniciarViajeEnTransito(['A'], 'mercaderia', 10, 3)` -> lanza `RangeError` (camino de un solo
  vértice)
- `iniciarViajeEnTransito(['A','B'], 'ambos', 10, 3)` -> lanza `RangeError`
- `iniciarViajeEnTransito(['A','B'], 'mercaderia', 10, 0)` -> lanza `RangeError`

## Do / Don't
- DO: validar los 4 argumentos antes de construir el objeto de estado.
- DO: mantener el objeto de estado plano, sin campos derivados ni calculados.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar `tipoTrafico: 'ambos'` — un viaje en tránsito siempre transporta un tipo
  concreto.

## Tests
(Los tests están en `tests/test_iniciar_viaje_en_transito.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
