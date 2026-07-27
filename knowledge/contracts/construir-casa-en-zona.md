---
type: 'Task Contract'
title: 'Construcción de una casa en zona de influencia'
description: 'Funcion que coloca una casa en el grid solo si esta dentro del radio real de influencia de un centro civico.'
tags: ['motor-poblacion', 'motor-integracion', 'flow-city', 'grid', 'zona-influencia']

task: construir-casa-en-zona
intent: "Colocar una casa en el grid solo si esta dentro del radio de influencia real de un centro civico, sin tocar el grid si no lo esta."
target: src/construirCasaEnZona.js
signature: "function construirCasaEnZona(grid, xCentro, yCentro, radio, xCasa, yCasa, categoriaTerreno, nodo)"
test_command: "node tests/test_construir_casa_en_zona.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_construir_casa_en_zona.js"
tests_sha256: "9abe5e70135d475ef816435929d0ab63764b1df362c72d1a7fa181b589ab6e96"
touch_only: ['src/construirCasaEnZona.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Construcción de una casa en zona de influencia

## Intent
Primera pieza del [Contrato 16](../../specs/CONTRACT-16-poblacion-grid-real.md): "la única
forma de construir casas es dentro de la zona de influencia de un centro cívico"
(`DEFINITION.md`, sección "Grilla y construcción"). Esta función compone
[`estaEnZonaInfluencia`](./esta-en-zona-influencia.md) (Contrato 06) con
[`colocarNodo`](./colocar-nodo.md) (Contrato 01): valida la zona ANTES de tocar el grid, para
que una casa fuera de zona no lo mute en absoluto.

## Interface
```
function construirCasaEnZona(grid, xCentro, yCentro, radio, xCasa, yCasa, categoriaTerreno, nodo)
```
Devuelve la celda actualizada (misma forma que `colocarNodo`).

## Invariants
- Si `estaEnZonaInfluencia(xCentro, yCentro, radio, xCasa, yCasa)` es `false`: lanza `Error`
  (no `RangeError`) — la casa está fuera de zona. El grid NO se modifica.
- Si está dentro de la zona: se delega en `colocarNodo(grid, xCasa, yCasa, categoriaTerreno,
  nodo)`, con sus mismas reglas y errores (terreno incompatible o celda ocupada → `Error` de
  negocio; coordenadas o categoría inválidas → `RangeError`).
- Coordenadas o radio inválidos (delegado de `estaEnZonaInfluencia`): lanza `RangeError`.

## Examples
- `construirCasaEnZona(grid, 1, 1, 1, 0, 0, 'no_extractiva', 'casa-1')` -> celda con `nodo:
  'casa-1'` (distancia `1 <= radio 1`).
- `construirCasaEnZona(grid, 1, 1, 1, 3, 3, 'no_extractiva', 'casa-2')` -> lanza `Error`
  (distancia `2 > radio 1`), el grid no cambia.
- `construirCasaEnZona(grid, -1, 1, 1, 0, 0, 'no_extractiva', 'casa-1')` -> lanza `RangeError`.

## Do / Don't
- DO: verificar la zona de influencia ANTES de llamar a `colocarNodo` (evita mutar el grid en
  vano).
- DO: propagar tal cual los errores de `colocarNodo` cuando la casa sí está en zona.
- DON'T: usar red, `require` de paquetes externos (salvo `estaEnZonaInfluencia` y `colocarNodo`,
  módulos hermanos), ni acceso a estado global.
- DON'T: mutar el grid cuando la casa está fuera de zona.

## Tests
(Los tests están en `tests/test_construir_casa_en_zona.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
