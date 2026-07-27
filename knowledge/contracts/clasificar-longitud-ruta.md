---
type: 'Task Contract'
title: 'Clasificar longitud de ruta'
description: 'Funcion pura que clasifica una ruta como corta o larga segun un umbral fijo de longitud.'
tags: ['motor-rutas', 'flow-city', 'combustible']

task: clasificar-longitud-ruta
intent: "Clasificar una ruta como corta o larga segun un umbral fijo de longitud."
target: src/clasificarLongitudRuta.js
signature: "function clasificarLongitudRuta(longitud)"
test_command: "node tests/test_clasificar_longitud_ruta.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_clasificar_longitud_ruta.js"
tests_sha256: "0a18bf53f0d15e1e8d4e4993856b1f45865bd8d1e7938b90ed503be5cec207d4"
touch_only: ['src/clasificarLongitudRuta.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Clasificar longitud de ruta

## Intent
Primera pieza del [Contrato 42](../../specs/CONTRACT-42-combustible-trafico-degradado.md):
`DEFINITION.md` menciona rutas marítimas "largas" que conectan islas/continentes. Umbral fijo
(ad hoc, no especificado por el usuario, elegido consistente con los valores ya usados en el
Contrato 31 — `5`=corta, `25`=larga): `longitud >= 15` es `'larga'`.

## Interface
```
function clasificarLongitudRuta(longitud)
```
Devuelve `'corta'` o `'larga'`.

## Invariants
- `longitud < 15`: devuelve `'corta'`.
- `longitud >= 15`: devuelve `'larga'`.
- `longitud <= 0`: lanza `RangeError`.

## Examples
- `clasificarLongitudRuta(5)` -> `'corta'`
- `clasificarLongitudRuta(15)` -> `'larga'` (el umbral mismo cuenta como larga)
- `clasificarLongitudRuta(0)` -> lanza `RangeError`

## Do / Don't
- DO: usar un único umbral fijo (`15`), sin escalones intermedios.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: reusar `tramo.longitud` de un tramo real dentro de esta función — recibe el número
  directo, sin acoplarse a la forma de `crearTramo`.

## Tests
(Los tests están en `tests/test_clasificar_longitud_ruta.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
