---
type: 'Task Contract'
title: 'Aforo disponible de un comercio'
description: 'Funcion pura que calcula cuantos compradores mas puede admitir un comercio, dado su aforo maximo y ocupacion actual.'
tags: ['motor-comercio', 'flow-city', 'aforo']

task: aforo-disponible
intent: "Calcular cuantos compradores mas puede admitir un comercio, dado su aforo maximo y su ocupacion actual."
target: src/aforoDisponible.js
signature: "function aforoDisponible(aforoMaximo, ocupacionActual)"
test_command: "node tests/test_aforo_disponible.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_aforo_disponible.js"
tests_sha256: "e22af5a7243ae4eed6f5fd39514183c161f430a7240f5d9aee3185d94f9072e1"
touch_only: ['src/aforoDisponible.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Aforo disponible de un comercio

## Intent
Primera pieza del [Contrato 07](../../specs/CONTRACT-07-comercio.md): un comercio (ej.
restaurante) tiene un aforo máximo — capacidad de personas simultáneas dentro del local,
distinta de la capacidad de una ruta (`DEFINITION.md`, sección "Comercio y economía"). Esta
función calcula cuánto espacio queda disponible, base para T4 (resolver venta local, patrón
"comprador viaja al bien").

## Interface
```
function aforoDisponible(aforoMaximo, ocupacionActual)
```
Devuelve un entero `>= 0`.

## Invariants
- El resultado es `max(0, aforoMaximo - ocupacionActual)` — nunca negativo.
- Si `ocupacionActual > aforoMaximo` (estado inconsistente que esta función no previene, solo
  lee defensivamente): el resultado es `0`, no un número negativo.
- `aforoMaximo <= 0` o no entero: lanza `RangeError` (todo comercio tiene aforo positivo).
- `ocupacionActual < 0` o no entero: lanza `RangeError`.

## Examples
- `aforoDisponible(10, 3)` -> `7`
- `aforoDisponible(10, 10)` -> `0`
- `aforoDisponible(10, 15)` -> `0` (clampeado, no `-5`)
- `aforoDisponible(0, 0)` -> lanza `RangeError`

## Do / Don't
- DO: clampear el resultado en `0` con `Math.max`.
- DO: validar ambos parámetros antes de calcular.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: lanzar una excepción cuando `ocupacionActual > aforoMaximo` — es un estado a clampear,
  no un input inválido en sí mismo.

## Tests
(Los tests están en `tests/test_aforo_disponible.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
