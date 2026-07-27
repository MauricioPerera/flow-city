---
type: 'Task Contract'
title: 'Costo de construcción de un nodo'
description: 'Funcion pura que devuelve el costo de construccion de un nodo segun su categoria, con una tabla explicita y extensible.'
tags: ['motor-economia', 'flow-city', 'construccion']

task: costo-construccion-nodo
intent: "Devolver el costo de construccion de un nodo segun su categoria, usando una tabla explicita de valores conocidos."
target: src/costoConstruccionNodo.js
signature: "function costoConstruccionNodo(categoria)"
test_command: "node tests/test_costo_construccion_nodo.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_costo_construccion_nodo.js"
tests_sha256: "7e0ff7fe6b0d67cdf8db9a3b550617f2b938b9e8d0efd3f9da617bfaa3203e47"
touch_only: ['src/costoConstruccionNodo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Costo de construcción de un nodo

## Intent
Primera pieza del [Contrato 14](../../specs/CONTRACT-14-gasto-tesoreria-construccion.md):
"construir cuesta dinero" (`DEFINITION.md`, sección "Comercio y economía"). Esta función
devuelve el costo según la `categoria` del nodo (mismo campo que usa
[`crearNodoProductivo`](./crear-nodo-productivo.md)), con una tabla explícita — valores fijados
en esta tarea, no derivados de `DEFINITION.md` (que no los especifica): `'extraccion-agua':
50`, `'agricultura': 30`.

Una categoría no registrada en la tabla lanza error explícito, nunca devuelve `0` en silencio —
evita que un tipo de nodo nuevo se construya "gratis" por omisión.

## Interface
```
function costoConstruccionNodo(categoria)
```
Devuelve un número positivo.

## Invariants
- `costoConstruccionNodo('extraccion-agua') === 50`.
- `costoConstruccionNodo('agricultura') === 30`.
- Cualquier `categoria` fuera de esas dos (incluidas cadenas vacías, `null`, `undefined`, u
  otras categorías válidas de otro contexto como `'no_extractiva'`): lanza `RangeError`.

## Examples
- `costoConstruccionNodo('extraccion-agua')` -> `50`
- `costoConstruccionNodo('agricultura')` -> `30`
- `costoConstruccionNodo('mineria')` -> lanza `RangeError`
- `costoConstruccionNodo(null)` -> lanza `RangeError`

## Do / Don't
- DO: mantener la tabla como un objeto explícito de categorías conocidas, sin valor por
  defecto.
- DO: lanzar `RangeError` ante cualquier categoría no registrada.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: devolver `0` o `undefined` para una categoría desconocida.

## Tests
(Los tests están en `tests/test_costo_construccion_nodo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
