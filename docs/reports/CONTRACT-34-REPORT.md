# CONTRACT-34 — Footprint de viviendas por nivel — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-34-footprint-viviendas-por-nivel.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 79 archivos) |
| Suite de tests | ✅ verde 2× (465 tests) | `node --test tests/test_*.js` — 465/465 ambas corridas, sin flaky |

## Delegación

Tres tareas, **implementadas por `pool` (Poolside CLI)**. T1 y T2 delegadas en paralelo (sin
dependencia mutua), T3 delegada después de verificar T1 (T3 la requiere). Ejecución autónoma
según el plan aprobado, sin pausar entre tareas.

## T1 — Celdas de casa por nivel

`src/celdasDeCasaPorNivel.js`. Geometría pura: S=2x2, M=3x2, L=3x3, sin acceso a grid.

## T2 — Capacidad de población de casa por nivel

`src/calcularCapacidadPoblacionCasaPorNivel.js`. Tabla fija `{S:4, M:6, L:9}` (heurística de 1
persona por celda de footprint, decisión ad hoc documentada en el contrato).

## T3 — Colocar casa multi-celda

`src/colocarCasaMultiCelda.js`. Compone T1 + `puedeConstruirFlexible` + `asignarNodoCelda`
(Contrato 33) en dos pasadas (validar todo, luego commitear todo) para lograr atomicidad real
sin mecanismo de rollback — verificado con dos escenarios explícitos: celda ya ocupada, y
footprint completo sobre agua profunda; en ambos, ninguna celda queda mutada.

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `5/5`, `4/4`, `6/6` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `puedeConstruirFlexible.js`, `asignarNodoCelda.js`, `obtenerCelda.js` y
  `crearGrid.js` nunca tocados.
- Suite completa 2× consecutivas al cierre: 465/465 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- Sin integración con población real todavía (esta tarea es solo el footprint/capacidad — la
  conexión con el crecimiento poblacional dinámico queda para una integración futura, fuera de
  este roadmap por ahora).
- Ningún flaky detectado.
