---
type: 'Task Contract'
title: 'Ejecución del taller de tala (receta multi-insumo real)'
description: 'Funcion de integracion que arma el taller de tala real de DEFINITION.md (agua+comida+personas->madera), con personas como el insumo deliberadamente mas escaso.'
tags: ['motor-integracion', 'flow-city', 'produccion']

task: ejecutar-taller-de-tala
intent: "Ejecutar el taller de tala real (agua+comida+personas->madera), demostrando el cuello de botella cuando un insumo (personas) es el mas escaso."
target: src/ejecutarTallerDeTala.js
signature: "function ejecutarTallerDeTala()"
test_command: "node tests/test_ejecutar_taller_de_tala.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_taller_de_tala.js"
tests_sha256: "2ed37c2fdf29cd8a7660b237672d0862b33f0fdbd3a1a76cedc37704f37210a4"
touch_only: ['src/ejecutarTallerDeTala.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución del taller de tala (receta multi-insumo real)

## Intent
Tercera y última pieza del [Contrato 21](../../specs/CONTRACT-21-recetas-multi-insumo.md):
cierra el límite documentado en el Contrato 20 — el taller de tala real de `DEFINITION.md`
(agua + comida + personas → madera) ahora es posible usando
[`crearNodoProductivoMultiInsumo`](./crear-nodo-productivo-multi-insumo.md) +
[`producirTickNodoMultiInsumo`](./producir-tick-nodo-multi-insumo.md).

Valores fijados (constantes internas): receta `agua: ratioEntrada 1`, `comida: ratioEntrada
1`, `personas: ratioEntrada 2`, `ratioSalida: 1`. Cantidades recibidas: `agua: 10`, `comida:
10`, `personas: 6` — elegidas para que `personas` sea deliberadamente el insumo más escaso
(`agua` y `comida` alcanzarían para `10` tandas cada uno, `personas` solo para `3`),
demostrando el cuello de botella, no solo el camino feliz donde todos los insumos alcanzan
igual.

## Interface
```
function ejecutarTallerDeTala()
```
Devuelve `{ agua, comida, personas, tandasAgua, tandasComida, tandasPersonas,
tandasProducidas, maderaProducida }`.

## Invariants
- `agua === 10`, `comida === 10`, `personas === 6` (cantidades fijadas).
- `tandasAgua === 10` (`floor(10/1)`), `tandasComida === 10` (`floor(10/1)`),
  `tandasPersonas === 3` (`floor(6/2)`).
- `tandasProducidas === 3` (el mínimo de las tres, `personas` es el cuello de botella).
- `maderaProducida === 3` (`tandasProducidas * ratioSalida`, con `ratioSalida: 1`).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarTallerDeTala()` -> `{ agua: 10, comida: 10, personas: 6, tandasAgua: 10,
  tandasComida: 10, tandasPersonas: 3, tandasProducidas: 3, maderaProducida: 3 }`
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `crearNodoProductivoMultiInsumo` y `producirTickNodoMultiInsumo` — ninguna lógica
  de bottleneck se reimplementa acá.
- DO: reportar las tandas individuales de cada insumo, no solo el resultado final, para que el
  oráculo pueda verificar POR QUÉ el resultado es el que es.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir grid, rutas, almacenes, comercio o tesorería — fuera de alcance de este
  contrato (ya demostrados en otras integraciones).

## Tests
(Los tests están en `tests/test_ejecutar_taller_de_tala.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
