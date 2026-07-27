---
type: 'Task Contract'
title: 'Ejecución de tráfico con combustible'
description: 'Funcion de integracion que evalua 6 escenarios fijos combinando clasificacion de longitud, requisito de combustible por tipo de ruta, y degradacion lineal por escasez.'
tags: ['motor-rutas', 'motor-integracion', 'flow-city', 'combustible']

task: ejecutar-trafico-con-combustible
intent: "Evaluar 6 escenarios fijos que combinan clasificacion de longitud, requisito de combustible y degradacion lineal para demostrar el efecto del combustible en el trafico."
target: src/ejecutarTraficoConCombustible.js
signature: "function ejecutarTraficoConCombustible()"
test_command: "node tests/test_ejecutar_trafico_con_combustible.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_trafico_con_combustible.js"
tests_sha256: "d12da3c31ddeb8deaae0035b66ca10b7cceeb5e4cbced478855e3364b8c0ce9c"
touch_only: ['src/ejecutarTraficoConCombustible.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de tráfico con combustible

## Intent
Cuarta y última pieza del [Contrato 42](../../specs/CONTRACT-42-combustible-trafico-degradado.md),
y capstone del roadmap completo de esta segunda ronda de diseño: combina
[`clasificar-longitud-ruta`](./clasificar-longitud-ruta.md) +
[`tramo-requiere-combustible`](./tramo-requiere-combustible.md) +
[`aplicar-escasez-combustible-tramo`](./aplicar-escasez-combustible-tramo.md) en 6 escenarios
fijos que demuestran, de punta a punta, el efecto del combustible sobre cada tipo de ruta.

## Interface
```
function ejecutarTraficoConCombustible()
```
Devuelve `{ escenarios }`. `escenarios` tiene 6 elementos, cada uno `{ nombre, tipoRuta,
longitud, esRutaLarga, requiereCombustible, cargaSolicitada, combustibleDisponible,
cargaEfectiva, factorDegradacion }`.

## Invariants
- `escenarios.length === 6`, en este orden: `carretera-con-combustible-suficiente`,
  `carretera-sin-combustible`, `carretera-con-combustible-parcial`,
  `subte-sin-combustible-no-afectado`, `maritima-corta-sin-combustible-no-afectada`,
  `maritima-larga-sin-combustible-afectada`.
- Los 3 escenarios de carretera (`longitud: 5`, `esRutaLarga: false`, `requiereCombustible:
  true`, `cargaSolicitada: 10`): con `combustibleDisponible` `10`/`0`/`5` dan
  `cargaEfectiva`/`factorDegradacion` `10`/`1`, `0`/`0`, `5`/`0.5` respectivamente.
- `subte-sin-combustible-no-afectado`: `requiereCombustible: false` → `cargaEfectiva: 10`,
  `factorDegradacion: 1` (ignora `combustibleDisponible: 0` por completo).
- `maritima-corta-sin-combustible-no-afectada` (`longitud: 5`, `esRutaLarga: false`):
  `requiereCombustible: false` → `cargaEfectiva: 10`, `factorDegradacion: 1`.
- `maritima-larga-sin-combustible-afectada` (`longitud: 25`, `esRutaLarga: true`):
  `requiereCombustible: true` → `cargaEfectiva: 0`, `factorDegradacion: 0` (mismo resultado que
  carretera sin combustible, porque SÍ requiere).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarTraficoConCombustible().escenarios[3].cargaEfectiva` -> `10` (subte no afectado pese
  a `combustibleDisponible: 0`).
- `ejecutarTraficoConCombustible().escenarios[5].cargaEfectiva` -> `0` (marítima larga sí se
  degrada).
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `clasificarLongitudRuta`, `tramoRequiereCombustible` y
  `aplicarEscasezCombustibleTramo` — ninguna lógica se reimplementa.
- DO: cuando `requiereCombustible` es `false`, devolver `cargaEfectiva: cargaSolicitada` y
  `factorDegradacion: 1` SIN llamar a `aplicarEscasezCombustibleTramo` (esa función solo aplica
  cuando el tramo realmente depende de combustible).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir producción, almacenes, comercio, tesorería real, población o calendario —
  fuera de alcance de este contrato.

## Tests
(Los tests están en `tests/test_ejecutar_trafico_con_combustible.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
