---
type: 'Task Contract'
title: 'Registro de un gasto en la tesorería'
description: 'Funcion que descuenta un monto de la tesoreria, permitiendo que el saldo quede en 0 o negativo.'
tags: ['motor-economia', 'flow-city', 'tesoreria']

task: registrar-gasto
intent: "Descontar un monto de la tesoreria, permitiendo que el saldo quede en 0 o negativo."
target: src/registrarGasto.js
signature: "function registrarGasto(tesoreria, monto)"
test_command: "node tests/test_registrar_gasto.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_registrar_gasto.js"
tests_sha256: "d31d8a74a3cd13393fa91985d7dea5633ce86bad29672cd6a89fa7f715e70ec5"
touch_only: ['src/registrarGasto.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Registro de un gasto en la tesorería

## Intent
Segunda pieza del [Contrato 05](../../specs/CONTRACT-05-tesoreria.md): descuenta un monto de la
tesorería creada por [`crearTesoreria`](./crear-tesoreria.md) — sea por costo de construcción o
por mantenimiento. A diferencia de una validación de fondos suficientes, esta función NO
bloquea el gasto si el saldo no alcanza: la quiebra (saldo `0` o negativo) es un estado válido
del sistema, con consecuencias mecánicas a resolver en tareas futuras (degradación de nodos),
no un error que esta función deba impedir. Ver [DEFINITION.md](../../DEFINITION.md), sección
"Comercio y economía".

## Interface
```
function registrarGasto(tesoreria, monto)
```
Muta `tesoreria.saldo` (lo resta) y devuelve la `tesoreria` mutada.

## Invariants
- Tras una llamada exitosa: `tesoreria.saldo` disminuye exactamente en `monto` respecto a su
  valor previo.
- El saldo resultante puede ser `0` o negativo — no se lanza excepción por fondos
  insuficientes.
- `monto <= 0` o no finito (`NaN`, `Infinity`): lanza `RangeError`.
- `tesoreria` `null`, no-objeto, o con `saldo` no numérico/no finito: lanza `RangeError`.

## Examples
- `registrarGasto({ saldo: 100 }, 30)` -> `tesoreria.saldo === 70`
- `registrarGasto({ saldo: 50 }, 80)` -> `tesoreria.saldo === -30` (quiebra, sin error)
- `registrarGasto({ saldo: 100 }, 0)` -> lanza `RangeError`
- `registrarGasto(null, 10)` -> lanza `RangeError`

## Do / Don't
- DO: validar `tesoreria.saldo` y `monto` antes de mutar.
- DO: permitir explícitamente que el saldo resultante sea `0` o negativo.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: lanzar una excepción por "fondos insuficientes" — esa validación de negocio no es
  responsabilidad de esta función.

## Tests
(Los tests están en `tests/test_registrar_gasto.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
