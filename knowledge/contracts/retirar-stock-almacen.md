---
type: 'Task Contract'
title: 'Retirar stock de un almacén'
description: 'Funcion que retira una cantidad de materia prima o producto de un almacen, limitada al stock realmente disponible.'
tags: ['motor-almacenes', 'flow-city', 'produccion']

task: retirar-stock-almacen
intent: "Retirar una cantidad de materia prima o producto de un almacen, limitada al stock disponible."
target: src/retirarStockAlmacen.js
signature: "function retirarStockAlmacen(almacen, campo, cantidad)"
test_command: "node tests/test_retirar_stock_almacen.js"
budget:
  max_cyclomatic_complexity: 7
  max_nesting_depth: 2
tests: "tests/test_retirar_stock_almacen.js"
tests_sha256: "19b2c5eb43ebec140785950bc52078069cd58146d9225c8cce989069cbfddb6c"
touch_only: ['src/retirarStockAlmacen.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Retirar stock de un almacén

## Intent
Tercera pieza del [Contrato 10](../../specs/CONTRACT-10-almacenes.md): simétrica a
[`agregarStockAlmacen`](./agregar-stock-almacen.md), retira (para transportar, o para
consumir como materia prima de producción) una cantidad de un almacén, limitada a lo que
realmente hay disponible — nunca deja el stock en negativo.

## Interface
```
function retirarStockAlmacen(almacen, campo, cantidad)
```
`campo` es `'materiaPrima'` o `'producto'`. Muta el stock correspondiente. Devuelve el número
efectivamente retirado.

## Invariants
- El resultado es exactamente `Math.min(cantidad, stockActual)`.
- El stock del campo correspondiente disminuye exactamente en el valor retirado; el otro campo
  no se toca.
- El stock resultante nunca es negativo (si se pide más de lo disponible, se retira todo lo que
  hay y el stock queda en `0`).
- `campo` fuera de `['materiaPrima', 'producto']`: lanza `RangeError`.
- `cantidad <= 0` o no entera: lanza `RangeError`.
- `almacen` `null` o no-objeto: lanza `RangeError`.

## Examples
- Almacén con `stockMateriaPrima: 7`: `retirarStockAlmacen(almacen, 'materiaPrima', 5)` -> `5`,
  `stockMateriaPrima` pasa a `2`.
- Almacén con `stockMateriaPrima: 3`: `retirarStockAlmacen(almacen, 'materiaPrima', 10)` -> `3`,
  `stockMateriaPrima` pasa a `0`.
- Almacén sin stock: `retirarStockAlmacen(almacen, 'materiaPrima', 5)` -> `0`.
- `retirarStockAlmacen(almacen, 'volador', 5)` -> lanza `RangeError`

## Do / Don't
- DO: clampear el retiro con `Math.min`, nunca dejar el stock negativo.
- DO: mantener los campos `materiaPrima` y `producto` completamente independientes.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: lanzar una excepción cuando no hay stock suficiente — retirar `0` (o menos de lo
  pedido) es un resultado legítimo, no un error.

## Tests
(Los tests están en `tests/test_retirar_stock_almacen.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
