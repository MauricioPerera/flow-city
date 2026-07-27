---
type: 'Task Contract'
title: 'Reglas de emplazamiento por terreno'
description: 'Funcion pura que determina si una categoria de construccion puede emplazarse en un tipo de celda de terreno dado.'
tags: ['motor-recursos', 'flow-city', 'terreno', 'grid']

task: puede-construir
intent: "Determinar si una categoria de construccion puede emplazarse en un tipo de celda de terreno dado."
target: src/puedeConstruir.js
signature: "function puedeConstruir(tipoTerreno, categoriaConstruccion)"
test_command: "node tests/test_puede_construir.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_puede_construir.js"
tests_sha256: "a524c4fc4b434f2b5588d36613472a4281087e3a33dcb141062220a600b45c28"
touch_only: ['src/puedeConstruir.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Reglas de emplazamiento por terreno

## Intent
El lienzo de Flow City tiene 4 tipos de celda (`verde`, `elevada`, `agua_profunda`, `neutra`),
y cada categoría de construcción solo puede emplazarse en un subconjunto de ellas. Esta función
encapsula esa regla de compatibilidad terreno↔construcción, para que el resto del motor
(colocación de nodos, validación de la grilla) la consulte sin duplicar la tabla de reglas.
Ver [DEFINITION.md](../../DEFINITION.md), sección "Grilla y construcción".

Decisión de diseño fijada en esta tarea (hueco abierto en `DEFINITION.md`, resuelto en
conversación antes de escribir este contrato): las construcciones no-extractivas
(`no_extractiva`) solo pueden emplazarse en `verde` o `neutra`. `elevada` y `agua_profunda`
quedan reservadas en exclusiva a su uso extractivo (`mineria` y `pesca` respectivamente) — nada
más puede construirse ahí.

## Interface
```
function puedeConstruir(tipoTerreno, categoriaConstruccion)
```

## Invariants
- Devuelve siempre un booleano; nunca `undefined` ni un valor truthy/falsy no booleano.
- Tabla de compatibilidad fija: `agricultura` y `reforestacion` -> solo `verde`; `mineria` ->
  solo `elevada`; `pesca` -> solo `agua_profunda`; `no_extractiva` -> `verde` o `neutra`.
- `tipoTerreno` o `categoriaConstruccion` fuera del vocabulario conocido lanzan `RangeError`,
  nunca devuelven `false` en silencio (evita confundir "no permitido" con "valor inválido").

## Examples
- `puedeConstruir('verde', 'agricultura')` -> `true`
- `puedeConstruir('elevada', 'mineria')` -> `true`
- `puedeConstruir('elevada', 'no_extractiva')` -> `false`
- `puedeConstruir('neutra', 'agricultura')` -> `false`

## Do / Don't
- DO: usar una tabla de compatibilidad explícita (objeto/mapa), no cadenas de `if` anidadas.
- DO: validar ambos argumentos contra el vocabulario conocido antes de consultar la tabla.
- DON'T: usar red, `require` de paquetes externos, ni acceso a estado global.
- DON'T: devolver `false` para un terreno o categoría desconocidos — eso es un `RangeError`.

## Tests
(Los tests están en `tests/test_puede_construir.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
