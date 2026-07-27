---
type: 'Task Contract'
title: 'Ejecución de conexión de ruta con elevación'
description: 'Funcion de integracion que evalua 4 escenarios fijos combinando el chequeo de terreno fisico y el chequeo de elevacion por nivel para decidir si una conexion de ruta es valida.'
tags: ['motor-rutas', 'motor-integracion', 'flow-city', 'elevacion', 'nivel']

task: ejecutar-conexion-ruta-con-elevacion
intent: "Evaluar 4 escenarios fijos que combinan terreno fisico y elevacion por nivel para decidir si una conexion de ruta es valida."
target: src/ejecutarConexionRutaConElevacion.js
signature: "function ejecutarConexionRutaConElevacion()"
test_command: "node tests/test_ejecutar_conexion_ruta_con_elevacion.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_ejecutar_conexion_ruta_con_elevacion.js"
tests_sha256: "b1d6f5c6b379724f4d367d4ef019f80ccc197a153eea8d79ab78c47a7ea11180"
touch_only: ['src/ejecutarConexionRutaConElevacion.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Ejecución de conexión de ruta con elevación

## Intent
Cuarta y última pieza del [Contrato 39](../../specs/CONTRACT-39-elevacion-terreno-rutas.md):
combina [`plano-de-terreno`](./plano-de-terreno.md) +
[`ruta-cruza-terreno-valido`](./ruta-cruza-terreno-valido.md) +
[`ruta-puede-cambiar-plano`](./ruta-puede-cambiar-plano.md) en 4 escenarios fijos que demuestran,
de punta a punta, cuándo una conexión de ruta es válida: primero el terreno físico (agua/tierra),
y solo si eso pasa, la elevación (mismo plano siempre válido; distinto plano depende del nivel).

## Interface
```
function ejecutarConexionRutaConElevacion()
```
Devuelve `{ escenarios }`. `escenarios` tiene 4 elementos, cada uno `{ nombre, nivel, tipoRuta,
terrenoOrigen, terrenoDestino, terrenoValido, planoOrigen, planoDestino, mismoPlano,
puedeCambiarPlano, conexionPermitida }`.

## Invariants
- `escenarios.length === 4`, en este orden: `carretera-bloqueada-por-agua`,
  `carretera-nivel-S-no-cambia-plano`, `carretera-nivel-M-si-cambia-plano`,
  `maritima-bloqueada-por-tierra`.
- `carretera-bloqueada-por-agua` (nivel `S`, `verde→agua_profunda`): `terrenoValido: false` →
  `conexionPermitida: false` (el terreno inválido corta corto, sin importar plano/nivel).
- `carretera-nivel-S-no-cambia-plano` (nivel `S`, `verde→elevada`): `terrenoValido: true`,
  `mismoPlano: false`, `puedeCambiarPlano: false` → `conexionPermitida: false`.
- `carretera-nivel-M-si-cambia-plano` (nivel `M`, `verde→elevada`): `terrenoValido: true`,
  `mismoPlano: false`, `puedeCambiarPlano: true` → `conexionPermitida: true`.
- `maritima-bloqueada-por-tierra` (nivel `L`, `agua_profunda→verde`): `terrenoValido: false` →
  `conexionPermitida: false` (aunque `puedeCambiarPlano` sea `true` para nivel `L`, el terreno
  inválido corta corto igual).
- Regla general de `conexionPermitida`: si `terrenoValido` es `false`, siempre `false`; si es
  `true` y `mismoPlano` es `true`, siempre `true`; si es `true` y `mismoPlano` es `false`,
  igual a `puedeCambiarPlano`.
- El resultado es determinístico entre corridas.

## Examples
- `ejecutarConexionRutaConElevacion().escenarios[2].conexionPermitida` -> `true` (nivel M cambia
  de plano).
- `ejecutarConexionRutaConElevacion().escenarios[3].conexionPermitida` -> `false` (marítima
  sobre tierra, sin importar el nivel).
- Dos llamadas consecutivas devuelven el mismo objeto (`deepEqual`).

## Do / Don't
- DO: reusar `planoDeTerreno`, `rutaCruzaTerrenoValido` y `rutaPuedeCambiarPlano` — ninguna
  lógica de terreno o elevación se reimplementa.
- DO: aplicar la regla en el orden correcto: terreno físico PRIMERO (corte corto si inválido),
  elevación DESPUÉS (solo si el terreno ya es válido).
- DON'T: usar red, `require` de paquetes externos (salvo los módulos hermanos ya listados), ni
  acceso a estado global.
- DON'T: introducir `crearTramo`/`conectarVertices` reales — esta es una evaluación pura de
  reglas, sin grafo real (la integración con el grafo real queda para un contrato futuro si hace
  falta).

## Tests
(Los tests están en `tests/test_ejecutar_conexion_ruta_con_elevacion.js` — oráculo congelado,
sellado por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
