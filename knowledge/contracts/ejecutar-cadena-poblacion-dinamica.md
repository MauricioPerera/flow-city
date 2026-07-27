---
type: 'Task Contract'
title: 'Ejecución de cadena con población dinámica y degradación combinadas'
description: 'Integracion que combina la degradacion por quiebra con una poblacion que se recompone tick a tick segun su propio indice de cobertura, cerrando el pendiente del Contrato 19.'
tags: ['motor-integracion', 'motor-economia', 'motor-poblacion', 'motor-comercio', 'flow-city', 'produccion', 'grid', 'grafo', 'tick', 'quiebra']

task: ejecutar-cadena-poblacion-dinamica
intent: "Simular 10 ticks de la cadena completa donde la poblacion se recompone al final de cada tick segun su propio indice de cobertura, junto con la degradacion por quiebra."
target: src/ejecutarCadenaPoblacionDinamica.js
signature: "function ejecutarCadenaPoblacionDinamica()"
test_command: "node tests/test_ejecutar_cadena_poblacion_dinamica.js"
budget:
  max_cyclomatic_complexity: 24
  max_nesting_depth: 4
tests: "tests/test_ejecutar_cadena_poblacion_dinamica.js"
tests_sha256: "c7ef9afd92bf0ff8dc46958803d3ef5ae8e69a7b5e75b6beaf7ef91bdc20a7cc"
touch_only: ['src/ejecutarCadenaPoblacionDinamica.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena con población dinámica y degradación combinadas

## Intent
Única pieza del [Contrato 25](../../specs/CONTRACT-25-cadena-poblacion-dinamica.md): cierra el
pendiente explícito del Contrato 19 (`ejecutar-cadena-completa-poblacion`), donde la población
era un conteo fijo. Aquí la población se recompone AL FINAL de cada tick con
[`calcular-crecimiento-poblacion`](./calcular-crecimiento-poblacion.md) usando el índice de
cobertura DE ESE MISMO tick, y ese nuevo valor alimenta la necesidad del tick siguiente —
combinando por primera vez los dos loops de retroalimentación completos (población Y
degradación) en la misma simulación.

Mismo setup económico que el Contrato 19 (construcción con costo, almacenes, comercio,
tesorería, mantenimiento, degradación, "población primero"), reusando TODOS sus módulos, sin
modificar esa integración.

Decisión de redondeo (confirmada explícitamente por el usuario, entre dos alternativas
presentadas, ante el hallazgo de que la población variable rompe la aritmética entera de los
almacenes): el remanente de agua/comida que va al almacén se trunca con `Math.floor` ANTES de
`agregarStockAlmacen`; la necesidad de la población (`aguaRequerida`/`comidaRequerida`) NO se
redondea.

Hallazgo emergente (verificado a mano por el orquestador vía prototipo en vivo, no un
descubrimiento de la implementación): la población decrece mientras la cobertura es baja
(`11 → 9 → 8 → 7 → 6 → 5`, ticks `2`-`6`) hasta estabilizarse en `5` (tick `7` en adelante),
tamaño donde la producción degradada cubre el `100%` de su necesidad. La TESORERÍA, sin
embargo, nunca se recupera: sin excedente para vender, el saldo cae indefinidamente por
mantenimiento puro — la población se adapta a la degradación, pero eso no rescata la economía.

## Interface
```
function ejecutarCadenaPoblacionDinamica()
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal, tesoreriaFinal, poblacionInicial,
poblacionFinal }`. `historial` tiene `10` elementos.

## Invariants
- `poblacionInicial === 10`.
- Ticks `0`-`1`: `degradado: false`. Tick `0`: `poblacionFinTick: 11` (cobertura `1`, crece).
  Tick `1`: `poblacionFinTick: 11` (cobertura `0.9090909090909091`, sin cambio entero tras
  `floor`).
- Tick `2`: contador de quiebra alcanza el umbral → `degradado: true` (se mantiene `true` en
  TODOS los ticks siguientes, el saldo nunca vuelve a ser positivo). Población decrece:
  `11 → 9` (`cambioPoblacion: -2`).
- Ticks `3`-`6`: población sigue decreciendo un habitante por tick (`9→8→7→6→5`) mientras la
  cobertura de agua es `1` pero la de comida es `0` (la granja no produce, sin agua sobrante).
- Ticks `7`-`9`: población estable en `5` (`cambioPoblacion: 0`); con población `5` la
  necesidad (`1` agua, `1` comida) es cubierta exactamente por la producción degradada
  (`aguaProducida: 2`, remanente `1` entero via `floor`, `manzanasProducidas: 1`),
  `indiceCobertura: 1` en los tres ticks.
- `montoVenta === 0` en TODOS los ticks a partir del tick `1` (nunca hay excedente de manzanas
  para vender una vez que la población consume prioritariamente).
- `tesoreriaFinal.saldo === -56` (cae `-3`/tick por mantenimiento sin ingreso desde el tick 1).
- `poblacionFinal === 5`.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaPoblacionDinamica().historial[2]` -> `poblacionInicioTick: 11,
  cambioPoblacion: -2, poblacionFinTick: 9` (primer tick degradado, la población empieza a
  decrecer).
- `ejecutarCadenaPoblacionDinamica().poblacionFinal` -> `5`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar TODOS los módulos del Contrato 19 (`construir-nodo-con-costo`, `crear-almacen`,
  `agregar-stock-almacen`, `retirar-stock-almacen`, `resolver-viaje`,
  `resolver-compra-almacen`, `calcular-monto-venta`, `crear-tesoreria`, `registrar-ingreso`,
  `calcular-mantenimiento-total`, `aplicar-mantenimiento-tick`, `actualizar-contador-quiebra`,
  `esta-nodo-degradado`, `poblacion-total-casas`, `calcular-cobertura-necesidad`,
  `combinar-coberturas`, `calcular-crecimiento-poblacion`, `producir-tick-nodo`,
  `aplicar-degradacion-produccion`) — ninguna lógica se reimplementa.
- DO: aplicar `Math.floor` SOLO al remanente que va al almacén (`aguaRestante`,
  `manzanasRestantes`), nunca a la necesidad de la población ni a `aguaParaPoblacion`/
  `comidaParaPoblacion`.
- DO: recalcular la población AL FINAL de cada tick (con el índice de cobertura de ESE tick) y
  usar el nuevo valor recién en el tick SIGUIENTE — no dentro del mismo tick que la generó.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: modificar `ejecutar-cadena-completa-poblacion` (Contrato 19) — función independiente y
  nueva.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_poblacion_dinamica.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
