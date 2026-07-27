# CONTRACT-39 — Reglas de elevación y terreno para rutas — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-39-elevacion-terreno-rutas.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 93 archivos) |
| Suite de tests | ✅ verde 2× (507 tests) | `node --test tests/test_*.js` — 507/507 ambas corridas, sin flaky |

## Delegación

Cuatro tareas, **implementadas por `pool` (Poolside CLI)**. T1, T2, T3 delegadas en paralelo
(independientes), T4 delegada tras verificar las tres (las combina). Ejecución autónoma, sin
pausar entre tareas.

## T1 — Plano de terreno

`src/planoDeTerreno.js`. El plano de elevación se DERIVA directo del terreno existente
(`'elevada'` → plano elevado, resto → base), sin introducir estado nuevo por celda.

## T2 — Ruta cruza terreno válido

`src/rutaCruzaTerrenoValido.js`. Carretera nunca sobre agua, marítima nunca sobre tierra,
ferrocarril/subte exentos.

## T3 — Ruta puede cambiar de plano

`src/rutaPuedeCambiarPlano.js`. Nivel S no puede cambiar de plano; M/L sí.

## T4 — Ejecutar conexión de ruta con elevación

`src/ejecutarConexionRutaConElevacion.js`. Combina las tres en 4 escenarios: carretera bloqueada
por agua (corte corto, sin importar nivel), carretera nivel S bloqueada por elevación, carretera
nivel M permitida a través de elevación, marítima bloqueada por tierra (corte corto incluso en
nivel L).

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `3/3`, `5/5`, `4/4`, `2/2` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `crearTramo.js`, `conectarVertices.js` y `encontrarRuta.js` nunca tocados.
- Suite completa 2× consecutivas al cierre: 507/507 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- Sin integración con el grafo real (`crearTramo`/`conectarVertices`/`encontrarRuta`) todavía —
  esta es una evaluación pura de reglas, no una conexión real sobre un grid.
- Terminales de subte/ferrocarril (mencionadas en `DEFINITION.md`) no requieren primitivo nuevo
  — ya son solo un vértice del grafo existente, exento por su propio `tipoRuta`.
- Ningún flaky detectado.
