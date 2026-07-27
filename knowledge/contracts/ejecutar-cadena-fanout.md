---
type: 'Task Contract'
title: 'Ejecución de cadena de producción con fan-out'
description: 'Funcion de integracion donde un mismo productor (bomba de agua) reparte su produccion entre dos consumidores en paralelo, cada uno con su propia ruta y receta.'
tags: ['motor-integracion', 'flow-city', 'produccion', 'grid', 'grafo']

task: ejecutar-cadena-fanout
intent: "Repartir la produccion de un nodo entre dos consumidores en paralelo (granja y reforestacion), cada uno conectado por su propia ruta real."
target: src/ejecutarCadenaFanOut.js
signature: "function ejecutarCadenaFanOut()"
test_command: "node tests/test_ejecutar_cadena_fanout.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_fanout.js"
tests_sha256: "ff47dd347448578461be83dc82e6fd5b3707362ad31b9563db05701b023aeb00"
touch_only: ['src/ejecutarCadenaFanOut.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena de producción con fan-out

## Intent
Primera integración del proyecto con MÁS de dos nodos productivos reales y ramificación
(fan-out): la bomba de agua reparte su producción entre la granja (agua→manzanas, `1:2`) y un
nodo de reforestación (agua→árboles, `2:1`), cada uno conectado a la bomba por su propia ruta
real ([`conectarVertices`](./conectar-vertices.md) + [`resolverViaje`](./resolver-viaje.md)).
Prueba que el patrón de integración escala más allá de una cadena lineal.

Nodo de reforestación en vez del taller de tala de `DEFINITION.md` (agua+comida+personas→
madera): el taller tiene TRES insumos, pero
[`crearNodoProductivo`](./crear-nodo-productivo.md) solo soporta receta de UN insumo —
limitación documentada, no resuelta en este contrato.

Grid: bomba en `(0,0)`, granja en `(1,0)`, reforestación en `(0,1)` — coordenadas elegidas
específicamente para que sus tres vértices de entrada (`verticeEntrada`) sean DISTINTOS entre
sí (`'1,1'`, `'1,0'`, `'0,1'`), evitando el error de auto-conexión de `conectarVertices`.

## Interface
```
function ejecutarCadenaFanOut()
```
Devuelve `{ aguaProducida, aguaParaGranja, aguaRecibidaGranja, manzanasProducidas,
aguaParaReforestacion, aguaRecibidaReforestacion, arbolesProducidos }`.

## Invariants
- `aguaProducida === 4` (producción fija de la bomba).
- `aguaParaGranja === 2` y `aguaParaReforestacion === 2` (reparto fijo, mitad y mitad).
- `aguaRecibidaGranja === 2` y `aguaRecibidaReforestacion === 2` (sin saturación real en
  ninguna de las dos rutas).
- `manzanasProducidas === 4` (`calcularProduccion(2, 1, 2)`).
- `arbolesProducidos === 1` (`calcularProduccion(2, 2, 1)`).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaFanOut()` -> `{ aguaProducida: 4, aguaParaGranja: 2, aguaRecibidaGranja: 2,
  manzanasProducidas: 4, aguaParaReforestacion: 2, aguaRecibidaReforestacion: 2,
  arbolesProducidos: 1 }`
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: conectar la bomba a AMBOS destinos con dos llamadas separadas a `conectarVertices`
  (mismo vértice de origen, dos tramos distintos).
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `crearNodoProductivo`, `producirTickNodo`, `resolverViaje` — ninguna lógica se reimplementa.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir comercio, tesorería, almacenes o degradación — fuera de alcance de este
  contrato (ya demostrados en otros).

## Tests
(Los tests están en `tests/test_ejecutar_cadena_fanout.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
