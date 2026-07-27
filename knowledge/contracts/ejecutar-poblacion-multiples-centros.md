---
type: 'Task Contract'
title: 'Ejecución de población con múltiples centros cívicos'
description: 'Funcion de integracion donde una casa se construye si cae en la zona de influencia de CUALQUIERA de varios centros civicos, incluyendo celdas de solapamiento.'
tags: ['motor-poblacion', 'flow-city', 'grid', 'zona-influencia']

task: ejecutar-poblacion-multiples-centros
intent: "Construir casas que se aceptan si su celda cae en la zona de influencia de al menos uno de varios centros civicos, sin duplicar poblacion en celdas de solapamiento."
target: src/ejecutarPoblacionMultiplesCentros.js
signature: "function ejecutarPoblacionMultiplesCentros()"
test_command: "node tests/test_ejecutar_poblacion_multiples_centros.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_ejecutar_poblacion_multiples_centros.js"
tests_sha256: "64c773b530845918f79dfd3d95d2472b5fbf226a3fd133cc82f3647a838eac04"
touch_only: ['src/ejecutarPoblacionMultiplesCentros.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de población con múltiples centros cívicos

## Intent
Única pieza del [Contrato 26](../../specs/CONTRACT-26-poblacion-multiples-centros.md): ningún
contrato anterior probó más de un centro cívico a la vez. Esta función define dos centros con
zonas de influencia ([`esta-en-zona-influencia`](./esta-en-zona-influencia.md), distancia
Chebyshev) que se solapan parcialmente, e intenta construir 4 casas
([`colocar-nodo`](./colocar-nodo.md)): una casa se acepta si su celda cae dentro del radio de
**al menos uno** de los centros (unión de zonas, no intersección) — incluida la celda de
solapamiento, sin duplicar su población.

Grid `6x6` terreno `neutra`. Centro 1 en `(1,1)` radio `2` (zona: `x` en `[0,3]`... clippeado
por grid, `y` en `[0,3]`, clippeado). Centro 2 en `(4,4)` radio `2` (zona: `x` en `[2,5]`, `y`
en `[2,5]`, clippeado). Solapamiento: celdas con `x` e `y` ambos en `[2,3]`.

Casas intentadas: `(0,0)` (distancia a centro 1: `max(1,1)=1<=2` → dentro; a centro 2:
`max(4,4)=4>2` → fuera; se acepta por centro 1). `(5,5)` (distancia a centro 2: `max(1,1)=1<=2`
→ dentro; a centro 1: `max(4,4)=4>2` → fuera; se acepta por centro 2). `(3,3)` (distancia a
centro 1: `max(2,2)=2<=2` → dentro; a centro 2: `max(1,1)=1<=2` → dentro; se acepta, cubierta
por AMBOS). `(0,5)` (distancia a centro 1: `max(1,4)=4>2` → fuera; a centro 2: `max(4,1)=4>2` →
fuera; se rechaza).

## Interface
```
function ejecutarPoblacionMultiplesCentros()
```
Devuelve `{ centros, casasIntentadas, casasConstruidas, poblacionTotal }`. `centros` es un array
de `{ x, y, radio }`. `casasIntentadas` es un array de `{ x, y, construida }` en el orden en que
se intentaron.

## Invariants
- `centros` tiene exactamente `2` elementos: `{ x: 1, y: 1, radio: 2 }` y `{ x: 4, y: 4, radio:
  2 }`.
- `casasIntentadas` tiene exactamente `4` elementos, en el orden `(0,0)`, `(5,5)`, `(3,3)`,
  `(0,5)`.
- `(0,0).construida === true`, `(5,5).construida === true`, `(3,3).construida === true`,
  `(0,5).construida === false`.
- Una casa se acepta si `estaEnZonaInfluencia` es `true` para AL MENOS UNO de los dos centros
  (no requiere ambos, no es intersección).
- `casasConstruidas === 3` (las 3 aceptadas; la de `(0,5)` no cuenta).
- `poblacionTotal === 30` (`3` casas construidas × `10` de población cada una, vía
  [`poblacion-total-casas`](./poblacion-total-casas.md)).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarPoblacionMultiplesCentros().casasConstruidas` -> `3`
- `ejecutarPoblacionMultiplesCentros().casasIntentadas[2]` -> `{ x: 3, y: 3, construida: true }`
  (celda de solapamiento, cubierta por ambos centros, se acepta una sola vez)
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `estaEnZonaInfluencia`, `poblacionTotalCasas` —
  ninguna lógica de distancia, colocación o suma poblacional se reimplementa.
- DO: para cada casa intentada, comprobar `estaEnZonaInfluencia` contra CADA centro y aceptar si
  CUALQUIERA da `true` (lógica de "unión", nueva orquestación de este contrato, no una función
  existente que se esté duplicando).
- DO: capturar el `Error` de `colocarNodo` (terreno no admite / celda ocupada) o simplemente NO
  llamar `colocarNodo` si ningún centro cubre la celda, para registrar `construida: false` sin
  abortar la función completa.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir producción, comercio, tesorería, degradación o crecimiento tick a tick —
  fuera de alcance de este contrato (ya demostrados en otros).

## Tests
(Los tests están en `tests/test_ejecutar_poblacion_multiples_centros.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
