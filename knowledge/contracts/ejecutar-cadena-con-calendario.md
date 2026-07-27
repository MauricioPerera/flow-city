---
type: 'Task Contract'
title: 'Ejecución de cadena real con calendario integrado'
description: 'Funcion de integracion que corre la cadena real bomba-granja-comercio existente y decora cada entrada de su historial con la informacion de calendario del tick correspondiente.'
tags: ['motor-calendario', 'flow-city', 'grid', 'tesoreria', 'trazabilidad']

task: ejecutar-cadena-con-calendario
intent: "Decorar cada entrada del historial de una cadena real de 8 ticks con su informacion de calendario completa, sin cambiar ninguna regla economica existente."
target: src/ejecutarCadenaConCalendario.js
signature: "function ejecutarCadenaConCalendario()"
test_command: "node tests/test_ejecutar_cadena_con_calendario.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_ejecutar_cadena_con_calendario.js"
tests_sha256: "11ef9fded732fe7abea25ea4fdd56dd7ddfca053c060f58ab2d89a3cd5e92d7c"
touch_only: ['src/ejecutarCadenaConCalendario.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena real con calendario integrado

## Intent
Única pieza del [Contrato 24](../../specs/CONTRACT-24-cadena-con-calendario.md): ningún
contrato anterior conecta [`calendario-de-tick`](./calendario-de-tick.md) a una cadena
económica real multi-tick. Alcance confirmado explícitamente por el usuario: **solo
trazabilidad, sin nueva regla económica** — esta función corre
[`ejecutar-cadena-bomba-granja-comercio`](./ejecutar-cadena-bomba-granja-comercio.md) con `8`
ticks (una semana completa más un día) y decora cada entrada de su `historial` con
`calendario: calendarioDeTick(tick)`. El comportamiento económico (agua, manzanas, ventas,
almacenes, tesorería) es exactamente el mismo que sin esta decoración — ninguna regla
existente cambia.

`8` ticks para demostrar el ciclo semanal completo: `esLaboral: false` en sábado/domingo (ticks
`5`-`6`) y el avance de `semanaDelMes` de `0` a `1` en el tick `7` (lunes de la semana
siguiente).

## Interface
```
function ejecutarCadenaConCalendario()
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal, tesoreriaFinal }` — mismo shape
que `ejecutarCadenaBombaGranjaComercio(8)`, con cada entrada de `historial` llevando además un
campo `calendario`.

## Invariants
- `historial.length === 8`.
- Cada entrada conserva TODOS los campos originales de
  `ejecutarCadenaBombaGranjaComercio` (`tick`, `aguaProducida`, `aguaEnviada`, `aguaRecibida`,
  `manzanasProducidas`, `manzanasCompradas`, `montoVenta`, `granjaAlmacenLleno`) sin
  modificarlos.
- Cada entrada agrega `calendario`, exactamente igual a `calendarioDeTick(entrada.tick)`.
- `historial[5].calendario.diaDeSemana === 'sabado'` y `historial[5].calendario.esLaboral ===
  false`; lo mismo para `historial[6]` con `'domingo'`.
- `historial[7].calendario.semanaDelMes === 1` (cruzó a la semana siguiente).
- `almacenBombaFinal`, `almacenGranjaFinal` y `tesoreriaFinal` son exactamente los mismos que
  produce `ejecutarCadenaBombaGranjaComercio(8)` sin decorar.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaConCalendario().historial[0].calendario` -> `{ dia: 0, anio: 0, mesDelAnio: 0,
  semanaDelMes: 0, diaDeSemana: 'lunes', esLaboral: true, estacion: 'otono' }`
- `ejecutarCadenaConCalendario().historial[5].calendario.diaDeSemana` -> `'sabado'`
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: llamar `ejecutarCadenaBombaGranjaComercio(8)` una sola vez y mapear su `historial` para
  agregar `calendario` a cada entrada, sin tocar ningún otro campo.
- DO: usar `calendarioDeTick(entrada.tick)` — no reimplementar el cálculo de calendario.
- DON'T: usar red, `require` de paquetes externos (salvo los dos módulos hermanos), ni acceso a
  estado global.
- DON'T: cambiar ninguna regla económica en función del calendario (ej. mantenimiento
  condicionado a día laboral) — explícitamente fuera de alcance de este contrato.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_con_calendario.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
