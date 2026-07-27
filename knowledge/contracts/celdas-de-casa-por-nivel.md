---
type: 'Task Contract'
title: 'Celdas de casa por nivel'
description: 'Funcion pura que devuelve las celdas del footprint rectangular de una casa segun su nivel S/M/L, anclado en una esquina superior izquierda dada.'
tags: ['motor-grid', 'flow-city', 'footprint', 'nivel']

task: celdas-de-casa-por-nivel
intent: "Devolver las celdas del footprint rectangular de una casa segun su nivel, anclado en una esquina superior izquierda dada."
target: src/celdasDeCasaPorNivel.js
signature: "function celdasDeCasaPorNivel(nivel, xAncla, yAncla)"
test_command: "node tests/test_celdas_de_casa_por_nivel.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_celdas_de_casa_por_nivel.js"
tests_sha256: "12d71debd08a34ae432b5b857732834a8c73998a2eb0565495e6bac08c30806a"
touch_only: ['src/celdasDeCasaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Celdas de casa por nivel

## Intent
Primera pieza del [Contrato 34](../../specs/CONTRACT-34-footprint-viviendas-por-nivel.md):
`DEFINITION.md` (sección "Footprint vs. área de acción") establece que las casas son la única
construcción cuyo footprint crece con el nivel. Esta función es pura geometría, sin acceso a
grid: dado un nivel y una celda ancla (esquina superior izquierda), devuelve la lista de celdas
que forman el rectángulo. Forma elegida (decisión de diseño, no especificada por el usuario):
S=`2x2`, M=`3x2`, L=`3x3`.

## Interface
```
function celdasDeCasaPorNivel(nivel, xAncla, yAncla)
```
Devuelve un array de `{x, y}`, en orden fila por fila (izquierda a derecha, arriba a abajo).

## Invariants
- `nivel === 'S'`: devuelve exactamente 4 celdas (`2x2`).
- `nivel === 'M'`: devuelve exactamente 6 celdas (`3x2`).
- `nivel === 'L'`: devuelve exactamente 9 celdas (`3x3`).
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError`.
- `xAncla`/`yAncla` no enteros o negativos: lanza `RangeError`.
- La primera celda del array devuelto es siempre `{x: xAncla, y: yAncla}`.

## Examples
- `celdasDeCasaPorNivel('S', 0, 0)` -> `[{x:0,y:0},{x:1,y:0},{x:0,y:1},{x:1,y:1}]`
- `celdasDeCasaPorNivel('L', 0, 0)` -> 9 celdas, rectángulo `3x3` completo.
- `celdasDeCasaPorNivel('XL', 0, 0)` -> lanza `RangeError`.

## Do / Don't
- DO: devolver las celdas en orden fila por fila, determinístico.
- DO: validar `nivel` y las coordenadas de ancla antes de calcular cualquier cosa.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: acceder a ningún grid — esta función es pura geometría, sin validar límites de un
  grid real (eso es responsabilidad de quien la componga con `obtenerCelda`).

## Tests
(Los tests están en `tests/test_celdas_de_casa_por_nivel.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
