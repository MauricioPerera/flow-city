---
type: 'Task Contract'
title: 'Ejecución de la cadena completa: producción, comercio, tesorería y degradación'
description: 'Funcion de integracion final que combina construccion con costo, mantenimiento, comercio y degradacion progresiva sobre la cadena real bomba-granja.'
tags: ['motor-integracion', 'motor-economia', 'motor-comercio', 'flow-city', 'produccion', 'grid', 'grafo', 'tick', 'quiebra']

task: ejecutar-cadena-completa
intent: "Simular N ticks de la cadena completa bomba-granja-comercio con costos de construccion/mantenimiento reales y degradacion progresiva por quiebra."
target: src/ejecutarCadenaCompleta.js
signature: "function ejecutarCadenaCompleta(numTicks)"
test_command: "node tests/test_ejecutar_cadena_completa.js"
budget:
  max_cyclomatic_complexity: 20
  max_nesting_depth: 4
tests: "tests/test_ejecutar_cadena_completa.js"
tests_sha256: "f0b41e87e8dd74040e13509903f89a525a895f54bb70eb8f5f68b7bc92bd7fa2"
touch_only: ['src/ejecutarCadenaCompleta.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de la cadena completa: producción, comercio, tesorería y degradación

## Intent
Integración final del proyecto hasta la fecha: combina TODO lo construido en los Contratos 09
(cadena real), 10 (almacenes), 11 (integración con almacenes), 12 (comercio y tesorería), 13
(consecuencias de la quiebra) y 14 (costo de construcción/mantenimiento) en una sola
simulación. Ver [DEFINITION.md](../../DEFINITION.md) y
[specs/CONTRACT-15-integracion-completa-degradacion.md](../../specs/CONTRACT-15-integracion-completa-degradacion.md)
para el detalle completo del orden de operaciones y los valores fijados.

Esta función NO usa `producirTickNodoConAlmacen` directamente para bomba/granja: en su lugar
compone `producirTickNodo` (producción cruda) + `aplicarDegradacionProduccion` (aplica la
mitad si corresponde) + la lógica de almacén (chequeo de espacio + `agregarStockAlmacen`)
manualmente, porque la degradación debe aplicarse ANTES de chequear el espacio del almacén, y
`producirTickNodoConAlmacen` no tiene un punto de inyección para eso.

## Interface
```
function ejecutarCadenaCompleta(numTicks)
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal, tesoreriaFinal }`. `historial` es
un array de `numTicks` elementos `{ tick, degradado, aguaProducida, aguaEnviada, aguaRecibida,
manzanasProducidas, manzanasCompradas, montoVenta, montoMantenimiento, saldoTesoreria,
contadorQuiebra, bombaAlmacenLleno, granjaAlmacenLleno }`.

## Invariants

Verificados a mano por el orquestador antes de escribir el oráculo:
- Saldo inicial de tesorería `50`; costo de construcción total `80` (`50` bomba + `30`
  granja) — arranca en quiebra (`saldo: -30`) antes del primer tick, por sobre-construcción
  deliberada, no por un caso artificial.
- `umbralDegradacion: 2`. El contador de quiebra hereda su valor del FINAL del tick anterior
  (arranca en `0` antes del tick `0`); `degradado` de un tick se calcula con el contador
  heredado, ANTES de que ese mismo tick lo actualice.
- Ticks `0`-`1`: `degradado: false` (contador `< 2`), producción completa (`aguaProducida: 4`,
  `manzanasProducidas: 8`), saldo termina en `-17` y `-4` respectivamente.
- Ticks `2`-`6`: `degradado: true` (contador `>= 2`), producción a la mitad
  (`aguaProducida: 2`, `manzanasProducidas: 2`), saldo sube de a `+1` neto por tick
  (`-3, -2, -1, 0, 1`).
- Tick `6`: el saldo cruza a positivo (`1`) DESPUÉS de aplicarse mantenimiento, así que el
  contador de quiebra se reinicia a `0` — pero el tick `6` en sí seguía `degradado: true`
  (heredó contador `6` del tick `5`).
- Tick `7`: `degradado: false` (contador heredado `0` del final del tick `6`) — recuperación
  completa, producción vuelve a `4`/`8`, saldo termina en `14`.
- `bombaAlmacenLleno` y `granjaAlmacenLleno` son `false` en los 8 ticks (las capacidades
  fijadas nunca se saturan en este escenario, con o sin degradación).
- `numTicks` no entero o `<= 0`: lanza `RangeError`.

## Examples
- Tick `0` (sin degradar): `{ tick: 0, degradado: false, aguaProducida: 4, manzanasProducidas:
  8, saldoTesoreria: -17, contadorQuiebra: 1, ... }`.
- Tick `2` (recién degradado): `{ tick: 2, degradado: true, aguaProducida: 2,
  manzanasProducidas: 2, saldoTesoreria: -3, contadorQuiebra: 3, ... }`.
- Tick `7` (recuperado): `{ tick: 7, degradado: false, aguaProducida: 4, manzanasProducidas: 8,
  saldoTesoreria: 14, contadorQuiebra: 0, ... }`.
- La tabla completa tick-a-tick (los 8 ticks, campo por campo) está en el oráculo congelado
  (`tests/test_ejecutar_cadena_completa.js`, constante `ESPERADO`).

## Do / Don't
- DO: seguir EXACTAMENTE el orden de operaciones fijado en el contrato de ejecución (degradado
  primero, producción bomba, envío, producción granja, venta, mantenimiento, actualizar
  contador — en ese orden).
- DO: reusar `crearGrid`, `colocarNodo` (vía `construirNodoConCosto`), `verticeEntrada`,
  `crearTramo`, `conectarVertices`, `crearNodoProductivo`, `crearAlmacen`, `producirTickNodo`,
  `aplicarDegradacionProduccion`, `agregarStockAlmacen`, `retirarStockAlmacen`,
  `resolverViaje`, `resolverCompraAlmacen`, `calcularMontoVenta`, `crearTesoreria`,
  `registrarIngreso`, `calcularMantenimientoTotal`, `aplicarMantenimientoTick`,
  `actualizarContadorQuiebra`, `estaNodoDegradado`, `construirNodoConCosto`.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: modificar ninguna integración anterior (Contratos 09, 11, 12) — esta es una función
  independiente y nueva.
- DON'T: calcular `degradado` con el contador YA actualizado de este mismo tick — debe usar el
  heredado del tick anterior.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_completa.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
