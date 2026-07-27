---
type: 'Task Contract'
title: 'Capacidad de mano de obra disponible'
description: 'Funcion pura que determina cuanta poblacion esta disponible para trabajar en un tick, segun si es dia laboral.'
tags: ['motor-poblacion', 'flow-city', 'mano-de-obra', 'tick']

task: capacidad-mano-de-obra
intent: "Determinar cuanta poblacion esta disponible para trabajar en un tick, segun si ese dia es laboral."
target: src/capacidadManoDeObra.js
signature: "function capacidadManoDeObra(poblacionTotal, esLaboral)"
test_command: "node tests/test_capacidad_mano_de_obra.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_capacidad_mano_de_obra.js"
tests_sha256: "a05b17db16268189544b25d8d6a0583648856568fdeb63cf8c632f8a9eec517f"
touch_only: ['src/capacidadManoDeObra.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Capacidad de mano de obra disponible

## Intent
Quinta y última pieza del [Contrato 06](../../specs/CONTRACT-06-poblacion.md): "la población
total implica en cuánta gente puede trabajar" (`DEFINITION.md`, sección "Población"), y el
calendario ya fija que la semana laboral es lunes a viernes, sábado y domingo de descanso
(`esLaboral` de [`calendarioDeTick`](./calendario-de-tick.md)). Sin un modelo de edades/
dependientes en `DEFINITION.md`, la interpretación más directa y no-inventada es: toda la
población es mano de obra potencial, disponible únicamente en días laborales.

## Interface
```
function capacidadManoDeObra(poblacionTotal, esLaboral)
```
Devuelve un entero `>= 0`.

## Invariants
- Si `esLaboral === true`: el resultado es exactamente `poblacionTotal`.
- Si `esLaboral === false`: el resultado es `0`.
- `poblacionTotal` negativa o no entera: lanza `RangeError`.
- `esLaboral` no booleano: lanza `RangeError`.

## Examples
- `capacidadManoDeObra(1000, true)` -> `1000`
- `capacidadManoDeObra(1000, false)` -> `0`
- `capacidadManoDeObra(0, true)` -> `0`
- `capacidadManoDeObra(1000, 'true')` -> lanza `RangeError`

## Do / Don't
- DO: usar el `esLaboral` que ya calcula `calendarioDeTick`, no reimplementar la regla de
  lunes-viernes.
- DO: validar ambos parámetros antes de decidir.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: inventar una fracción de población no laboral (niños, jubilados) — `DEFINITION.md` no
  modela eso; toda la población cuenta como mano de obra potencial.

## Tests
(Los tests están en `tests/test_capacidad_mano_de_obra.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
