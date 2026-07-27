---
type: 'Task Contract'
title: 'Cálculo del monto de una venta'
description: 'Funcion pura que calcula el monto de ingreso de una venta, dada la cantidad vendida y el precio unitario.'
tags: ['motor-comercio', 'flow-city', 'economia']

task: calcular-monto-venta
intent: "Calcular el monto de ingreso de una venta, dada la cantidad vendida y el precio unitario."
target: src/calcularMontoVenta.js
signature: "function calcularMontoVenta(cantidad, precioUnitario)"
test_command: "node tests/test_calcular_monto_venta.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_calcular_monto_venta.js"
tests_sha256: "d57c3c573c39f39cc45f8701c09451ccd40a0ca249a219ce3a68b4eaf7730cdf"
touch_only: ['src/calcularMontoVenta.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Cálculo del monto de una venta

## Intent
Segunda pieza del [Contrato 07](../../specs/CONTRACT-07-comercio.md): "el dinero es un
resultado derivado de la venta" (`DEFINITION.md`, sección "Comercio y economía"). Esta función
calcula el monto de ingreso a partir de la cantidad efectivamente vendida y un precio unitario;
el monto resultante se pasa luego a
[`registrarIngreso`](./registrar-ingreso.md) (Contrato 05).

`cantidad` acepta valores no enteros porque puede provenir de la cantidad `entregado` de
[`resolverViaje`](./resolver-viaje.md) (Contrato 04), que ya puede ser fraccionaria por pérdida
proporcional de saturación.

## Interface
```
function calcularMontoVenta(cantidad, precioUnitario)
```
Devuelve un número `>= 0`.

## Invariants
- El resultado es exactamente `cantidad * precioUnitario`.
- `cantidad === 0` es válido y devuelve `0` (nada vendido no es un error).
- `cantidad < 0` o no finita: lanza `RangeError`.
- `precioUnitario <= 0` o no finito: lanza `RangeError` (un precio de venta siempre es
  positivo).

## Examples
- `calcularMontoVenta(10, 5)` -> `50`
- `calcularMontoVenta(0, 5)` -> `0`
- `calcularMontoVenta(7.5, 4)` -> `30`
- `calcularMontoVenta(10, 0)` -> lanza `RangeError`
- `calcularMontoVenta(-1, 5)` -> lanza `RangeError`

## Do / Don't
- DO: aceptar `cantidad` fraccionaria (no forzar enteros).
- DO: validar ambos parámetros antes de multiplicar.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar un `precioUnitario` `0` o negativo.

## Tests
(Los tests están en `tests/test_calcular_monto_venta.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
