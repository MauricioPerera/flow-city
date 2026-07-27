---
type: 'Task Contract'
title: 'Calendario de un tick'
description: 'Funcion pura que convierte un numero de tick (dia absoluto) en su informacion de calendario: semana, mes, estacion y anio.'
tags: ['motor-calendario', 'flow-city', 'tick']

task: calendario-de-tick
intent: "Convertir un numero de tick (dia absoluto desde el inicio) en su informacion de calendario completa."
target: src/calendarioDeTick.js
signature: "function calendarioDeTick(numeroTick)"
test_command: "node tests/test_calendario_de_tick.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 1
tests: "tests/test_calendario_de_tick.js"
tests_sha256: "fad709fbfabf44fda427e50c24162e89135cc72333823c756db4820a691df301"
touch_only: ['src/calendarioDeTick.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Calendario de un tick

## Intent
Primera pieza del [Contrato 04](../../specs/CONTRACT-04-motor-trafico-tick.md): ningún
contrato anterior modela el paso del tiempo. Esta función es la base de calendario que el resto
del motor de tráfico consultará por tick: dado un número de tick (día absoluto, 0-indexado
desde el inicio de la partida), devuelve en qué día de la semana cae, si es laborable, en qué
semana del mes, mes del año, estación y año está. Ver [DEFINITION.md](../../DEFINITION.md),
sección "Calendario".

Decisión confirmada en conversación antes de escribir este contrato: **un tick equivale a un
día completo** (las 3 fases del día — trabajo/sueño/tiempo libre — son sub-pasos internos de la
resolución de ESE mismo tick, no ticks separados; esta función no las modela, son
responsabilidad de una tarea posterior de este mismo contrato).

Jerarquía fija de `DEFINITION.md`: semana = 7 días (lunes a viernes laboral, sábado y domingo
descanso); mes = 4 semanas (28 días); estación = 3 meses (84 días), ciclo `['otono', 'invierno',
'primavera', 'verano']` en ese orden; año = 12 meses (336 días). Los nombres de estación se
escriben sin tilde/eñe (`'otono'`, no `'otoño'`) por consistencia ASCII con el resto de valores
de string del proyecto (`'mercaderia'`, `'ferrocarril'`, etc.).

## Interface
```
function calendarioDeTick(numeroTick)
```
Devuelve `{ dia, anio, mesDelAnio, semanaDelMes, diaDeSemana, esLaboral, estacion }`. `dia` es
el mismo `numeroTick` recibido (día absoluto). `anio`, `mesDelAnio` (0-11) y `semanaDelMes`
(0-3) son 0-indexados.

## Invariants
- `numeroTick` negativo o no entero lanza `RangeError`.
- `diaDeSemana` es uno de `['lunes','martes','miercoles','jueves','viernes','sabado',
  'domingo']`; `esLaboral === true` solo para `lunes`-`viernes`.
- `estacion` es uno de `['otono','invierno','primavera','verano']`, cíclico cada 84 días.
- Cada 336 ticks (`336 === 7*4*3*4`), el calendario vuelve a `mesDelAnio: 0`, `estacion:
  'otono'`, `diaDeSemana: 'lunes'`, y `anio` incrementa en 1.

## Examples
- `calendarioDeTick(0)` -> `{ dia: 0, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana:
  'lunes', esLaboral: true, estacion: 'otono' }`
- `calendarioDeTick(5)` -> `diaDeSemana: 'sabado'`, `esLaboral: false`
- `calendarioDeTick(84)` -> `mesDelAnio: 3`, `estacion: 'invierno'`
- `calendarioDeTick(336)` -> `anio: 1`, `estacion: 'otono'`, `diaDeSemana: 'lunes'`

## Do / Don't
- DO: derivar todos los campos por aritmética entera a partir de `numeroTick` (módulo/división),
  sin estado ni recursión.
- DO: mantener el ciclo de estaciones en el orden fijo `['otono', 'invierno', 'primavera',
  'verano']`.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: modelar las 3 fases del día en esta función — es responsabilidad de otra tarea.

## Tests
(Los tests están en `tests/test_calendario_de_tick.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
