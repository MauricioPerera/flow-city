---
type: 'Task Contract'
title: 'Resolución de una venta local'
description: 'Funcion pura que determina cuanto se vende efectivamente en un comercio local, limitado por demanda, stock disponible y aforo disponible.'
tags: ['motor-comercio', 'flow-city', 'comercio-local']

task: resolver-venta-local
intent: "Determinar cuanto se vende efectivamente en un comercio local, limitado por la demanda, el stock disponible y el aforo disponible."
target: src/resolverVentaLocal.js
signature: "function resolverVentaLocal(demanda, stockDisponible, aforoDisponible)"
test_command: "node tests/test_resolver_venta_local.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_resolver_venta_local.js"
tests_sha256: "c9b723405fab1c4b9df04e4acdbaf11d854a8ae02e60ebe353e4791bf1b48736"
touch_only: ['src/resolverVentaLocal.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Resolución de una venta local

## Intent
Cuarta y última pieza del [Contrato 07](../../specs/CONTRACT-07-comercio.md): patrón "comprador
viaja al bien" (ej. restaurante — `DEFINITION.md`, sección "Comercio y economía"). La cantidad
efectivamente vendida está limitada por TRES factores independientes: cuánto se demanda, cuánto
stock hay disponible, y cuántos compradores más caben ([`aforoDisponible`](./aforo-disponible.md)).
Esta función es el mínimo de los tres — asume, como simplificación explícita de esta tarea, que
una unidad de demanda equivale a un comprador (1 persona = 1 unidad consumida), coherente con la
métrica de aforo en personas.

## Interface
```
function resolverVentaLocal(demanda, stockDisponible, aforoDisponible)
```
Devuelve un número `>= 0`.

## Invariants
- El resultado es exactamente `Math.min(demanda, stockDisponible, aforoDisponible)`.
- Cualquiera de los tres en `0` da como resultado `0`.
- Cualquiera de los tres argumentos negativo o no finito: lanza `RangeError`.

## Examples
- `resolverVentaLocal(10, 5, 8)` -> `5` (limitado por stock)
- `resolverVentaLocal(10, 20, 3)` -> `3` (limitado por aforo)
- `resolverVentaLocal(2, 20, 8)` -> `2` (limitado por demanda)
- `resolverVentaLocal(0, 5, 8)` -> `0`
- `resolverVentaLocal(-1, 5, 8)` -> lanza `RangeError`

## Do / Don't
- DO: usar `Math.min` de los tres argumentos directamente.
- DO: validar los tres parámetros antes de comparar.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: introducir un factor de conversión entre "demanda" y "personas" — la simplificación
  1:1 es explícita y deliberada para esta tarea.

## Tests
(Los tests están en `tests/test_resolver_venta_local.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
