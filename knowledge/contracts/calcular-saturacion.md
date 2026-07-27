---
type: 'Task Contract'
title: 'Saturación de tramo: enlentecimiento y pérdida'
description: 'Funcion pura que calcula el factor de velocidad y la perdida de mercaderia de un tramo de ruta segun su carga vs. su capacidad.'
tags: ['motor-rutas', 'flow-city', 'trafico', 'saturacion']

task: calcular-saturacion
intent: "Calcular el factor de velocidad y la perdida de mercaderia de un tramo de ruta segun su carga actual vs. su capacidad declarada."
target: src/calcularSaturacion.js
signature: "function calcularSaturacion(carga, capacidad)"
test_command: "node tests/test_calcular_saturacion.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 2
tests: "tests/test_calcular_saturacion.js"
tests_sha256: "3a9c9f1ba2285c446570a3f462c8dc9a846a868726d3c660e270d298afb3bab4"
touch_only: ['src/calcularSaturacion.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Saturación de tramo: enlentecimiento y pérdida

## Intent
Cada tramo de ruta de Flow City tiene una capacidad de carga limitada. Cuando la carga actual
(mercadería y/o personas en tránsito) supera esa capacidad, el tramo se satura: el movimiento se
enlentece y el excedente que no entra se pierde. Esta función es el cálculo puro que el motor de
tráfico consulta por tramo, en cada tick, para saber a qué velocidad efectiva se mueve el
tránsito y cuánto se pierde. Ver [DEFINITION.md](../../DEFINITION.md), sección "Rutas y
tráfico".

Modelo de diseño fijado en esta tarea (hueco abierto en `DEFINITION.md`, resuelto en
conversación antes de escribir este contrato): **degradación proporcional continua**, sin
umbrales ni saltos fijos. `factorVelocidad = min(1, capacidad / carga)`; `perdida = max(0,
carga - capacidad)`.

## Interface
```
function calcularSaturacion(carga, capacidad)
```
Devuelve `{ factorVelocidad: number, perdida: number }`.

## Invariants
- `factorVelocidad` está siempre en el rango `(0, 1]`; nunca 0 ni mayor a 1.
- `perdida` es siempre `>= 0`.
- Con `carga <= capacidad`: `factorVelocidad === 1` y `perdida === 0` (sin excepción por
  `carga === 0`, caso especial que evita división por cero).
- Con `carga > capacidad`: `factorVelocidad === capacidad / carga` y `perdida === carga -
  capacidad`.
- `carga < 0` o `capacidad <= 0` son entradas inválidas y lanzan `RangeError`.

## Examples
- `calcularSaturacion(0, 10)` -> `{ factorVelocidad: 1, perdida: 0 }`
- `calcularSaturacion(10, 10)` -> `{ factorVelocidad: 1, perdida: 0 }`
- `calcularSaturacion(20, 10)` -> `{ factorVelocidad: 0.5, perdida: 10 }`
- `calcularSaturacion(15, 10)` -> `{ factorVelocidad: 0.666..., perdida: 5 }`

## Do / Don't
- DO: tratar `carga === 0` como caso especial ANTES de dividir, para evitar división por cero.
- DO: devolver siempre las dos claves (`factorVelocidad`, `perdida`) en el mismo objeto.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: introducir umbrales o saltos discretos — el modelo es degradación proporcional
  continua, no zonas.

## Tests
(Los tests están en `tests/test_calcular_saturacion.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
