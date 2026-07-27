---
type: 'Task Contract'
title: 'Ejecución del gasto de la fase de tiempo libre'
description: 'Funcion de integracion que corre el patron comprador-viaja-al-bien todos los dias de una semana (laborales y fin de semana por igual), acumulando el ingreso en tesoreria tick a tick.'
tags: ['motor-calendario', 'motor-comercio', 'flow-city', 'grid', 'tesoreria']

task: ejecutar-gasto-tiempo-libre
intent: "Ejecutar el gasto real de la poblacion en tiempo libre en cada tick de una semana, acumulando el ingreso en tesoreria."
target: src/ejecutarGastoTiempoLibre.js
signature: "function ejecutarGastoTiempoLibre()"
test_command: "node tests/test_ejecutar_gasto_tiempo_libre.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_ejecutar_gasto_tiempo_libre.js"
tests_sha256: "47775d639e9995d7fd5bcc33e73916bb7d4e396b0273f4f43dd8836f6d6870d7"
touch_only: ['src/ejecutarGastoTiempoLibre.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución del gasto de la fase de tiempo libre

## Intent
Única pieza del [Contrato 30](../../specs/CONTRACT-30-gasto-tiempo-libre.md): cierra el pendiente
que el Contrato 28 dejó explícito — `DEFINITION.md` dice que "en tiempo libre la población puede
gastar dinero". A diferencia del viaje laboral (Contrato 28, solo en días laborales), el gasto
en tiempo libre ocurre TODOS los días. Esta función reusa exactamente el patrón "comprador viaja
al bien" del [Contrato 23](./ejecutar-comercio-comprador-viaja-al-bien.md) (viaje real +
[`aforo-disponible`](./aforo-disponible.md) + [`resolver-venta-local`](./resolver-venta-local.md)
+ [`calcular-monto-venta`](./calcular-monto-venta.md) + [`registrar-ingreso`](./registrar-ingreso.md))
y lo repite en cada uno de `7` ticks (una semana), acumulando la tesorería.

Valores fijados (idénticos al Contrato 23, sin variación entre ticks): grid casa `(0,0)` /
restaurante `(1,0)`, tramo `carretera` tráfico `personas` capacidad `20`; `personasQueViajan:
10` → `personasQueLlegan: 10` (sin saturación); `aforoMaximo: 6`, `ocupacionActual: 0` →
`aforoDisp: 6`; `stockDisponible: 8` (re-abastecido cada tick, no modelado como almacén real);
`ventaResuelta: 6` (aforo es el cuello de botella, igual que en el Contrato 23);
`precioUnitario: 3` → `montoVenta: 18`/tick.

## Interface
```
function ejecutarGastoTiempoLibre()
```
Devuelve `{ historial, tesoreriaFinal }`. `historial` tiene `7` elementos, uno por tick.

## Invariants
- `historial.length === 7` (tick `0` a `6`, lunes a domingo).
- En TODOS los ticks (laboral o no): `personasQueViajan: 10`, `personasQueLlegan: 10`,
  `ventaResuelta: 6`, `montoVenta: 18` — idénticos, el gasto no depende del día de la semana.
- `saldoTesoreria` sube exactamente `18`/tick, acumulando: `18, 36, 54, 72, 90, 108, 126`.
- `tesoreriaFinal.saldo === 126` (`7 × 18`).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarGastoTiempoLibre().historial[5]` -> `{ tick: 5, diaDeSemana: 'sabado', ...,
  montoVenta: 18, saldoTesoreria: 108 }` (fin de semana, mismo gasto que un día laboral).
- `ejecutarGastoTiempoLibre().tesoreriaFinal` -> `{ saldo: 126 }`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `resolverViaje`, `aforoDisponible`, `resolverVentaLocal`, `calcularMontoVenta`,
  `crearTesoreria`, `registrarIngreso`, `calendarioDeTick` — ninguna lógica de venta, aforo o
  ruta se reimplementa.
- DO: construir el grid y la ruta UNA sola vez antes del loop; crear la tesorería UNA sola vez y
  acumular con `registrarIngreso` en cada tick (no recrearla).
- DO: incluir `diaDeSemana` en cada entrada del historial (vía `calendarioDeTick`) para
  trazabilidad, aunque el gasto no dependa de ese valor.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: condicionar el gasto en tiempo libre a `esLaboral` — a diferencia del viaje laboral del
  Contrato 28, esta fase ocurre todos los días por igual.

## Tests
(Los tests están en `tests/test_ejecutar_gasto_tiempo_libre.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
