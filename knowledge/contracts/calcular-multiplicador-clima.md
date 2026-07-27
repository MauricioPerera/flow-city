---
type: 'Task Contract'
title: 'Multiplicador de clima por estación'
description: 'Funcion pura que devuelve el multiplicador de produccion asociado a una estacion del ano (bonus en verano, penalizacion en invierno, neutral en otono/primavera).'
tags: ['motor-calendario', 'motor-economia', 'flow-city', 'clima']

task: calcular-multiplicador-clima
intent: "Devolver el multiplicador de produccion asociado a una estacion del ano."
target: src/calcularMultiplicadorClima.js
signature: "function calcularMultiplicadorClima(estacion)"
test_command: "node tests/test_calcular_multiplicador_clima.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_calcular_multiplicador_clima.js"
tests_sha256: "8041e971590201c7f15a1bba4bfb7c762fbb56af64c882dac9b9a010b714f776"
touch_only: ['src/calcularMultiplicadorClima.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Multiplicador de clima por estación

## Intent
Primera pieza del [Contrato 29](../../specs/CONTRACT-29-impacto-estacion-produccion.md):
`DEFINITION.md` describe que la estación tiene "impacto propio en clima y por tanto en
producción" — esta función es el mapeo puro estación → multiplicador. Decisión de alcance
confirmada explícitamente por el usuario: verano da bonus de cosecha (`1.5`), invierno
penalización (`0.5`), otoño y primavera son neutrales (`1`).

## Interface
```
function calcularMultiplicadorClima(estacion)
```
Devuelve un número positivo.

## Invariants
- `calcularMultiplicadorClima('verano') === 1.5`.
- `calcularMultiplicadorClima('invierno') === 0.5`.
- `calcularMultiplicadorClima('otono') === 1`.
- `calcularMultiplicadorClima('primavera') === 1`.
- Cualquier valor que no sea exactamente uno de `['otono', 'invierno', 'primavera', 'verano']`
  (incluyendo no-strings) lanza `RangeError`.

## Examples
- `calcularMultiplicadorClima('verano')` -> `1.5`
- `calcularMultiplicadorClima('invierno')` -> `0.5`
- `calcularMultiplicadorClima('otono')` -> `1`
- `calcularMultiplicadorClima('primavera')` -> `1`
- `calcularMultiplicadorClima('verano2')` -> lanza `RangeError`
- `calcularMultiplicadorClima(42)` -> lanza `RangeError`

## Do / Don't
- DO: usar el mismo ciclo de estaciones fijo de [`calendario-de-tick`](./calendario-de-tick.md)
  (`['otono', 'invierno', 'primavera', 'verano']`), sin tilde/eñe.
- DO: validar el valor de entrada antes de mapear (whitelist exacta de las 4 estaciones
  válidas).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar variantes de escritura (mayúsculas, con tilde, etc.) — solo los 4 valores
  exactos que produce `calendarioDeTick`.

## Tests
(Los tests están en `tests/test_calcular_multiplicador_clima.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
