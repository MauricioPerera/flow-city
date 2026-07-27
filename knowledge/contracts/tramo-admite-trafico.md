---
type: 'Task Contract'
title: 'Validación de tráfico admitido por un tramo'
description: 'Funcion pura que determina si un tramo de ruta admite un tipo de trafico dado (mercaderia o personas).'
tags: ['motor-rutas', 'flow-city', 'trafico']

task: tramo-admite-trafico
intent: "Determinar si un tramo de ruta admite un tipo de trafico concreto, dado su tipoTrafico configurado."
target: src/tramoAdmiteTrafico.js
signature: "function tramoAdmiteTrafico(tramo, tipoTraficoConsulta)"
test_command: "node tests/test_tramo_admite_trafico.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 2
tests: "tests/test_tramo_admite_trafico.js"
tests_sha256: "25e29594818e0b5f0d166c7819e0475da927e980aeaefd4d9041f1b6d43165e1"
touch_only: ['src/tramoAdmiteTrafico.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Validación de tráfico admitido por un tramo

## Intent
Segunda pieza del [Contrato 02](../../specs/CONTRACT-02-modelo-rutas.md): dado un tramo creado
por [`crearTramo`](./crear-tramo.md) (con su `tipoTrafico` ya resuelto a `'mercaderia'`,
`'personas'` o `'ambos'`) y una consulta de un tipo de tráfico concreto, determina si ese tramo
lo admite. La usará el futuro pathfinding (T4) para descartar tramos incompatibles con lo que
se quiere transportar. Ver [DEFINITION.md](../../DEFINITION.md), sección "Rutas y tráfico".

La consulta (`tipoTraficoConsulta`) es siempre un tipo concreto — `'mercaderia'` o
`'personas'` — nunca `'ambos'`: no tiene sentido preguntar "¿admite ambos?", solo "¿admite
mercadería?" o "¿admite personas?" por separado.

## Interface
```
function tramoAdmiteTrafico(tramo, tipoTraficoConsulta)
```
Devuelve un booleano.

## Invariants
- Si `tramo.tipoTrafico === 'ambos'`: devuelve `true` para cualquier consulta válida.
- Si `tramo.tipoTrafico === 'mercaderia'`: devuelve `true` solo si `tipoTraficoConsulta ===
  'mercaderia'`.
- Si `tramo.tipoTrafico === 'personas'`: devuelve `true` solo si `tipoTraficoConsulta ===
  'personas'`.
- `tramo.tipoTrafico` fuera de `['mercaderia', 'personas', 'ambos']` lanza `RangeError`.
- `tipoTraficoConsulta` fuera de `['mercaderia', 'personas']` (incluido `'ambos'`) lanza
  `RangeError`.

## Examples
- `tramoAdmiteTrafico({ tipoTrafico: 'ambos' }, 'mercaderia')` -> `true`
- `tramoAdmiteTrafico({ tipoTrafico: 'mercaderia' }, 'personas')` -> `false`
- `tramoAdmiteTrafico({ tipoTrafico: 'personas' }, 'personas')` -> `true`
- `tramoAdmiteTrafico({ tipoTrafico: 'ambos' }, 'ambos')` -> lanza `RangeError`

## Do / Don't
- DO: validar `tramo.tipoTrafico` y `tipoTraficoConsulta` contra su vocabulario antes de
  comparar.
- DO: tratar `'ambos'` como admite-todo solo del lado del tramo, nunca del lado de la consulta.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar `'ambos'` como valor de consulta.

## Tests
(Los tests están en `tests/test_tramo_admite_trafico.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
