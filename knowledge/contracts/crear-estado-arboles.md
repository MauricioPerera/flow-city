---
type: 'Task Contract'
title: 'Crear estado de árboles'
description: 'Funcion que crea una tabla de estado de arboles vacia, como Map, independiente del grid.'
tags: ['motor-arboles', 'flow-city', 'ciclo-de-vida']

task: crear-estado-arboles
intent: "Crear una tabla de estado de arboles vacia, como Map plano keyed por coordenada, independiente del grid."
target: src/crearEstadoArboles.js
signature: "function crearEstadoArboles()"
test_command: "node tests/test_crear_estado_arboles.js"
budget:
  max_cyclomatic_complexity: 2
  max_nesting_depth: 1
tests: "tests/test_crear_estado_arboles.js"
tests_sha256: "1a65e7be48e2f554d59dc7ad0ce509a2644a47f1d82296d26bbbf9f29964faa2"
touch_only: ['src/crearEstadoArboles.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Crear estado de árboles

## Intent
Primera pieza del [Contrato 37](../../specs/CONTRACT-37-ciclo-de-vida-del-arbol.md): el estado
de árbol de cada celda (Árbol/Tocón/Limpio) vive en un `Map` plano, keyed por `"x,y"`,
mantenido junto al grid pero SIN modificar `crearGrid.js`/`obtenerCelda.js` — mismo patrón que
`grafo` en [`conectar-vertices`](./conectar-vertices.md) (estructura auxiliar, no parte del
grid). Una celda sin entrada en el `Map` se considera en estado `'arbol'` por defecto.

## Interface
```
function crearEstadoArboles()
```
Devuelve un `Map` vacío nuevo.

## Invariants
- El valor devuelto es una instancia de `Map`.
- `tamaño devuelto.size === 0`.
- Cada llamada devuelve una instancia NUEVA e independiente (mutar una no afecta a otra).

## Examples
- `crearEstadoArboles()` -> `Map` vacío, `size === 0`.
- Dos llamadas devuelven instancias distintas; mutar una no afecta a la otra.

## Do / Don't
- DO: devolver un `Map` nativo de JS, sin envolverlo en ningún objeto adicional.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: pre-poblar el `Map` con ninguna entrada — la ausencia de entrada YA significa
  `'arbol'` (convención documentada, no requiere inicialización explícita).

## Tests
(Los tests están en `tests/test_crear_estado_arboles.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
