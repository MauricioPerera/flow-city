---
type: 'Task Contract'
title: 'Ejecución de la cadena bomba → granja → comercio'
description: 'Funcion de integracion que extiende ejecutarCadenaBombaGranjaConAlmacen agregando un comercio que compra las manzanas acumuladas y genera ingreso real en una tesoreria.'
tags: ['motor-integracion', 'motor-comercio', 'motor-economia', 'flow-city', 'produccion', 'grid', 'grafo', 'tick']

task: ejecutar-cadena-bomba-granja-comercio
intent: "Simular N ticks de la cadena bomba -> granja -> comercio, drenando el almacen de la granja cada tick y acumulando el ingreso en una tesoreria real."
target: src/ejecutarCadenaBombaGranjaComercio.js
signature: "function ejecutarCadenaBombaGranjaComercio(numTicks)"
test_command: "node tests/test_ejecutar_cadena_bomba_granja_comercio.js"
budget:
  max_cyclomatic_complexity: 14
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_bomba_granja_comercio.js"
tests_sha256: "703b90663bbcde66bb6202bd64a2000760be68539424f23d132b4bc2ece1d596"
touch_only: ['src/ejecutarCadenaBombaGranjaComercio.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de la cadena bomba → granja → comercio

## Intent
Extiende [`ejecutarCadenaBombaGranjaConAlmacen`](./ejecutar-cadena-bomba-granja-con-almacen.md)
(Contrato 11, no modificada) cerrando su ítem de seguimiento explícito: "retiro de stock del
almacén de la granja (comercio que la desbloquee)". Cada tick, DESPUÉS de que la bomba y la
granja producen (mismo flujo que el Contrato 11), un comercio compra las manzanas acumuladas
usando [`resolverCompraAlmacen`](./resolver-compra-almacen.md) (el menor entre lo disponible y
su capacidad de compra), las retira con
[`retirarStockAlmacen`](./retirar-stock-almacen.md), calcula el ingreso con
[`calcularMontoVenta`](./calcular-monto-venta.md) y lo acumula en una tesorería real
([`crearTesoreria`](./crear-tesoreria.md) + [`registrarIngreso`](./registrar-ingreso.md)).

Este comercio no usa [`aforoDisponible`](./aforo-disponible.md): el patrón aplicable es
comercio inter-zona (el bien se retira de un almacén), no "comprador viaja al bien" — el aforo
no aplica a esta integración puntual.

Valores fijados (constantes internas): `capacidadCompraComercio: 8` (igual a la producción de
manzanas por tick, para drenar completo el almacén de la granja todos los ticks — el bloqueo por
almacén lleno ya quedó demostrado en el Contrato 11, no es el foco de este contrato);
`precioUnitario: 2`; tesorería inicial `crearTesoreria(0)`.

## Interface
```
function ejecutarCadenaBombaGranjaComercio(numTicks)
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal, tesoreriaFinal }`. `historial` es
un array de `numTicks` elementos `{ tick, aguaProducida, aguaEnviada, aguaRecibida,
manzanasProducidas, manzanasCompradas, montoVenta, granjaAlmacenLleno }`.

## Invariants
- Cada tick: `manzanasProducidas` es siempre `8` (nunca bloqueado, ver constantes arriba),
  `manzanasCompradas` es siempre `8` (drena completo), `montoVenta` es siempre `16`
  (`8 * 2`), `granjaAlmacenLleno` es siempre `false`.
- `almacenGranjaFinal.stockProducto === 0` (drenado completo el último tick).
- `almacenBombaFinal.stockProducto === 0` (mismo comportamiento que el Contrato 11, sin
  cambios).
- `tesoreriaFinal.saldo === numTicks * 16` (acumula `16` por tick, sin gastos en este
  contrato).
- `numTicks` no entero o `<= 0`: lanza `RangeError`.

## Examples
- `ejecutarCadenaBombaGranjaComercio(1)` -> `tesoreriaFinal.saldo === 16`.
- `ejecutarCadenaBombaGranjaComercio(3)` -> `tesoreriaFinal.saldo === 48`,
  `almacenGranjaFinal.stockProducto === 0`.
- `ejecutarCadenaBombaGranjaComercio(0)` -> lanza `RangeError`.

## Do / Don't
- DO: reusar TODO lo del Contrato 11 (grid, nodos, ruta, almacenes de bomba/granja) más
  `resolverCompraAlmacen`, `retirarStockAlmacen`, `calcularMontoVenta`, `crearTesoreria` y
  `registrarIngreso` — ninguna lógica de esos módulos se reimplementa acá.
- DO: comprar DESPUÉS de que la granja produce en el mismo tick (no antes).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: modificar `src/ejecutarCadenaBombaGranjaConAlmacen.js` (Contrato 11) — esta es una
  función independiente y nueva.
- DON'T: usar `aforoDisponible` en esta integración — no aplica al patrón de comercio
  inter-zona/almacén.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_bomba_granja_comercio.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
