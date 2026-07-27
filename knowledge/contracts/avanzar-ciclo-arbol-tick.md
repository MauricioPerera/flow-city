---
type: 'Task Contract'
title: 'Avanzar ciclo de árbol un tick'
description: 'Funcion que avanza el contador de ticks de una celda de arbol y aplica las transiciones automaticas Tocon-a-Limpio y Limpio-a-Arbol por tiempo.'
tags: ['motor-arboles', 'flow-city', 'ciclo-de-vida', 'tick']

task: avanzar-ciclo-arbol-tick
intent: "Avanzar el contador de ticks de una celda de arbol y aplicar las transiciones automaticas por tiempo (Tocon a Limpio, Limpio a Arbol)."
target: src/avanzarCicloArbolTick.js
signature: "function avanzarCicloArbolTick(estadoArboles, x, y)"
test_command: "node tests/test_avanzar_ciclo_arbol_tick.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_avanzar_ciclo_arbol_tick.js"
tests_sha256: "d77196c01a2f3641bec136770240d9f511829b6d4d43cd0010fad7408217ce12"
touch_only: ['src/avanzarCicloArbolTick.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Avanzar ciclo de árbol un tick

## Intent
Tercera pieza del [Contrato 37](../../specs/CONTRACT-37-ciclo-de-vida-del-arbol.md): a
diferencia de [`talar-arbol`](./talar-arbol.md) (siempre una acción explícita), las
transiciones Tocón→Limpio y Limpio→Árbol son automáticas por el paso del tiempo. Umbrales fijos
(ad hoc, no especificados por el usuario): `UMBRAL_TOCON_A_LIMPIO = 2`,
`UMBRAL_LIMPIO_A_ARBOL = 3` ticks.

## Interface
```
function avanzarCicloArbolTick(estadoArboles, x, y)
```
Muta `estadoArboles` en el lugar y devuelve el nuevo estado (`'arbol' | 'tocon' | 'limpio'`).

## Invariants
- Celda sin entrada (o con entrada `'arbol'`): no se muta nada nuevo, devuelve `'arbol'` — el
  estado Árbol NO decae con el tiempo, es estable indefinidamente.
- Celda en `'tocon'` con `ticksEnEstado` tras incrementar en `1` `< 2`: permanece `'tocon'` con
  el contador incrementado.
- Celda en `'tocon'` con `ticksEnEstado` tras incrementar en `1` `>= 2`: pasa a
  `{ estado: 'limpio', ticksEnEstado: 0 }`.
- Celda en `'limpio'` con `ticksEnEstado` tras incrementar en `1` `< 3`: permanece `'limpio'`
  con el contador incrementado.
- Celda en `'limpio'` con `ticksEnEstado` tras incrementar en `1` `>= 3`: pasa a
  `{ estado: 'arbol', ticksEnEstado: 0 }`.
- El valor de retorno siempre coincide con el `estado` final guardado en el `Map` para esa
  celda.

## Examples
- Sobre una celda recién talada (`{estado:'tocon', ticksEnEstado:0}`): 1ª llamada -> `'tocon'`
  (`ticksEnEstado:1`); 2ª llamada -> `'limpio'` (`ticksEnEstado:0`); 3ª y 4ª llamada -> `'limpio'`
  (`ticksEnEstado:1` y `2`); 5ª llamada -> `'arbol'` (`ticksEnEstado:0`).
- Sobre una celda sin entrada: cualquier número de llamadas siempre devuelve `'arbol'`.

## Do / Don't
- DO: incrementar el contador ANTES de comparar contra el umbral (el tick que hace cumplir el
  umbral es el mismo que dispara la transición, no uno de más).
- DO: resetear `ticksEnEstado` a `0` cada vez que ocurre una transición de estado.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: hacer que el estado `'arbol'` decaiga con el tiempo — se mantiene indefinidamente
  hasta una tala explícita.

## Tests
(Los tests están en `tests/test_avanzar_ciclo_arbol_tick.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
