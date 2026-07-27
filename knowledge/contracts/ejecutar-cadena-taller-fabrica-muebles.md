---
type: 'Task Contract'
title: 'Ejecución de cadena taller de tala → fábrica de muebles'
description: 'Funcion de integracion donde el taller de tala (nodo multi-insumo) produce madera y la envia por una ruta real a la fabrica de muebles (nodo receta simple), que la convierte en muebles.'
tags: ['motor-integracion', 'flow-city', 'produccion', 'grid', 'grafo', 'multi-insumo']

task: ejecutar-cadena-taller-fabrica-muebles
intent: "Conectar la salida de madera del taller de tala, por una ruta real, a la fabrica de muebles, que la convierte en muebles."
target: src/ejecutarCadenaTallerFabricaMuebles.js
signature: "function ejecutarCadenaTallerFabricaMuebles()"
test_command: "node tests/test_ejecutar_cadena_taller_fabrica_muebles.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_taller_fabrica_muebles.js"
tests_sha256: "f0136abee95cca3421cc92b22bd4d48cbb4a6a09abf10ade220ee232efddb848"
touch_only: ['src/ejecutarCadenaTallerFabricaMuebles.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena taller de tala → fábrica de muebles

## Intent
Cuarta pieza del [Contrato 22](../../specs/CONTRACT-22-cadena-taller-fabrica-muebles.md): conecta
la salida de madera del taller de tala (nodo multi-insumo, ver
[`crear-nodo-productivo-multi-insumo`](./crear-nodo-productivo-multi-insumo.md) +
[`producir-tick-nodo-multi-insumo`](./producir-tick-nodo-multi-insumo.md)) a un consumidor real
en el grid: la fábrica de muebles, un nodo de receta simple de UN insumo
([`crear-nodo-productivo`](./crear-nodo-productivo.md) +
[`producir-tick-nodo`](./producir-tick-nodo.md)), conectados por una ruta real
([`conectar-vertices`](./conectar-vertices.md) + [`resolver-viaje`](./resolver-viaje.md)).

Insumos fijos del taller (iguales a [`ejecutar-taller-de-tala`](./ejecutar-taller-de-tala.md)):
`agua: 10`, `comida: 10`, `personas: 6`, receta `agua:1, comida:1, personas:2 -> madera:1`
(`personas` es el cuello de botella, `3` tandas). Fábrica de muebles: receta `madera:2 ->
muebles:1` (ratio elegido para este contrato, no especificado numéricamente en
`DEFINITION.md`).

Grid: taller en `(0,0)`, fábrica en `(1,0)`, conectados vértice `este`→`oeste` con un tramo
`carretera` de capacidad `10` — mismo patrón exacto de posiciones/vértices/tramo que
`ejecutar-cadena-fanout` (bomba→granja), ya verificado sin colisión de vértices.

## Interface
```
function ejecutarCadenaTallerFabricaMuebles()
```
Devuelve `{ agua, comida, personas, tandasAgua, tandasComida, tandasPersonas, tandasProducidas,
maderaProducida, maderaEnviada, maderaRecibida, mueblesProducidos }`.

## Invariants
- `agua === 10`, `comida === 10`, `personas === 6` (cantidades fijadas del taller).
- `tandasAgua === 10`, `tandasComida === 10`, `tandasPersonas === 3` (`personas` es el cuello de
  botella del taller).
- `tandasProducidas === 3` y `maderaProducida === 3`.
- `maderaEnviada === 3` (toda la madera producida se envía por la ruta).
- `maderaRecibida === 3` (la capacidad de la ruta, `10`, no satura el envío de `3`).
- `mueblesProducidos === 1` (`calcularProduccion(3, 2, 1)` = `floor(3/2) * 1`).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaTallerFabricaMuebles()` -> `{ agua: 10, comida: 10, personas: 6, tandasAgua:
  10, tandasComida: 10, tandasPersonas: 3, tandasProducidas: 3, maderaProducida: 3,
  maderaEnviada: 3, maderaRecibida: 3, mueblesProducidos: 1 }`
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `crearNodoProductivoMultiInsumo`, `producirTickNodoMultiInsumo`, `crearNodoProductivo`,
  `producirTickNodo`, `resolverViaje` — ninguna lógica de producción, receta o ruta se
  reimplementa.
- DO: usar el mismo par de posiciones/vértices/tramo (`(0,0)` este, `(1,0)` oeste, `carretera`
  capacidad `10`) que `ejecutar-cadena-fanout`, ya verificado libre de colisión.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir comercio, tesorería, almacenes o degradación — fuera de alcance de este
  contrato (ya demostrados en otros).

## Tests
(Los tests están en `tests/test_ejecutar_cadena_taller_fabrica_muebles.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
