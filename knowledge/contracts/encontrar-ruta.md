---
type: 'Task Contract'
title: 'Cálculo automático de ruta entre dos vértices'
description: 'Funcion que encuentra el camino de menor distancia total entre dos vertices de un grafo de rutas, acotado a los tramos que admiten el tipo de trafico pedido.'
tags: ['motor-rutas', 'flow-city', 'pathfinding', 'grafo']

task: encontrar-ruta
intent: "Encontrar el camino de menor distancia total entre dos vertices, considerando solo los tramos que admiten el tipo de trafico pedido."
target: src/encontrarRuta.js
signature: "function encontrarRuta(grafo, origen, destino, tipoTrafico)"
test_command: "node tests/test_encontrar_ruta.js"
budget:
  max_cyclomatic_complexity: 12
  max_nesting_depth: 4
tests: "tests/test_encontrar_ruta.js"
tests_sha256: "192f9a3ccbad2d4df23777f390fb4c730b931a3f71398086830640e9e152d80d"
touch_only: ['src/encontrarRuta.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Cálculo automático de ruta entre dos vértices

## Intent
Cuarta y última pieza del [Contrato 02](../../specs/CONTRACT-02-modelo-rutas.md): dado el grafo
de rutas construido con [`conectarVertices`](./conectar-vertices.md), calcula el camino de
**menor distancia total** (no de menos saltos) entre `origen` y `destino`, descartando
cualquier tramo que no admita el `tipoTrafico` pedido (vía
[`tramoAdmiteTrafico`](./tramo-admite-trafico.md)). Es el pathfinding automático que
`DEFINITION.md` fija como mecánica de movimiento de mercadería y personas: "cálculo de ruta
automático, siempre acotado a las rutas realmente disponibles y su tipo de tráfico permitido".

Algoritmo: Dijkstra, ponderando cada arista por `tramo.longitud`. `tipoTrafico` es siempre un
tipo concreto (`'mercaderia'` o `'personas'`), igual que en `tramoAdmiteTrafico` — nunca
`'ambos'`.

## Interface
```
function encontrarRuta(grafo, origen, destino, tipoTrafico)
```
Devuelve `{ camino: string[], distanciaTotal: number }` si existe camino, o `null` si `destino`
es inalcanzable desde `origen` con el `tipoTrafico` dado. `camino` incluye tanto `origen` como
`destino`.

## Invariants
- Si `origen === destino`: devuelve `{ camino: [origen], distanciaTotal: 0 }` (caso trivial, no
  es un error).
- Si existe camino: `distanciaTotal` es la suma de `longitud` de los tramos atravesados, y es
  mínima entre todos los caminos posibles que solo usan tramos que admiten `tipoTrafico`.
- Si `destino` es un vértice válido del grafo pero inalcanzable con ese `tipoTrafico`: devuelve
  `null` (no lanza excepción — "no hay camino" es un resultado legítimo).
- `origen` o `destino` ausentes como clave del `grafo`: lanza `RangeError`.
- `tipoTrafico` fuera de `['mercaderia', 'personas']` (incluido `'ambos'`): lanza `RangeError`.
- `grafo` `null` o no-objeto: lanza `RangeError`.

## Examples
- Grafo con `A-B` (long. 5) y `B-C` (long. 3) y también `A-C` directo (long. 100):
  `encontrarRuta(grafo, 'A', 'C', 'mercaderia')` -> `{ camino: ['A','B','C'], distanciaTotal: 8
  }` (el camino indirecto es más corto en distancia total).
- `encontrarRuta(grafo, 'A', 'A', 'mercaderia')` -> `{ camino: ['A'], distanciaTotal: 0 }`
- Un tramo `A-D` de tipo `ferrocarril` (solo mercadería):
  `encontrarRuta(grafo, 'A', 'D', 'personas')` -> `null`
- `encontrarRuta(grafo, 'Z', 'A', 'mercaderia')` con `'Z'` inexistente -> lanza `RangeError`

## Do / Don't
- DO: usar `tramoAdmiteTrafico` para filtrar aristas, no reimplementar la regla de tráfico.
- DO: ponderar por `tramo.longitud`, nunca por cantidad de saltos.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos del propio
  proyecto), ni acceso a estado global.
- DON'T: lanzar una excepción cuando simplemente no hay camino — eso es un `null`, no un error.

## Tests
(Los tests están en `tests/test_encontrar_ruta.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
