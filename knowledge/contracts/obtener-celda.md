---
type: 'Task Contract'
title: 'Consulta de una celda de la grilla'
description: 'Funcion pura que devuelve la celda de un grid en una posicion (x, y) dada, validando limites.'
tags: ['motor-grid', 'flow-city', 'terreno', 'grid']

task: obtener-celda
intent: "Devolver la celda de un grid en la posicion (x, y) dada, validando que este dentro de los limites."
target: src/obtenerCelda.js
signature: "function obtenerCelda(grid, x, y)"
test_command: "node tests/test_obtener_celda.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_obtener_celda.js"
tests_sha256: "761b8d4fcc6844f8bedc9742342beeae6c5e3cb7647ad8a8fad5cd5e41d86ecd"
touch_only: ['src/obtenerCelda.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Consulta de una celda de la grilla

## Intent
Segunda pieza de T4 del [Contrato 01](../../specs/CONTRACT-01-motor-recursos-fundamentos.md):
dado un grid creado por [`crearGrid`](./crear-grid.md) y una coordenada `(x, y)`, devolver la
celda correspondiente. Es la operación de lectura que usarán tanto la colocación de nodos
(pieza siguiente de T4) como cualquier consulta de terreno del motor. Ver
[DEFINITION.md](../../DEFINITION.md), sección "Grilla y construcción".

`x` es columna (eje ancho), `y` es fila (eje alto), consistente con la forma de `grid.celdas`
devuelta por `crearGrid` (`celdas[y][x]`).

## Interface
```
function obtenerCelda(grid, x, y)
```
Devuelve la referencia real de la celda `{ terreno, nodo }` — no una copia; mutarla muta el
grid.

## Invariants
- Devuelve exactamente el objeto celda almacenado en `grid.celdas[y][x]` (misma referencia, no
  clonada).
- `x` fuera de `[0, grid.ancho - 1]`, `y` fuera de `[0, grid.alto - 1]`, o `x`/`y` no enteros
  lanzan `RangeError`.

## Examples
- `obtenerCelda(crearGrid(2, 3, 'verde'), 0, 0)` -> `{ terreno: 'verde', nodo: null }`
- `obtenerCelda(grid, 1, 2)` (esquina inferior derecha de un grid 2x3) -> celda válida
- `obtenerCelda(grid, 2, 0)` (ancho=2, x fuera de rango) -> lanza `RangeError`
- `obtenerCelda(grid, 0, -1)` -> lanza `RangeError`

## Do / Don't
- DO: validar `x` e `y` (rango y enteridad) antes de indexar `grid.celdas`.
- DO: devolver la referencia real de la celda (no `{...celda}` ni `JSON.parse(JSON.stringify)`).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar coordenadas fuera de límites ni no enteras.

## Tests
(Los tests están en `tests/test_obtener_celda.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
