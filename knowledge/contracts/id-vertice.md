---
type: 'Task Contract'
title: 'Identificador canónico de vértice'
description: 'Funcion pura que convierte una coordenada (x, y) de la grilla en un identificador canonico y deterministico de vertice.'
tags: ['motor-grid', 'motor-rutas', 'flow-city', 'grid', 'grafo']

task: id-vertice
intent: "Convertir una coordenada (x, y) de la grilla en un identificador canonico y deterministico de vertice."
target: src/idVertice.js
signature: "function idVertice(x, y)"
test_command: "node tests/test_id_vertice.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_id_vertice.js"
tests_sha256: "1a7d601163af1fc8c1782c4ffcb4a581f0be558ab83fcc02508c99a1b8e8b46a"
touch_only: ['src/idVertice.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Identificador canónico de vértice

## Intent
Primera pieza del [Contrato 03](../../specs/CONTRACT-03-integracion-grid-rutas.md): el grafo de
rutas del Contrato 02 (`conectarVertices`, `encontrarRuta`) usa identificadores de vértice
opacos tipo string, sin relación con las coordenadas reales de la grilla. Esta función es el
puente: dado que los vértices son las intersecciones/esquinas de la grilla (decisión confirmada
en conversación: una grilla de `ancho x alto` celdas tiene `(ancho+1) x (alto+1)` vértices),
convierte una coordenada `(x, y)` en el identificador string canónico que el resto del motor de
rutas ya sabe consumir. Ver [DEFINITION.md](../../DEFINITION.md), sección "Grilla y
construcción".

## Interface
```
function idVertice(x, y)
```
Devuelve un `string`.

## Invariants
- Determinístico: la misma `(x, y)` siempre produce el mismo id.
- Inyectivo dentro del rango de enteros no negativos: `(x, y)` distintas producen ids
  distintos; en particular `idVertice(a, b) !== idVertice(b, a)` cuando `a !== b`.
- `x` o `y` negativos, o no enteros, lanzan `RangeError`.

## Examples
- `idVertice(0, 0)` -> `'0,0'`
- `idVertice(3, 5)` -> `'3,5'`
- `idVertice(1, 2)` !== `idVertice(2, 1)`
- `idVertice(-1, 0)` -> lanza `RangeError`

## Do / Don't
- DO: validar `x` e `y` (no negativos, enteros) antes de construir el id.
- DO: mantener el formato simple y determinístico (ej. `` `${x},${y}` ``).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: producir el mismo id para coordenadas distintas.

## Tests
(Los tests están en `tests/test_id_vertice.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
