---
type: 'Task Contract'
title: 'Creación de un tramo de ruta'
description: 'Funcion pura que construye la estructura de datos de un tramo de ruta, validando su tipo y restricciones de trafico.'
tags: ['motor-rutas', 'flow-city', 'trafico', 'grid']

task: crear-tramo
intent: "Construir la estructura de datos de un tramo de ruta validando su tipo, capacidad, longitud y restriccion de trafico."
target: src/crearTramo.js
signature: "function crearTramo(tipoRuta, capacidad, longitud, tipoTrafico)"
test_command: "node tests/test_crear_tramo.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_crear_tramo.js"
tests_sha256: "caa0d982aa4404d031306515882d3a42c9617d995d0fbdc1cc63ea6126fa1b4d"
touch_only: ['src/crearTramo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Creación de un tramo de ruta

## Intent
Primera pieza del [Contrato 02](../../specs/CONTRACT-02-modelo-rutas.md): un tramo es la
fracción de ruta entre dos conexiones (vértice-vértice o vértice-nodo). Esta función construye
su estructura de datos: tipo de ruta, capacidad de carga, longitud, y tipo de tráfico
permitido. Ver [DEFINITION.md](../../DEFINITION.md), secciones "Rutas y tráfico" y "Comercio y
economía".

Decisión de diseño fijada en esta tarea (hueco abierto en `DEFINITION.md`, resuelto en
conversación antes de escribir este contrato): **ferrocarril y subte tienen `tipoTrafico`
fijo** (`mercaderia` y `personas` respectivamente, no configurable); **carretera y marítima son
configurables** (`mercaderia`/`personas`/`ambos`, default `ambos` si se omite el argumento). Un
`tipoTrafico` explícito que contradiga el valor fijo de ferrocarril/subte es un error, no un
valor que se ignore en silencio.

## Interface
```
function crearTramo(tipoRuta, capacidad, longitud, tipoTrafico)
```
Devuelve `{ tipoRuta, capacidad, longitud, tipoTrafico }`. `tipoTrafico` es opcional.

## Invariants
- `tipoRuta` debe ser uno de `['carretera', 'ferrocarril', 'maritima', 'subte']`; cualquier
  otro valor lanza `RangeError`.
- `capacidad` y `longitud` deben ser `> 0`; cualquier otro valor lanza `RangeError`.
- Para `ferrocarril`: `tipoTrafico` resultante es siempre `'mercaderia'`. Si se pasa un valor
  explícito distinto, lanza `RangeError`.
- Para `subte`: `tipoTrafico` resultante es siempre `'personas'`. Si se pasa un valor explícito
  distinto, lanza `RangeError`.
- Para `carretera` y `maritima`: `tipoTrafico` puede ser `'mercaderia'`, `'personas'` o
  `'ambos'`; si se omite, el resultado es `'ambos'`. Cualquier otro valor lanza `RangeError`.

## Examples
- `crearTramo('carretera', 10, 5)` -> `{ tipoRuta: 'carretera', capacidad: 10, longitud: 5,
  tipoTrafico: 'ambos' }`
- `crearTramo('ferrocarril', 20, 7)` -> `tipoTrafico: 'mercaderia'` (autocompletado)
- `crearTramo('ferrocarril', 20, 7, 'personas')` -> lanza `RangeError` (contradice el tipo fijo)
- `crearTramo('subte', 15, 3, 'ambos')` -> lanza `RangeError`

## Do / Don't
- DO: autocompletar `tipoTrafico` cuando se omite, según la regla de cada `tipoRuta`.
- DO: validar los 4 argumentos antes de construir el objeto de retorno.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: ignorar en silencio un `tipoTrafico` contradictorio — siempre `RangeError`.

## Tests
(Los tests están en `tests/test_crear_tramo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
