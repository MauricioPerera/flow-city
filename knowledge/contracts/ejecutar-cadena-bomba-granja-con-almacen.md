---
type: 'Task Contract'
title: 'Ejecución de la cadena bomba → granja con almacenes reales'
description: 'Funcion de integracion que extiende ejecutarCadenaBombaGranja con almacenes reales en ambos nodos, demostrando el frenado de produccion por almacen lleno.'
tags: ['motor-integracion', 'motor-almacenes', 'flow-city', 'produccion', 'grid', 'grafo', 'tick']

task: ejecutar-cadena-bomba-granja-con-almacen
intent: "Simular N ticks de la cadena bomba de agua -> granja usando almacenes reales en ambos nodos, incluyendo el frenado de produccion cuando el almacen de la granja se llena."
target: src/ejecutarCadenaBombaGranjaConAlmacen.js
signature: "function ejecutarCadenaBombaGranjaConAlmacen(numTicks)"
test_command: "node tests/test_ejecutar_cadena_bomba_granja_con_almacen.js"
budget:
  max_cyclomatic_complexity: 14
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_bomba_granja_con_almacen.js"
tests_sha256: "7452d179b05637ed5e47b8fffa9d40f402d0039cd026cfd363a71076c19de34c"
touch_only: ['src/ejecutarCadenaBombaGranjaConAlmacen.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de la cadena bomba → granja con almacenes reales

## Intent
Extiende [`ejecutarCadenaBombaGranja`](./ejecutar-cadena-bomba-granja.md) (Contrato 09, no
modificado) integrando [`crearAlmacen`](./crear-almacen.md),
[`producirTickNodoConAlmacen`](./producir-tick-nodo-con-almacen.md) y
[`retirarStockAlmacen`](./retirar-stock-almacen.md) (Contrato 10). Mismo grid, nodos
(`crearNodoProductivo`) y ruta real que la integración original; se agrega un almacén propio
para cada nodo.

Valores fijados (constantes internas, no parámetros): almacén de la bomba con
`capacidadProducto: 10` (suficiente para su `produccionFija: 4`, nunca bloquea porque se retira
todo el stock cada tick antes del siguiente); almacén de la granja con `capacidadProducto: 20`
(deliberadamente insuficiente para 3 ticks de `8` manzanas cada uno — `8+8=16`, el tercer `8` no
entra — nada se retira nunca del almacén de la granja en este contrato, así que se llena de
forma determinista en el tercer tick).

El agua que la granja recibe mientras su almacén está bloqueado NO se almacena en ningún lado
(no hay almacén de materia prima en el alcance de este contrato) — se pierde ese tick. Es una
limitación documentada, no un bug: `producirTickNodoConAlmacen` ya define que producción
bloqueada no consume ni transforma la entrada.

## Interface
```
function ejecutarCadenaBombaGranjaConAlmacen(numTicks)
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal }`. `historial` es un array de
`numTicks` elementos `{ tick, aguaProducida, aguaEnviada, aguaRecibida, manzanasProducidas,
bombaAlmacenLleno, granjaAlmacenLleno }`.

## Invariants
- Cada tick: la bomba produce vía `producirTickNodoConAlmacen` sobre su propio almacén; TODO su
  stock de producto se retira (`retirarStockAlmacen`) y se envía por la ruta real
  (`resolverViaje`); la granja recibe lo entregado y produce vía `producirTickNodoConAlmacen`
  sobre su propio almacén (nunca se retira).
- Con `numTicks: 3`: los ticks `0` y `1` producen `manzanasProducidas: 8` cada uno
  (`granjaAlmacenLleno: false`); el tick `2` produce `manzanasProducidas: 0`
  (`granjaAlmacenLleno: true`), porque el espacio disponible (`20 - 16 = 4`) no alcanza para la
  producción potencial (`8`).
- `almacenBombaFinal.stockProducto === 0` siempre (se retira completo cada tick).
- `bombaAlmacenLleno` es `false` en todos los ticks de este escenario (la bomba nunca se
  bloquea, porque su almacén se vacía antes de la siguiente producción).
- `numTicks` no entero o `<= 0`: lanza `RangeError`.

## Examples
- `ejecutarCadenaBombaGranjaConAlmacen(1)` -> `historial[0].manzanasProducidas === 8`,
  `granjaAlmacenLleno: false`.
- `ejecutarCadenaBombaGranjaConAlmacen(3)` -> `historial[2].manzanasProducidas === 0`,
  `historial[2].granjaAlmacenLleno === true`, `almacenGranjaFinal.stockProducto === 16`.
- `ejecutarCadenaBombaGranjaConAlmacen(0)` -> lanza `RangeError`.

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `crearNodoProductivo`, `producirTickNodoConAlmacen`, `retirarStockAlmacen`, `resolverViaje` y
  `crearAlmacen` — ninguna lógica de esos módulos se reimplementa acá.
- DO: retirar TODO el stock de producto de la bomba antes de enviarlo (no dejar remanente).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: modificar `src/ejecutarCadenaBombaGranja.js` (Contrato 09) — esta es una función
  independiente y nueva.
- DON'T: inventar un almacén de materia prima para "salvar" el agua perdida durante el bloqueo
  de la granja — está fuera de alcance (ver condición de aborto del contrato de ejecución).

## Tests
(Los tests están en `tests/test_ejecutar_cadena_bomba_granja_con_almacen.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
