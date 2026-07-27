---
type: 'Task Contract'
title: 'Creación de la grilla base'
description: 'Funcion pura que inicializa una grilla acotada de ancho x alto con terreno por celda.'
tags: ['motor-grid', 'flow-city', 'terreno', 'grid']

task: crear-grid
intent: "Inicializar una grilla acotada de ancho por alto con todas sus celdas en un terreno default dado."
target: src/crearGrid.js
signature: "function crearGrid(ancho, alto, terrenoDefault)"
test_command: "node tests/test_crear_grid.js"
budget:
  max_cyclomatic_complexity: 5
  max_nesting_depth: 3
tests: "tests/test_crear_grid.js"
tests_sha256: "104fdb09aaf4fab53fa4335f173fcff7aa289e9bca98fea923a3daac5ebce6a1"
touch_only: ['src/crearGrid.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Creación de la grilla base

## Intent
El lienzo de Flow City es una grilla acotada por chunks (no infinita, no libre) donde cada
celda tiene un tipo de terreno. Esta función crea esa estructura base: una grilla de
`ancho` x `alto` celdas, todas inicializadas con el mismo terreno default (asignar terreno
distinto por celda, colocar nodos y consultar celdas individuales son piezas separadas,
todavía sin construir). Ver [DEFINITION.md](../../DEFINITION.md), sección "Grilla y
construcción".

Primera pieza de T4 del [Contrato 01](../../specs/CONTRACT-01-motor-recursos-fundamentos.md),
elegida por ser la base de la que dependen las demás (consulta de celda, colocación de nodo).

## Interface
```
function crearGrid(ancho, alto, terrenoDefault)
```
Devuelve `{ ancho, alto, celdas }`, donde `celdas` es un array de `alto` filas, cada una un
array de `ancho` columnas, y cada celda es `{ terreno: terrenoDefault, nodo: null }`.

## Invariants
- `grid.ancho` y `grid.alto` reflejan exactamente los argumentos recibidos.
- `grid.celdas.length === alto` y cada fila tiene `length === ancho`.
- Toda celda arranca como `{ terreno: terrenoDefault, nodo: null }`.
- Las celdas son objetos independientes: mutar una no afecta a ninguna otra.
- `ancho <= 0`, `alto <= 0`, `ancho`/`alto` no enteros, o `terrenoDefault` fuera de
  `['verde', 'elevada', 'agua_profunda', 'neutra']` lanzan `RangeError`.

## Examples
- `crearGrid(2, 3, 'neutra')` -> `{ ancho: 2, alto: 3, celdas: [...3 filas de 2 celdas...] }`
- `crearGrid(1, 1, 'verde').celdas[0][0]` -> `{ terreno: 'verde', nodo: null }`
- `crearGrid(0, 3, 'neutra')` -> lanza `RangeError`
- `crearGrid(2, 2, 'lava')` -> lanza `RangeError`

## Do / Don't
- DO: validar `ancho`, `alto` y `terrenoDefault` antes de construir la estructura.
- DO: crear un objeto de celda nuevo por cada posición (nunca reutilizar la misma referencia).
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: aceptar dimensiones no enteras ni terrenos fuera del vocabulario conocido.

## Tests
(Los tests están en `tests/test_crear_grid.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
