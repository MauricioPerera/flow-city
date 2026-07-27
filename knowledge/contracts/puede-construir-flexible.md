---
type: 'Task Contract'
title: 'Puede construir flexible'
description: 'Funcion pura que determina si una categoria de construccion flexible (residencial, industrial) puede construirse en un tipo de terreno, aceptando cualquiera excepto agua profunda.'
tags: ['motor-grid', 'flow-city', 'terreno', 'nivel']

task: puede-construir-flexible
intent: "Determinar si una construccion de categoria flexible (residencial o industrial) puede construirse en un tipo de terreno dado, aceptando cualquiera excepto agua profunda."
target: src/puedeConstruirFlexible.js
signature: "function puedeConstruirFlexible(tipoTerreno, categoriaConstruccion)"
test_command: "node tests/test_puede_construir_flexible.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 1
tests: "tests/test_puede_construir_flexible.js"
tests_sha256: "17b5e4a8098bd41ac9d012c76f7484224f2c8b5c8ca344c0304fc92a9d3391d0"
touch_only: ['src/puedeConstruirFlexible.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Puede construir flexible

## Intent
Primera pieza del [Contrato 33](../../specs/CONTRACT-33-terreno-flexible-residencial-industrial.md):
`DEFINITION.md` (sección "Terreno flexible para vivienda e industria") establece que las
construcciones de vivienda e industria pueden ir en cualquier terreno no acuático, a diferencia
de [`puede-construir`](./puede-construir.md), cuya tabla es una whitelist estricta por
categoría. Esta función es un gate NUEVO y aditivo — nunca reemplaza a `puedeConstruir` para
ninguna otra categoría, y lanza `RangeError` si se la invoca con una categoría no flexible, para
evitar que alguien la use por error donde debería usarse la estricta.

Categorías flexibles fijas: `['residencial', 'industrial']` (introducidas en este mismo
contrato, ver `DEFINITION.md`).

## Interface
```
function puedeConstruirFlexible(tipoTerreno, categoriaConstruccion)
```
Devuelve un booleano.

## Invariants
- Para `categoriaConstruccion` en `['residencial', 'industrial']`: devuelve `true` para
  cualquier `tipoTerreno` válido excepto `'agua_profunda'`; devuelve `false` para
  `'agua_profunda'`.
- Para cualquier otro valor de `categoriaConstruccion` (incluyendo las 5 categorías existentes
  `agricultura`, `reforestacion`, `mineria`, `pesca`, `no_extractiva`): lanza `RangeError`.
- `tipoTerreno` fuera de `['verde', 'elevada', 'agua_profunda', 'neutra']`: lanza `RangeError`.

## Examples
- `puedeConstruirFlexible('verde', 'residencial')` -> `true`
- `puedeConstruirFlexible('agua_profunda', 'industrial')` -> `false`
- `puedeConstruirFlexible('verde', 'agricultura')` -> lanza `RangeError`
- `puedeConstruirFlexible('lava', 'residencial')` -> lanza `RangeError`

## Do / Don't
- DO: validar `tipoTerreno` contra la misma whitelist de 4 terrenos que usa `crearGrid`/
  `puedeConstruir` (redeclarada localmente en este archivo, siguiendo la convención ya
  establecida del proyecto de no compartir constantes entre archivos).
- DO: lanzar `RangeError` para cualquier categoría no listada en `['residencial',
  'industrial']` — nunca actuar como reemplazo silencioso de `puedeConstruir`.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: importar ni modificar `src/puedeConstruir.js`.

## Tests
(Los tests están en `tests/test_puede_construir_flexible.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
