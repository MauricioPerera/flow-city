---
type: 'Task Contract'
title: 'Creación de la tesorería'
description: 'Funcion pura que inicializa la estructura de tesoreria del jugador con un saldo inicial.'
tags: ['motor-economia', 'flow-city', 'tesoreria']

task: crear-tesoreria
intent: "Inicializar la estructura de tesoreria del jugador con un saldo inicial no negativo."
target: src/crearTesoreria.js
signature: "function crearTesoreria(saldoInicial)"
test_command: "node tests/test_crear_tesoreria.js"
budget:
  max_cyclomatic_complexity: 3
  max_nesting_depth: 1
tests: "tests/test_crear_tesoreria.js"
tests_sha256: "78d11e129835a37a6e8200f90eb49a8c8561eff533a8bfb9cfc0553e7cea05e0"
touch_only: ['src/crearTesoreria.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Creación de la tesorería

## Intent
Primera pieza del [Contrato 05](../../specs/CONTRACT-05-tesoreria.md): el jugador de Flow City
gestiona una tesorería real (construir cuesta dinero, cada nodo tiene mantenimiento periódico,
la venta es el ingreso — decisión confirmada en conversación antes de escribir este contrato).
Esta función crea esa estructura base con un saldo inicial. Ver
[DEFINITION.md](../../DEFINITION.md), sección "Comercio y economía".

El saldo puede volverse `0` o negativo más adelante (quiebra, mediante
`registrar-gasto`/`aplicar-mantenimiento-tick`, tareas siguientes de este contrato) — pero el
saldo INICIAL de una tesorería recién creada debe ser no negativo (no tiene sentido empezar una
partida en quiebra).

## Interface
```
function crearTesoreria(saldoInicial)
```
Devuelve `{ saldo: saldoInicial }`.

## Invariants
- `tesoreria.saldo === saldoInicial` exactamente.
- `saldoInicial` debe ser un número finito (`typeof === 'number'`, no `NaN`, no `Infinity`/
  `-Infinity`) y `>= 0`; cualquier otro valor lanza `RangeError`.
- `saldoInicial` puede ser no entero (decimales de moneda son válidos).

## Examples
- `crearTesoreria(1000)` -> `{ saldo: 1000 }`
- `crearTesoreria(0)` -> `{ saldo: 0 }`
- `crearTesoreria(150.5)` -> `{ saldo: 150.5 }`
- `crearTesoreria(-1)` -> lanza `RangeError`
- `crearTesoreria(NaN)` -> lanza `RangeError`
- `crearTesoreria('1000')` -> lanza `RangeError`

## Do / Don't
- DO: validar tipo, finitud y signo de `saldoInicial` antes de construir el objeto.
- DO: permitir valores decimales (no forzar enteros).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar un saldo inicial negativo, `NaN` o infinito.

## Tests
(Los tests están en `tests/test_crear_tesoreria.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
