---
type: 'Task Contract'
title: 'Retirar stock de almacén de petróleo'
description: 'Funcion que retira stock de crudo o refinado de un almacen de petroleo, limitado al stock disponible.'
tags: ['motor-almacenes', 'flow-city', 'petroleo']

task: retirar-stock-almacen-petroleo
intent: "Retirar stock de crudo o refinado de un almacen de petroleo, limitado al stock disponible."
target: src/retirarStockAlmacenPetroleo.js
signature: "function retirarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad)"
test_command: "node tests/test_retirar_stock_almacen_petroleo.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_retirar_stock_almacen_petroleo.js"
tests_sha256: "6ed7e33d5fd4ea0e5cfcfc42250bc70aeca257b2b21ffccbe665099751348471"
touch_only: ['src/retirarStockAlmacenPetroleo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Retirar stock de almacén de petróleo

## Intent
Tercera pieza del [Contrato 41](../../specs/CONTRACT-41-petroleo-refinería-almacen-tipado.md):
mismo patrón que [`retirar-stock-almacen`](./retirar-stock-almacen.md), pero para
[`crear-almacen-petroleo`](./crear-almacen-petroleo.md).

## Interface
```
function retirarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad)
```
Devuelve la cantidad efectivamente retirada (número); muta el `stock<Campo>` correspondiente.

## Invariants
- `campo` debe ser exactamente `'crudo'` o `'refinado'`; cualquier otro valor lanza `RangeError`.
- `cantidad` debe ser un entero positivo; si no, lanza `RangeError`.
- El valor devuelto es exactamente `Math.min(cantidad, stock<Campo>Actual)`.
- El `stock<Campo>` correspondiente se decrementa exactamente en el valor devuelto.

## Examples
- `retirarStockAlmacenPetroleo(almacen, 'crudo', 3)` con `5` de stock -> devuelve `3`, stock
  queda en `2`.
- `retirarStockAlmacenPetroleo(almacen, 'refinado', 5)` con solo `2` de stock -> devuelve `2`
  (no `5`), stock queda en `0`.

## Do / Don't
- DO: seguir exactamente el mismo patrón de `retirar-stock-almacen.js`, adaptado a
  `crudo`/`refinado`.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar `campo` fuera de `['crudo', 'refinado']`.

## Tests
(Los tests están en `tests/test_retirar_stock_almacen_petroleo.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
