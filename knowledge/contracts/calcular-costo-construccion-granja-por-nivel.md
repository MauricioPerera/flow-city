---
type: 'Task Contract'
title: 'Costo de construcción de granja por nivel'
description: 'Funcion que compone el costo base existente de construccion de una granja con un recargo por nivel S/M/L.'
tags: ['motor-economia', 'flow-city', 'nivel']

task: calcular-costo-construccion-granja-por-nivel
intent: "Calcular el costo de construccion de una granja segun su nivel, componiendo el costo base existente con un recargo por nivel."
target: src/calcularCostoConstruccionGranjaPorNivel.js
signature: "function calcularCostoConstruccionGranjaPorNivel(nivel)"
test_command: "node tests/test_calcular_costo_construccion_granja_por_nivel.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_calcular_costo_construccion_granja_por_nivel.js"
tests_sha256: "e41508fd1f9fdb4d33265c8a88cc27f1a02a6ce9840efe77920ea3a4a863a26b"
touch_only: ['src/calcularCostoConstruccionGranjaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Costo de construcción de granja por nivel

## Intent
Segunda pieza del [Contrato 35](../../specs/CONTRACT-35-nivel-de-granja.md): construir en un
nivel más alto cuesta más dinero (`DEFINITION.md`). Esta función compone (sin editar) el costo
base ya existente de [`costo-construccion-nodo`](./costo-construccion-nodo.md)
(`costoConstruccionNodo('agricultura')`, `30`) con un recargo fijo por nivel, decisión de diseño
ad hoc no especificada por el usuario: `{S:0, M:20, L:50}`, dando totales `{S:30, M:50, L:80}`.

## Interface
```
function calcularCostoConstruccionGranjaPorNivel(nivel)
```
Devuelve un entero positivo.

## Invariants
- `calcularCostoConstruccionGranjaPorNivel('S') === 30` (`30 + 0`).
- `calcularCostoConstruccionGranjaPorNivel('M') === 50` (`30 + 20`).
- `calcularCostoConstruccionGranjaPorNivel('L') === 80` (`30 + 50`).
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError`.

## Examples
- `calcularCostoConstruccionGranjaPorNivel('S')` -> `30`
- `calcularCostoConstruccionGranjaPorNivel('L')` -> `80`
- `calcularCostoConstruccionGranjaPorNivel('XL')` -> lanza `RangeError`

## Do / Don't
- DO: llamar a `costoConstruccionNodo('agricultura')` para obtener el costo base — no
  hardcodear el `30` directamente, para que si el costo base cambia (en un contrato futuro,
  nunca editando el existente), esta función siga coherente.
- DO: usar una tabla fija de recargo por nivel, sin cálculo derivado.
- DON'T: usar red, `require` de paquetes externos (salvo `costoConstruccionNodo`), ni acceso a
  estado global.
- DON'T: compartir la tabla de recargo con ningún otro dominio.

## Tests
(Los tests están en `tests/test_calcular_costo_construccion_granja_por_nivel.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
