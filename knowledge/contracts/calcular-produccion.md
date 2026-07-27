---
type: 'Task Contract'
title: 'Cálculo de producción por ratio entrada:salida'
description: 'Función pura que calcula cuánta producción resulta de un input de recurso dado un ratio entrada:salida.'
tags: ['motor-recursos', 'flow-city', 'produccion']

task: calcular-produccion
intent: "Calcular la produccion resultante de un input de recurso segun un ratio entrada:salida fijo."
target: src/calcularProduccion.js
signature: "function calcularProduccion(entrada, ratioEntrada, ratioSalida)"
test_command: "node tests/test_calcular_produccion.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 2
tests: "tests/test_calcular_produccion.js"
tests_sha256: "24791f81f0995a7c761447ba1b92e1f9928d2354d7e9633d0627208c84a9519f"
touch_only: ['src/calcularProduccion.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Cálculo de producción por ratio entrada:salida

## Intent
Toda construcción productiva de Flow City (bomba de agua, granja, reforestación, taller de
tala, fábrica de muebles, etc.) transforma una cantidad de recurso de entrada en una cantidad
de recurso de salida según un ratio fijo declarado por su receta (ej. granja: 1 agua : 2
manzanas; reforestación: 2 agua : 1 árbol). Esta función es el cálculo puro y reutilizable que
toda receta de producción usará, independiente de qué construcción o recurso concreto se trate.
Ver [DEFINITION.md](../../DEFINITION.md), sección "Producción y cadenas de recursos".

Asunción de diseño explícita (no estaba en DEFINITION.md, se fija acá): los recursos son
unidades discretas; la entrada que no alcanza a completar una unidad de `ratioEntrada` no se
consume ni produce nada (floor, sin fracciones ni acarreo entre llamadas).

## Interface
```
function calcularProduccion(entrada, ratioEntrada, ratioSalida)
```

## Invariants
- El resultado es siempre un entero >= 0.
- La función es pura: mismo input siempre produce el mismo output, sin efectos secundarios.
- `entrada < 0`, `ratioEntrada <= 0` o `ratioSalida <= 0` son entradas inválidas y lanzan
  `RangeError`, nunca devuelven un número negativo o silencioso.

## Examples
- `calcularProduccion(1, 1, 2)` -> `2` (bomba->granja: 1 agua produce 2 manzanas)
- `calcularProduccion(4, 2, 1)` -> `2` (4 agua produce 2 árboles, ratio 2:1)
- `calcularProduccion(5, 2, 1)` -> `2` (el agua sobrante, 1 unidad, no alcanza y se descarta)
- `calcularProduccion(0, 1, 2)` -> `0`

## Do / Don't
- DO: usar aritmética entera (`Math.floor`) para el descarte del resto.
- DO: validar los tres argumentos antes de calcular.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: redondear hacia arriba ni acarrear el resto entre llamadas.

## Tests
(Los tests están en `tests/test_calcular_produccion.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
