---
type: 'Task Contract'
title: 'Combinación de coberturas de necesidades en un índice general'
description: 'Funcion pura que combina varias coberturas de necesidades individuales en un solo indice general, tomando el minimo (cuello de botella).'
tags: ['motor-poblacion', 'flow-city', 'necesidades']

task: combinar-coberturas
intent: "Combinar varias coberturas de necesidades individuales en un solo indice general, tomando el minimo entre ellas."
target: src/combinarCoberturas.js
signature: "function combinarCoberturas(coberturas)"
test_command: "node tests/test_combinar_coberturas.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_combinar_coberturas.js"
tests_sha256: "6efd03160566ce50e5225fbc08d4834e3c66b73b44f0be2e935f6244fca24e2e"
touch_only: ['src/combinarCoberturas.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Combinación de coberturas de necesidades en un índice general

## Intent
Segunda pieza del [Contrato 06](../../specs/CONTRACT-06-poblacion.md): la población tiene
varias necesidades (agua, comida, muebles, etc.), cada una con su propia cobertura calculada
por [`calcularCoberturaNecesidad`](./calcular-cobertura-necesidad.md). Esta función las combina
en un único índice general que usará T3 (crecimiento). Decisión confirmada en conversación
antes de escribir este contrato: **mínimo** (cuello de botella) — una carencia grave en un
recurso no se compensa con superávit en otro.

## Interface
```
function combinarCoberturas(coberturas)
```
`coberturas` es un array no vacío de números en `[0, 1]`. Devuelve un número en `[0, 1]`.

## Invariants
- El resultado es exactamente `Math.min(...coberturas)`.
- `coberturas` vacío (`[]`) o no-array: lanza `RangeError`.
- Cualquier elemento fuera de `[0, 1]` o no finito (`NaN`, `Infinity`): lanza `RangeError`.

## Examples
- `combinarCoberturas([1, 0.5, 0.8])` -> `0.5`
- `combinarCoberturas([1, 1, 1])` -> `1`
- `combinarCoberturas([1, 1, 0])` -> `0`
- `combinarCoberturas([])` -> lanza `RangeError`

## Do / Don't
- DO: validar que `coberturas` sea un array no vacío antes de calcular el mínimo.
- DO: validar cada elemento contra el rango `[0, 1]` antes de combinar.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: promediar ni ponderar — el modelo fijado es estrictamente el mínimo.

## Tests
(Los tests están en `tests/test_combinar_coberturas.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
