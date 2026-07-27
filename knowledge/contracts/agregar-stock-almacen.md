---
type: 'Task Contract'
title: 'Agregar stock a un almacén'
description: 'Funcion que agrega una cantidad de materia prima o producto a un almacen, respetando su capacidad y devolviendo cuanto entro y cuanto no cupo.'
tags: ['motor-almacenes', 'flow-city', 'produccion']

task: agregar-stock-almacen
intent: "Agregar una cantidad de materia prima o producto a un almacen, respetando su capacidad, devolviendo cuanto entro y cuanto fue rechazado."
target: src/agregarStockAlmacen.js
signature: "function agregarStockAlmacen(almacen, campo, cantidad)"
test_command: "node tests/test_agregar_stock_almacen.js"
budget:
  max_cyclomatic_complexity: 7
  max_nesting_depth: 2
tests: "tests/test_agregar_stock_almacen.js"
tests_sha256: "5feb70ac33c1595cd820542554b55c4f713d0d09e63d79e003c3d12dc56ba6af"
touch_only: ['src/agregarStockAlmacen.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Agregar stock a un almacén

## Intent
Segunda pieza del [Contrato 10](../../specs/CONTRACT-10-almacenes.md): agrega una cantidad de
materia prima o producto a un almacén (creado por [`crearAlmacen`](./crear-almacen.md)),
respetando su capacidad independiente de cada campo. Lo que no entra se reporta como
`rechazado`, para que quien orqueste decida qué hacer con el excedente (ej. no consumirlo,
perderlo, o intentarlo en otro almacén — decisión fuera del alcance de esta función).

## Interface
```
function agregarStockAlmacen(almacen, campo, cantidad)
```
`campo` es `'materiaPrima'` o `'producto'`. Muta `almacen.stockMateriaPrima` o
`almacen.stockProducto` según corresponda. Devuelve `{ aceptado, rechazado }`.

## Invariants
- `aceptado + rechazado === cantidad` siempre.
- `aceptado === Math.min(cantidad, capacidad - stockActual)`, nunca negativo (si el almacén ya
  está lleno o sobre su capacidad, `aceptado === 0`).
- El stock del campo correspondiente aumenta exactamente en `aceptado`; el otro campo (el que
  NO se tocó) permanece sin cambios.
- `campo` fuera de `['materiaPrima', 'producto']`: lanza `RangeError`.
- `cantidad <= 0` o no entera: lanza `RangeError`.
- `almacen` `null` o no-objeto: lanza `RangeError`.

## Examples
- Almacén `{capacidadMateriaPrima:10, stockMateriaPrima:7}`:
  `agregarStockAlmacen(almacen, 'materiaPrima', 5)` -> `{ aceptado: 3, rechazado: 2 }`,
  `stockMateriaPrima` pasa a `10`.
- Almacén lleno: `agregarStockAlmacen(almacenLleno, 'materiaPrima', 1)` -> `{ aceptado: 0,
  rechazado: 1 }`.
- `agregarStockAlmacen(almacen, 'volador', 5)` -> lanza `RangeError`
- `agregarStockAlmacen(almacen, 'materiaPrima', 0)` -> lanza `RangeError`

## Do / Don't
- DO: clampear `aceptado` con `Math.max(0, Math.min(...))`.
- DO: mantener los campos `materiaPrima` y `producto` completamente independientes (nunca
  restar de uno lo que sobra del otro).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: lanzar una excepción cuando el almacén está lleno — `rechazado > 0` es un resultado
  legítimo, no un error.

## Tests
(Los tests están en `tests/test_agregar_stock_almacen.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
