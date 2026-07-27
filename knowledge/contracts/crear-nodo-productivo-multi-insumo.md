---
type: 'Task Contract'
title: 'Creación de un nodo productivo con receta multi-insumo'
description: 'Funcion pura que crea el estado de un nodo productivo con receta de 2 o mas insumos, cada uno con su propio ratio de entrada.'
tags: ['motor-integracion', 'flow-city', 'produccion']

task: crear-nodo-productivo-multi-insumo
intent: "Crear el estado de un nodo productivo con receta de 2 o mas insumos obligatorios, cada uno con su propio ratio."
target: src/crearNodoProductivoMultiInsumo.js
signature: "function crearNodoProductivoMultiInsumo(categoria, receta, ratioSalida)"
test_command: "node tests/test_crear_nodo_productivo_multi_insumo.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 2
tests: "tests/test_crear_nodo_productivo_multi_insumo.js"
tests_sha256: "3de52627cd122723a6c653402b74cf2a94894397134c0a9af2519b705c24a425"
touch_only: ['src/crearNodoProductivoMultiInsumo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Creación de un nodo productivo con receta multi-insumo

## Intent
Primera pieza del [Contrato 21](../../specs/CONTRACT-21-recetas-multi-insumo.md): el taller de
tala de `DEFINITION.md` (agua + comida + personas → madera) necesita TRES insumos obligatorios,
pero [`crearNodoProductivo`](./crear-nodo-productivo.md) (Contrato 09) solo soporta uno — su
oráculo está sellado, no se modifica. Esta función crea un modelo NUEVO e independiente para
recetas de 2 o más insumos, cada uno con su propio `ratioEntrada`.

## Interface
```
function crearNodoProductivoMultiInsumo(categoria, receta, ratioSalida)
```
`receta` es un array de `{ nombre, ratioEntrada }` con AL MENOS 2 elementos. Devuelve
`{ categoria, receta, ratioSalida }`.

## Invariants
- `categoria` debe ser un string no vacío; si no, lanza `RangeError`.
- `receta` debe ser un array de AL MENOS 2 elementos; si no (incluye array vacío o de 1
  elemento, o no-array), lanza `RangeError`.
- Cada elemento de `receta` debe tener `nombre` (string no vacío) y `ratioEntrada` (entero
  positivo); si no, lanza `RangeError`.
- Los `nombre` de los insumos dentro de una misma receta deben ser todos distintos entre sí; si
  hay un duplicado, lanza `RangeError`.
- `ratioSalida` debe ser un entero positivo; si no, lanza `RangeError`.
- El objeto devuelto refleja exactamente `categoria`, `receta` y `ratioSalida` recibidos, sin
  transformación.

## Examples
- `crearNodoProductivoMultiInsumo('taller-tala', [{nombre:'agua',ratioEntrada:1},
  {nombre:'comida',ratioEntrada:1}], 1)` -> `{ categoria: 'taller-tala', receta: [...],
  ratioSalida: 1 }`
- `crearNodoProductivoMultiInsumo('x', [{nombre:'agua',ratioEntrada:1}], 1)` -> lanza
  `RangeError` (solo 1 insumo, no es multi-insumo)
- Receta con `nombre: 'agua'` repetido dos veces -> lanza `RangeError`
- `crearNodoProductivoMultiInsumo('x', receta, 0)` -> lanza `RangeError`

## Do / Don't
- DO: exigir AL MENOS 2 insumos — si el caso de uso tiene 1 solo, corresponde usar
  `crearNodoProductivo`, no esta función.
- DO: validar nombres únicos dentro de la receta.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar insumos opcionales — todos los insumos de la receta son obligatorios (fuera de
  alcance de este contrato, ver condición de aborto en
  `specs/CONTRACT-21-recetas-multi-insumo.md`).

## Tests
(Los tests están en `tests/test_crear_nodo_productivo_multi_insumo.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
