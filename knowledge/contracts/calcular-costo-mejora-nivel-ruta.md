---
type: 'Task Contract'
title: 'Costo de mejora de nivel de ruta'
description: 'Funcion pura que devuelve el costo de mejorar una ruta existente de un nivel a otro superior, pagando solo la diferencia; nunca permite degradar.'
tags: ['motor-rutas', 'motor-economia', 'flow-city', 'nivel']

task: calcular-costo-mejora-nivel-ruta
intent: "Calcular el costo de mejorar una ruta existente a un nivel superior, pagando la diferencia; rechazar cualquier intento de degradar o mantener el mismo nivel."
target: src/calcularCostoMejoraNivelRuta.js
signature: "function calcularCostoMejoraNivelRuta(nivelActual, nivelNuevo)"
test_command: "node tests/test_calcular_costo_mejora_nivel_ruta.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_calcular_costo_mejora_nivel_ruta.js"
tests_sha256: "530f3ac9fca032704541c91349636ad37c9a02876ae4ac35b36b5d0a667e8f13"
touch_only: ['src/calcularCostoMejoraNivelRuta.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Costo de mejora de nivel de ruta

## Intent
Cuarta pieza del [Contrato 40](../../specs/CONTRACT-40-rutas-escaladas-por-nivel.md):
`DEFINITION.md` establece que una ruta ya existente puede mejorarse de nivel pagando la
diferencia de costo, pero nunca se puede degradar de nivel. Compone (sin editar)
[`calcular-costo-construccion-ruta-por-nivel`](./calcular-costo-construccion-ruta-por-nivel.md).

## Interface
```
function calcularCostoMejoraNivelRuta(nivelActual, nivelNuevo)
```
Devuelve un entero positivo (la diferencia de costo).

## Invariants
- El orden de nivel es `S < M < L`. Si `nivelNuevo` NO es estrictamente superior a
  `nivelActual` (mismo nivel o degradación): lanza `RangeError`.
- Si `nivelNuevo` es superior: devuelve exactamente
  `calcularCostoConstruccionRutaPorNivel(nivelNuevo) - calcularCostoConstruccionRutaPorNivel(nivelActual)`.
- `nivelActual`/`nivelNuevo` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `calcularCostoMejoraNivelRuta('S', 'M')` -> `20` (`40 - 20`)
- `calcularCostoMejoraNivelRuta('S', 'L')` -> `50` (`70 - 20`)
- `calcularCostoMejoraNivelRuta('M', 'S')` -> lanza `RangeError` (degradar)
- `calcularCostoMejoraNivelRuta('S', 'S')` -> lanza `RangeError` (mismo nivel)

## Do / Don't
- DO: reusar `calcularCostoConstruccionRutaPorNivel` — ninguna tabla de costo se reimplementa.
- DO: validar el orden ANTES de calcular la diferencia — nunca devolver un número negativo o
  cero.
- DON'T: usar red, `require` de paquetes externos (salvo el módulo hermano ya listado), ni
  acceso a estado global.
- DON'T: permitir `nivelNuevo === nivelActual` como caso válido — no hay "mejora" a costo `0`.

## Tests
(Los tests están en `tests/test_calcular_costo_mejora_nivel_ruta.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
