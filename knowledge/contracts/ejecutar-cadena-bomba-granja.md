---
type: 'Task Contract'
title: 'Ejecución de la cadena real bomba de agua → granja'
description: 'Funcion de integracion que arma un grid real, coloca y conecta bomba de agua y granja por una ruta real, y simula N ticks completos de produccion-transporte-produccion.'
tags: ['motor-integracion', 'flow-city', 'produccion', 'grid', 'grafo', 'tick']

task: ejecutar-cadena-bomba-granja
intent: "Simular N ticks completos de la cadena real bomba de agua -> granja, integrando grid, grafo de rutas, produccion y motor de trafico."
target: src/ejecutarCadenaBombaGranja.js
signature: "function ejecutarCadenaBombaGranja(numTicks)"
test_command: "node tests/test_ejecutar_cadena_bomba_granja.js"
budget:
  max_cyclomatic_complexity: 12
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_bomba_granja.js"
tests_sha256: "8540d5f44996a1dc8a67675aa6e961f6c9fc4acc6f332886e89ae064cb49e44e"
touch_only: ['src/ejecutarCadenaBombaGranja.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de la cadena real bomba de agua → granja

## Intent
Tercera y última pieza del [Contrato 09](../../specs/CONTRACT-09-integracion-bomba-granja.md):
la primera integración real de punta a punta del proyecto. Arma internamente un grid real de
2x1 celdas `'verde'` ([`crearGrid`](./crear-grid.md)), coloca una bomba de agua (nodo de
extracción, categoría de emplazamiento `'no_extractiva'`) en `(0,0)` y una granja (categoría
`'agricultura'`) en `(1,0)` con [`colocarNodo`](./colocar-nodo.md), calcula sus vértices de
entrada enfrentados con [`verticeEntrada`](./vertice-entrada.md) (bomba mirando `'este'`,
granja mirando `'oeste'`), los conecta con un tramo real
([`crearTramo`](./crear-tramo.md) + [`conectarVertices`](./conectar-vertices.md)), y simula
`numTicks` ticks: cada tick la bomba produce agua fija
([`producirTickNodo`](./producir-tick-nodo.md)), esa agua viaja por la ruta real
([`resolverViaje`](./resolver-viaje.md)), y la granja produce manzanas con lo efectivamente
recibido.

Valores fijados internamente (constantes de esta integración, no parámetros): bomba con
`produccionFija: 4`; granja con `ratioEntrada: 1, ratioSalida: 2` (1 agua : 2 manzanas, igual
que `DEFINITION.md`); tramo `'carretera'` con `capacidad: 10, longitud: 1` (capacidad
deliberadamente mayor a la producción fija, para que esta integración no dispare saturación —
saturación real queda para una integración futura que la ejercite a propósito). Sin almacenes
limitados por nodo (alcance del Contrato 09, decisión ya confirmada): toda el agua recibida en
un tick se convierte en manzanas ESE mismo tick, sin acumulación.

## Interface
```
function ejecutarCadenaBombaGranja(numTicks)
```
Devuelve un array de `numTicks` elementos `{ tick, aguaProducida, aguaRecibida,
manzanasProducidas }`, uno por cada tick simulado (`tick` de `0` a `numTicks - 1`).

## Invariants
- El array devuelto tiene exactamente `numTicks` elementos, en orden de `tick` ascendente desde
  `0`.
- `aguaProducida` es siempre `4` (la `produccionFija` de la bomba), igual en todos los ticks.
- `aguaRecibida` es igual a `aguaProducida` en todos los ticks (la capacidad del tramo, `10`,
  nunca se satura con una producción fija de `4`).
- `manzanasProducidas` es `calcularProduccion(aguaRecibida, 1, 2)` — `8` en las condiciones
  fijadas arriba.
- El resultado es determinístico: dos llamadas con el mismo `numTicks` devuelven arrays
  idénticos (`deepEqual`).
- `numTicks` no entero o `<= 0`: lanza `RangeError`.

## Examples
- `ejecutarCadenaBombaGranja(1)` -> `[{ tick: 0, aguaProducida: 4, aguaRecibida: 4,
  manzanasProducidas: 8 }]`
- `ejecutarCadenaBombaGranja(3)` -> array de 3 elementos, `tick` `0`, `1`, `2`, todos con los
  mismos valores de producción (sin variación tick a tick en este escenario fijo).
- `ejecutarCadenaBombaGranja(0)` -> lanza `RangeError`
- `ejecutarCadenaBombaGranja(1.5)` -> lanza `RangeError`

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `crearNodoProductivo`, `producirTickNodo` y `resolverViaje` — ninguna lógica de esos módulos
  se reimplementa acá, esta función solo los compone.
- DO: mantener los valores fijados (producción, ratio, capacidad, longitud) como constantes
  internas del módulo, no como parámetros de la función.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir almacenes limitados por nodo ni acumulación de agua/manzanas entre ticks —
  eso está fuera de alcance de este contrato (ver condición de aborto en
  `specs/CONTRACT-09-integracion-bomba-granja.md`).

## Tests
(Los tests están en `tests/test_ejecutar_cadena_bomba_granja.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
