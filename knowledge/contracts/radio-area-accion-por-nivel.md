---
type: 'Task Contract'
title: 'Radio de área de acción por nivel'
description: 'Funcion pura que devuelve el radio de area de accion (Chebyshev) segun el nivel S/M/L, compartido por reforestacion, tala, granja y centro civico.'
tags: ['motor-grid', 'flow-city', 'nivel', 'area-de-accion']

task: radio-area-accion-por-nivel
intent: "Devolver el radio de area de accion segun el nivel, compartido por construcciones cuyo footprint no cambia pero cuya area de accion si."
target: src/radioAreaAccionPorNivel.js
signature: "function radioAreaAccionPorNivel(nivel)"
test_command: "node tests/test_radio_area_accion_por_nivel.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_radio_area_accion_por_nivel.js"
tests_sha256: "905e8b8c85b7666276e78140f5ff9e2926888f32724c135f42583144ab37a72b"
touch_only: ['src/radioAreaAccionPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Radio de área de acción por nivel

## Intent
Primera pieza del [Contrato 36](../../specs/CONTRACT-36-area-de-accion-por-nivel.md):
`DEFINITION.md` establece que el footprint de la mayoría de construcciones (reforestación,
tala, granja, centro cívico) se mantiene igual entre niveles, pero su área de acción crece. Esta
es la ÚNICA tabla de este roadmap deliberadamente compartida entre dominios (a diferencia de,
por ejemplo, `calcular-factor-rendimiento-granja-por-nivel`), porque reforestación y tala son un
par complementario que debe coincidir en su radio. Tabla fija (ad hoc, no especificada por el
usuario): `{S:2, M:3, L:4}`.

## Interface
```
function radioAreaAccionPorNivel(nivel)
```
Devuelve un entero positivo, para usar directo como `radio` de
[`esta-en-zona-influencia`](./esta-en-zona-influencia.md).

## Invariants
- `radioAreaAccionPorNivel('S') === 2`.
- `radioAreaAccionPorNivel('M') === 3`.
- `radioAreaAccionPorNivel('L') === 4`.
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `radioAreaAccionPorNivel('S')` -> `2`
- `radioAreaAccionPorNivel('L')` -> `4`
- `radioAreaAccionPorNivel('XL')` -> lanza `RangeError`

## Do / Don't
- DO: usar una tabla fija de 3 valores, sin cálculo derivado.
- DO: mantenerse deliberadamente reusable — esta es la ÚNICA tabla del roadmap de niveles que se
  comparte entre más de un dominio de construcción (a propósito, ver Intent).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: crear un wrapper nuevo sobre `estaEnZonaInfluencia` — el radio se pasa directo a esa
  función ya existente, sin capa intermedia.

## Tests
(Los tests están en `tests/test_radio_area_accion_por_nivel.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
