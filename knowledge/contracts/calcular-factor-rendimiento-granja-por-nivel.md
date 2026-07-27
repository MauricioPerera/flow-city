---
type: 'Task Contract'
title: 'Factor de rendimiento de granja por nivel'
description: 'Funcion pura que devuelve el multiplicador de rendimiento de una granja segun su nivel S/M/L.'
tags: ['motor-produccion', 'flow-city', 'nivel']

task: calcular-factor-rendimiento-granja-por-nivel
intent: "Devolver el multiplicador de rendimiento de una granja segun su nivel."
target: src/calcularFactorRendimientoGranjaPorNivel.js
signature: "function calcularFactorRendimientoGranjaPorNivel(nivel)"
test_command: "node tests/test_calcular_factor_rendimiento_granja_por_nivel.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_calcular_factor_rendimiento_granja_por_nivel.js"
tests_sha256: "2561f4c9834f0ccaa38edd2f51a6732b6af222ac9ef314278604b1a65fe87a1c"
touch_only: ['src/calcularFactorRendimientoGranjaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Factor de rendimiento de granja por nivel

## Intent
Primera pieza del [Contrato 35](../../specs/CONTRACT-35-nivel-de-granja.md): `DEFINITION.md`
establece que subir de nivel una granja aumenta su rendimiento. Tabla fija (decisión de diseño
ad hoc, no especificada por el usuario, documentada aquí): `{S:1, M:2, L:3}` — lineal, sin
compartir tabla con ningún otro dominio (siguiendo la convención del proyecto de no centralizar
constantes entre archivos).

## Interface
```
function calcularFactorRendimientoGranjaPorNivel(nivel)
```
Devuelve un entero positivo.

## Invariants
- `calcularFactorRendimientoGranjaPorNivel('S') === 1`.
- `calcularFactorRendimientoGranjaPorNivel('M') === 2`.
- `calcularFactorRendimientoGranjaPorNivel('L') === 3`.
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `calcularFactorRendimientoGranjaPorNivel('S')` -> `1`
- `calcularFactorRendimientoGranjaPorNivel('L')` -> `3`
- `calcularFactorRendimientoGranjaPorNivel('XL')` -> lanza `RangeError`

## Do / Don't
- DO: usar una tabla fija de 3 valores, sin cálculo derivado.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: importar ni compartir tabla con `calcular-costo-construccion-granja-por-nivel` ni con
  ningún otro dominio (rutas, casas, fábricas) — cada uno tiene su propia tabla independiente.

## Tests
(Los tests están en `tests/test_calcular_factor_rendimiento_granja_por_nivel.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
