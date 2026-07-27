---
type: 'Task Contract'
title: 'Ejecución de área de acción por nivel'
description: 'Funcion de integracion que verifica, para un centro fijo y los 3 niveles, que el radio de area de accion aplica igual para reforestacion y tala.'
tags: ['motor-grid', 'flow-city', 'nivel', 'area-de-accion']

task: ejecutar-area-accion-por-nivel
intent: "Verificar que el radio de area de accion por nivel, aplicado con esta-en-zona-influencia, coincide para reforestacion y tala en cada nivel."
target: src/ejecutarAreaAccionPorNivel.js
signature: "function ejecutarAreaAccionPorNivel()"
test_command: "node tests/test_ejecutar_area_accion_por_nivel.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_ejecutar_area_accion_por_nivel.js"
tests_sha256: "cbbdcceee3054fbd9cba46bdad0831e0eb9e7dfff70b739e5e1ad5d9c939a48f"
touch_only: ['src/ejecutarAreaAccionPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de área de acción por nivel

## Intent
Segunda y última pieza del [Contrato 36](../../specs/CONTRACT-36-area-de-accion-por-nivel.md):
usa [`radio-area-accion-por-nivel`](./radio-area-accion-por-nivel.md) directo con
[`esta-en-zona-influencia`](./esta-en-zona-influencia.md) (sin wrapper nuevo) para un centro fijo
`(5,5)`, en los 3 niveles. Para cada nivel, evalúa una celda justo dentro del radio (distancia
Chebyshev exactamente igual al radio) y una justo fuera (distancia radio+1), llamando
`estaEnZonaInfluencia` DOS VECES por celda con el mismo par de argumentos (una vez "para
reforestación", una vez "para tala" — conceptualmente, ya que la función no tiene parámetro de
dominio) para demostrar que ambos dan el mismo resultado, coherente con que deben coincidir.

## Interface
```
function ejecutarAreaAccionPorNivel()
```
Devuelve `{ centro, historial }`. `centro` es `{x:5, y:5}`. `historial` tiene 3 elementos, uno
por nivel, cada uno `{ nivel, radio, celdaDentro, celdaDentroEnAreaReforestacion,
celdaDentroEnAreaTala, celdaFuera, celdaFueraEnAreaReforestacion, celdaFueraEnAreaTala }`.

## Invariants
- `centro` es `{x:5, y:5}`.
- `historial.length === 3`, orden `S`, `M`, `L`.
- `S`: `radio: 2`, `celdaDentro: {x:7,y:5}` (distancia Chebyshev `2`, dentro),
  `celdaFuera: {x:8,y:5}` (distancia `3`, fuera).
- `M`: `radio: 3`, `celdaDentro: {x:8,y:5}` (distancia `3`), `celdaFuera: {x:9,y:5}`
  (distancia `4`).
- `L`: `radio: 4`, `celdaDentro: {x:9,y:5}` (distancia `4`), `celdaFuera: {x:10,y:5}`
  (distancia `5`).
- En los 3 niveles: `celdaDentroEnAreaReforestacion === celdaDentroEnAreaTala === true`;
  `celdaFueraEnAreaReforestacion === celdaFueraEnAreaTala === false` — reforestación y tala
  coinciden siempre.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarAreaAccionPorNivel().historial[0]` -> `{ nivel: 'S', radio: 2, celdaDentro: {x:7,y:5},
  celdaDentroEnAreaReforestacion: true, celdaDentroEnAreaTala: true, celdaFuera: {x:8,y:5},
  celdaFueraEnAreaReforestacion: false, celdaFueraEnAreaTala: false }`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `radioAreaAccionPorNivel` y `estaEnZonaInfluencia` — ninguna lógica de distancia se
  reimplementa.
- DO: llamar a `estaEnZonaInfluencia` con los MISMOS argumentos para "reforestación" y "tala" (no
  hay diferencia real de código entre ambas, es intencional — el punto es demostrar que
  coinciden porque comparten la misma tabla de radio).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir producción, ciclo de vida de árboles, comercio o tesorería — fuera de
  alcance de este contrato (el Contrato 38 los combina).

## Tests
(Los tests están en `tests/test_ejecutar_area_accion_por_nivel.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
