---
type: 'Task Contract'
title: 'Producción de un nodo multi-insumo en un tick'
description: 'Funcion que calcula la produccion de un nodo con receta de varios insumos, limitada por el insumo mas escaso (cuello de botella).'
tags: ['motor-integracion', 'flow-city', 'produccion', 'tick']

task: producir-tick-nodo-multi-insumo
intent: "Calcular la produccion de un nodo multi-insumo en un tick, limitada por el insumo mas escaso entre todos los recibidos."
target: src/producirTickNodoMultiInsumo.js
signature: "function producirTickNodoMultiInsumo(nodo, entradasRecibidas)"
test_command: "node tests/test_producir_tick_nodo_multi_insumo.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_producir_tick_nodo_multi_insumo.js"
tests_sha256: "12ab5d22323518af3205f8648c6cb55827255aa2b566ec4fe0bfa833f69712f3"
touch_only: ['src/producirTickNodoMultiInsumo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Producción de un nodo multi-insumo en un tick

## Intent
Segunda pieza del [Contrato 21](../../specs/CONTRACT-21-recetas-multi-insumo.md): dado un nodo
creado por [`crearNodoProductivoMultiInsumo`](./crear-nodo-productivo-multi-insumo.md) y las
cantidades recibidas de cada insumo, calcula cuántas "tandas" completas de la receta se pueden
producir — limitado por el insumo MÁS ESCASO (cuello de botella entre todos), no por el
promedio ni por ninguno en particular.

## Interface
```
function producirTickNodoMultiInsumo(nodo, entradasRecibidas)
```
`entradasRecibidas` es un objeto plano `{ [nombreInsumo]: cantidad }`. Un insumo de la receta
ausente en `entradasRecibidas` se trata como `0`. Devuelve un entero `>= 0`.

## Invariants
- Para cada insumo de `nodo.receta`, se calcula `Math.floor(recibido / ratioEntrada)`
  (`recibido` es `0` si el insumo no está en `entradasRecibidas`).
- El resultado es `Math.min(...tandas) * nodo.ratioSalida`.
- Si CUALQUIER insumo tiene `0` tandas disponibles, el resultado es `0` (no hay producción
  parcial).
- `entradasRecibidas` `null`, no-objeto, o array: lanza `RangeError`.
- Cualquier valor presente en `entradasRecibidas` que sea negativo o no finito: lanza
  `RangeError`.
- `nodo` inválido (no cumple la forma de `crearNodoProductivoMultiInsumo`): lanza `RangeError`.

## Examples
- Receta `agua:1, comida:1, personas:2`, recibido `{agua:5, comida:5, personas:6}` -> tandas
  `5, 5, 3` -> mínimo `3` -> `producido: 3` (`ratioSalida: 1`).
- Recibido `{agua:5, comida:2, personas:10}` -> tandas `5, 2, 5` -> mínimo `2` -> `producido: 2`.
- Recibido `{agua:5, comida:5}` (sin `personas`) -> tandas `5, 5, 0` -> `producido: 0`.
- `producirTickNodoMultiInsumo(nodo, null)` -> lanza `RangeError`.

## Do / Don't
- DO: tratar un insumo ausente en `entradasRecibidas` como `0`, no como error.
- DO: usar `Math.min` sobre TODAS las tandas, nunca solo la primera o la última.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: producir una cantidad parcial cuando un insumo no alcanza — es todo o nada por tanda
  completa.

## Tests
(Los tests están en `tests/test_producir_tick_nodo_multi_insumo.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
