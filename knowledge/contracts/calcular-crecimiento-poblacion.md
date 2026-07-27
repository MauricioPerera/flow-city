---
type: 'Task Contract'
title: 'Cálculo de crecimiento de población'
description: 'Funcion pura que calcula el cambio de poblacion segun el indice general de cobertura, la poblacion actual y una tasa base.'
tags: ['motor-poblacion', 'flow-city', 'crecimiento']

task: calcular-crecimiento-poblacion
intent: "Calcular el cambio de poblacion resultante segun el indice general de cobertura, la poblacion actual y una tasa base."
target: src/calcularCrecimientoPoblacion.js
signature: "function calcularCrecimientoPoblacion(poblacionActual, indice, tasaBase)"
test_command: "node tests/test_calcular_crecimiento_poblacion.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_calcular_crecimiento_poblacion.js"
tests_sha256: "9f4a4f61857e23e20fb793f9a0e1ae3e0f43d4ee02efa84bee3e4e44cffa9e03"
touch_only: ['src/calcularCrecimientoPoblacion.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Cálculo de crecimiento de población

## Intent
Tercera pieza del [Contrato 06](../../specs/CONTRACT-06-poblacion.md): traduce el índice
general de cobertura (de [`combinarCoberturas`](./combinar-coberturas.md)) en un cambio de
población. Fórmula fijada en conversación antes de escribir este contrato: proporcional,
centrada en `0.5` — `cambioPoblacion = poblacionActual * tasaBase * (indice - 0.5) * 2`. Con
`indice = 1` (cobertura perfecta) la población crece a `tasaBase` completa; con `indice = 0.5`
no cambia; con `indice = 0` (sin cobertura) decrece a `tasaBase` completa. Ver
[DEFINITION.md](../../DEFINITION.md), sección "Población".

El resultado NO se redondea a entero — es responsabilidad de quien acumule el cambio sobre el
contador de población real (tarea futura) decidir cómo redondear/acumular fracciones de
persona entre ticks.

## Interface
```
function calcularCrecimientoPoblacion(poblacionActual, indice, tasaBase)
```
Devuelve un número (puede ser negativo, positivo o `0`; no necesariamente entero).

## Invariants
- `calcularCrecimientoPoblacion(p, 1, t) === p * t` (crecimiento máximo).
- `calcularCrecimientoPoblacion(p, 0.5, t) === 0` (equilibrio, para cualquier `p`/`t` válidos).
- `calcularCrecimientoPoblacion(p, 0, t) === -p * t` (decrecimiento máximo).
- `calcularCrecimientoPoblacion(0, indice, t) === 0` (sin población no hay cambio posible,
  para cualquier `indice`/`t` válidos).
- `poblacionActual` negativa o no entera: lanza `RangeError`.
- `indice` fuera de `[0, 1]` o no finito: lanza `RangeError`.
- `tasaBase <= 0` o no finita: lanza `RangeError`.

## Examples
- `calcularCrecimientoPoblacion(100, 1, 0.1)` -> `10`
- `calcularCrecimientoPoblacion(100, 0.5, 0.1)` -> `0`
- `calcularCrecimientoPoblacion(100, 0, 0.1)` -> `-10`
- `calcularCrecimientoPoblacion(100, 0.75, 0.1)` -> `5`
- `calcularCrecimientoPoblacion(0, 1, 0.1)` -> `0`

## Do / Don't
- DO: aplicar la fórmula fijada exactamente (`poblacionActual * tasaBase * (indice - 0.5) *
  2`), sin variantes.
- DO: validar los tres parámetros antes de calcular.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: redondear el resultado a entero dentro de esta función.

## Tests
(Los tests están en `tests/test_calcular_crecimiento_poblacion.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
