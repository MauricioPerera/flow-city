---
type: 'Task Contract'
title: 'Agregar stock a almacén de petróleo'
description: 'Funcion que agrega stock de crudo o refinado a un almacen de petroleo, clampeando al espacio libre disponible.'
tags: ['motor-almacenes', 'flow-city', 'petroleo']

task: agregar-stock-almacen-petroleo
intent: "Agregar stock de crudo o refinado a un almacen de petroleo, clampeando al espacio libre disponible."
target: src/agregarStockAlmacenPetroleo.js
signature: "function agregarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad)"
test_command: "node tests/test_agregar_stock_almacen_petroleo.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_agregar_stock_almacen_petroleo.js"
tests_sha256: "e4b918c1c03644b76a25ef1c5ec95c1f5d965b25068782e75cb7f36c5fae4ce2"
touch_only: ['src/agregarStockAlmacenPetroleo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Agregar stock a almacén de petróleo

## Intent
Segunda pieza del [Contrato 41](../../specs/CONTRACT-41-petroleo-refinería-almacen-tipado.md):
mismo patrón que [`agregar-stock-almacen`](./agregar-stock-almacen.md), pero para
[`crear-almacen-petroleo`](./crear-almacen-petroleo.md) — `campo` restringido a los literales
`'crudo'`/`'refinado'` (equivalente de `'materiaPrima'`/`'producto'`).

## Interface
```
function agregarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad)
```
Devuelve `{ aceptado, rechazado }`; muta el `stock<Campo>` correspondiente.

## Invariants
- `campo` debe ser exactamente `'crudo'` o `'refinado'`; cualquier otro valor lanza `RangeError`.
- `cantidad` debe ser un entero positivo; si no, lanza `RangeError`.
- `aceptado = clamp(cantidad, 0, espacioLibre)`, `rechazado = cantidad - aceptado`.
- El campo `stock<Campo>` correspondiente se incrementa exactamente en `aceptado`.

## Examples
- `agregarStockAlmacenPetroleo(almacen, 'crudo', 4)` con espacio de sobra -> `{aceptado:4,
  rechazado:0}`.
- `agregarStockAlmacenPetroleo(almacen, 'refinado', 4)` con solo `2` de espacio libre ->
  `{aceptado:2, rechazado:2}`.
- `agregarStockAlmacenPetroleo(almacen, 'producto', 1)` -> lanza `RangeError`.

## Do / Don't
- DO: seguir exactamente el mismo patrón de `agregar-stock-almacen.js` (clamp, `{aceptado,
  rechazado}`), adaptado a `crudo`/`refinado`.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar `campo` fuera de `['crudo', 'refinado']`.

## Tests
(Los tests están en `tests/test_agregar_stock_almacen_petroleo.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
