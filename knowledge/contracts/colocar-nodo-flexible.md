---
type: 'Task Contract'
title: 'Colocar nodo flexible'
description: 'Funcion que coloca un nodo de categoria flexible (residencial, industrial) en una celda del grid usando la regla de terreno flexible en vez de la whitelist estricta de puedeConstruir.'
tags: ['motor-grid', 'flow-city', 'terreno', 'nivel']

task: colocar-nodo-flexible
intent: "Colocar un nodo de categoria flexible en una celda del grid, validando terreno con la regla flexible y asignando sin el chequeo estricto de puedeConstruir."
target: src/colocarNodoFlexible.js
signature: "function colocarNodoFlexible(grid, x, y, categoriaConstruccion, nodo)"
test_command: "node tests/test_colocar_nodo_flexible.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_colocar_nodo_flexible.js"
tests_sha256: "50a46d0c8d86641f71d6664a4ae16fc576bef2b60a96ab04ebd0038754ffa55c"
touch_only: ['src/colocarNodoFlexible.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Colocar nodo flexible

## Intent
Tercera y última pieza del [Contrato 33](../../specs/CONTRACT-33-terreno-flexible-residencial-industrial.md):
compone [`puede-construir-flexible`](./puede-construir-flexible.md) (validar terreno) +
[`asignar-nodo-celda`](./asignar-nodo-celda.md) (asignar) — el equivalente de
[`colocar-nodo`](./colocar-nodo.md) pero para categorías de terreno flexible (`residencial`,
`industrial`), celda única. Usada directo para construcciones industriales; el Contrato 34
reusa esta misma función, celda por celda, para el footprint multi-celda de viviendas.

## Interface
```
function colocarNodoFlexible(grid, x, y, categoriaConstruccion, nodo)
```
Devuelve la celda mutada (`{terreno, nodo}`).

## Invariants
- Lee la celda vía `obtenerCelda` (propagando cualquier error de coordenadas fuera de rango).
- Si `puedeConstruirFlexible(celda.terreno, categoriaConstruccion)` devuelve `false`
  (`agua_profunda`): lanza `Error` indicando que el terreno no admite la categoría.
- Si `categoriaConstruccion` no es flexible (`RangeError` de `puedeConstruirFlexible`): se
  propaga sin capturar.
- Si el terreno es válido: delega en `asignarNodoCelda` (que a su vez valida ocupación y
  `nodo !== null/undefined`, propagando sus propios errores).
- Nunca llama a `puedeConstruir` ni a `colocarNodo`.

## Examples
- `colocarNodoFlexible(grid, 0, 0, 'residencial', 'casa-1')` sobre terreno `elevada` -> coloca
  sin lanzar.
- `colocarNodoFlexible(grid, 0, 0, 'residencial', 'casa-1')` sobre terreno `agua_profunda` ->
  lanza `Error`.
- `colocarNodoFlexible(grid, 0, 0, 'agricultura', 'granja-1')` -> lanza `RangeError` (categoría
  no flexible, propagado de `puedeConstruirFlexible`).

## Do / Don't
- DO: reusar `obtenerCelda`, `puedeConstruirFlexible` y `asignarNodoCelda` — ninguna lógica de
  rango, terreno u ocupación se reimplementa.
- DO: dejar que los errores de las funciones compuestas se propaguen tal cual (no envolverlos ni
  cambiar su tipo).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: llamar a `puedeConstruir` o `colocarNodo` — este es el camino flexible, exclusivamente.

## Tests
(Los tests están en `tests/test_colocar_nodo_flexible.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
