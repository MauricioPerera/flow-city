---
type: 'Task Contract'
title: 'Determinación de nodo degradado'
description: 'Funcion pura que determina si un nodo esta degradado, segun el contador de ticks en quiebra y un umbral.'
tags: ['motor-economia', 'flow-city', 'quiebra']

task: esta-nodo-degradado
intent: "Determinar si un nodo esta degradado, comparando el contador de ticks en quiebra contra un umbral."
target: src/estaNodoDegradado.js
signature: "function estaNodoDegradado(contadorQuiebra, umbral)"
test_command: "node tests/test_esta_nodo_degradado.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_esta_nodo_degradado.js"
tests_sha256: "a1bab8dce98ee1ed7d7a718033718e9db749a327c9b795c2ea66bd0007cbdf27"
touch_only: ['src/estaNodoDegradado.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Determinación de nodo degradado

## Intent
Segunda pieza del [Contrato 13](../../specs/CONTRACT-13-consecuencias-quiebra.md): dado el
contador de ticks consecutivos en quiebra (de
[`actualizarContadorQuiebra`](./actualizar-contador-quiebra.md)) y un umbral configurable
(cantidad de ticks necesarios para que la degradación se dispare), determina si un nodo está
degradado en este momento.

## Interface
```
function estaNodoDegradado(contadorQuiebra, umbral)
```
Devuelve un booleano.

## Invariants
- El resultado es exactamente `contadorQuiebra >= umbral`.
- `contadorQuiebra` negativo o no entero: lanza `RangeError`.
- `umbral` no positivo (`<= 0`) o no entero: lanza `RangeError`.

## Examples
- `estaNodoDegradado(0, 3)` -> `false`
- `estaNodoDegradado(3, 3)` -> `true`
- `estaNodoDegradado(5, 3)` -> `true`
- `estaNodoDegradado(3, 0)` -> lanza `RangeError`

## Do / Don't
- DO: usar comparación `>=` (el umbral mismo ya cuenta como degradado, no solo superarlo).
- DO: validar ambos parámetros antes de comparar.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: introducir niveles intermedios de severidad — es un booleano, degradado o no.

## Tests
(Los tests están en `tests/test_esta_nodo_degradado.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
