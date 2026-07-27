---
type: 'Task Contract'
title: 'Costo de construcción de ruta por nivel'
description: 'Funcion pura que devuelve el costo de construccion de una ruta segun su nivel S/M/L.'
tags: ['motor-rutas', 'motor-economia', 'flow-city', 'nivel']

task: calcular-costo-construccion-ruta-por-nivel
intent: "Devolver el costo de construccion de una ruta segun su nivel."
target: src/calcularCostoConstruccionRutaPorNivel.js
signature: "function calcularCostoConstruccionRutaPorNivel(nivel)"
test_command: "node tests/test_calcular_costo_construccion_ruta_por_nivel.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_calcular_costo_construccion_ruta_por_nivel.js"
tests_sha256: "2bc26de59c68f9b79680288c35d32acfb5c22fa9d5cb7e6aa8b74a9d504a3fdc"
touch_only: ['src/calcularCostoConstruccionRutaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Costo de construcción de ruta por nivel

## Intent
Tercera pieza del [Contrato 40](../../specs/CONTRACT-40-rutas-escaladas-por-nivel.md):
`DEFINITION.md` establece que construir una ruta de nivel más alto cuesta más dinero. Tabla fija
(ad hoc, propia de este dominio): `{S:20, M:40, L:70}`.

## Interface
```
function calcularCostoConstruccionRutaPorNivel(nivel)
```
Devuelve un entero positivo.

## Invariants
- `calcularCostoConstruccionRutaPorNivel('S') === 20`.
- `calcularCostoConstruccionRutaPorNivel('M') === 40`.
- `calcularCostoConstruccionRutaPorNivel('L') === 70`.
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `calcularCostoConstruccionRutaPorNivel('S')` -> `20`
- `calcularCostoConstruccionRutaPorNivel('L')` -> `70`
- `calcularCostoConstruccionRutaPorNivel('XL')` -> lanza `RangeError`

## Do / Don't
- DO: usar una tabla fija de 3 valores, sin cálculo derivado.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: compartir la tabla con ningún otro dominio.

## Tests
(Los tests están en `tests/test_calcular_costo_construccion_ruta_por_nivel.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
