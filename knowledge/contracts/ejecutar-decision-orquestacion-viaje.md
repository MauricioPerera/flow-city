---
type: 'Task Contract'
title: 'Ejecución de la decisión de orquestación de viaje (instantáneo vs. tránsito)'
description: 'Funcion de integracion que decide, segun calcularTicksViaje, si un viaje se resuelve instantaneo o como viaje en transito multi-tick, demostrando ambas ramas.'
tags: ['motor-trafico', 'motor-integracion', 'flow-city', 'grid', 'grafo']

task: ejecutar-decision-orquestacion-viaje
intent: "Decidir, para cada viaje nuevo, si se resuelve instantaneo o como viaje en transito multi-tick, segun calcularTicksViaje sobre la distancia real de la ruta."
target: src/ejecutarDecisionOrquestacionViaje.js
signature: "function ejecutarDecisionOrquestacionViaje()"
test_command: "node tests/test_ejecutar_decision_orquestacion_viaje.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_ejecutar_decision_orquestacion_viaje.js"
tests_sha256: "d65f234b5589a6a98e05c5a94492ffcb3dadee3d6c345c98079276d8f0b96dbc"
touch_only: ['src/ejecutarDecisionOrquestacionViaje.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de la decisión de orquestación de viaje (instantáneo vs. tránsito)

## Intent
Única pieza del [Contrato 31](../../specs/CONTRACT-31-decision-orquestacion-viaje.md): cierra
el pendiente que el propio contrato de
[`resolver-tick-con-transito`](./resolver-tick-con-transito.md) dejó explícito — "la decisión de
CUÁNDO convertir un viaje nuevo en viaje en tránsito... queda del lado de quien orquesta". Esta
función es esa orquestación: para una ruta real ([`encontrar-ruta`](./encontrar-ruta.md), que
expone `distanciaTotal`), calcula [`calcular-ticks-viaje`](./calcular-ticks-viaje.md) con una
`velocidadBase` fija y bifurca: si `ticksViaje <= 1`, resuelve con
[`resolver-viaje`](./resolver-viaje.md) (instantáneo, mismo tick); si `ticksViaje > 1`, inicia
con [`iniciar-viaje-en-transito`](./iniciar-viaje-en-transito.md) y llama repetidamente a
[`resolver-tick-con-transito`](./resolver-tick-con-transito.md) (una vez por tick simulado) hasta
que el viaje llega.

Grid `5x4`. Ruta corta: `A` en `(0,0)`, `B` en `(1,0)`, tramo `carretera` longitud `5`. Ruta
larga: `C` en `(3,3)`, `D` en `(4,3)`, tramo `carretera` longitud `25`. Coordenadas elegidas
para que los 4 vértices de entrada (`verticeEntrada(0,0,'este')`, `verticeEntrada(1,0,'oeste')`,
`verticeEntrada(3,3,'este')`, `verticeEntrada(4,3,'oeste')`) sean pairwise distintos — la
primera elección de coordenadas (celdas adyacentes) colisionó y fue descartada antes de escribir
el oráculo. `velocidadBase: 10` para ambas rutas; `cantidad: 6` (mercadería); capacidad de
ambos tramos `20` (sin saturación).

## Interface
```
function ejecutarDecisionOrquestacionViaje()
```
Devuelve `{ distanciaCorta, ticksCorto, entregadoCorto, distanciaLarga, ticksLargo,
ticksTranscurridos, entregadoLargo }`.

## Invariants
- `distanciaCorta === 5`, `ticksCorto === 1` (`calcularTicksViaje(5, 10) = ceil(0.5) = 1`) →
  rama instantánea, `entregadoCorto === 6` (sin saturación).
- `distanciaLarga === 25`, `ticksLargo === 3` (`calcularTicksViaje(25, 10) = ceil(2.5) = 3`) →
  rama de tránsito, requiere exactamente `3` llamadas a `resolverTickConTransito` antes de
  llegar (`ticksTranscurridos === 3`), `entregadoLargo === 6` (sin saturación).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarDecisionOrquestacionViaje()` -> `{ distanciaCorta: 5, ticksCorto: 1, entregadoCorto:
  6, distanciaLarga: 25, ticksLargo: 3, ticksTranscurridos: 3, entregadoLargo: 6 }`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `encontrarRuta`, `calcularTicksViaje`, `resolverViaje`, `iniciarViajeEnTransito`,
  `resolverTickConTransito` — ninguna lógica de ruta, tránsito o saturación se reimplementa.
- DO: usar `ruta.distanciaTotal` (de `encontrarRuta`) como `distanciaTotal` de
  `calcularTicksViaje` — no recalcular la distancia por otro medio.
- DO: para la ruta larga, llamar a `resolverTickConTransito(grafo, [viajeActual])` en un loop,
  actualizando el estado del viaje (`resultado.enTransito[0]`) hasta que
  `resultado.llegados.length > 0`, contando cuántas llamadas hicieron falta.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir producción, comercio, tesorería, población o calendario — fuera de alcance
  de este contrato (ya demostrados en otros).

## Tests
(Los tests están en `tests/test_ejecutar_decision_orquestacion_viaje.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
