---
type: 'Task Contract'
title: 'Ejecución de cadena con mantenimiento condicionado al calendario'
description: 'Funcion de integracion que corre la cadena bomba-granja-comercio-tesoreria y aplica el mantenimiento periodico SOLO en dias laborales, primera regla economica real atada al calendario.'
tags: ['motor-calendario', 'motor-economia', 'flow-city', 'grid', 'tesoreria']

task: ejecutar-cadena-mantenimiento-calendario
intent: "Aplicar el mantenimiento periodico solo en ticks donde el calendario indica dia laboral, demostrando el primer efecto economico real del calendario."
target: src/ejecutarCadenaMantenimientoCalendario.js
signature: "function ejecutarCadenaMantenimientoCalendario()"
test_command: "node tests/test_ejecutar_cadena_mantenimiento_calendario.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_mantenimiento_calendario.js"
tests_sha256: "a63e6da229484b5146e56ccf779c1a60ad666bdcb8a429764e46ef6e0fc051b9"
touch_only: ['src/ejecutarCadenaMantenimientoCalendario.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena con mantenimiento condicionado al calendario

## Intent
Única pieza del [Contrato 27](../../specs/CONTRACT-27-mantenimiento-por-dia-laboral.md): el
Contrato 24 conectó [`calendario-de-tick`](./calendario-de-tick.md) a una cadena real, pero
explícitamente SIN cambiar ninguna regla económica ("solo trazabilidad"). Este contrato
construye esa primera regla real: el mantenimiento periódico
([`calcular-mantenimiento-total`](./calcular-mantenimiento-total.md) +
[`aplicar-mantenimiento-tick`](./aplicar-mantenimiento-tick.md)) se cobra ÚNICAMENTE cuando
`calendarioDeTick(tick).esLaboral === true` — en fin de semana se salta, sin acumularse ni
cobrarse doble después.

Mismo patrón económico del Contrato 12 (bomba→granja→almacenes→comercio→tesorería,
`crearNodoProductivo` con `produccionFija: 4` y ratio `1:2`, sin degradación ni construcción
con costo) corrido `8` ticks fijos (lunes a lunes), demostrando el ciclo semanal completo.

## Interface
```
function ejecutarCadenaMantenimientoCalendario()
```
Devuelve `{ historial, almacenBombaFinal, almacenGranjaFinal, tesoreriaFinal }`. `historial`
tiene `8` elementos.

## Invariants
- `historial.length === 8`.
- Producción y comercio son idénticos en TODOS los ticks (el calendario no los afecta):
  `aguaProducida: 4`, `aguaEnviada: 4`, `aguaRecibida: 4`, `manzanasProducidas: 8`,
  `manzanasCompradas: 8`, `montoVenta: 16`.
- `mantenimientoCobrado === true` en los ticks `0`-`4` y `7` (lunes a viernes, y el lunes
  siguiente); `mantenimientoCobrado === false` en los ticks `5`-`6` (sábado, domingo).
- `saldoTesoreria` sube `13`/tick en día laboral (`+16` venta `-3` mantenimiento) y `16`/tick en
  fin de semana (`+16` venta, sin mantenimiento): `13, 26, 39, 52, 65, 81, 97, 110`.
- `tesoreriaFinal.saldo === 110`.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaMantenimientoCalendario().historial[5]` -> `{ tick: 5, diaDeSemana: 'sabado',
  esLaboral: false, ..., mantenimientoCobrado: false, saldoTesoreria: 81 }` (fin de semana, sin
  mantenimiento, la tesorería sube `16` en vez de `13`).
- `ejecutarCadenaMantenimientoCalendario().tesoreriaFinal` -> `{ saldo: 110 }`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `crearNodoProductivo`, `crearAlmacen`, `producirTickNodoConAlmacen`, `retirarStockAlmacen`,
  `resolverViaje`, `resolverCompraAlmacen`, `calcularMontoVenta`, `crearTesoreria`,
  `registrarIngreso`, `calcularMantenimientoTotal`, `aplicarMantenimientoTick`,
  `calendarioDeTick` — ninguna lógica se reimplementa.
- DO: calcular `calendario.esLaboral` con `calendarioDeTick(tick)` al inicio de cada tick, y
  condicionar SOLO la llamada a `aplicarMantenimientoTick` a ese valor.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: condicionar producción o comercio al calendario — solo el mantenimiento, fuera de eso
  ninguna otra regla cambia en este contrato.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_mantenimiento_calendario.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
