---
type: 'Task Contract'
title: 'Ejecución de extracción y refino de petróleo'
description: 'Funcion de integracion que extrae petroleo crudo, lo refina, lo almacena en un almacen dedicado, y demuestra la regla de incompatibilidad con almacenes organicos.'
tags: ['motor-produccion', 'motor-almacenes', 'motor-integracion', 'flow-city', 'petroleo']

task: ejecutar-extraccion-refino-petroleo
intent: "Extraer petroleo crudo, refinarlo y almacenarlo en un almacen dedicado, demostrando concretamente la regla de incompatibilidad con almacenes organicos."
target: src/ejecutarExtraccionRefinoPetroleo.js
signature: "function ejecutarExtraccionRefinoPetroleo()"
test_command: "node tests/test_ejecutar_extraccion_refino_petroleo.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_extraccion_refino_petroleo.js"
tests_sha256: "449d00419f2b656c76c8902b68e7e714e4cc530ba464a7dec28d1a20ff138181"
touch_only: ['src/ejecutarExtraccionRefinoPetroleo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de extracción y refino de petróleo

## Intent
Quinta y última pieza del [Contrato 41](../../specs/CONTRACT-41-petroleo-refinería-almacen-tipado.md):
combina extracción de petróleo (nueva categoría de dato sobre
[`crear-nodo-productivo`](./crear-nodo-productivo.md), modo `produccionFija` — igual patrón que
la bomba de agua), refinería (misma función, modo receta simple `ratioEntrada`/`ratioSalida`),
el almacén dedicado (T1-T3), y [`es-almacen-incompatible`](./es-almacen-incompatible.md) para
demostrar concretamente que petróleo y orgánico son incompatibles.

Valores fijados: extracción `produccionFija: 5`; refinería `ratioEntrada: 2, ratioSalida: 1`
(`5` crudo → `2` refinado, `floor(5/2)*1`); almacén `crearAlmacenPetroleo(10, 10)`.

## Interface
```
function ejecutarExtraccionRefinoPetroleo()
```
Devuelve `{ crudoProducido, crudoRetirado, refinadoProducido, almacenPetroleoFinal,
incompatibilidadPetroleoOrganico, incompatibilidadPetroleoPetroleo }`.

## Invariants
- `crudoProducido === 5` (extracción, `producirTickNodo` con `produccionFija: 5`).
- `crudoRetirado === 5` (todo el crudo se retira del almacén para refinarlo).
- `refinadoProducido === 2` (`calcularProduccion(5, 2, 1)`, vía `producirTickNodo` en modo
  receta).
- `almacenPetroleoFinal` es exactamente `{capacidadCrudo:10, capacidadRefinado:10, stockCrudo:0,
  stockRefinado:2}` (el crudo se agregó y se retiró completo; el refinado se agregó y quedó).
- `incompatibilidadPetroleoOrganico === true` (`esAlmacenIncompatible('petroleo', 'organico')`).
- `incompatibilidadPetroleoPetroleo === false` (`esAlmacenIncompatible('petroleo',
  'petroleo')`, control de sanidad: dos almacenes del mismo tipo son compatibles entre sí).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarExtraccionRefinoPetroleo()` -> `{ crudoProducido: 5, crudoRetirado: 5,
  refinadoProducido: 2, almacenPetroleoFinal: {capacidadCrudo:10, capacidadRefinado:10,
  stockCrudo:0, stockRefinado:2}, incompatibilidadPetroleoOrganico: true,
  incompatibilidadPetroleoPetroleo: false }`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearNodoProductivo`, `producirTickNodo`, `crearAlmacenPetroleo`,
  `agregarStockAlmacenPetroleo`, `retirarStockAlmacenPetroleo` y `esAlmacenIncompatible` —
  ninguna lógica de producción, almacenamiento o incompatibilidad se reimplementa.
- DO: agregar el crudo producido al almacén ANTES de retirarlo para refinar (secuencia completa:
  extraer → almacenar crudo → retirar crudo → refinar → almacenar refinado).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: llamar realmente a `agregarStockAlmacen` (genérico) con producto petrolero para
  "demostrar" el rechazo — la incompatibilidad se demuestra con el chequeo booleano de
  `esAlmacenIncompatible`, sin necesitar un intento real de mezcla física.

## Tests
(Los tests están en `tests/test_ejecutar_extraccion_refino_petroleo.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
