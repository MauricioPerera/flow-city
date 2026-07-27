---
type: 'Task Contract'
title: 'Ejecución de producción de granja por nivel'
description: 'Funcion de integracion que calcula la produccion de una granja en los 3 niveles S/M/L con la misma agua recibida, demostrando que a mayor nivel mayor produccion.'
tags: ['motor-produccion', 'motor-economia', 'flow-city', 'nivel']

task: ejecutar-produccion-granja-por-nivel
intent: "Calcular la produccion de una granja en los 3 niveles con la misma agua recibida, demostrando el efecto del nivel en el rendimiento y el costo."
target: src/ejecutarProduccionGranjaPorNivel.js
signature: "function ejecutarProduccionGranjaPorNivel()"
test_command: "node tests/test_ejecutar_produccion_granja_por_nivel.js"
budget:
  max_cyclomatic_complexity: 6
  max_nesting_depth: 2
tests: "tests/test_ejecutar_produccion_granja_por_nivel.js"
tests_sha256: "1edfcda67e3fc059b6fd03f40a1d24f5da0d7000a623411fc145257bad58b9e2"
touch_only: ['src/ejecutarProduccionGranjaPorNivel.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de producción de granja por nivel

## Intent
Tercera y última pieza del [Contrato 35](../../specs/CONTRACT-35-nivel-de-granja.md): usa
[`calcular-factor-rendimiento-granja-por-nivel`](./calcular-factor-rendimiento-granja-por-nivel.md)
y [`calcular-costo-construccion-granja-por-nivel`](./calcular-costo-construccion-granja-por-nivel.md)
sobre la producción real de una granja ([`crear-nodo-productivo`](./crear-nodo-productivo.md) +
[`producir-tick-nodo`](./producir-tick-nodo.md), ratio `1:2`) recibiendo la MISMA agua (`4`) en
los 3 niveles, demostrando que a mayor nivel, mayor producción (y mayor costo) con idéntico
insumo.

## Interface
```
function ejecutarProduccionGranjaPorNivel()
```
Devuelve `{ historial }`. `historial` tiene 3 elementos, uno por nivel (`S`, `M`, `L`), cada uno
`{ nivel, aguaRecibida, rawManzanas, factor, manzanasProducidas, costoConstruccion }`.

## Invariants
- `historial.length === 3`, en el orden `S`, `M`, `L`.
- En los 3: `aguaRecibida === 4`, `rawManzanas === 8` (`calcularProduccion(4, 1, 2)`, idéntico
  sin importar el nivel — el nivel NO cambia el ratio de la receta, solo multiplica el
  resultado).
- `S`: `factor: 1`, `manzanasProducidas: 8`, `costoConstruccion: 30`.
- `M`: `factor: 2`, `manzanasProducidas: 16`, `costoConstruccion: 50`.
- `L`: `factor: 3`, `manzanasProducidas: 24`, `costoConstruccion: 80`.
- `manzanasProducidas === rawManzanas * factor` en los 3 casos.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarProduccionGranjaPorNivel().historial[2]` -> `{ nivel: 'L', aguaRecibida: 4,
  rawManzanas: 8, factor: 3, manzanasProducidas: 24, costoConstruccion: 80 }`.
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearNodoProductivo`, `producirTickNodo`,
  `calcularFactorRendimientoGranjaPorNivel` y `calcularCostoConstruccionGranjaPorNivel` — ninguna
  lógica de producción o de nivel se reimplementa.
- DO: calcular `rawManzanas` UNA sola vez por nivel con la receta base (`ratioEntrada:1,
  ratioSalida:2`), sin que el nivel altere la receta en sí — el nivel solo multiplica el
  resultado final.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir almacenes, comercio, tesorería real o degradación — fuera de alcance de este
  contrato (ya demostrados en otros).

## Tests
(Los tests están en `tests/test_ejecutar_produccion_granja_por_nivel.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
