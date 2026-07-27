---
type: 'Task Contract'
title: 'Población total de un conjunto de casas'
description: 'Funcion que suma la poblacion de un conjunto de casas construidas.'
tags: ['motor-poblacion', 'flow-city']

task: poblacion-total-casas
intent: "Sumar la poblacion de un conjunto de casas construidas dentro de la zona de un centro civico."
target: src/poblacionTotalCasas.js
signature: "function poblacionTotalCasas(poblacionesPorCasa)"
test_command: "node tests/test_poblacion_total_casas.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_poblacion_total_casas.js"
tests_sha256: "c3786193e50759a655e80ca9a84376dff41caa389d0d3e3f35381f58d0893345"
touch_only: ['src/poblacionTotalCasas.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Población total de un conjunto de casas

## Intent
Segunda pieza del [Contrato 16](../../specs/CONTRACT-16-poblacion-grid-real.md): agrega la
población de cada casa exitosamente construida (con
[`construirCasaEnZona`](./construir-casa-en-zona.md)) en un único número — la población total
que usará T3 para calcular cobertura de necesidades y crecimiento
([`calcularCrecimientoPoblacion`](./calcular-crecimiento-poblacion.md)).

## Interface
```
function poblacionTotalCasas(poblacionesPorCasa)
```
`poblacionesPorCasa` es un array de enteros positivos (población que aporta cada casa). Devuelve
un entero `>= 0`.

## Invariants
- El resultado es la suma de todos los elementos del array.
- `poblacionesPorCasa` vacío (`[]`) devuelve `0` (todavía no hay casas construidas).
- `poblacionesPorCasa` no-array: lanza `RangeError`.
- Cualquier elemento no entero o `<= 0`: lanza `RangeError`.

## Examples
- `poblacionTotalCasas([10, 10])` -> `20`
- `poblacionTotalCasas([])` -> `0`
- `poblacionTotalCasas([10, 15, 5])` -> `30`
- `poblacionTotalCasas([10, 0])` -> lanza `RangeError`
- `poblacionTotalCasas('no-es-array')` -> lanza `RangeError`

## Do / Don't
- DO: validar el array y cada elemento antes de sumar.
- DO: devolver `0` para un array vacío, sin error.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar poblaciones `0` o negativas por casa — una casa construida siempre aporta
  población positiva.

## Tests
(Los tests están en `tests/test_poblacion_total_casas.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
