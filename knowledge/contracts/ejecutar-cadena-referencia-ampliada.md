---
type: 'Task Contract'
title: 'Ejecución de la cadena de referencia ampliada (población + degradación + calendario + clima)'
description: 'Integracion que extiende el bucle de poblacion dinamica y degradacion del Contrato 25 agregando mantenimiento condicionado al calendario (Contrato 27) y multiplicador de clima en la granja (Contrato 29).'
tags: ['motor-integracion', 'motor-economia', 'motor-poblacion', 'motor-calendario', 'flow-city', 'produccion', 'grid', 'grafo', 'tick', 'quiebra']

task: ejecutar-cadena-referencia-ampliada
intent: "Combinar poblacion dinamica y degradacion con mantenimiento condicionado al calendario y clima estacional en la granja, en una sola simulacion de 10 ticks."
target: src/ejecutarCadenaReferenciaAmpliada.js
signature: "function ejecutarCadenaReferenciaAmpliada()"
test_command: "node tests/test_ejecutar_cadena_referencia_ampliada.js"
budget:
  max_cyclomatic_complexity: 26
  max_nesting_depth: 4
tests: "tests/test_ejecutar_cadena_referencia_ampliada.js"
tests_sha256: "6613a3cffd355807458ba7b690e54828cc898341e918c4989b48202084cd0e54"
touch_only: ['src/ejecutarCadenaReferenciaAmpliada.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de la cadena de referencia ampliada (población + degradación + calendario + clima)

## Intent
Única pieza del [Contrato 32](../../specs/CONTRACT-32-cadena-referencia-ampliada.md): extiende
el bucle más completo existente
([`ejecutar-cadena-poblacion-dinamica`](./ejecutar-cadena-poblacion-dinamica.md), Contrato 25 —
construcción con costo, almacenes, comercio, tesorería, mantenimiento, degradación progresiva,
población que se recompone tick a tick) agregando DOS mecánicas más, ya construidas por separado:
mantenimiento condicionado a `esLaboral`
([`ejecutar-cadena-mantenimiento-calendario`](./ejecutar-cadena-mantenimiento-calendario.md),
Contrato 27) y multiplicador de clima aplicado a la producción de la granja tras la degradación
([`ejecutar-produccion-estacional`](./ejecutar-produccion-estacional.md), Contrato 29).

Decisión de diseño: el contador de tick que se pasa a
[`calendario-de-tick`](./calendario-de-tick.md) arranca en el día `80` (no en `0`), para que los
`10` ticks simulados (`80`-`89`) crucen el límite de estación otoño→invierno (día `84`) sin
necesitar una traza de `84`+ ticks — el estado económico (población, tesorería, contador de
quiebra) arranca fresco, igual que cualquier otra integración.

**Hallazgo emergente**: a diferencia del Contrato 25 (cobertura de equilibrio `1`), aquí la
población se estabiliza en `5` con cobertura de comida `0.5` — el invierno reduce la producción
justo lo suficiente para dejar a la población en el punto neutro exacto de
[`calcular-crecimiento-poblacion`](./calcular-crecimiento-poblacion.md) (`indice - 0.5`), un
equilibrio distinto, causado por la interacción degradación+clima.

## Interface
```
function ejecutarCadenaReferenciaAmpliada()
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal, tesoreriaFinal, poblacionInicial,
poblacionFinal }`. `historial` tiene `10` elementos (días de calendario `80` a `89`).

## Invariants
- `poblacionInicial === 10`.
- `historial[i].tick === 80 + i` para todo `i` en `0..9`.
- Ticks `80`-`83`: `estacion: 'otono'`; ticks `84`-`89`: `estacion: 'invierno'` (multiplicador
  de clima cambia de `1` a `0.5` exactamente en el tick `84`).
- `mantenimientoCobrado` sigue `esLaboral` de cada tick: `false` en los ticks `82`, `83`
  (fin de semana de otoño) y `89` (fin de semana de invierno); `true` en el resto.
- Tick `82`: contador de quiebra alcanza el umbral → `degradado: true` en adelante (nunca se
  revierte, el saldo no vuelve a ser positivo).
- Población: `10 → 11` (tick 80) `→ 11` (tick 81) `→ 9` (tick 82) `→ 8 → 7 → 6 → 5` (ticks
  83-86), luego estable en `5` desde el tick 87.
- Desde el tick `87` (invierno, población ya en `5`): `manzanasProducidas === 0.5`,
  `coberturaComida === 0.5`, `indiceCobertura === 0.5`, `cambioPoblacion === 0` — equilibrio
  distinto al del Contrato 25 (que llegaba a cobertura `1`).
- `tesoreriaFinal.saldo === -47`, `poblacionFinal === 5`.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaReferenciaAmpliada().historial[4]` -> `{ tick: 84, estacion: 'invierno',
  multiplicadorClima: 0.5, ... }` (primer tick de invierno).
- `ejecutarCadenaReferenciaAmpliada().poblacionFinal` -> `5`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar TODOS los módulos de los Contratos 25, 27 y 29 (`construir-nodo-con-costo`,
  `crear-almacen`, `agregar-stock-almacen`, `retirar-stock-almacen`, `resolver-viaje`,
  `resolver-compra-almacen`, `calcular-monto-venta`, `crear-tesoreria`, `registrar-ingreso`,
  `calcular-mantenimiento-total`, `aplicar-mantenimiento-tick`, `actualizar-contador-quiebra`,
  `esta-nodo-degradado`, `poblacion-total-casas`, `calcular-cobertura-necesidad`,
  `combinar-coberturas`, `calcular-crecimiento-poblacion`, `producir-tick-nodo`,
  `aplicar-degradacion-produccion`, `calendario-de-tick`, `calcular-multiplicador-clima`) —
  ninguna lógica se reimplementa.
- DO: pasar `80 + i` (no `i`) a `calendarioDeTick` en cada iteración del loop de `10` ticks.
- DO: aplicar el multiplicador de clima a `manzanasConDegradacion` (después de la degradación),
  y truncar (`Math.floor`) el remanente que va al almacén, igual que el Contrato 25.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir recetas multi-insumo ni múltiples centros cívicos — explícitamente fuera de
  alcance de este contrato.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_referencia_ampliada.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
