---
type: 'Task Contract'
title: 'Producción de un nodo en un tick'
description: 'Funcion que calcula la produccion de salida de un nodo productivo en un tick, segun su modo (receta con insumo, o extraccion con produccion fija).'
tags: ['motor-integracion', 'flow-city', 'produccion', 'tick']

task: producir-tick-nodo
intent: "Calcular la produccion de salida de un nodo productivo en un tick, segun su modo (receta con insumo recibido, o extraccion con produccion fija)."
target: src/producirTickNodo.js
signature: "function producirTickNodo(nodo, entradaRecibida)"
test_command: "node tests/test_producir_tick_nodo.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_producir_tick_nodo.js"
tests_sha256: "babea7414be23bd457872345872165fee9e937522b735890671f9c50590bf4bd"
touch_only: ['src/producirTickNodo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Producción de un nodo en un tick

## Intent
Segunda pieza del [Contrato 09](../../specs/CONTRACT-09-integracion-bomba-granja.md): dado un
nodo productivo (creado por [`crearNodoProductivo`](./crear-nodo-productivo.md)) y la cantidad
de insumo recibida en el tick actual, calcula su producción de ese tick. Un nodo de
**extracción** (ej. bomba de agua) ignora `entradaRecibida` y devuelve siempre su
`produccionFija`. Un nodo de **receta** (ej. granja) usa
[`calcularProduccion`](./calcular-produccion.md) con su `ratioEntrada`/`ratioSalida` sobre
`entradaRecibida`.

## Interface
```
function producirTickNodo(nodo, entradaRecibida)
```
Devuelve un número `>= 0`.

## Invariants
- Si `nodo.produccionFija !== null` (modo extracción): el resultado es exactamente
  `nodo.produccionFija`, sin importar `entradaRecibida`.
- Si `nodo.produccionFija === null` (modo receta): el resultado es exactamente
  `calcularProduccion(entradaRecibida, nodo.ratioEntrada, nodo.ratioSalida)`.
- `entradaRecibida` negativa o no finita: lanza `RangeError`, incluso en modo extracción (donde
  el valor se ignora para el cálculo, pero igual debe ser válido).
- `nodo` `null`, no-objeto, o que no cumpla exactamente uno de los dos modos válidos de
  [`crearNodoProductivo`](./crear-nodo-productivo.md): lanza `RangeError`.

## Examples
- Nodo extracción con `produccionFija: 5`: `producirTickNodo(nodo, 100)` -> `5`
- Nodo receta con `ratioEntrada: 1, ratioSalida: 2`: `producirTickNodo(nodo, 10)` -> `20`
- Nodo receta con `ratioEntrada: 2, ratioSalida: 1`: `producirTickNodo(nodo, 5)` -> `2`
  (descarta el resto)
- `producirTickNodo(nodo, -1)` -> lanza `RangeError`
- `producirTickNodo(null, 10)` -> lanza `RangeError`

## Do / Don't
- DO: reusar `calcularProduccion` para el modo receta, no reimplementar su aritmética.
- DO: validar `entradaRecibida` siempre, incluso cuando el modo extracción la va a ignorar.
- DON'T: usar red, `require` de paquetes externos (salvo `calcularProduccion`, módulo hermano),
  ni acceso a estado global.
- DON'T: aceptar un `nodo` que no cumpla exactamente uno de los dos modos de
  `crearNodoProductivo`.

## Tests
(Los tests están en `tests/test_producir_tick_nodo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
