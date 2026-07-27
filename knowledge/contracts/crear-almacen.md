---
type: 'Task Contract'
title: 'Creación de un almacén de nodo'
description: 'Funcion pura que crea el estado de un almacen con capacidad separada para materia prima y para producto terminado, con stock inicial en 0.'
tags: ['motor-almacenes', 'flow-city', 'produccion']

task: crear-almacen
intent: "Crear el estado de un almacen de nodo con capacidad separada para materia prima y producto terminado, con stock inicial en 0."
target: src/crearAlmacen.js
signature: "function crearAlmacen(capacidadMateriaPrima, capacidadProducto)"
test_command: "node tests/test_crear_almacen.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_crear_almacen.js"
tests_sha256: "be2c6cb9256eeb3ece4f0245704bedccac3d75ce4744d5d76c44d827b5197e96"
touch_only: ['src/crearAlmacen.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Creación de un almacén de nodo

## Intent
Primera pieza del [Contrato 10](../../specs/CONTRACT-10-almacenes.md): cada construcción
productiva tiene almacén propio, de capacidad limitada, con espacio SEPARADO para materia
prima y para producto terminado (`DEFINITION.md`, sección "Producción y cadenas de recursos").
Esta función crea ese estado base.

## Interface
```
function crearAlmacen(capacidadMateriaPrima, capacidadProducto)
```
Devuelve `{ capacidadMateriaPrima, capacidadProducto, stockMateriaPrima: 0, stockProducto: 0 }`.

## Invariants
- `almacen.capacidadMateriaPrima` y `almacen.capacidadProducto` reflejan exactamente los
  argumentos recibidos.
- `almacen.stockMateriaPrima === 0` y `almacen.stockProducto === 0` siempre al crear.
- `capacidadMateriaPrima` o `capacidadProducto` no positivos o no enteros: lanza `RangeError`.

## Examples
- `crearAlmacen(10, 5)` -> `{ capacidadMateriaPrima: 10, capacidadProducto: 5,
  stockMateriaPrima: 0, stockProducto: 0 }`
- `crearAlmacen(0, 5)` -> lanza `RangeError`
- `crearAlmacen(10, 1.5)` -> lanza `RangeError`

## Do / Don't
- DO: validar ambas capacidades (enteras, positivas) antes de construir el objeto.
- DO: mantener las dos capacidades y los dos stocks como campos SEPARADOS, nunca combinados en
  un único número.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar una capacidad `0` o negativa — todo almacén tiene espacio positivo.

## Tests
(Los tests están en `tests/test_crear_almacen.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
