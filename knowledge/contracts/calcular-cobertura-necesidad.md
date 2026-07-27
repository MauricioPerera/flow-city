---
type: 'Task Contract'
title: 'Cálculo de cobertura de una necesidad'
description: 'Funcion pura que calcula que fraccion de una necesidad de poblacion esta cubierta, dado lo requerido y lo recibido.'
tags: ['motor-poblacion', 'flow-city', 'necesidades']

task: calcular-cobertura-necesidad
intent: "Calcular que fraccion de una necesidad esta cubierta, dado un requerimiento y una cantidad recibida."
target: src/calcularCoberturaNecesidad.js
signature: "function calcularCoberturaNecesidad(requerido, recibido)"
test_command: "node tests/test_calcular_cobertura_necesidad.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_calcular_cobertura_necesidad.js"
tests_sha256: "c154e367faf602be9a5ae3645fe1a72ea00f736ae050d01704f36a936196c316"
touch_only: ['src/calcularCoberturaNecesidad.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Cálculo de cobertura de una necesidad

## Intent
Primera pieza del [Contrato 06](../../specs/CONTRACT-06-poblacion.md): la población tiene
necesidades (agua, comida, muebles, etc. — `DEFINITION.md`, sección "Población"). Esta función
es la unidad atómica de esa mecánica: dado cuánto se REQUIERE de un recurso concreto y cuánto
se RECIBIÓ efectivamente, calcula la fracción de cobertura (0 = nada cubierto, 1 = totalmente
cubierto). Será la base de T2 (combinar varias coberturas en un índice general de crecimiento).

## Interface
```
function calcularCoberturaNecesidad(requerido, recibido)
```
Devuelve un número en `[0, 1]`.

## Invariants
- El resultado está siempre en el rango `[0, 1]`; nunca negativo ni mayor a 1 (un superávit de
  `recibido` no sobre-satisface la necesidad).
- Si `requerido === 0` (no hay necesidad de ese recurso): el resultado es siempre `1`, sin
  importar `recibido` (una necesidad inexistente está trivialmente cubierta).
- Si `requerido > 0`: el resultado es `min(1, recibido / requerido)`.
- `requerido < 0`, `recibido < 0`, o cualquiera de los dos no finito (`NaN`, `Infinity`): lanza
  `RangeError`.

## Examples
- `calcularCoberturaNecesidad(10, 10)` -> `1`
- `calcularCoberturaNecesidad(10, 5)` -> `0.5`
- `calcularCoberturaNecesidad(10, 20)` -> `1` (capado, no `2`)
- `calcularCoberturaNecesidad(0, 0)` -> `1`
- `calcularCoberturaNecesidad(10, 0)` -> `0`
- `calcularCoberturaNecesidad(-1, 5)` -> lanza `RangeError`

## Do / Don't
- DO: tratar `requerido === 0` como caso especial ANTES de dividir (evita división por cero, y
  la necesidad inexistente cuenta como cubierta).
- DO: capar el resultado en `1` con `Math.min`.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: devolver un valor fuera de `[0, 1]` bajo ninguna combinación de entradas válidas.

## Tests
(Los tests están en `tests/test_calcular_cobertura_necesidad.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
