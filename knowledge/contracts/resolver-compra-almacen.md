---
type: 'Task Contract'
title: 'Resolución de una compra en un almacén'
description: 'Funcion pura que determina cuanto se compra realmente, limitado al menor entre lo ofrecido por el vehiculo y la capacidad de compra del almacen destino.'
tags: ['motor-comercio', 'flow-city', 'comercio-inter-zona']

task: resolver-compra-almacen
intent: "Determinar cuanto se compra realmente en una transaccion inter-zona, limitado al menor entre lo ofrecido y la capacidad de compra del almacen destino."
target: src/resolverCompraAlmacen.js
signature: "function resolverCompraAlmacen(cantidadOfrecida, capacidadCompraAlmacen)"
test_command: "node tests/test_resolver_compra_almacen.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_resolver_compra_almacen.js"
tests_sha256: "c7e6e4fc3db4b0b89c654062e91cd1d996096da1da9a396e10d8957f1cfac3b0"
touch_only: ['src/resolverCompraAlmacen.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Resolución de una compra en un almacén

## Intent
Tercera pieza del [Contrato 07](../../specs/CONTRACT-07-comercio.md): en el comercio
inter-zona/inter-ciudad, "la transacción siempre está limitada a lo que el ferrocarril o barco
tiene y el puerto o estación del ferrocarril puede comprar" (`DEFINITION.md`, sección "Rutas y
tráfico" / "estaciones de ferrocarril y puertos"). Esta función es esa regla en forma pura: el
menor entre lo que el vehículo ofrece y la capacidad de compra restante del almacén destino.

## Interface
```
function resolverCompraAlmacen(cantidadOfrecida, capacidadCompraAlmacen)
```
Devuelve un número `>= 0`.

## Invariants
- El resultado es exactamente `Math.min(cantidadOfrecida, capacidadCompraAlmacen)`.
- `cantidadOfrecida === 0` o `capacidadCompraAlmacen === 0` son válidos y devuelven `0`.
- Cualquiera de los dos argumentos negativo o no finito: lanza `RangeError`.

## Examples
- `resolverCompraAlmacen(10, 15)` -> `10` (se vende todo lo ofrecido)
- `resolverCompraAlmacen(15, 10)` -> `10` (limitado por el almacén)
- `resolverCompraAlmacen(0, 10)` -> `0`
- `resolverCompraAlmacen(10, 0)` -> `0`
- `resolverCompraAlmacen(-1, 10)` -> lanza `RangeError`

## Do / Don't
- DO: usar `Math.min` directamente, sin condicionales redundantes.
- DO: validar ambos parámetros antes de comparar.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: asumir que `cantidadOfrecida` y `capacidadCompraAlmacen` son enteros — ambos pueden ser
  fraccionarios (mismo motivo que `calcular-monto-venta`: pueden provenir de `entregado` de
  `resolverViaje`).

## Tests
(Los tests están en `tests/test_resolver_compra_almacen.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
