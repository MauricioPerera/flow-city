---
type: 'Task Contract'
title: 'Ejecución de cadena con escasez real de producción'
description: 'Funcion de integracion donde la poblacion supera ampliamente la produccion disponible, forzando cobertura real por debajo de 1 y decrecimiento poblacional.'
tags: ['motor-integracion', 'motor-poblacion', 'flow-city', 'produccion', 'grid', 'grafo']

task: ejecutar-cadena-escasez
intent: "Ejercitar el caso de escasez real: poblacion mayor a la produccion disponible, con cobertura por debajo de 1 y decrecimiento poblacional resultante."
target: src/ejecutarCadenaConEscasez.js
signature: "function ejecutarCadenaConEscasez()"
test_command: "node tests/test_ejecutar_cadena_escasez.js"
budget:
  max_cyclomatic_complexity: 12
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_escasez.js"
tests_sha256: "f9189c9129b3dfd98c00ae860a6d0502d191a574d2db02064cc07c35a22589fc"
touch_only: ['src/ejecutarCadenaConEscasez.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena con escasez real de producción

## Intent
Extiende [`ejecutarCadenaConPoblacionReal`](./ejecutar-cadena-poblacion-real.md) (Contrato 17,
no modificada) al caso opuesto: población mucho mayor a la producción disponible. Misma regla
"población primero", pero acá la necesidad de agua (`40 * 0.2 = 8`) supera lo que produce la
bomba (`4`) — la población se queda con TODA el agua producida, no queda nada para la granja,
que en consecuencia no produce nada, dejando la necesidad de comida totalmente descubierta.
Cierra el ítem de seguimiento explícito del Contrato 17 (la condición de escasez nunca se
había disparado).

## Interface
```
function ejecutarCadenaConEscasez()
```
Devuelve el mismo shape de objeto que `ejecutarCadenaConPoblacionReal`.

## Invariants

Verificados a mano por el orquestador antes de escribir el oráculo:

- `poblacionInicial === 40` (4 casas × 10).
- `aguaProducida === 4`; `aguaParaPoblacion === 4` (`min(8, 4)` — la población agota toda el
  agua producida).
- `aguaEnviadaGranja === 0` y `aguaRecibidaGranja === 0` (no queda remanente; la llamada a
  `resolverViaje` se SALTEA cuando la cantidad a enviar es `0`, no se fuerza con `0`).
- `manzanasProducidas === 0` (sin agua recibida, la granja no produce nada).
- `comidaParaPoblacion === 0`; `manzanasVendidas === 0`; `montoVenta === 0` (la llamada a
  `calcularMontoVenta`/`registrarIngreso` se SALTEA cuando no hay nada vendido).
- `coberturaAgua === 0.5` (`4/8`); `coberturaComida === 0` (`0/8`).
- `indiceCobertura === 0` (mínimo de ambas).
- `cambioPoblacion === -4` (`Math.floor(calcularCrecimientoPoblacion(40, 0, 0.1))` =
  `Math.floor(-4)` = `-4` — decrecimiento real, no un artefacto de redondeo).
- `poblacionFinal === 36` (`40 - 4`); `manoDeObraDisponible === 36`.
- `saldoTesoreria === 0` (sin ninguna venta este tick).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaConEscasez()` -> el objeto completo descrito arriba, con `poblacionFinal: 36`
  (decreció respecto a `poblacionInicial: 40`).
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: saltear `resolverViaje` cuando `aguaEnviadaGranja === 0` (no llamarla con cantidad `0`,
  ya que `resolverViaje` exige un entero positivo).
- DO: saltear `calcularMontoVenta`/`registrarIngreso` cuando `manzanasVendidas === 0`.
- DO: reusar exactamente los mismos módulos que el Contrato 17
  (`crearGrid`, `colocarNodo`, `verticeEntrada`, `crearTramo`, `conectarVertices`,
  `crearNodoProductivo`, `producirTickNodo`, `resolverViaje`, `resolverCompraAlmacen`,
  `calcularMontoVenta`, `crearTesoreria`, `registrarIngreso`, `poblacionTotalCasas`,
  `calcularCoberturaNecesidad`, `combinarCoberturas`, `calcularCrecimientoPoblacion`,
  `capacidadManoDeObra`).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: modificar `src/ejecutarCadenaConPoblacionReal.js` (Contrato 17) — esta es una función
  independiente y nueva.

## Tests
(Los tests están en `tests/test_ejecutar_cadena_escasez.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
