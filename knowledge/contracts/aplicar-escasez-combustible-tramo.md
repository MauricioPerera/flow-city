---
type: 'Task Contract'
title: 'Aplicar escasez de combustible a tramo'
description: 'Funcion pura que degrada linealmente la carga que puede circular por un tramo segun el combustible disponible, misma logica que calcularSaturacion.'
tags: ['motor-rutas', 'flow-city', 'combustible']

task: aplicar-escasez-combustible-tramo
intent: "Degradar linealmente la carga que puede circular por un tramo segun el combustible disponible."
target: src/aplicarEscasezCombustibleTramo.js
signature: "function aplicarEscasezCombustibleTramo(cargaSolicitada, combustibleDisponible)"
test_command: "node tests/test_aplicar_escasez_combustible_tramo.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_aplicar_escasez_combustible_tramo.js"
tests_sha256: "a48d3c703a926beca32f9680e4b8a0bef237801249906601406b166f3cfa800c"
touch_only: ['src/aplicarEscasezCombustibleTramo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Aplicar escasez de combustible a tramo

## Intent
Tercera pieza del [Contrato 42](../../specs/CONTRACT-42-combustible-trafico-degradado.md): la
ausencia de combustible degrada el tráfico. Decisión de diseño (ad hoc, no especificada por el
usuario — "debería degradar/fallar" quedaba abierto): degradación LINEAL y gradual, mismo idioma
que [`calcular-saturacion`](./calcular-saturacion.md) ya usa en el proyecto para modelar
escasez, en vez de un corte binario.

## Interface
```
function aplicarEscasezCombustibleTramo(cargaSolicitada, combustibleDisponible)
```
Devuelve `{ cargaEfectiva, factorDegradacion }`.

## Invariants
- `combustibleDisponible <= 0`: devuelve `{ cargaEfectiva: 0, factorDegradacion: 0 }`.
- `combustibleDisponible > 0`: `factorDegradacion = Math.min(1, combustibleDisponible /
  cargaSolicitada)`, `cargaEfectiva = Math.floor(cargaSolicitada * factorDegradacion)`.
- `cargaSolicitada` no entero positivo: lanza `RangeError`.
- `combustibleDisponible` no numérico finito o negativo: lanza `RangeError`.
- `cargaEfectiva` nunca excede `cargaSolicitada` (`factorDegradacion` está acotado en `1`).

## Examples
- `aplicarEscasezCombustibleTramo(10, 10)` -> `{cargaEfectiva:10, factorDegradacion:1}`
- `aplicarEscasezCombustibleTramo(10, 0)` -> `{cargaEfectiva:0, factorDegradacion:0}`
- `aplicarEscasezCombustibleTramo(10, 5)` -> `{cargaEfectiva:5, factorDegradacion:0.5}`

## Do / Don't
- DO: usar el mismo patrón lineal de `calcularSaturacion.js` (proporción acotada en `1`), sin
  importarlo ni modificarlo — es un patrón consistente, no una dependencia real.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: implementar un corte binario (todo o nada) — la degradación es siempre gradual.

## Tests
(Los tests están en `tests/test_aplicar_escasez_combustible_tramo.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
