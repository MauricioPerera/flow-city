---
type: 'Task Contract'
title: 'Aplicación de degradación a la producción'
description: 'Funcion pura que reduce a la mitad (redondeada hacia abajo) una produccion potencial cuando el nodo esta degradado.'
tags: ['motor-economia', 'flow-city', 'quiebra', 'produccion']

task: aplicar-degradacion-produccion
intent: "Reducir a la mitad (redondeada hacia abajo) una produccion potencial cuando el nodo esta degradado; dejarla intacta si no."
target: src/aplicarDegradacionProduccion.js
signature: "function aplicarDegradacionProduccion(produccionPotencial, degradado)"
test_command: "node tests/test_aplicar_degradacion_produccion.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_aplicar_degradacion_produccion.js"
tests_sha256: "c2b7cf86cba3c6a9f01b9ad08f75c84e2fcccd226939288c910b587ac29d6683"
touch_only: ['src/aplicarDegradacionProduccion.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Aplicación de degradación a la producción

## Intent
Tercera y última pieza del [Contrato 13](../../specs/CONTRACT-13-consecuencias-quiebra.md):
decisión confirmada en conversación antes de escribir este contrato — un nodo degradado (según
[`estaNodoDegradado`](./esta-nodo-degradado.md)) produce a la mitad, redondeada hacia abajo, de
su producción potencial (calculada por ejemplo con
[`producirTickNodo`](./producir-tick-nodo.md) o
[`producirTickNodoConAlmacen`](./producir-tick-nodo-con-almacen.md)). Un nodo no degradado
produce su cantidad completa, sin cambios.

## Interface
```
function aplicarDegradacionProduccion(produccionPotencial, degradado)
```
Devuelve un número `>= 0`.

## Invariants
- Si `degradado === false`: el resultado es exactamente `produccionPotencial`.
- Si `degradado === true`: el resultado es `Math.floor(produccionPotencial / 2)`.
- `produccionPotencial` negativa o no finita: lanza `RangeError`.
- `degradado` no booleano: lanza `RangeError`.

## Examples
- `aplicarDegradacionProduccion(8, false)` -> `8`
- `aplicarDegradacionProduccion(8, true)` -> `4`
- `aplicarDegradacionProduccion(5, true)` -> `2` (descarta el resto)
- `aplicarDegradacionProduccion(0, true)` -> `0`
- `aplicarDegradacionProduccion(-1, true)` -> lanza `RangeError`

## Do / Don't
- DO: usar `Math.floor` para el redondeo hacia abajo, nunca `Math.round` ni `Math.ceil`.
- DO: validar ambos parámetros antes de calcular.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: introducir un factor de reducción distinto de exactamente la mitad.

## Tests
(Los tests están en `tests/test_aplicar_degradacion_produccion.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
