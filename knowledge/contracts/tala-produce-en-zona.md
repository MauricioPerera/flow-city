---
type: 'Task Contract'
title: 'Tala produce en zona'
description: 'Funcion que determina si al menos una celda de una lista dada esta en estado arbol, condicion necesaria para que un nodo de tala pueda producir.'
tags: ['motor-arboles', 'flow-city', 'ciclo-de-vida']

task: tala-produce-en-zona
intent: "Determinar si al menos una celda de una zona dada esta en estado arbol, condicion necesaria para que la tala produzca."
target: src/talaProduceEnZona.js
signature: "function talaProduceEnZona(estadoArboles, celdasEnZona)"
test_command: "node tests/test_tala_produce_en_zona.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_tala_produce_en_zona.js"
tests_sha256: "0569203bc0aebc4c0f4cae4aabb00b9e18af2156f5d2c8afa44367de3a3e24ee"
touch_only: ['src/talaProduceEnZona.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Tala produce en zona

## Intent
Cuarta y última pieza del [Contrato 37](../../specs/CONTRACT-37-ciclo-de-vida-del-arbol.md):
`DEFINITION.md` establece que el nodo de tala solo puede producir madera si existe al menos una
celda en estado Árbol dentro de su área de acción. Esta función recibe explícitamente la lista
de celdas de la zona (el cálculo de qué celdas caen en el área de acción, vía
[`esta-en-zona-influencia`](./esta-en-zona-influencia.md) +
[`radio-area-accion-por-nivel`](./radio-area-accion-por-nivel.md), es responsabilidad de quien
orquesta — Contrato 38) y solo consulta el estado de árbol de cada una.

## Interface
```
function talaProduceEnZona(estadoArboles, celdasEnZona)
```
`celdasEnZona` es un array de `{x, y}`. Devuelve un booleano.

## Invariants
- Devuelve `true` si AL MENOS UNA celda de `celdasEnZona` está en estado `'arbol'` (por defecto
  o explícito).
- Devuelve `false` si NINGUNA celda de `celdasEnZona` está en estado `'arbol'`.
- `celdasEnZona` vacío: devuelve `false` (no hay ninguna celda con árbol, trivialmente).
- No muta `estadoArboles` (función de solo lectura).

## Examples
- `talaProduceEnZona(estadoArboles, [{x:0,y:0}])` con la celda sin entrada previa (por defecto
  `'arbol'`) -> `true`.
- `talaProduceEnZona(estadoArboles, [{x:0,y:0},{x:1,y:0}])` con ambas celdas ya taladas
  (`'tocon'`) -> `false`.
- `talaProduceEnZona(estadoArboles, [])` -> `false`.

## Do / Don't
- DO: tratar la ausencia de entrada en el `Map` como `'arbol'` — consistente con el resto del
  ciclo de vida.
- DO: recibir la lista de celdas como parámetro explícito — no calcular el área de acción
  dentro de esta función.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: mutar `estadoArboles`.

## Tests
(Los tests están en `tests/test_tala_produce_en_zona.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
