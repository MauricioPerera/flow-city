---
type: 'Task Contract'
title: 'Registro de un ingreso en la tesorería'
description: 'Funcion que suma un monto a la tesoreria, como ingreso por venta.'
tags: ['motor-economia', 'flow-city', 'tesoreria']

task: registrar-ingreso
intent: "Sumar un monto a la tesoreria, como ingreso por venta."
target: src/registrarIngreso.js
signature: "function registrarIngreso(tesoreria, monto)"
test_command: "node tests/test_registrar_ingreso.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_registrar_ingreso.js"
tests_sha256: "fe6a02ef28b6f090ecd3b86571fa6152379f73e3da99cf2f4cb12f36e1d2561c"
touch_only: ['src/registrarIngreso.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Registro de un ingreso en la tesorería

## Intent
Tercera pieza del [Contrato 05](../../specs/CONTRACT-05-tesoreria.md): simétrica a
[`registrarGasto`](./registrar-gasto.md), suma un monto a la tesorería — el ingreso por venta
de mercadería/servicios (`DEFINITION.md`: "el dinero es un resultado derivado de la venta").
Un ingreso puede sacar a la tesorería de un saldo negativo (quiebra) sin restricción especial.

## Interface
```
function registrarIngreso(tesoreria, monto)
```
Muta `tesoreria.saldo` (lo suma) y devuelve la `tesoreria` mutada.

## Invariants
- Tras una llamada exitosa: `tesoreria.saldo` aumenta exactamente en `monto` respecto a su
  valor previo, sin importar si el saldo previo era negativo.
- `monto <= 0` o no finito (`NaN`, `Infinity`): lanza `RangeError`.
- `tesoreria` `null`, no-objeto, o con `saldo` no numérico/no finito: lanza `RangeError`.

## Examples
- `registrarIngreso({ saldo: 100 }, 30)` -> `tesoreria.saldo === 130`
- `registrarIngreso({ saldo: -30 }, 50)` -> `tesoreria.saldo === 20`
- `registrarIngreso({ saldo: 100 }, 0)` -> lanza `RangeError`
- `registrarIngreso(null, 10)` -> lanza `RangeError`

## Do / Don't
- DO: validar `tesoreria.saldo` y `monto` antes de mutar.
- DO: permitir sumar sobre un saldo negativo sin restricción especial.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: duplicar la lógica de `registrarGasto` importándola — es una operación independiente,
  no su inverso reutilizado.

## Tests
(Los tests están en `tests/test_registrar_ingreso.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
