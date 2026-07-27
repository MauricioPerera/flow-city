---
type: 'Task Contract'
title: 'Ejecución de cadena con cobertura de población conectada a producción real'
description: 'Funcion de integracion donde la poblacion toma su necesidad de agua y comida de la produccion real de la cadena bomba-granja antes que la granja/el comercio.'
tags: ['motor-integracion', 'motor-poblacion', 'motor-comercio', 'flow-city', 'produccion', 'grid', 'grafo']

task: ejecutar-cadena-poblacion-real
intent: "Conectar la cobertura de necesidades de poblacion a la produccion real de la cadena bomba-granja, con la poblacion tomando su necesidad antes que la granja y el comercio."
target: src/ejecutarCadenaConPoblacionReal.js
signature: "function ejecutarCadenaConPoblacionReal()"
test_command: "node tests/test_ejecutar_cadena_poblacion_real.js"
budget:
  max_cyclomatic_complexity: 12
  max_nesting_depth: 3
tests: "tests/test_ejecutar_cadena_poblacion_real.js"
tests_sha256: "c9a37a293bb023925730a18c6cf9b2b43bfd12e8e2cca88ac3fc4f68987ed6fe"
touch_only: ['src/ejecutarCadenaConPoblacionReal.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de cadena con cobertura de población conectada a producción real

## Intent
Cierra el ítem de seguimiento explícito del [Contrato 16](./ejecutar-poblacion-en-zona.md): la
cobertura de necesidades de población ya no usa suministros fijos, sino la producción REAL de
la cadena. Decisión confirmada en conversación antes de escribir este contrato: **población
primero** — toma su necesidad de agua directamente de lo que produce la bomba (antes de
enviarlo a la granja), y su necesidad de comida directamente de lo que produce la granja (antes
de vendérselo al comercio). El remanente de cada paso sigue el flujo normal.

Ver [DEFINITION.md](../../DEFINITION.md): "la población total implica cuánta gente puede
trabajar... impacta en la economía" — este contrato cierra el primer tramo real de ese loop
(producción → cobertura → crecimiento), sin almacenes ni degradación (ya demostrados en los
Contratos 11 y 15, fuera de este alcance).

## Interface
```
function ejecutarCadenaConPoblacionReal()
```
Devuelve un objeto con el detalle completo del tick (ver Invariants para cada campo).

## Invariants

Verificados a mano por el orquestador antes de escribir el oráculo:
- `poblacionInicial === 10` (1 casa).
- `aguaProducida === 4` (producción fija de la bomba).
- `aguaParaPoblacion === 2` (`min(poblacionInicial * 0.2, aguaProducida)` =
  `min(2, 4)`).
- `aguaEnviadaGranja === 2` y `aguaRecibidaGranja === 2` (el remanente, `4 - 2`, sin
  saturación real en la ruta).
- `manzanasProducidas === 4` (`calcularProduccion(2, 1, 2)`).
- `comidaParaPoblacion === 2` (`min(poblacionInicial * 0.2, manzanasProducidas)` =
  `min(2, 4)`).
- `manzanasVendidas === 2` (el remanente, `4 - 2`) y `montoVenta === 4`
  (`calcularMontoVenta(2, 2)`).
- `coberturaAgua === 1` y `coberturaComida === 1` (`calcularCoberturaNecesidad(2, 2)` en ambos
  casos — la producción real alcanza exactamente la necesidad de población en este escenario).
- `indiceCobertura === 1`, `cambioPoblacion === 1` (`Math.floor(calcularCrecimientoPoblacion(10,
  1, 0.1))`), `poblacionFinal === 11`, `manoDeObraDisponible === 11`.
- `saldoTesoreria === 4` (tesorería inicial `0` + `montoVenta`).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarCadenaConPoblacionReal()` -> el objeto completo descrito arriba, con
  `poblacionFinal: 11` y `saldoTesoreria: 4`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: calcular `aguaParaPoblacion`/`comidaParaPoblacion` con `Math.min` ANTES de enviar el
  remanente a la granja o venderlo al comercio.
- DO: reusar `crearGrid`, `colocarNodo` (o `construirCasaEnZona`), `verticeEntrada`,
  `crearTramo`, `conectarVertices`, `crearNodoProductivo`, `producirTickNodo`, `resolverViaje`,
  `resolverCompraAlmacen`, `calcularMontoVenta`, `crearTesoreria`, `registrarIngreso`,
  `poblacionTotalCasas`, `calcularCoberturaNecesidad`, `combinarCoberturas`,
  `calcularCrecimientoPoblacion`, `capacidadManoDeObra`.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir almacenes ni degradación en esta integración — fuera de alcance (ya
  cubiertos en los Contratos 11 y 15).

## Tests
(Los tests están en `tests/test_ejecutar_cadena_poblacion_real.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
