---
type: 'Task Contract'
title: 'Cálculo del mantenimiento total de un tick'
description: 'Funcion que suma el costo de mantenimiento de un conjunto de categorias de nodos activos, lista para pasar a aplicarMantenimientoTick.'
tags: ['motor-economia', 'flow-city', 'mantenimiento', 'tick']

task: calcular-mantenimiento-total
intent: "Sumar el costo de mantenimiento de un conjunto de categorias de nodos activos en un tick."
target: src/calcularMantenimientoTotal.js
signature: "function calcularMantenimientoTotal(categorias)"
test_command: "node tests/test_calcular_mantenimiento_total.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_calcular_mantenimiento_total.js"
tests_sha256: "d91fb1fab465dddcef26d44b8aaa1a0a0787f0189da685e2135bb0c0242acace"
touch_only: ['src/calcularMantenimientoTotal.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Cálculo del mantenimiento total de un tick

## Intent
Cuarta y última pieza del [Contrato 14](../../specs/CONTRACT-14-gasto-tesoreria-construccion.md):
suma el costo de mantenimiento ([`costoMantenimientoNodo`](./costo-mantenimiento-nodo.md)) de
TODAS las categorías de nodos activos en un tick, produciendo el número que
[`aplicarMantenimientoTick`](./aplicar-mantenimiento-tick.md) (Contrato 05) espera como suma
total — cierra el puente entre "qué nodos hay" y "cuánto sale mantenerlos".

## Interface
```
function calcularMantenimientoTotal(categorias)
```
`categorias` es un array de categorías (una por cada nodo activo, con repetición si hay varios
del mismo tipo). Devuelve un número `>= 0`.

## Invariants
- El resultado es la suma de `costoMantenimientoNodo(c)` para cada `c` en `categorias`.
- `categorias` vacío (`[]`) devuelve `0`.
- `categorias` no-array: lanza `RangeError`.
- Cualquier categoría desconocida dentro del array: lanza `RangeError` (delegado de
  `costoMantenimientoNodo`).

## Examples
- `calcularMantenimientoTotal(['extraccion-agua', 'agricultura'])` -> `3` (`2 + 1`)
- `calcularMantenimientoTotal(['agricultura', 'agricultura', 'agricultura'])` -> `3`
- `calcularMantenimientoTotal([])` -> `0`
- `calcularMantenimientoTotal(['mineria'])` -> lanza `RangeError`
- `calcularMantenimientoTotal('no-es-array')` -> lanza `RangeError`

## Do / Don't
- DO: reusar `costoMantenimientoNodo` para cada elemento, no reimplementar la tabla de costos.
- DO: sumar sobre un array vacío sin error, devolviendo `0`.
- DON'T: usar red, `require` de paquetes externos (salvo `costoMantenimientoNodo`, módulo
  hermano), ni acceso a estado global.
- DON'T: ignorar una categoría desconocida en medio del array — debe propagar el error de esa
  categoría, no saltearla en silencio.

## Tests
(Los tests están en `tests/test_calcular_mantenimiento_total.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
