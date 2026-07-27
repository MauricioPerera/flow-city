---
type: 'Task Contract'
title: 'Crear tramo con nivel'
description: 'Funcion que compone crearTramo con el multiplicador de tolerancia a saturacion por nivel, agregando el campo nivel al tramo resultante.'
tags: ['motor-rutas', 'flow-city', 'nivel']

task: crear-tramo-con-nivel
intent: "Crear un tramo cuya capacidad esta escalada segun su nivel, componiendo crearTramo sin modificarlo."
target: src/crearTramoConNivel.js
signature: "function crearTramoConNivel(tipoRuta, capacidad, longitud, tipoTrafico, nivel)"
test_command: "node tests/test_crear_tramo_con_nivel.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_crear_tramo_con_nivel.js"
tests_sha256: "f646bffc10760cf42e3d92282f5891c85ed3553e4a523722e0b818f4f2443728"
touch_only: ['src/crearTramoConNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Crear tramo con nivel

## Intent
Segunda pieza del [Contrato 40](../../specs/CONTRACT-40-rutas-escaladas-por-nivel.md): compone
(sin editar) [`crear-tramo`](./crear-tramo.md) con
[`calcular-tolerancia-saturacion-ruta-por-nivel`](./calcular-tolerancia-saturacion-ruta-por-nivel.md)
para escalar la capacidad base según el nivel, agregando el campo `nivel` al objeto resultante.

## Interface
```
function crearTramoConNivel(tipoRuta, capacidad, longitud, tipoTrafico, nivel)
```
Devuelve `{ tipoRuta, capacidad, longitud, tipoTrafico, nivel }` — `capacidad` ya escalada.

## Invariants
- `crearTramo(tipoRuta, capacidad, longitud, tipoTrafico)` se llama con la `capacidad` BASE (sin
  escalar) — cualquier `RangeError` que lance (tipo de ruta o tráfico inválido) se propaga sin
  capturar.
- La `capacidad` del objeto devuelto es exactamente
  `capacidadBase * calcularToleranciaSaturacionRutaPorNivel(nivel)`.
- `nivel` fuera de `['S', 'M', 'L']`: lanza `RangeError` (propagado de
  `calcularToleranciaSaturacionRutaPorNivel`).
- El resto de los campos (`tipoRuta`, `longitud`, `tipoTrafico`) son exactamente los que
  devuelve `crearTramo`, sin alterar.

## Examples
- `crearTramoConNivel('carretera', 10, 5, 'mercaderia', 'S')` -> `{tipoRuta:'carretera',
  capacidad:10, longitud:5, tipoTrafico:'mercaderia', nivel:'S'}`.
- `crearTramoConNivel('carretera', 10, 5, 'mercaderia', 'L')` -> `capacidad: 30`.
- `crearTramoConNivel('aerea', 10, 5, 'mercaderia', 'S')` -> lanza `RangeError` (propagado de
  `crearTramo`).

## Do / Don't
- DO: reusar `crearTramo` y `calcularToleranciaSaturacionRutaPorNivel` — ninguna lógica de
  validación de ruta/tráfico o de nivel se reimplementa.
- DO: pasar la capacidad BASE (sin escalar) a `crearTramo`, y escalar el resultado DESPUÉS.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: editar `crearTramo.js` para que acepte un parámetro `nivel` — esta función lo compone
  desde afuera.

## Tests
(Los tests están en `tests/test_crear_tramo_con_nivel.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
