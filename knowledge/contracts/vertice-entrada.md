---
type: 'Task Contract'
title: 'Vértice de entrada de un nodo según su rotación'
description: 'Funcion pura que determina a que esquina de su celda se conecta la entrada de un nodo, segun su direccion de rotacion.'
tags: ['motor-grid', 'motor-rutas', 'flow-city', 'grid', 'grafo']

task: vertice-entrada
intent: "Determinar a que vertice-esquina de su celda se conecta la entrada de un nodo, segun su direccion de rotacion."
target: src/verticeEntrada.js
signature: "function verticeEntrada(x, y, rotacion)"
test_command: "node tests/test_vertice_entrada.js"
budget:
  max_cyclomatic_complexity: 4
  max_nesting_depth: 1
tests: "tests/test_vertice_entrada.js"
tests_sha256: "54d7ff764c5f67b6053d66dd1db33b05b3ea31f8c0c45532e88cd2015448ceae"
touch_only: ['src/verticeEntrada.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Vértice de entrada de un nodo según su rotación

## Intent
Tercera pieza del [Contrato 03](../../specs/CONTRACT-03-integracion-grid-rutas.md): un nodo
tiene "una entrada que debe conectarse a una ruta" y puede rotarse; como el modelo de vértices
solo tiene esquinas (no puntos medios de arista), cada dirección de rotación debe mapear a UNA
esquina concreta de las 4 que devuelve [`verticesDeCelda`](./vertices-de-celda.md). Ver
[DEFINITION.md](../../DEFINITION.md), sección "Grilla y construcción".

Convención fijada en esta tarea (ambigüedad resuelta en conversación antes de escribir este
contrato, sentido horario): `norte -> noreste`, `este -> sureste`, `sur -> suroeste`, `oeste ->
noroeste`.

## Interface
```
function verticeEntrada(x, y, rotacion)
```
`rotacion` es uno de `'norte'`, `'este'`, `'sur'`, `'oeste'`. Devuelve un id de vértice
(string).

## Invariants
- `verticeEntrada(x, y, 'norte') === verticesDeCelda(x, y).noreste`
- `verticeEntrada(x, y, 'este') === verticesDeCelda(x, y).sureste`
- `verticeEntrada(x, y, 'sur') === verticesDeCelda(x, y).suroeste`
- `verticeEntrada(x, y, 'oeste') === verticesDeCelda(x, y).noroeste`
- `rotacion` fuera de `['norte', 'este', 'sur', 'oeste']` lanza `RangeError`.
- `x`/`y` inválidas (negativas o no enteras) lanzan `RangeError` (delegado de
  `verticesDeCelda`/`idVertice`).

## Examples
- `verticeEntrada(0, 0, 'norte')` -> `'1,0'`
- `verticeEntrada(0, 0, 'oeste')` -> `'0,0'`
- `verticeEntrada(2, 3, 'sur')` -> `'2,4'`
- `verticeEntrada(0, 0, 'arriba')` -> lanza `RangeError`

## Do / Don't
- DO: reusar `verticesDeCelda` para obtener las 4 esquinas, no recalcular coordenadas a mano.
- DO: validar `rotacion` contra el vocabulario de 4 direcciones antes de mapear.
- DON'T: usar red, `require` de paquetes externos (salvo `verticesDeCelda`, módulo hermano),
  ni acceso a estado global.
- DON'T: cambiar la convención horaria fijada (norte→noreste, este→sureste, sur→suroeste,
  oeste→noroeste).

## Tests
(Los tests están en `tests/test_vertice_entrada.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
