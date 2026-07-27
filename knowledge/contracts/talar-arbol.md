---
type: 'Task Contract'
title: 'Talar árbol'
description: 'Funcion que ejecuta la transicion explicita Arbol a Tocon sobre una celda, lanzando error si la celda no esta en estado arbol.'
tags: ['motor-arboles', 'flow-city', 'ciclo-de-vida']

task: talar-arbol
intent: "Ejecutar la transicion explicita de Arbol a Tocon sobre una celda del estado de arboles."
target: src/talarArbol.js
signature: "function talarArbol(estadoArboles, x, y)"
test_command: "node tests/test_talar_arbol.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 1
tests: "tests/test_talar_arbol.js"
tests_sha256: "92b8f9df3c96908435e450f042f5a88d53bde1523839c0246ca8a5617db6cec7"
touch_only: ['src/talarArbol.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Talar árbol

## Intent
Segunda pieza del [Contrato 37](../../specs/CONTRACT-37-ciclo-de-vida-del-arbol.md): Árbol→Tocón
es SIEMPRE una acción explícita de tala (nunca ocurre por el paso del tiempo, a diferencia de
las otras dos transiciones, ver
[`avanzar-ciclo-arbol-tick`](./avanzar-ciclo-arbol-tick.md)). Muta la entrada de
[`estado-de-arboles`](./crear-estado-arboles.md) para la celda `(x, y)`: si no hay entrada
previa (equivale a `'arbol'`) o si la entrada explícita es `'arbol'`, la convierte en `'tocon'`
con `ticksEnEstado: 0`. Si la celda está en cualquier otro estado, lanza `Error` — solo se puede
talar un árbol maduro.

## Interface
```
function talarArbol(estadoArboles, x, y)
```
Muta `estadoArboles` en el lugar. No devuelve nada útil (efecto secundario).

## Invariants
- Si la celda `(x, y)` no tiene entrada en `estadoArboles` (por defecto `'arbol'`) o su entrada
  explícita es `{estado: 'arbol', ...}`: tras la llamada, `estadoArboles.get('x,y')` es
  exactamente `{ estado: 'tocon', ticksEnEstado: 0 }`.
- Si la celda tiene una entrada con `estado !== 'arbol'` (`'tocon'` o `'limpio'`): lanza `Error`,
  sin mutar `estadoArboles`.
- La clave del `Map` es exactamente la cadena `` `${x},${y}` ``.

## Examples
- `talarArbol(estadoArboles, 0, 0)` sobre una celda sin entrada previa -> deja
  `estadoArboles.get('0,0')` en `{ estado: 'tocon', ticksEnEstado: 0 }`.
- Llamar `talarArbol` dos veces seguidas sobre la misma celda -> la segunda llamada lanza
  `Error` (la celda ya está en `'tocon'`, no en `'arbol'`).

## Do / Don't
- DO: tratar la ausencia de entrada en el `Map` como `'arbol'` (no lanzar por "celda no
  encontrada").
- DO: usar la clave `` `${x},${y}` `` — mismo formato que el resto de este contrato.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: mutar `estadoArboles` si la validación falla.

## Tests
(Los tests están en `tests/test_talar_arbol.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
