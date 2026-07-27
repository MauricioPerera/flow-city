---
type: 'Task Contract'
title: 'Asignar nodo a celda'
description: 'Funcion mutadora minima que asigna un nodo a una celda del grid verificando solo ocupacion, sin chequear compatibilidad de terreno, para el camino de colocacion flexible.'
tags: ['motor-grid', 'flow-city', 'terreno', 'nivel']

task: asignar-nodo-celda
intent: "Asignar un nodo a una celda del grid verificando unicamente que no este ocupada, sin chequear compatibilidad de terreno."
target: src/asignarNodoCelda.js
signature: "function asignarNodoCelda(grid, x, y, nodo)"
test_command: "node tests/test_asignar_nodo_celda.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_asignar_nodo_celda.js"
tests_sha256: "9718fac744e88e082270858e46acc28d0e790b0cfedcc893c5220e6e779afc4b"
touch_only: ['src/asignarNodoCelda.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Asignar nodo a celda

## Intent
Segunda pieza del [Contrato 33](../../specs/CONTRACT-33-terreno-flexible-residencial-industrial.md):
[`colocar-nodo`](./colocar-nodo.md) no es separable — llama internamente a
[`puede-construir`](./puede-construir.md), no a
[`puede-construir-flexible`](./puede-construir-flexible.md) — así que el camino de colocación
flexible necesita su propio mutador mínimo: la mitad de `colocarNodo` que solo verifica
ocupación y asigna, sin ningún chequeo de terreno. Usado exclusivamente por el camino flexible
(nunca reemplaza a `colocarNodo` para las categorías existentes).

## Interface
```
function asignarNodoCelda(grid, x, y, nodo)
```
Devuelve la celda mutada (`{terreno, nodo}`).

## Invariants
- `nodo === null` o `nodo === undefined`: lanza `RangeError`.
- Reusa [`obtener-celda`](./obtener-celda.md) para leer/mutar la celda — cualquier error de
  coordenadas fuera de rango que esa función lance se propaga sin capturar.
- Si `celda.nodo !== null` (ya ocupada): lanza `Error` (no `RangeError`, mismo tipo que
  `colocarNodo` usa para esa misma condición).
- Si la celda está libre: asigna `celda.nodo = nodo` sin verificar `celda.terreno` en absoluto
  (a diferencia de `colocarNodo`, que sí lo verifica vía `puedeConstruir`).

## Examples
- `asignarNodoCelda(grid, 0, 0, 'fabrica-1')` sobre una celda vacía en terreno `agua_profunda`
  -> la asigna igual, sin lanzar (a propósito: el chequeo de terreno es responsabilidad de quien
  llama, no de esta función).
- `asignarNodoCelda(grid, x, y, null)` -> lanza `RangeError`.
- Llamar dos veces sobre la misma celda -> la segunda llamada lanza `Error` (ya ocupada).

## Do / Don't
- DO: reusar `obtenerCelda` para el acceso a la celda — ninguna lógica de rango se reimplementa.
- DO: verificar SOLO ocupación (`celda.nodo !== null`), nunca terreno.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: importar ni llamar a `puedeConstruir`/`puedeConstruirFlexible` desde este archivo — el
  chequeo de terreno es responsabilidad exclusiva de quien orquesta la colocación (ver
  `colocar-nodo-flexible`, T3 de este mismo contrato).

## Tests
(Los tests están en `tests/test_asignar_nodo_celda.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
