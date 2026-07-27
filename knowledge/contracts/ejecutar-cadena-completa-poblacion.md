---
type: 'Task Contract'
title: 'Ejecución de la cadena completa con población real'
description: 'Integracion final que combina almacenes, costo de construccion/mantenimiento, degradacion y poblacion real con prioridad sobre la produccion.'
tags: ['motor-integracion', 'motor-economia', 'motor-poblacion', 'motor-comercio', 'flow-city', 'produccion', 'grid', 'grafo', 'tick', 'quiebra']

task: ejecutar-cadena-completa-poblacion
intent: "Simular N ticks de la cadena completa (almacenes, costo, mantenimiento, degradacion) con poblacion real tomando su cobertura de la produccion antes que la granja/el comercio."
target: src/ejecutarCadenaCompletaConPoblacion.js
signature: "function ejecutarCadenaCompletaConPoblacion(numTicks)"
test_command: "node tests/test_ejecutar_cadena_completa_poblacion.js"
budget:
  max_cyclomatic_complexity: 22
  max_nesting_depth: 4
tests: "tests/test_ejecutar_cadena_completa_poblacion.js"
tests_sha256: "cee7afededad42f0f6fa5b4b008cf05b9eeb41dfb7a39e3207b8223b583d439a"
touch_only: ['src/ejecutarCadenaCompletaConPoblacion.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de la cadena completa con población real

## Intent
Combina TODO lo construido hasta ahora en el proyecto: el patrón de
[`ejecutarCadenaCompleta`](./ejecutar-cadena-completa.md) (Contrato 15: construcción con
costo, almacenes, comercio, tesorería, mantenimiento, degradación) más
[`ejecutarCadenaConPoblacionReal`](./ejecutar-cadena-poblacion-real.md) (Contrato 17: una
casa con población real que toma su cobertura de agua/comida ANTES que la granja/el comercio,
cada tick).

Alcance simplificado deliberado: la población es un conteo FIJO (`10`) durante los ticks
simulados — no se compone tick a tick junto con la degradación de tesorería (evitaría
encadenar dos loops de retroalimentación completos en la misma traza manual). Al final de la
simulación se evalúa UNA sola vez cuánto crecería/decrecería la población con el índice de
cobertura del ÚLTIMO tick simulado.

Hallazgo emergente (verificado a mano por el orquestador, no un descubrimiento de la
implementación): con población tomando prioridad real sobre el agua, una vez que la bomba se
degrada (`4 → 2`), la población consume exactamente el 100% del agua degradada (necesita `2`,
hay `2`), dejando `0` para la granja — que en consecuencia no vuelve a producir mientras dure
la degradación. A diferencia del Contrato 15 (que sí se recuperaba), este escenario **NO se
recupera**: sin ingreso de ventas, el saldo cae indefinidamente por puro mantenimiento
(`-3`/tick).

## Interface
```
function ejecutarCadenaCompletaConPoblacion(numTicks)
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal, tesoreriaFinal, poblacionFija,
cambioPoblacionFinal, poblacionFinal, manoDeObraDisponible }`. `historial` es un array de
`numTicks` elementos con el detalle completo de cada tick (ver Invariants).

## Invariants

Verificados a mano por el orquestador antes de escribir el oráculo:
- Ticks `0`-`1`: `degradado: false`, `aguaProducida: 4`, `aguaParaPoblacion: 2` (`min(10*0.2,
  4)`), `coberturaAgua: 1`, `aguaEnviadaGranja: 2` (remanente), `manzanasProducidas: 4`,
  `comidaParaPoblacion: 2`, `coberturaComida: 1`, `manzanasVendidas: 2`, `montoVenta: 4`,
  `indiceCobertura: 1`, `montoMantenimiento: 3`. Saldo termina en `-29` y `-28`
  respectivamente (arranca en `-30` por sobre-construcción, igual que el Contrato 15).
- Tick `2`: contador de quiebra alcanza el umbral (`2`) → `degradado: true`.
  `aguaProducida: 2` (degradada), `aguaParaPoblacion: 2` (consume TODO), `aguaEnviadaGranja: 0`,
  `manzanasProducidas: 0`, `coberturaComida: 0`, `manzanasVendidas: 0`, `montoVenta: 0`,
  `indiceCobertura: 0` (mínimo). Saldo cae a `-31` (solo mantenimiento, sin ingreso).
- Tick `3`: idéntico al tick `2` (el sistema queda atrapado en el estado degradado, no se
  recupera). Saldo cae a `-34`.
- `bombaAlmacenLleno` y `granjaAlmacenLleno` son `false` en todos los ticks (las capacidades
  fijadas nunca se saturan).
- Al final: `poblacionFija === 10`; `cambioPoblacionFinal` y `poblacionFinal` se calculan con
  el `indiceCobertura` del ÚLTIMO tick simulado (con `4` ticks: índice `0` → `cambioPoblacionFinal:
  -1`, `poblacionFinal: 9`; con `2` ticks: índice `1` → `cambioPoblacionFinal: 1`,
  `poblacionFinal: 11`).
- `numTicks` no entero o `<= 0`: lanza `RangeError`.

## Examples
- `ejecutarCadenaCompletaConPoblacion(2)` -> saldo final `-28`, `poblacionFinal: 11` (índice
  sano del último tick).
- `ejecutarCadenaCompletaConPoblacion(4)` -> saldo final `-34` (colapso sin recuperación),
  `poblacionFinal: 9` (índice degradado del último tick).
- `ejecutarCadenaCompletaConPoblacion(0)` -> lanza `RangeError`.

## Do / Don't
- DO: aplicar "población primero" en CADA tick — agua y comida se descuentan de la producción
  degradada ANTES de enviarla/venderla.
- DO: reusar TODOS los módulos de los Contratos 09, 10, 11, 12, 13, 14, 15, 16, 17 listados en
  esos contratos — ninguna lógica se reimplementa acá.
- DO: calcular `cambioPoblacionFinal`/`poblacionFinal` UNA sola vez al final, con el
  `indiceCobertura` del último tick del `historial` — no compuesto tick a tick.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: modificar ninguna integración anterior — esta es una función independiente y nueva.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_completa_poblacion.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
