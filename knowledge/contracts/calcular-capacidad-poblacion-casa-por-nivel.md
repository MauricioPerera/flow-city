---
type: 'Task Contract'
title: 'Capacidad de población de casa por nivel'
description: 'Funcion pura que devuelve cuanta poblacion aloja una casa segun su nivel S/M/L.'
tags: ['motor-poblacion', 'flow-city', 'nivel']

task: calcular-capacidad-poblacion-casa-por-nivel
intent: "Devolver la capacidad de poblacion que aloja una casa segun su nivel."
target: src/calcularCapacidadPoblacionCasaPorNivel.js
signature: "function calcularCapacidadPoblacionCasaPorNivel(nivel)"
test_command: "node tests/test_calcular_capacidad_poblacion_casa_por_nivel.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_calcular_capacidad_poblacion_casa_por_nivel.js"
tests_sha256: "33398939e7719dc34f2fa64f6a26317b49f060d7e276e8567ce979a2ee06bda2"
touch_only: ['src/calcularCapacidadPoblacionCasaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Capacidad de población de casa por nivel

## Intent
Segunda pieza del [Contrato 34](../../specs/CONTRACT-34-footprint-viviendas-por-nivel.md):
`DEFINITION.md` establece que subir de nivel una casa aumenta la población que aloja, junto con
su footprint. Tabla fija (decisión de diseño ad hoc, heurística de 1 persona por celda de
footprint — `2x2=4`, `3x2=6`, `3x3=9` — no especificada por el usuario, documentada aquí, mismo
patrón que otras constantes del proyecto como `NECESIDAD_PER_CAPITA`).

## Interface
```
function calcularCapacidadPoblacionCasaPorNivel(nivel)
```
Devuelve un entero positivo.

## Invariants
- `calcularCapacidadPoblacionCasaPorNivel('S') === 4`.
- `calcularCapacidadPoblacionCasaPorNivel('M') === 6`.
- `calcularCapacidadPoblacionCasaPorNivel('L') === 9`.
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `calcularCapacidadPoblacionCasaPorNivel('S')` -> `4`
- `calcularCapacidadPoblacionCasaPorNivel('L')` -> `9`
- `calcularCapacidadPoblacionCasaPorNivel('XL')` -> lanza `RangeError`

## Do / Don't
- DO: usar una tabla fija de 3 valores (`{S:4, M:6, L:9}`), sin cálculo derivado.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: importar `celdas-de-casa-por-nivel` — aunque los números coinciden con el conteo de
  celdas de esa función, son tablas independientes (una es geometría, otra es población), no
  hay que acoplarlas.

## Tests
(Los tests están en `tests/test_calcular_capacidad_poblacion_casa_por_nivel.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
