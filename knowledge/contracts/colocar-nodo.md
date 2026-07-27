---
type: 'Task Contract'
title: 'Colocación de un nodo en la grilla'
description: 'Funcion que coloca un nodo en una celda, validando terreno permitido y ausencia de superposicion.'
tags: ['motor-grid', 'flow-city', 'terreno', 'grid']

task: colocar-nodo
intent: "Colocar un nodo en una celda del grid, validando que el terreno lo permita y que la celda no este ya ocupada."
target: src/colocarNodo.js
signature: "function colocarNodo(grid, x, y, categoriaConstruccion, nodo)"
test_command: "node tests/test_colocar_nodo.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_colocar_nodo.js"
tests_sha256: "8d9707f882fbb3b7b0d955f855cc5c5af9d302808474cdd7533753e0031c1b50"
touch_only: ['src/colocarNodo.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Colocación de un nodo en la grilla

## Intent
Tercera y última pieza de T4 del
[Contrato 01](../../specs/CONTRACT-01-motor-recursos-fundamentos.md): coloca un nodo
(construcción) en una celda del grid, componiendo las dos piezas anteriores —
[`obtenerCelda`](./obtener-celda.md) para localizar y validar límites, y
[`puedeConstruir`](./puede-construir.md) para validar que el terreno de esa celda admita la
categoría de construcción — y agrega la regla que faltaba: una celda ya ocupada no puede
recibir un segundo nodo (los nodos no se superponen). Ver
[DEFINITION.md](../../DEFINITION.md), sección "Grilla y construcción".

Distingue dos familias de error: **estructural** (`RangeError` — coordenadas fuera de rango,
categoría desconocida, `nodo` vacío) vs. **de negocio** (`Error` común — terreno incompatible,
celda ya ocupada), para que el motor pueda diferenciar "pediste algo inválido" de "esa jugada
concreta no es posible ahora mismo".

## Interface
```
function colocarNodo(grid, x, y, categoriaConstruccion, nodo)
```
Devuelve la celda ya actualizada (`{ terreno, nodo }`, con `nodo` seteado).

## Invariants
- Tras una colocación exitosa, `grid.celdas[y][x].nodo === nodo` (mutación visible en el grid
  original).
- Si el terreno de la celda no admite `categoriaConstruccion` (según `puedeConstruir`): lanza
  `Error` (no `RangeError`) con mensaje que menciona "terreno". La celda no se modifica.
- Si la celda ya tiene un `nodo` no nulo: lanza `Error` (no `RangeError`) con mensaje que
  menciona "ocupada". La celda no se modifica.
- `x`/`y` fuera de los límites del grid: `RangeError` (vía `obtenerCelda`).
- `categoriaConstruccion` fuera del vocabulario conocido: `RangeError` (vía `puedeConstruir`).
- `nodo` `null` o `undefined`: `RangeError`.

## Examples
- `colocarNodo(crearGrid(2, 2, 'verde'), 0, 0, 'agricultura', 'granja-1')` -> celda con
  `nodo: 'granja-1'`
- Sobre grid `'neutra'`: `colocarNodo(grid, 0, 0, 'agricultura', 'granja-1')` -> lanza `Error`
  ("terreno...")
- Colocar dos veces sobre la misma celda -> la segunda llamada lanza `Error` ("ocupada...")
- `colocarNodo(grid, 5, 0, 'agricultura', 'granja-1')` (fuera de rango) -> lanza `RangeError`

## Do / Don't
- DO: reusar `obtenerCelda` y `puedeConstruir` en vez de reimplementar sus validaciones.
- DO: validar `nodo` no nulo antes de tocar la celda.
- DON'T: usar red, ni subprocess, ni acceso a estado global fuera del `grid` recibido.
- DON'T: mutar la celda si alguna validación falla (todo-o-nada).

## Tests
(Los tests están en `tests/test_colocar_nodo.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
