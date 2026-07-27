---
type: 'Task Contract'
title: 'Costo de mantenimiento de un nodo'
description: 'Funcion pura que devuelve el costo de mantenimiento periodico de un nodo segun su categoria, con una tabla explicita y extensible.'
tags: ['motor-economia', 'flow-city', 'mantenimiento']

task: costo-mantenimiento-nodo
intent: "Devolver el costo de mantenimiento periodico de un nodo segun su categoria, usando una tabla explicita de valores conocidos."
target: src/costoMantenimientoNodo.js
signature: "function costoMantenimientoNodo(categoria)"
test_command: "node tests/test_costo_mantenimiento_nodo.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_costo_mantenimiento_nodo.js"
tests_sha256: "6beda22b7d9906ce6f20606ecbf776aa2c645b343d8ac0904a5ae85caf64a92d"
touch_only: ['src/costoMantenimientoNodo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Costo de mantenimiento de un nodo

## Intent
Segunda pieza del [Contrato 14](../../specs/CONTRACT-14-gasto-tesoreria-construccion.md):
análoga a [`costoConstruccionNodo`](./costo-construccion-nodo.md), pero para el mantenimiento
periódico ("cada nodo tiene mantenimiento periódico", `DEFINITION.md`). Valores fijados en esta
tarea: `'extraccion-agua': 2`, `'agricultura': 1`.

Una categoría no registrada lanza error explícito, nunca devuelve `0` en silencio.

## Interface
```
function costoMantenimientoNodo(categoria)
```
Devuelve un número positivo.

## Invariants
- `costoMantenimientoNodo('extraccion-agua') === 2`.
- `costoMantenimientoNodo('agricultura') === 1`.
- Cualquier `categoria` fuera de esas dos: lanza `RangeError`.

## Examples
- `costoMantenimientoNodo('extraccion-agua')` -> `2`
- `costoMantenimientoNodo('agricultura')` -> `1`
- `costoMantenimientoNodo('mineria')` -> lanza `RangeError`
- `costoMantenimientoNodo(null)` -> lanza `RangeError`

## Do / Don't
- DO: mantener la tabla como un objeto explícito de categorías conocidas, sin valor por
  defecto.
- DO: lanzar `RangeError` ante cualquier categoría no registrada.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: devolver `0` o `undefined` para una categoría desconocida.

## Tests
(Los tests están en `tests/test_costo_mantenimiento_nodo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
