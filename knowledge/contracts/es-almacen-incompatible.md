---
type: 'Task Contract'
title: 'Es almacén incompatible'
description: 'Funcion pura que determina si dos tipos de almacen (organico, petroleo) son incompatibles entre si y no pueden compartir el mismo almacen.'
tags: ['motor-almacenes', 'flow-city', 'petroleo']

task: es-almacen-incompatible
intent: "Determinar si dos tipos de almacen son incompatibles entre si (petroleo y organico no pueden mezclarse)."
target: src/esAlmacenIncompatible.js
signature: "function esAlmacenIncompatible(tipoAlmacenA, tipoAlmacenB)"
test_command: "node tests/test_es_almacen_incompatible.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_es_almacen_incompatible.js"
tests_sha256: "f89b848d3fc062e75b98e10e6433b24da483b00e10cf1c664da847b40ab144ea"
touch_only: ['src/esAlmacenIncompatible.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Es almacén incompatible

## Intent
Cuarta pieza del [Contrato 41](../../specs/CONTRACT-41-petroleo-refinería-almacen-tipado.md):
`DEFINITION.md` establece que los almacenes que guardan petróleo no pueden compartirse con
productos orgánicos. Esta función es el chequeo booleano puro de esa regla, sobre dos etiquetas
de tipo (`'organico'`/`'petroleo'`), independiente de la forma real del almacén (aplica tanto a
`crearAlmacen` genérico "orgánico" como a `crearAlmacenPetroleo`).

## Interface
```
function esAlmacenIncompatible(tipoAlmacenA, tipoAlmacenB)
```
Devuelve un booleano.

## Invariants
- `esAlmacenIncompatible('petroleo', 'organico') === true` y
  `esAlmacenIncompatible('organico', 'petroleo') === true` (simétrico).
- `esAlmacenIncompatible('petroleo', 'petroleo') === false` y
  `esAlmacenIncompatible('organico', 'organico') === false` (un tipo nunca es incompatible
  consigo mismo).
- `tipoAlmacenA`/`tipoAlmacenB` fuera de `['organico', 'petroleo']`: lanza `RangeError`.

## Examples
- `esAlmacenIncompatible('petroleo', 'organico')` -> `true`
- `esAlmacenIncompatible('petroleo', 'petroleo')` -> `false`
- `esAlmacenIncompatible('petroleo', 'mineral')` -> lanza `RangeError`

## Do / Don't
- DO: validar ambos tipos contra la whitelist `['organico', 'petroleo']` antes de comparar.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: acoplar esta función a la forma real de ningún almacén — opera exclusivamente sobre
  las dos etiquetas de tipo recibidas como argumentos.

## Tests
(Los tests están en `tests/test_es_almacen_incompatible.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
