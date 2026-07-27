---
type: 'Task Contract'
title: 'Creación de un nodo productivo'
description: 'Funcion pura que crea el estado de un nodo productivo, en modo receta (ratio entrada:salida) o modo extraccion (produccion fija sin insumo).'
tags: ['motor-integracion', 'flow-city', 'produccion']

task: crear-nodo-productivo
intent: "Crear el estado de un nodo productivo, en modo receta (ratio entrada:salida) o modo extraccion (produccion fija sin insumo)."
target: src/crearNodoProductivo.js
signature: "function crearNodoProductivo(categoria, ratioEntrada, ratioSalida, produccionFija)"
test_command: "node tests/test_crear_nodo_productivo.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_crear_nodo_productivo.js"
tests_sha256: "f35b08abc30f55e89a309fdf80cca345932caafbc2b205ed0a01618937a084b6"
touch_only: ['src/crearNodoProductivo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Creación de un nodo productivo

## Intent
Primera pieza del [Contrato 09](../../specs/CONTRACT-09-integracion-bomba-granja.md): en la
cadena bomba de agua → granja, la bomba es un nodo de **extracción** (produce una cantidad fija
de agua cada tick, sin insumo — no está entre los recursos "a mano" según `DEFINITION.md`, pero
tampoco tiene receta con insumo transportado) y la granja es un nodo de **receta** (consume
agua transportada y produce manzanas en ratio 1:2, vía
[`calcularProduccion`](./calcular-produccion.md)). Esta función crea el estado de cualquiera de
los dos tipos, exigiendo que sea exactamente uno de los dos modos, nunca ambos ni ninguno.

## Interface
```
function crearNodoProductivo(categoria, ratioEntrada, ratioSalida, produccionFija)
```
Devuelve `{ categoria, ratioEntrada, ratioSalida, produccionFija }`.

## Invariants
- Modo receta: `ratioEntrada` y `ratioSalida` son enteros positivos, `produccionFija` es
  `null`.
- Modo extracción: `ratioEntrada` y `ratioSalida` son `null`, `produccionFija` es un número
  finito positivo.
- Cualquier otra combinación (ambos modos a la vez, ninguno, o receta a medias con solo uno de
  los dos ratios) lanza `RangeError`.
- `categoria` debe ser un string no vacío; si no, lanza `RangeError`.

## Examples
- `crearNodoProductivo('agricultura', 1, 2, null)` -> `{ categoria: 'agricultura',
  ratioEntrada: 1, ratioSalida: 2, produccionFija: null }`
- `crearNodoProductivo('extraccion-agua', null, null, 5)` -> `{ categoria: 'extraccion-agua',
  ratioEntrada: null, ratioSalida: null, produccionFija: 5 }`
- `crearNodoProductivo('x', 1, 2, 5)` -> lanza `RangeError` (ambos modos a la vez)
- `crearNodoProductivo('x', null, null, null)` -> lanza `RangeError` (ningún modo)
- `crearNodoProductivo('x', 1, null, null)` -> lanza `RangeError` (receta a medias)

## Do / Don't
- DO: validar que sea EXACTAMENTE uno de los dos modos antes de aceptar el nodo.
- DO: validar `categoria` como string no vacío.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar un nodo sin ningún modo de producción definido.

## Tests
(Los tests están en `tests/test_crear_nodo_productivo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
