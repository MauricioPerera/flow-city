---
type: 'Task Contract'
title: 'Ruta puede cambiar de plano'
description: 'Funcion pura que determina si una ruta de un nivel dado puede conectar celdas de distinto plano de elevacion.'
tags: ['motor-rutas', 'flow-city', 'elevacion', 'nivel']

task: ruta-puede-cambiar-plano
intent: "Determinar si una ruta de un nivel dado puede conectar celdas de distinto plano de elevacion."
target: src/rutaPuedeCambiarPlano.js
signature: "function rutaPuedeCambiarPlano(nivelRuta)"
test_command: "node tests/test_ruta_puede_cambiar_plano.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_ruta_puede_cambiar_plano.js"
tests_sha256: "977aa61734a72388574e500c82d1b79dc29106d611afb7f073f1369afe9d2b82"
touch_only: ['src/rutaPuedeCambiarPlano.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ruta puede cambiar de plano

## Intent
Tercera pieza del [Contrato 39](../../specs/CONTRACT-39-elevacion-terreno-rutas.md):
`DEFINITION.md` establece que una ruta de nivel S solo conecta puntos dentro de un mismo plano
de elevación; los niveles M y L permiten además cambiar de plano. Esta función es el chequeo de
nivel, independiente del terreno físico (ver
[`ruta-cruza-terreno-valido`](./ruta-cruza-terreno-valido.md)).

## Interface
```
function rutaPuedeCambiarPlano(nivelRuta)
```
Devuelve un booleano.

## Invariants
- `rutaPuedeCambiarPlano('S') === false`.
- `rutaPuedeCambiarPlano('M') === true`.
- `rutaPuedeCambiarPlano('L') === true`.
- `nivelRuta` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `rutaPuedeCambiarPlano('S')` -> `false`
- `rutaPuedeCambiarPlano('M')` -> `true`
- `rutaPuedeCambiarPlano('XL')` -> lanza `RangeError`

## Do / Don't
- DO: usar una tabla fija de 3 valores, sin cálculo derivado.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: recibir ni comparar planos directamente — esta función solo sabe de nivel; la
  comparación de planos de origen/destino es responsabilidad de quien orquesta (T4).

## Tests
(Los tests están en `tests/test_ruta_puede_cambiar_plano.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
