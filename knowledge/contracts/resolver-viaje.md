---
type: 'Task Contract'
title: 'Resolución de un viaje a través de la red de rutas'
description: 'Funcion que calcula la ruta de un viaje y cuanto llega efectivamente a destino, aplicando saturacion proporcional por cada tramo atravesado.'
tags: ['motor-trafico', 'flow-city', 'trafico', 'tick', 'pathfinding']

task: resolver-viaje
intent: "Calcular la ruta de un viaje y cuanta cantidad llega efectivamente a destino, aplicando la perdida proporcional de saturacion de cada tramo atravesado."
target: src/resolverViaje.js
signature: "function resolverViaje(grafo, origen, destino, tipoTrafico, cantidad)"
test_command: "node tests/test_resolver_viaje.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_resolver_viaje.js"
tests_sha256: "830e8d3ed7ef80d2e3732559ab0302316f5ab4a4c683b2612c2751d88d5b2f33"
touch_only: ['src/resolverViaje.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Resolución de un viaje a través de la red de rutas

## Intent
Tercera pieza del [Contrato 04](../../specs/CONTRACT-04-motor-trafico-tick.md): dado un grafo
donde cada tramo YA tiene su `cargaActual` final del tick asignada (por
[`registrarCargaTramo`](./registrar-carga-tramo.md), acumulando todos los viajes simultáneos
antes de esta llamada — responsabilidad de T4, no de esta función), calcula la ruta
([`encontrarRuta`](./encontrar-ruta.md)) de un viaje concreto y cuánta `cantidad` llega
efectivamente a destino.

Modelo de pérdida fijado en esta tarea: la `perdida` absoluta que devuelve
[`calcularSaturacion`](./calcular-saturacion.md) es sobre el tráfico TOTAL de un tramo (todos
los viajes que lo comparten), no solo el de este viaje. Por eso se convierte a una
**fracción de pérdida** (`perdida / cargaActual`) y se aplica proporcionalmente a la `cantidad`
de este viaje — asume que la pérdida se reparte por igual entre todo el tráfico que satura el
tramo. Las pérdidas de tramos consecutivos se **componen** (se multiplican, no se suman). La
velocidad efectiva del viaje completo es el `factorVelocidad` MÍNIMO entre todos los tramos
atravesados (el tramo más lento marca el ritmo de todo el trayecto — cuello de botella).

Esta función NO llama a `registrarCargaTramo`: solo lee `cargaActual` (o lo trata como `0` si
no existe todavía). Registrar la carga es responsabilidad de quien orquesta el tick (T4).

## Interface
```
function resolverViaje(grafo, origen, destino, tipoTrafico, cantidad)
```
Devuelve `{ camino, entregado, factorVelocidadMinimo }`.

## Invariants
- Si `origen === destino`: `{ camino: [origen], entregado: cantidad, factorVelocidadMinimo: 1
  }` (caso trivial, sin tramos que atravesar).
- Si `destino` es inalcanzable (según `encontrarRuta`): `{ camino: null, entregado: 0,
  factorVelocidadMinimo: null }` — no es un error, es un resultado legítimo.
- Si existe camino: `entregado = cantidad * producto((1 - fraccionPerdida) por cada tramo)`, y
  `factorVelocidadMinimo` es el mínimo de los `factorVelocidad` de todos los tramos del camino.
- Un tramo sin `cargaActual` (`undefined`) se trata como `cargaActual = 0` (sin saturación,
  `factorVelocidad = 1`, `fraccionPerdida = 0`).
- `cantidad` no entera o `<= 0`: lanza `RangeError`.
- `tipoTrafico` inválido u `origen`/`destino` ausentes del grafo: lanza `RangeError` (delegado
  de `encontrarRuta`).
- `grafo` inválido: lanza `RangeError` (delegado de `encontrarRuta`).

## Examples
- Tramo `A-B` sin saturación (`cargaActual` bajo capacidad): `resolverViaje(grafo, 'A', 'B',
  'mercaderia', 5)` -> `entregado: 5`, `factorVelocidadMinimo: 1`.
- Tramo `A-B` con `cargaActual: 20`, `capacidad: 10`: `resolverViaje(grafo, 'A', 'B',
  'mercaderia', 8)` -> `entregado: 4` (mitad, `fraccionPerdida = 10/20 = 0.5`),
  `factorVelocidadMinimo: 0.5`.
- Camino de 2 tramos, uno sin saturación y otro al doble de capacidad: la pérdida solo la
  aporta el tramo saturado; `factorVelocidadMinimo` es el del tramo saturado (el más lento).
- `resolverViaje(grafo, 'A', 'A', 'mercaderia', 10)` -> `{ camino: ['A'], entregado: 10,
  factorVelocidadMinimo: 1 }`

## Do / Don't
- DO: reusar `encontrarRuta` y `calcularSaturacion`, no reimplementar pathfinding ni la fórmula
  de saturación.
- DO: componer (multiplicar) las fracciones de pérdida de tramos consecutivos, no sumarlas.
- DON'T: usar red, `require` de paquetes externos (salvo módulos hermanos del proyecto), ni
  acceso a estado global.
- DON'T: llamar a `registrarCargaTramo` desde esta función — la acumulación de carga es de T4.

## Tests
(Los tests están en `tests/test_resolver_viaje.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
