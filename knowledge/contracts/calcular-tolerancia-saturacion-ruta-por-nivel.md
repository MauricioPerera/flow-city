---
type: 'Task Contract'
title: 'Tolerancia de saturación de ruta por nivel'
description: 'Funcion pura que devuelve el multiplicador de tolerancia a saturacion (capacidad) de una ruta segun su nivel S/M/L.'
tags: ['motor-rutas', 'flow-city', 'nivel']

task: calcular-tolerancia-saturacion-ruta-por-nivel
intent: "Devolver el multiplicador de tolerancia a saturacion de una ruta segun su nivel."
target: src/calcularToleranciaSaturacionRutaPorNivel.js
signature: "function calcularToleranciaSaturacionRutaPorNivel(nivel)"
test_command: "node tests/test_calcular_tolerancia_saturacion_ruta_por_nivel.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_calcular_tolerancia_saturacion_ruta_por_nivel.js"
tests_sha256: "cf78d9b21763511e868d95e91536f15f1e5d5b5daa89882d52179c5634f46513"
touch_only: ['src/calcularToleranciaSaturacionRutaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Tolerancia de saturación de ruta por nivel

## Intent
Primera pieza del [Contrato 40](../../specs/CONTRACT-40-rutas-escaladas-por-nivel.md):
`DEFINITION.md` establece que subir de nivel una ruta aumenta su tolerancia a saturación. Tabla
fija (decisión de diseño ad hoc, propia de este dominio, no compartida con
`calcular-factor-rendimiento-granja-por-nivel` aunque los números coincidan): `{S:1, M:2, L:3}`.

## Interface
```
function calcularToleranciaSaturacionRutaPorNivel(nivel)
```
Devuelve un entero positivo, multiplicador de la capacidad base.

## Invariants
- `calcularToleranciaSaturacionRutaPorNivel('S') === 1`.
- `calcularToleranciaSaturacionRutaPorNivel('M') === 2`.
- `calcularToleranciaSaturacionRutaPorNivel('L') === 3`.
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `calcularToleranciaSaturacionRutaPorNivel('S')` -> `1`
- `calcularToleranciaSaturacionRutaPorNivel('L')` -> `3`
- `calcularToleranciaSaturacionRutaPorNivel('XL')` -> lanza `RangeError`

## Do / Don't
- DO: usar una tabla fija de 3 valores, sin cálculo derivado.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: compartir la tabla con ningún otro dominio (granja, casas, etc.) — cada uno tiene la
  suya, por convención del proyecto.

## Tests
(Los tests están en `tests/test_calcular_tolerancia_saturacion_ruta_por_nivel.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
