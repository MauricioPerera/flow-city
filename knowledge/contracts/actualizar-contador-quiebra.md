---
type: 'Task Contract'
title: 'Actualización del contador de ticks en quiebra'
description: 'Funcion pura que actualiza el contador de ticks consecutivos en quiebra, segun el saldo actual de la tesoreria.'
tags: ['motor-economia', 'flow-city', 'quiebra', 'tick']

task: actualizar-contador-quiebra
intent: "Actualizar el contador de ticks consecutivos en quiebra, incrementandolo si el saldo es <= 0 o reiniciandolo si es positivo."
target: src/actualizarContadorQuiebra.js
signature: "function actualizarContadorQuiebra(contadorActual, saldoTesoreria)"
test_command: "node tests/test_actualizar_contador_quiebra.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_actualizar_contador_quiebra.js"
tests_sha256: "ad4b8c2eddb623ba20ccbcfe64d89749078eb048139d3dbd0c3d4a8307dcd022"
touch_only: ['src/actualizarContadorQuiebra.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Actualización del contador de ticks en quiebra

## Intent
Primera pieza del [Contrato 13](../../specs/CONTRACT-13-consecuencias-quiebra.md): la
degradación de nodos es progresiva, no instantánea (decisión confirmada en conversación antes
de escribir este contrato) — depende de cuántos ticks CONSECUTIVOS la tesorería lleva en
quiebra (saldo `<= 0`). Esta función lleva ese contador tick a tick: lo incrementa mientras
sigue en quiebra, lo reinicia a `0` en cuanto el saldo vuelve a ser positivo (recuperación
inmediata, sin arrastre). Ver [DEFINITION.md](../../DEFINITION.md), sección "Comercio y
economía".

## Interface
```
function actualizarContadorQuiebra(contadorActual, saldoTesoreria)
```
Devuelve un entero `>= 0`.

## Invariants
- Si `saldoTesoreria <= 0` (incluye exactamente `0`, no solo negativo): devuelve
  `contadorActual + 1`.
- Si `saldoTesoreria > 0`: devuelve `0`, sin importar `contadorActual`.
- `contadorActual` negativo o no entero: lanza `RangeError`.
- `saldoTesoreria` no finito (`NaN`, `Infinity`, `-Infinity`): lanza `RangeError`.

## Examples
- `actualizarContadorQuiebra(0, -5)` -> `1`
- `actualizarContadorQuiebra(3, -1)` -> `4`
- `actualizarContadorQuiebra(5, 0)` -> `6` (saldo exactamente `0` cuenta como quiebra)
- `actualizarContadorQuiebra(5, 10)` -> `0` (recuperado)
- `actualizarContadorQuiebra(-1, -5)` -> lanza `RangeError`

## Do / Don't
- DO: tratar `saldoTesoreria === 0` igual que negativo (ambos incrementan).
- DO: reiniciar a `0` en cualquier saldo estrictamente positivo, sin importar cuán alto era el
  contador previo.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aplicar ninguna lógica de "recuperación gradual" — el reinicio es inmediato y completo.

## Tests
(Los tests están en `tests/test_actualizar_contador_quiebra.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
