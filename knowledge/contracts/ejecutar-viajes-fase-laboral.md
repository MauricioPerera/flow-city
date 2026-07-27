---
type: 'Task Contract'
title: 'Ejecución de viajes de la fase laboral (ida/vuelta)'
description: 'Funcion de integracion que genera viajes reales de ida y vuelta casa-trabajo, solo en dias laborales segun el calendario, modelando la transicion de fase del dia de DEFINITION.md.'
tags: ['motor-calendario', 'motor-trafico', 'flow-city', 'grid', 'grafo']

task: ejecutar-viajes-fase-laboral
intent: "Generar los viajes reales de ida y vuelta casa-trabajo que corresponden a la transicion de fase laboral, unicamente en ticks donde el calendario indica dia laboral."
target: src/ejecutarViajesFaseLaboral.js
signature: "function ejecutarViajesFaseLaboral()"
test_command: "node tests/test_ejecutar_viajes_fase_laboral.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_viajes_fase_laboral.js"
tests_sha256: "b9e6243abfcf530dd69b493e939532bee592c32bad66fc2d4e0a5a3f4f6cf936"
touch_only: ['src/ejecutarViajesFaseLaboral.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de viajes de la fase laboral (ida/vuelta)

## Intent
Única pieza del [Contrato 28](../../specs/CONTRACT-28-viajes-fase-laboral.md): `DEFINITION.md`
describe que "la transición entre fases genera picos de tráfico (ida/vuelta laboral)" — nunca
antes construido. Alcance confirmado explícitamente por el usuario: **solo la transición
laboral**, no las 3 fases completas (la fase de tiempo libre y su gasto asociado quedan fuera de
alcance). Para cada uno de `7` ticks (una semana), si `calendarioDeTick(tick).esLaboral ===
true`, se generan dos viajes reales por una ruta real de tráfico `personas`
([`conectar-vertices`](./conectar-vertices.md) + [`resolver-viaje`](./resolver-viaje.md)): uno
casa→trabajo (ida) y uno trabajo→casa (vuelta). En ticks no laborales (sábado, domingo) no se
genera ningún viaje.

Grid: casa en `(0,0)`, trabajo en `(1,0)`, conectados vértice `este`→`oeste` con un tramo
`carretera` tráfico `personas` de capacidad `20` (amplia, sin saturación).
`personasQueTrabajan: 8`.

## Interface
```
function ejecutarViajesFaseLaboral()
```
Devuelve `{ personasQueTrabajan, historial }`. `historial` tiene `7` elementos, uno por tick,
cada uno `{ tick, diaDeSemana, esLaboral, viajeGenerado, personasIda, personasVuelta }`.

## Invariants
- `personasQueTrabajan === 8`.
- `historial.length === 7` (tick `0` a `6`, lunes a domingo).
- Ticks `0`-`4` (lunes a viernes): `esLaboral: true`, `viajeGenerado: true`, `personasIda: 8`,
  `personasVuelta: 8` (sin saturación, capacidad `20` >> `8`).
- Ticks `5`-`6` (sábado, domingo): `esLaboral: false`, `viajeGenerado: false`, `personasIda: 0`,
  `personasVuelta: 0` (no se llama a `resolverViaje` en absoluto esos ticks).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarViajesFaseLaboral().historial[0]` -> `{ tick: 0, diaDeSemana: 'lunes', esLaboral:
  true, viajeGenerado: true, personasIda: 8, personasVuelta: 8 }`.
- `ejecutarViajesFaseLaboral().historial[5]` -> `{ tick: 5, diaDeSemana: 'sabado', esLaboral:
  false, viajeGenerado: false, personasIda: 0, personasVuelta: 0 }`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `resolverViaje`, `calendarioDeTick` — ninguna lógica de ruta, saturación o calendario se
  reimplementa.
- DO: consultar `calendarioDeTick(tick).esLaboral` al inicio de cada tick y condicionar AMBOS
  viajes (ida y vuelta) a ese valor — si es `false`, no llamar a `resolverViaje` ninguna vez ese
  tick.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: modelar la fase de "tiempo libre" ni su gasto asociado — explícitamente fuera de
  alcance de este contrato.

## Tests
(Los tests están en `tests/test_ejecutar_viajes_fase_laboral.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
