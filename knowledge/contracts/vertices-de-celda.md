---
type: 'Task Contract'
title: 'Vértices que rodean una celda'
description: 'Funcion pura que devuelve los 4 vertices-esquina que rodean una celda de la grilla dada su coordenada.'
tags: ['motor-grid', 'motor-rutas', 'flow-city', 'grid', 'grafo']

task: vertices-de-celda
intent: "Devolver los 4 vertices-esquina que rodean una celda de la grilla dada su coordenada (x, y)."
target: src/verticesDeCelda.js
signature: "function verticesDeCelda(x, y)"
test_command: "node tests/test_vertices_de_celda.js"
budget:
  max_cyclomatic_complexity: 3
  max_nesting_depth: 1
tests: "tests/test_vertices_de_celda.js"
tests_sha256: "352f85be34df78c9a41577e9576406bd037ed5cc1e6af3c0a1b9a7a0016e51ae"
touch_only: ['src/verticesDeCelda.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Vértices que rodean una celda

## Intent
Segunda pieza del [Contrato 03](../../specs/CONTRACT-03-integracion-grid-rutas.md): dado que
los vértices son las intersecciones/esquinas de la grilla (una celda `(x,y)` ocupa el cuadrado
entre las esquinas `(x,y)`, `(x+1,y)`, `(x,y+1)`, `(x+1,y+1)`), esta función devuelve los 4
identificadores de vértice que rodean una celda, usando [`idVertice`](./id-vertice.md). Es la
base de la que dependerá T3 (vértice de entrada según rotación). Ver
[DEFINITION.md](../../DEFINITION.md), sección "Grilla y construcción".

Convención de ejes: `x` es columna, `y` es fila con `y` creciendo hacia abajo (fila 0 = arriba),
consistente con `crearGrid`/`obtenerCelda` del Contrato 01. "Noroeste" es la esquina superior
izquierda de la celda, "sureste" la inferior derecha.

## Interface
```
function verticesDeCelda(x, y)
```
Devuelve `{ noroeste, noreste, suroeste, sureste }`, cada uno un id de vértice (string).

## Invariants
- `noroeste === idVertice(x, y)`, `noreste === idVertice(x + 1, y)`,
  `suroeste === idVertice(x, y + 1)`, `sureste === idVertice(x + 1, y + 1)`.
- Dos celdas horizontalmente adyacentes comparten exactamente el borde esperado: el `noreste`/
  `sureste` de la celda izquierda son el `noroeste`/`suroeste` de la celda derecha.
- `x` o `y` negativos o no enteros lanzan `RangeError` (delegado de `idVertice`).

## Examples
- `verticesDeCelda(0, 0)` -> `{ noroeste: '0,0', noreste: '1,0', suroeste: '0,1', sureste:
  '1,1' }`
- `verticesDeCelda(2, 3)` -> `{ noroeste: '2,3', noreste: '3,3', suroeste: '2,4', sureste:
  '3,4' }`
- `verticesDeCelda(-1, 0)` -> lanza `RangeError`

## Do / Don't
- DO: reusar `idVertice` para construir cada esquina, no reimplementar el formato del id.
- DO: mantener el orden de argumentos `(x + dx, y + dy)` consistente con la convención de ejes.
- DON'T: usar red, `require` de paquetes externos (salvo `idVertice`, módulo hermano del propio
  proyecto), ni acceso a estado global.
- DON'T: invertir el eje `y` (fila 0 arriba, no abajo).

## Tests
(Los tests están en `tests/test_vertices_de_celda.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
