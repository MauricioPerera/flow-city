---
type: 'Task Contract'
title: 'Ejecución de producción estacional (clima)'
description: 'Funcion de integracion que corre la cadena bomba-granja en 4 ticks representativos (uno por estacion) y aplica el multiplicador de clima a la produccion cruda de la granja.'
tags: ['motor-calendario', 'motor-economia', 'flow-city', 'grid', 'clima']

task: ejecutar-produccion-estacional
intent: "Aplicar el multiplicador de clima de la estacion correspondiente a la produccion de la granja en 4 ticks representativos, uno por estacion."
target: src/ejecutarProduccionEstacional.js
signature: "function ejecutarProduccionEstacional()"
test_command: "node tests/test_ejecutar_produccion_estacional.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_ejecutar_produccion_estacional.js"
tests_sha256: "ca3ba34d9799f125267499fa6db4a0acea6c69666f598017b6b56b6e8e5636ac"
touch_only: ['src/ejecutarProduccionEstacional.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de producción estacional (clima)

## Intent
Segunda y última pieza del [Contrato 29](../../specs/CONTRACT-29-impacto-estacion-produccion.md):
usa [`calcular-multiplicador-clima`](./calcular-multiplicador-clima.md) sobre la producción de
la granja (agricultura) en `4` ticks representativos — uno por estación
(`0`=otoño, `84`=invierno, `168`=primavera, `252`=verano, confirmados contra
[`calendario-de-tick`](./calendario-de-tick.md)) — en vez de recorrer los `336` ticks de un año
completo. La bomba de agua NO se ve afectada por el clima en este contrato (decisión de alcance
explícita).

Mismo patrón de producción del Contrato 09: bomba `produccionFija: 4`, granja ratio `1:2`
(`agua→manzanas`), sin almacenes, comercio ni tesorería — la producción cruda de la granja
(`calcularProduccion(4, 1, 2) = 8`) se multiplica por el clima de la estación de ese tick.

## Interface
```
function ejecutarProduccionEstacional()
```
Devuelve `{ ticksMuestra, historial }`. `ticksMuestra` es `[0, 84, 168, 252]`. `historial` tiene
`4` elementos, uno por tick muestreado.

## Invariants
- `ticksMuestra` es exactamente `[0, 84, 168, 252]`.
- `historial.length === 4`.
- En TODOS los ticks: `aguaProducida === 4`, `aguaRecibida === 4` (sin degradación ni
  saturación, la bomba no cambia por clima), `manzanasCrudo === 8`
  (`calcularProduccion(4, 1, 2)`, antes de aplicar clima).
- Tick `0` (`estacion: 'otono'`): `multiplicadorClima: 1`, `manzanasProducidas: 8`.
- Tick `84` (`estacion: 'invierno'`): `multiplicadorClima: 0.5`, `manzanasProducidas: 4`.
- Tick `168` (`estacion: 'primavera'`): `multiplicadorClima: 1`, `manzanasProducidas: 8`.
- Tick `252` (`estacion: 'verano'`): `multiplicadorClima: 1.5`, `manzanasProducidas: 12`.
- `manzanasProducidas === manzanasCrudo * multiplicadorClima` en todos los casos.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarProduccionEstacional().historial[3]` -> `{ tick: 252, estacion: 'verano',
  aguaProducida: 4, aguaRecibida: 4, manzanasCrudo: 8, multiplicadorClima: 1.5,
  manzanasProducidas: 12 }` (bonus de verano).
- `ejecutarProduccionEstacional().historial[1].manzanasProducidas` -> `4` (penalización de
  invierno).
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `crearNodoProductivo`, `producirTickNodo`, `resolverViaje`, `calendarioDeTick`,
  `calcularMultiplicadorClima` — ninguna lógica se reimplementa.
- DO: aplicar el multiplicador de clima ÚNICAMENTE a la producción de la granja
  (`manzanasCrudo * multiplicadorClima`), nunca a la producción de la bomba.
- DO: muestrear SOLO los `4` ticks representativos (`0`, `84`, `168`, `252`) — no recorrer un
  año completo tick a tick.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir almacenes, comercio, tesorería, degradación o población — fuera de alcance
  de este contrato (ya demostrados en otros).

## Tests
(Los tests están en `tests/test_ejecutar_produccion_estacional.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
