---
type: 'Task Contract'
title: 'Ejecución de comercio con patrón "comprador viaja al bien"'
description: 'Funcion de integracion donde un comprador viaja por una ruta real hacia un comercio con aforo limitado; la venta se resuelve por el minimo entre demanda, stock y aforo.'
tags: ['motor-comercio', 'flow-city', 'grid', 'grafo', 'tesoreria']

task: ejecutar-comercio-comprador-viaja-al-bien
intent: "Resolver una venta local donde el comprador viaja por una ruta real hacia el comercio, limitada por el minimo entre demanda, stock disponible y aforo disponible."
target: src/ejecutarComercioCompradorViajaAlBien.js
signature: "function ejecutarComercioCompradorViajaAlBien()"
test_command: "node tests/test_ejecutar_comercio_comprador_viaja_al_bien.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_comercio_comprador_viaja_al_bien.js"
tests_sha256: "229f8790b25f436231aeec3e64a3f01cc178db52ad4c9fae0834f1b6da455a71"
touch_only: ['src/ejecutarComercioCompradorViajaAlBien.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de comercio con patrón "comprador viaja al bien"

## Intent
Única pieza del [Contrato 23](../../specs/CONTRACT-23-comercio-comprador-viaja-al-bien.md): el
segundo patrón de venta de `DEFINITION.md` (sección "Comercio y economía"), nunca antes
integrado — un comprador viaja por una ruta real
([`conectar-vertices`](./conectar-vertices.md) + [`resolver-viaje`](./resolver-viaje.md), tráfico
`personas`) hacia un comercio (ej. restaurante); la venta real se resuelve como el mínimo entre
las personas que llegan (demanda), el stock disponible del comercio y su
[`aforo-disponible`](./aforo-disponible.md) ([`resolver-venta-local`](./resolver-venta-local.md));
el monto ([`calcular-monto-venta`](./calcular-monto-venta.md)) se registra como ingreso real
([`registrar-ingreso`](./registrar-ingreso.md)) en tesorería.

Grid: casa en `(0,0)`, restaurante en `(1,0)`, conectados vértice `este`→`oeste` con un tramo
`carretera` tráfico `personas` de capacidad `20` (misma capacidad amplia usada en integraciones
previas para no introducir saturación fuera de alcance).

Valores fijados, elegidos para que el AFORO sea deliberadamente el cuello de botella (no la
demanda ni el stock — el factor distintivo de este patrón): `personasQueViajan: 10` →
`personasQueLlegan: 10` (sin saturación); `aforoMaximo: 6`, `ocupacionActual: 0` → `aforoDisp:
6`; `stockDisponible: 8`; `precioUnitario: 3`.

## Interface
```
function ejecutarComercioCompradorViajaAlBien()
```
Devuelve `{ personasQueViajan, personasQueLlegan, aforoMaximo, ocupacionActual, aforoDisp,
stockDisponible, ventaResuelta, precioUnitario, montoVenta, tesoreriaFinal }`.

## Invariants
- `personasQueViajan === 10` y `personasQueLlegan === 10` (ruta sin saturación, capacidad `20`
  >> `10`).
- `aforoMaximo === 6`, `ocupacionActual === 0`, `aforoDisp === 6`.
- `stockDisponible === 8`.
- `ventaResuelta === 6` (`Math.min(10, 8, 6)` — el aforo es el mínimo, no la demanda ni el
  stock).
- `precioUnitario === 3` y `montoVenta === 18` (`calcularMontoVenta(6, 3)`).
- `tesoreriaFinal` es `{ saldo: 18 }` (saldo inicial `0` + ingreso `18`).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarComercioCompradorViajaAlBien()` -> `{ personasQueViajan: 10, personasQueLlegan: 10,
  aforoMaximo: 6, ocupacionActual: 0, aforoDisp: 6, stockDisponible: 8, ventaResuelta: 6,
  precioUnitario: 3, montoVenta: 18, tesoreriaFinal: { saldo: 18 } }`
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `resolverViaje`, `aforoDisponible`, `resolverVentaLocal`, `calcularMontoVenta`,
  `crearTesoreria`, `registrarIngreso` — ninguna lógica de venta, aforo o ruta se reimplementa.
- DO: usar `crearTramo('carretera', 20, 1, 'personas')` explícitamente (tráfico `personas` no es
  fijo para `carretera`, a diferencia de `ferrocarril`/`subte`).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir producción, almacenes, degradación o crecimiento poblacional — fuera de
  alcance de este contrato (ya demostrados en otros).

## Tests
(Los tests están en `tests/test_ejecutar_comercio_comprador_viaja_al_bien.js` — oráculo
congelado, sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
