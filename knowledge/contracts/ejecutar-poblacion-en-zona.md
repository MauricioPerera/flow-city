---
type: 'Task Contract'
title: 'Ejecución de población conectada al grid real'
description: 'Funcion de integracion que arma un centro civico con casas dentro y fuera de zona, calcula poblacion total, cobertura de necesidades y un tick de crecimiento.'
tags: ['motor-integracion', 'motor-poblacion', 'flow-city', 'grid', 'zona-influencia']

task: ejecutar-poblacion-en-zona
intent: "Simular la construccion de casas en zona de influencia, calcular poblacion total, cobertura de necesidades con suministros fijos, y un tick de crecimiento poblacional y mano de obra."
target: src/ejecutarPoblacionEnZona.js
signature: "function ejecutarPoblacionEnZona()"
test_command: "node tests/test_ejecutar_poblacion_en_zona.js"
budget:
  max_cyclomatic_complexity: 10
  max_nesting_depth: 3
tests: "tests/test_ejecutar_poblacion_en_zona.js"
tests_sha256: "5674bb2d3d9bfd6a1adb24701172470fa555f30c3a164909bfe25e4a5067c327"
touch_only: ['src/ejecutarPoblacionEnZona.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de población conectada al grid real

## Intent
Tercera y última pieza del [Contrato 16](../../specs/CONTRACT-16-poblacion-grid-real.md):
integra [`construirCasaEnZona`](./construir-casa-en-zona.md),
[`poblacionTotalCasas`](./poblacion-total-casas.md),
[`calcularCoberturaNecesidad`](./calcular-cobertura-necesidad.md),
[`combinarCoberturas`](./combinar-coberturas.md),
[`calcularCrecimientoPoblacion`](./calcular-crecimiento-poblacion.md) y
[`capacidadManoDeObra`](./capacidad-mano-de-obra.md) en un escenario real de un solo tick.

Valores fijados (constantes internas): grid `crearGrid(4, 4, 'neutra')`; centro cívico en
`(1,1)` con `radio: 1`; casa 1 en `(0,0)` (dentro, distancia `1`); casa 2 en `(2,1)` (dentro,
justo en el borde, distancia `1`); intento de casa 3 en `(3,3)` (fuera, distancia `2`) —
`construirCasaEnZona` la rechaza, el intento se captura y se cuenta como
`casaFueraDeZonaRechazada: true` sin interrumpir el resto. Cada casa construida aporta
`10` de población. Suministros fijos de necesidades: agua disponible `15`, comida disponible
`25` (requerido de cada una es `poblacionInicial * 1`). `tasaBase` de crecimiento: `0.1`.
`esLaboral` fijo en `true` (sin integrar calendario todavía, alcance del Contrato 16).

## Interface
```
function ejecutarPoblacionEnZona()
```
Devuelve `{ poblacionInicial, casasConstruidas, casaFueraDeZonaRechazada, coberturaAgua,
coberturaComida, indiceCobertura, cambioPoblacion, poblacionFinal, manoDeObraDisponible }`.

## Invariants

Verificados a mano por el orquestador antes de escribir el oráculo:
- `poblacionInicial === 20` (2 casas × `10`).
- `casasConstruidas === 2`, `casaFueraDeZonaRechazada === true`.
- `coberturaAgua === 0.75` (`15/20`), `coberturaComida === 1` (`25/20` capado en `1`).
- `indiceCobertura === 0.75` (mínimo de ambas).
- `cambioPoblacion === 1` (`Math.floor(calcularCrecimientoPoblacion(20, 0.75, 0.1))`, que da
  exactamente `1.0`).
- `poblacionFinal === 21` (`20 + 1`).
- `manoDeObraDisponible === 21` (`capacidadManoDeObra(21, true)`).
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarPoblacionEnZona()` -> `{ poblacionInicial: 20, casasConstruidas: 2,
  casaFueraDeZonaRechazada: true, coberturaAgua: 0.75, coberturaComida: 1, indiceCobertura:
  0.75, cambioPoblacion: 1, poblacionFinal: 21, manoDeObraDisponible: 21 }`
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`), sin variación entre
  corridas.

## Do / Don't
- DO: capturar (try/catch) el rechazo de la casa fuera de zona — no dejar que interrumpa el
  resto de la integración.
- DO: reusar TODAS las funciones listadas en el Intent, sin reimplementar su lógica.
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: conectar la cobertura de necesidades a la producción real de la cadena bomba-granja —
  fuera de alcance de este contrato (ver condición de aborto en
  `specs/CONTRACT-16-poblacion-grid-real.md`).

## Tests
(Los tests están en `tests/test_ejecutar_poblacion_en_zona.js` — oráculo congelado, sellado por
`tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
