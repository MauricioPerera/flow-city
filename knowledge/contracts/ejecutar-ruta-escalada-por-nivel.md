---
type: 'Task Contract'
title: 'Ejecución de ruta escalada por nivel'
description: 'Funcion de integracion que demuestra capacidad, costo de construccion y costo de mejora de una ruta en los 3 niveles, confirmando que degradar lanza error.'
tags: ['motor-rutas', 'motor-economia', 'motor-integracion', 'flow-city', 'nivel']

task: ejecutar-ruta-escalada-por-nivel
intent: "Demostrar la capacidad, el costo de construccion y el costo de mejora de una ruta en los 3 niveles, confirmando que degradar lanza error."
target: src/ejecutarRutaEscaladaPorNivel.js
signature: "function ejecutarRutaEscaladaPorNivel()"
test_command: "node tests/test_ejecutar_ruta_escalada_por_nivel.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_ruta_escalada_por_nivel.js"
tests_sha256: "77b220584ea53398d9d2a4c2348913936150d98c7a488374584c4af782758aab"
touch_only: ['src/ejecutarRutaEscaladaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de ruta escalada por nivel

## Intent
Quinta y última pieza del [Contrato 40](../../specs/CONTRACT-40-rutas-escaladas-por-nivel.md):
combina [`crear-tramo-con-nivel`](./crear-tramo-con-nivel.md),
[`calcular-costo-construccion-ruta-por-nivel`](./calcular-costo-construccion-ruta-por-nivel.md)
y [`calcular-costo-mejora-nivel-ruta`](./calcular-costo-mejora-nivel-ruta.md) en un solo
escenario: capacidad base fija `10`, mostrando cómo escala en los 3 niveles, el costo de
construcción en los 3 niveles, y 3 mejoras válidas más la confirmación de que degradar lanza
error.

## Interface
```
function ejecutarRutaEscaladaPorNivel()
```
Devuelve `{ historialCapacidad, historialCosto, mejoras, degradarLanzaError }`.

## Invariants
- `historialCapacidad` tiene 3 elementos `{nivel, capacidad}`: `S:10`, `M:20`, `L:30` (capacidad
  base `10` escalada por `calcularToleranciaSaturacionRutaPorNivel`, vía `crearTramoConNivel`).
- `historialCosto` tiene 3 elementos `{nivel, costo}`: `S:20`, `M:40`, `L:70`.
- `mejoras` tiene 3 elementos `{nivelActual, nivelNuevo, costoMejora}`: `S→M:20`, `M→L:30`,
  `S→L:50`.
- `degradarLanzaError === true` (intentar `calcularCostoMejoraNivelRuta('M', 'S')` lanza
  `RangeError`, capturado y confirmado por esta función).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarRutaEscaladaPorNivel().historialCapacidad[2]` -> `{ nivel: 'L', capacidad: 30 }`.
- `ejecutarRutaEscaladaPorNivel().mejoras[2]` -> `{ nivelActual: 'S', nivelNuevo: 'L',
  costoMejora: 50 }`.
- `ejecutarRutaEscaladaPorNivel().degradarLanzaError` -> `true`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearTramoConNivel`, `calcularCostoConstruccionRutaPorNivel` y
  `calcularCostoMejoraNivelRuta` — ninguna lógica de nivel se reimplementa.
- DO: capturar el `RangeError` de intentar degradar (`M→S`) con un `try/catch` para confirmar
  `degradarLanzaError` como booleano, sin dejar que la excepción se propague fuera de esta
  función.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir producción, almacenes, comercio, tesorería real, población o calendario —
  fuera de alcance de este contrato.

## Tests
(Los tests están en `tests/test_ejecutar_ruta_escalada_por_nivel.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
