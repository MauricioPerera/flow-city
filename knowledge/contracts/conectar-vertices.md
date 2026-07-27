---
type: 'Task Contract'
title: 'Conexión de dos vértices mediante un tramo'
description: 'Funcion que registra un tramo entre dos vertices en una estructura de grafo de rutas, bidireccional y sin duplicados.'
tags: ['motor-rutas', 'flow-city', 'grid', 'grafo']

task: conectar-vertices
intent: "Registrar un tramo entre dos vertices en una estructura de grafo de rutas, en ambos sentidos."
target: src/conectarVertices.js
signature: "function conectarVertices(grafo, verticeA, verticeB, tramo)"
test_command: "node tests/test_conectar_vertices.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_conectar_vertices.js"
tests_sha256: "e502ef10adbfa9734471a14f70679927bb925ad9ab1d5b767b91dd00005567eb"
touch_only: ['src/conectarVertices.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Conexión de dos vértices mediante un tramo

## Intent
Tercera pieza del [Contrato 02](../../specs/CONTRACT-02-modelo-rutas.md): registra un tramo
(creado por [`crearTramo`](./crear-tramo.md)) como conexión entre dos vértices en una
estructura de grafo de rutas, representada como objeto plano
`{ [verticeId]: { [otroVerticeId]: tramo } }`. El futuro pathfinding (T4) recorrerá este grafo.
Ver [DEFINITION.md](../../DEFINITION.md), sección "Grilla y construcción" ("cada vértice es un
punto de conexión posible").

Los identificadores de vértice se tratan como strings opacos en esta tarea — el esquema de
coordenadas real de los vértices de la grilla (si coinciden con las celdas o son sus
intersecciones) todavía no está resuelto y no es necesario para esta función.

La ruta física es bidireccional: conectar A con B habilita el tránsito en ambos sentidos sobre
el mismo tramo (misma capacidad compartida, no dos tramos independientes).

## Interface
```
function conectarVertices(grafo, verticeA, verticeB, tramo)
```
Devuelve el `grafo` mutado (misma referencia).

## Invariants
- Tras una conexión exitosa: `grafo[verticeA][verticeB] === tramo` y
  `grafo[verticeB][verticeA] === tramo` (misma referencia en ambos sentidos).
- Si ya existe una conexión entre `verticeA` y `verticeB` (en cualquier orden): lanza `Error`
  (no `RangeError`) con mensaje que menciona "ya". El grafo no se modifica.
- `verticeA === verticeB`: lanza `RangeError` (una ruta no conecta un vértice consigo mismo).
- `verticeA`/`verticeB` no string o vacíos: lanza `RangeError`.
- `tramo` `null`, `undefined`, o no-objeto: lanza `RangeError`.
- `grafo` `null` o no-objeto: lanza `RangeError`.

## Examples
- `conectarVertices({}, 'A', 'B', tramo)` -> grafo con `A.B === tramo` y `B.A === tramo`
- Conectar `'A'`-`'B'` dos veces (en cualquier orden) -> la segunda llamada lanza `Error`
  ("ya...")
- `conectarVertices(grafo, 'A', 'A', tramo)` -> lanza `RangeError`
- `conectarVertices(grafo, 'A', 'B', null)` -> lanza `RangeError`

## Do / Don't
- DO: escribir la conexión en ambos sentidos con la MISMA referencia de `tramo` (no clonar).
- DO: verificar duplicados considerando ambos órdenes (`A→B` y `B→A` son la misma conexión).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: sobrescribir una conexión existente en silencio.

## Tests
(Los tests están en `tests/test_conectar_vertices.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
