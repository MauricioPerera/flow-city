---
type: 'Task Contract'
title: 'Colocar casa multi-celda'
description: 'Funcion que coloca una casa cuyo footprint depende del nivel S/M/L, validando todas las celdas del footprint antes de mutar cualquiera (atomico), usando el camino de terreno flexible.'
tags: ['motor-grid', 'flow-city', 'footprint', 'nivel']

task: colocar-casa-multi-celda
intent: "Colocar una casa cuyo footprint depende del nivel, de forma atomica: si cualquier celda del footprint falla, no se coloca ninguna."
target: src/colocarCasaMultiCelda.js
signature: "function colocarCasaMultiCelda(grid, nivel, xAncla, yAncla, nodo)"
test_command: "node tests/test_colocar_casa_multi_celda.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_colocar_casa_multi_celda.js"
tests_sha256: "a177df1d8845bdef804454dee3b392e95b2b9b319eef27e4dcccab1aa5ff3c61"
touch_only: ['src/colocarCasaMultiCelda.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Colocar casa multi-celda

## Intent
Tercera y última pieza del [Contrato 34](../../specs/CONTRACT-34-footprint-viviendas-por-nivel.md):
compone [`celdas-de-casa-por-nivel`](./celdas-de-casa-por-nivel.md) (geometría) +
[`puede-construir-flexible`](./puede-construir-flexible.md) (terreno, categoría fija
`'residencial'`) + [`asignar-nodo-celda`](./asignar-nodo-celda.md) (asignación) en dos pasadas
para garantizar atomicidad SIN necesitar rollback: la primera pasada valida terreno y ocupación
de TODAS las celdas del footprint sin mutar nada (leyendo con `obtenerCelda`); solo si todas
pasan, la segunda pasada asigna el mismo `nodo` (por referencia) a cada una.

## Interface
```
function colocarCasaMultiCelda(grid, nivel, xAncla, yAncla, nodo)
```
Devuelve `{ celdas }` — `celdas` es el array de `{x, y}` del footprint (mismo orden que
`celdasDeCasaPorNivel`).

## Invariants
- Obtiene las celdas del footprint vía `celdasDeCasaPorNivel(nivel, xAncla, yAncla)` — cualquier
  `RangeError` de nivel o ancla inválidos se propaga sin capturar.
- PASADA 1 (validación, sin mutar): para cada celda del footprint, llama `obtenerCelda` (propaga
  `RangeError` si está fuera de rango) y `puedeConstruirFlexible(celda.terreno, 'residencial')`;
  si alguna celda devuelve `false`, lanza `Error` ANTES de mutar cualquier celda.
- Si alguna celda del footprint ya está ocupada (`celda.nodo !== null`), lanza `Error` en la
  pasada 1, antes de mutar cualquier celda (chequeo explícito, sin depender de que
  `asignarNodoCelda` lo detecte tarde en la pasada 2).
- PASADA 2 (commit): solo se ejecuta si la pasada 1 completa sin lanzar; asigna el MISMO `nodo`
  (una sola referencia) a las `celda.nodo` de TODAS las celdas del footprint, vía
  `asignarNodoCelda`.
- Si la pasada 1 lanza por cualquier motivo, NINGUNA celda del footprint queda mutada (se puede
  verificar leyendo cada una después con `obtenerCelda`: todas mantienen su `nodo` previo).
- Devuelve `{ celdas }` con las mismas celdas de `celdasDeCasaPorNivel`.

## Examples
- `colocarCasaMultiCelda(grid, 'S', 0, 0, 'casa-1')` sobre un grid `2x2` vacío -> coloca
  `'casa-1'` en las 4 celdas, sin lanzar.
- `colocarCasaMultiCelda(grid, 'S', 0, 0, 'casa-1')` cuando la celda `(1,1)` ya está ocupada ->
  lanza `Error`; NINGUNA de las 4 celdas queda modificada (ni siquiera `(0,0)`, `(1,0)`, `(0,1)`
  que sí estaban libres).
- `colocarCasaMultiCelda(grid, 'S', 0, 0, 'casa-1')` sobre un grid `2x2` enteramente
  `agua_profunda` -> lanza `Error`; ninguna celda queda modificada.

## Do / Don't
- DO: reusar `celdasDeCasaPorNivel`, `obtenerCelda`, `puedeConstruirFlexible` y
  `asignarNodoCelda` — ninguna lógica de geometría, terreno, rango u ocupación se reimplementa.
- DO: separar estrictamente la fase de validación (solo lecturas) de la fase de commit (solo
  después de que TODAS las validaciones pasaron) — es la única forma de lograr atomicidad sin
  un mecanismo de rollback.
- DO: usar la MISMA referencia de `nodo` para todas las celdas del footprint (no crear una copia
  por celda).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: llamar a `colocarNodo`/`puedeConstruir` (los estrictos) — este es el camino flexible,
  exclusivamente para la categoría `residencial`.

## Tests
(Los tests están en `tests/test_colocar_casa_multi_celda.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
