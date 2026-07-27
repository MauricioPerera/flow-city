---
type: 'Task Contract'
title: 'Crear almacén de petróleo'
description: 'Funcion que crea un almacen dedicado a petroleo, con capacidades separadas para crudo y refinado, gemelo estructural de crearAlmacen.'
tags: ['motor-almacenes', 'flow-city', 'petroleo']

task: crear-almacen-petroleo
intent: "Crear un almacen dedicado a petroleo con capacidades separadas para crudo y refinado."
target: src/crearAlmacenPetroleo.js
signature: "function crearAlmacenPetroleo(capacidadCrudo, capacidadRefinado)"
test_command: "node tests/test_crear_almacen_petroleo.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_crear_almacen_petroleo.js"
tests_sha256: "62223efcd5396d9bd88e9b3051042043dd636618ddb6a3c1865e8006c824066b"
touch_only: ['src/crearAlmacenPetroleo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Crear almacén de petróleo

## Intent
Primera pieza del [Contrato 41](../../specs/CONTRACT-41-petroleo-refinería-almacen-tipado.md):
`DEFINITION.md` establece que el petróleo necesita refinarse antes de usarse en la mayoría de
los casos, lo que implica almacenar tanto crudo como refinado por separado. Esta función es
gemela estructural de [`crear-almacen`](./crear-almacen.md) — mismo patrón de 2 buffers, `crudo`
y `refinado` en vez de `materiaPrima`/`producto` — deliberadamente NO genérica a un `tipo`
arbitrario de mercancía (sigue el precedente de que `crearAlmacen` tampoco lo es).

## Interface
```
function crearAlmacenPetroleo(capacidadCrudo, capacidadRefinado)
```
Devuelve `{ capacidadCrudo, capacidadRefinado, stockCrudo: 0, stockRefinado: 0 }`.

## Invariants
- `capacidadCrudo` y `capacidadRefinado` deben ser enteros positivos; si no, lanza `RangeError`.
- `stockCrudo` y `stockRefinado` arrancan siempre en `0`.

## Examples
- `crearAlmacenPetroleo(10, 5)` -> `{capacidadCrudo:10, capacidadRefinado:5, stockCrudo:0,
  stockRefinado:0}`.
- `crearAlmacenPetroleo(0, 5)` -> lanza `RangeError`.

## Do / Don't
- DO: seguir exactamente el mismo patrón de validación que `crearAlmacen.js` (enteros
  positivos).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: generalizar a un `tipo` de mercancía arbitrario — esta función es específica de
  petróleo (crudo/refinado), no un almacén tipado genérico.

## Tests
(Los tests están en `tests/test_crear_almacen_petroleo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
