---
type: 'Task Contract'
title: 'Celda dentro de la zona de influencia de un centro cívico'
description: 'Funcion pura que determina si una celda esta dentro del radio de influencia (distancia Chebyshev) de un centro civico.'
tags: ['motor-poblacion', 'flow-city', 'grid', 'zona-influencia']

task: esta-en-zona-influencia
intent: "Determinar si una celda esta dentro del radio de influencia de un centro civico, usando distancia Chebyshev."
target: src/estaEnZonaInfluencia.js
signature: "function estaEnZonaInfluencia(xCentro, yCentro, radio, xCelda, yCelda)"
test_command: "node tests/test_esta_en_zona_influencia.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_esta_en_zona_influencia.js"
tests_sha256: "edd4070ec6859278e01d70a4ffd2d455dfcf806d5716c6442a7eb1e2cf7d8122"
touch_only: ['src/estaEnZonaInfluencia.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Celda dentro de la zona de influencia de un centro cívico

## Intent
Cuarta pieza del [Contrato 06](../../specs/CONTRACT-06-poblacion.md): "la única forma de
construir casas es dentro de la zona de influencia de un centro cívico"
(`DEFINITION.md`, sección "Grilla y construcción"). Esta función determina si una celda dada
cae dentro del radio de influencia de un centro cívico, usando la métrica de distancia
**Chebyshev** (`max(|dx|, |dy|)`) — decisión confirmada en conversación antes de escribir este
contrato, porque produce una zona cuadrada nativa de la grilla (equivalente al alcance del rey
en ajedrez), sin raíces cuadradas ni formas en diamante.

## Interface
```
function estaEnZonaInfluencia(xCentro, yCentro, radio, xCelda, yCelda)
```
Devuelve un booleano.

## Invariants
- `estaEnZonaInfluencia(xc, yc, r, xc, yc) === true` siempre (la propia celda del centro cívico
  está en su zona, para cualquier `r >= 0`).
- El resultado es `max(|xCelda - xCentro|, |yCelda - yCentro|) <= radio`.
- Con `radio === 0`: solo la celda del propio centro cívico está en zona.
- Cualquier coordenada (`xCentro`, `yCentro`, `xCelda`, `yCelda`) negativa o no entera: lanza
  `RangeError`.
- `radio` negativo o no entero: lanza `RangeError`.

## Examples
- `estaEnZonaInfluencia(5, 5, 2, 5, 5)` -> `true`
- `estaEnZonaInfluencia(5, 5, 2, 7, 5)` -> `true` (distancia recta 2)
- `estaEnZonaInfluencia(5, 5, 2, 7, 7)` -> `true` (Chebyshev: `max(2,2)=2`, no `4` como
  Manhattan)
- `estaEnZonaInfluencia(5, 5, 2, 8, 8)` -> `false` (Chebyshev `3 > 2`)
- `estaEnZonaInfluencia(5, 5, 0, 6, 5)` -> `false`

## Do / Don't
- DO: usar `Math.max(Math.abs(dx), Math.abs(dy))`, nunca `Math.abs(dx) + Math.abs(dy)`
  (Manhattan) ni `Math.sqrt(dx**2 + dy**2)` (euclídea).
- DO: validar las 4 coordenadas y el radio antes de calcular la distancia.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar coordenadas o radio negativos o no enteros.

## Tests
(Los tests están en `tests/test_esta_en_zona_influencia.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
