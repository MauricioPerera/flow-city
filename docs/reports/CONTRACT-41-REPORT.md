# CONTRACT-41 — Petróleo, refinería y almacén tipado — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-41-petroleo-refinería-almacen-tipado.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 103 archivos) |
| Suite de tests | ✅ verde 2× (541 tests) | `node --test tests/test_*.js` — 541/541 ambas corridas, sin flaky |

## Delegación

Cinco tareas, **implementadas por `pool` (Poolside CLI)**. T1 y T4 delegadas en paralelo
(independientes), T2 y T3 delegadas en paralelo tras verificar T1 (ambas la requieren), T5
(integración) al final. Ejecución autónoma, sin pausar entre tareas.

## T1-T3 — Almacén de petróleo (crear/agregar/retirar)

`src/crearAlmacenPetroleo.js`, `src/agregarStockAlmacenPetroleo.js`,
`src/retirarStockAlmacenPetroleo.js`. Gemelo estructural de `crearAlmacen`/
`agregarStockAlmacen`/`retirarStockAlmacen` (mismo patrón de 2 buffers), NO genérico a un
`tipo` arbitrario — `crudo`/`refinado` en vez de `materiaPrima`/`producto`.

## T4 — Es almacén incompatible

`src/esAlmacenIncompatible.js`. `true` solo entre `'petroleo'` y `'organico'` (en cualquier
orden); `false` para el mismo tipo consigo mismo.

## T5 — Ejecutar extracción y refino de petróleo

`src/ejecutarExtraccionRefinoPetroleo.js`. Extracción (`crearNodoProductivo` modo extracción,
igual patrón que la bomba de agua) → almacenamiento de crudo → refinería (`crearNodoProductivo`
modo receta) → almacenamiento de refinado; demuestra la incompatibilidad petróleo/orgánico
mediante el chequeo booleano, sin necesitar un intento real de mezcla física.

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `2/2`, `4/4`, `3/3`, `3/3`, `2/2` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `crearAlmacen.js`, `agregarStockAlmacen.js`, `retirarStockAlmacen.js`,
  `crearNodoProductivo.js` y `producirTickNodo.js` nunca tocados.
- Suite completa 2× consecutivas al cierre: 541/541 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- Industrias derivadas de petróleo (plásticos, tapizados, neumáticos, pegamentos, pinturas)
  quedan como trabajo futuro ad hoc — son solo nuevas instancias de receta sobre el modelo
  `crearNodoProductivo(MultiInsumo)` ya existente, sin primitivos nuevos.
- Combustible y su efecto en el tráfico vehicular es el Contrato 42.
- Ningún flaky detectado.
