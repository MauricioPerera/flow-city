---
type: 'Task Contract'
title: 'Registro de carga acumulada en un tramo'
description: 'Funcion que acumula una cantidad de trafico sobre un tramo, validando que el tramo admita ese tipo de trafico.'
tags: ['motor-trafico', 'flow-city', 'trafico', 'tick']

task: registrar-carga-tramo
intent: "Acumular una cantidad de trafico sobre un tramo, validando que el tramo admita ese tipo de trafico."
target: src/registrarCargaTramo.js
signature: "function registrarCargaTramo(tramo, tipoTraficoConsulta, cantidad)"
test_command: "node tests/test_registrar_carga_tramo.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_registrar_carga_tramo.js"
tests_sha256: "38ee6e0abf7c3b4796e79aec644eeb29413fdbc879ae68a46522e1bca5b8b409"
touch_only: ['src/registrarCargaTramo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Registro de carga acumulada en un tramo

## Intent
Segunda pieza del [Contrato 04](../../specs/CONTRACT-04-motor-trafico-tick.md): la capacidad
de un tramo (`DEFINITION.md`, sección "Rutas y tráfico") es un límite COMPARTIDO de tráfico
total, no una cuota separada por tipo (mercadería y personas compiten por el mismo espacio
físico del tramo). Esta función acumula cantidad de tráfico sobre `tramo.cargaActual`,
validando primero que el tramo admita ese tipo de tráfico (vía
[`tramoAdmiteTrafico`](./tramo-admite-trafico.md)). El resultado (`cargaActual`) es lo que
[`calcularSaturacion`](./calcular-saturacion.md) consumirá más adelante para determinar
velocidad y pérdida.

## Interface
```
function registrarCargaTramo(tramo, tipoTraficoConsulta, cantidad)
```
Muta `tramo.cargaActual` (lo inicializa en `0` si no existía) y devuelve el `tramo` mutado.

## Invariants
- Si el tramo no admite `tipoTraficoConsulta` (según `tramoAdmiteTrafico`): lanza `Error` (no
  `RangeError`). `tramo.cargaActual` no se modifica.
- Si `tramo.cargaActual` no existía: se inicializa en `0` antes de sumar.
- Tras una llamada exitosa: `tramo.cargaActual` aumenta exactamente en `cantidad` respecto a su
  valor previo (acumula entre llamadas sucesivas, no lo reemplaza).
- `cantidad <= 0` o no entera: lanza `RangeError`.
- `tipoTraficoConsulta` fuera de `['mercaderia', 'personas']` (incluido `'ambos'`): lanza
  `RangeError` (delegado de `tramoAdmiteTrafico`).
- `tramo` `null` o no-objeto: lanza `RangeError`.

## Examples
- `registrarCargaTramo({ tipoTrafico: 'ambos' }, 'mercaderia', 5)` -> `tramo.cargaActual === 5`
- Dos llamadas sucesivas de `5` y `3` -> `tramo.cargaActual === 8`
- Sobre un tramo `tipoTrafico: 'mercaderia'`: `registrarCargaTramo(tramo, 'personas', 1)` ->
  lanza `Error` (no `RangeError`), `cargaActual` sigue `undefined`
- `registrarCargaTramo(tramo, 'mercaderia', 0)` -> lanza `RangeError`

## Do / Don't
- DO: reusar `tramoAdmiteTrafico` para la validación de tipo, no reimplementarla.
- DO: acumular sobre el valor previo, nunca reemplazarlo.
- DON'T: usar red, `require` de paquetes externos (salvo `tramoAdmiteTrafico`, módulo hermano),
  ni acceso a estado global.
- DON'T: mantener sub-totales separados por tipo de tráfico — la carga es un total compartido.

## Tests
(Los tests están en `tests/test_registrar_carga_tramo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
