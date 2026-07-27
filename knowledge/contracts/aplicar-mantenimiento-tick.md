---
type: 'Task Contract'
title: 'Aplicación del mantenimiento de un tick'
description: 'Funcion que descuenta de una sola vez el mantenimiento acumulado de todos los nodos activos en un tick.'
tags: ['motor-economia', 'flow-city', 'tesoreria', 'tick']

task: aplicar-mantenimiento-tick
intent: "Descontar de la tesoreria, en una sola operacion, la suma total del mantenimiento de todos los nodos activos de un tick."
target: src/aplicarMantenimientoTick.js
signature: "function aplicarMantenimientoTick(tesoreria, costosMantenimiento)"
test_command: "node tests/test_aplicar_mantenimiento_tick.js"
budget:
  max_cyclomatic_complexity: 7
  max_nesting_depth: 2
tests: "tests/test_aplicar_mantenimiento_tick.js"
tests_sha256: "1d2b3cea552d98a6d913c68d913ecc646cb5301828ca20bf8d6b7c4a6b355d27"
touch_only: ['src/aplicarMantenimientoTick.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Aplicación del mantenimiento de un tick

## Intent
Cuarta y última pieza del [Contrato 05](../../specs/CONTRACT-05-tesoreria.md): cada nodo activo
tiene un costo de mantenimiento periódico (`DEFINITION.md`, sección "Comercio y economía": "cada
nodo tiene mantenimiento periódico"). Esta función recibe el costo de mantenimiento de cada
nodo activo en el tick actual y descuenta el TOTAL de una sola vez de la tesorería, reusando
[`registrarGasto`](./registrar-gasto.md) para la resta real.

Una lista vacía o de puros ceros no debe intentar registrar un gasto de `0` (`registrarGasto`
rechaza montos `<= 0` por diseño) — en ese caso la tesorería queda sin cambios, sin error.

## Interface
```
function aplicarMantenimientoTick(tesoreria, costosMantenimiento)
```
`costosMantenimiento` es un array de números (costo por nodo, `>= 0`, finitos). Muta
`tesoreria.saldo` y devuelve la `tesoreria` mutada.

## Invariants
- `tesoreria.saldo` disminuye exactamente en la suma de `costosMantenimiento` (puede ser `0` si
  la lista está vacía o son todos `0`, en cuyo caso el saldo no cambia).
- El saldo resultante puede quedar en `0` o negativo (quiebra, sin error) — mismo
  comportamiento que `registrarGasto`.
- `costosMantenimiento` no-array: lanza `RangeError`.
- Cualquier elemento negativo o no finito (`NaN`, `Infinity`): lanza `RangeError`.
- `tesoreria` inválida (`null`, no-objeto, `saldo` no numérico/no finito): lanza `RangeError`,
  incluso si `costosMantenimiento` está vacío (la validación de `tesoreria` no depende de si
  termina habiendo gasto real).

## Examples
- `aplicarMantenimientoTick({ saldo: 100 }, [10, 20, 5])` -> `tesoreria.saldo === 65`
- `aplicarMantenimientoTick({ saldo: 100 }, [])` -> `tesoreria.saldo === 100` (sin cambios)
- `aplicarMantenimientoTick({ saldo: 100 }, [0, 0])` -> `tesoreria.saldo === 100`
- `aplicarMantenimientoTick(tesoreria, [10, -1])` -> lanza `RangeError`

## Do / Don't
- DO: sumar todos los costos y hacer UNA sola llamada a `registrarGasto` (no una por nodo).
- DO: validar `tesoreria` y cada elemento de `costosMantenimiento` antes de sumar.
- DON'T: usar red, `require` de paquetes externos (salvo `registrarGasto`, módulo hermano), ni
  acceso a estado global.
- DON'T: llamar a `registrarGasto` con un total `0` — esa llamada lanzaría `RangeError` por
  diseño de `registrarGasto`; el caso de total `0` se resuelve como no-op en esta función.

## Tests
(Los tests están en `tests/test_aplicar_mantenimiento_tick.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
