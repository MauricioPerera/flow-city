---
type: 'Task Contract'
title: 'Tramo requiere combustible'
description: 'Funcion pura que determina si un tramo de ruta requiere combustible para operar, segun su tipo y si es una ruta larga.'
tags: ['motor-rutas', 'flow-city', 'combustible']

task: tramo-requiere-combustible
intent: "Determinar si un tramo de ruta requiere combustible para operar, segun su tipo y si es una ruta larga."
target: src/tramoRequiereCombustible.js
signature: "function tramoRequiereCombustible(tipoRuta, esRutaLarga)"
test_command: "node tests/test_tramo_requiere_combustible.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_tramo_requiere_combustible.js"
tests_sha256: "2acf997be2341f64f55fb6977fe6a3dacff8e83a2f50e7955dcc4c19ad608f58"
touch_only: ['src/tramoRequiereCombustible.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Tramo requiere combustible

## Intent
Segunda pieza del [Contrato 42](../../specs/CONTRACT-42-combustible-trafico-degradado.md):
`DEFINITION.md` establece que el combustible es necesario para el tráfico vehicular de
carretera; no afecta a subte/ferrocarril ni a embarcaciones de pesca chicas/medianas (rutas
marítimas cortas); sí afecta a las rutas marítimas largas.

## Interface
```
function tramoRequiereCombustible(tipoRuta, esRutaLarga)
```
Devuelve un booleano.

## Invariants
- `tipoRuta === 'carretera'`: siempre `true`, sin importar `esRutaLarga`.
- `tipoRuta === 'subte'` o `'ferrocarril'`: siempre `false`, sin importar `esRutaLarga`.
- `tipoRuta === 'maritima'`: devuelve exactamente `esRutaLarga`.
- `tipoRuta` fuera de `['carretera', 'ferrocarril', 'maritima', 'subte']`: lanza `RangeError`.
- `esRutaLarga` no booleano: lanza `RangeError`.

## Examples
- `tramoRequiereCombustible('carretera', false)` -> `true`
- `tramoRequiereCombustible('subte', true)` -> `false`
- `tramoRequiereCombustible('maritima', false)` -> `false`
- `tramoRequiereCombustible('maritima', true)` -> `true`

## Do / Don't
- DO: validar `tipoRuta` contra la misma whitelist de 4 tipos que usa `crearTramo`
  (redeclarada localmente, convención ya establecida del proyecto).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: calcular `esRutaLarga` dentro de esta función — la recibe como parámetro ya resuelto
  (de `clasificarLongitudRuta`, calculado por quien orquesta).

## Tests
(Los tests están en `tests/test_tramo_requiere_combustible.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
