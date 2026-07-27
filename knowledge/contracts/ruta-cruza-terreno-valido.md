---
type: 'Task Contract'
title: 'Ruta cruza terreno válido'
description: 'Funcion pura que determina si una ruta puede conectar dos celdas de terreno dado, segun su tipo (carretera nunca sobre agua, maritima nunca sobre tierra, ferrocarril/subte exentos).'
tags: ['motor-rutas', 'flow-city', 'terreno']

task: ruta-cruza-terreno-valido
intent: "Determinar si una ruta puede conectar dos celdas de terreno dado, segun las restricciones fisicas de su tipo."
target: src/rutaCruzaTerrenoValido.js
signature: "function rutaCruzaTerrenoValido(terrenoOrigen, terrenoDestino, tipoRuta)"
test_command: "node tests/test_ruta_cruza_terreno_valido.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 1
tests: "tests/test_ruta_cruza_terreno_valido.js"
tests_sha256: "0e017955922ac955c5770e1efd79dd10521fd0e15d71e04d4c8ed6e7f67980fc"
touch_only: ['src/rutaCruzaTerrenoValido.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ruta cruza terreno válido

## Intent
Segunda pieza del [Contrato 39](../../specs/CONTRACT-39-elevacion-terreno-rutas.md):
`DEFINITION.md` establece que las rutas terrestres (carretera) nunca pueden cruzar agua
profunda, y las marítimas nunca pueden cruzar tierra. Esta función es el chequeo físico de
terreno, INDEPENDIENTE del chequeo de elevación (ver
[`ruta-puede-cambiar-plano`](./ruta-puede-cambiar-plano.md)) — ambos se combinan en la
integración (T4).

## Interface
```
function rutaCruzaTerrenoValido(terrenoOrigen, terrenoDestino, tipoRuta)
```
Devuelve un booleano.

## Invariants
- `tipoRuta === 'carretera'`: devuelve `false` si `terrenoOrigen === 'agua_profunda'` O
  `terrenoDestino === 'agua_profunda'`; `true` en cualquier otro caso.
- `tipoRuta === 'maritima'`: devuelve `false` si `terrenoOrigen !== 'agua_profunda'` O
  `terrenoDestino !== 'agua_profunda'`; `true` solo si AMBOS son `agua_profunda`.
- `tipoRuta === 'ferrocarril'` o `tipoRuta === 'subte'`: siempre `true` (exentos de esta
  restricción, per `DEFINITION.md`).
- `terrenoOrigen`/`terrenoDestino` fuera de `['verde', 'elevada', 'agua_profunda', 'neutra']`:
  lanza `RangeError`.
- `tipoRuta` fuera de `['carretera', 'ferrocarril', 'maritima', 'subte']`: lanza `RangeError`.

## Examples
- `rutaCruzaTerrenoValido('verde', 'agua_profunda', 'carretera')` -> `false`
- `rutaCruzaTerrenoValido('agua_profunda', 'agua_profunda', 'maritima')` -> `true`
- `rutaCruzaTerrenoValido('agua_profunda', 'elevada', 'subte')` -> `true` (exento)
- `rutaCruzaTerrenoValido('verde', 'verde', 'aerea')` -> lanza `RangeError`

## Do / Don't
- DO: validar ambos terrenos y el tipo de ruta contra las mismas whitelists ya usadas en
  `crearGrid`/`crearTramo` (redeclaradas localmente, convención ya establecida del proyecto).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: mezclar el chequeo de elevación en esta función — es exclusivamente terreno físico
  (agua vs. tierra), la elevación es una función separada.

## Tests
(Los tests están en `tests/test_ruta_cruza_terreno_valido.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
