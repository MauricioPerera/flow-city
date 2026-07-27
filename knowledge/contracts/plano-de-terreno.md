---
type: 'Task Contract'
title: 'Plano de terreno'
description: 'Funcion pura que deriva el plano de elevacion (elevada o base) directamente del tipo de terreno de una celda.'
tags: ['motor-rutas', 'flow-city', 'elevacion', 'terreno']

task: plano-de-terreno
intent: "Derivar el plano de elevacion de una celda directamente de su tipo de terreno."
target: src/planoDeTerreno.js
signature: "function planoDeTerreno(tipoTerreno)"
test_command: "node tests/test_plano_de_terreno.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_plano_de_terreno.js"
tests_sha256: "5e9117e1323fa6173858a4b4e985a1224574002b1b0f72ae58bb97634af06c3e"
touch_only: ['src/planoDeTerreno.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Plano de terreno

## Intent
Primera pieza del [Contrato 39](../../specs/CONTRACT-39-elevacion-terreno-rutas.md):
`DEFINITION.md` establece que el terreno tiene planos de elevación (terreno elevado, frente al
resto). En vez de introducir estado nuevo por celda, el plano se DERIVA directamente del
`tipoTerreno` ya existente: `'elevada'` es el único plano distinto, todo lo demás
(`'verde'`, `'agua_profunda'`, `'neutra'`) es el plano `'base'`.

## Interface
```
function planoDeTerreno(tipoTerreno)
```
Devuelve `'elevada'` o `'base'`.

## Invariants
- `planoDeTerreno('elevada') === 'elevada'`.
- `planoDeTerreno('verde') === 'base'`, `planoDeTerreno('agua_profunda') === 'base'`,
  `planoDeTerreno('neutra') === 'base'`.
- `tipoTerreno` fuera de `['verde', 'elevada', 'agua_profunda', 'neutra']`: lanza `RangeError`.

## Examples
- `planoDeTerreno('elevada')` -> `'elevada'`
- `planoDeTerreno('agua_profunda')` -> `'base'`
- `planoDeTerreno('lava')` -> lanza `RangeError`

## Do / Don't
- DO: validar `tipoTerreno` contra la misma whitelist de 4 terrenos que usa `crearGrid`/
  `puedeConstruir` (redeclarada localmente, siguiendo la convención ya establecida del
  proyecto).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: introducir un tercer plano ni estado nuevo por celda — la derivación es directa desde
  `tipoTerreno`, sin excepciones.

## Tests
(Los tests están en `tests/test_plano_de_terreno.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
