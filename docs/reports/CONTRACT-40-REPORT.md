# CONTRACT-40 — Rutas escaladas por nivel — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-40-rutas-escaladas-por-nivel.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 98 archivos) |
| Suite de tests | ✅ verde 2× (527 tests) | `node --test tests/test_*.js` — 527/527 ambas corridas, sin flaky |

## Delegación

Cinco tareas, **implementadas por `pool` (Poolside CLI)**. T1 y T3 delegadas en paralelo
(independientes), T2 y T4 delegadas en paralelo tras verificar T1/T3 respectivamente, T5
(integración) al final. Ejecución autónoma, sin pausar entre tareas.

## T1 — Tolerancia de saturación de ruta por nivel

`src/calcularToleranciaSaturacionRutaPorNivel.js`. Tabla propia `{S:1, M:2, L:3}` (no
compartida con `calcular-factor-rendimiento-granja-por-nivel` aunque los números coincidan).

## T2 — Crear tramo con nivel

`src/crearTramoConNivel.js`. Compone `crearTramo` (sin editar) con la capacidad escalada por T1.

## T3 — Costo de construcción de ruta por nivel

`src/calcularCostoConstruccionRutaPorNivel.js`. Tabla propia `{S:20, M:40, L:70}`.

## T4 — Costo de mejora de nivel de ruta

`src/calcularCostoMejoraNivelRuta.js`. Diferencia de costo entre niveles; lanza `RangeError` si
se intenta degradar o "mejorar" al mismo nivel.

## T5 — Ejecutar ruta escalada por nivel

`src/ejecutarRutaEscaladaPorNivel.js`. Con capacidad base `10`: capacidad `10/20/30` para
`S/M/L`; costo `20/40/70`; mejoras `S→M:20`, `M→L:30`, `S→L:50`; confirma que degradar (`M→S`)
lanza error.

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `4/4`, `5/5`, `4/4`, `5/5`, `2/2` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `crearTramo.js` nunca tocado.
- Suite completa 2× consecutivas al cierre: 527/527 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- Sin integración con el grafo real (`conectarVertices`/`encontrarRuta`) todavía — esta es una
  demostración pura de escalado por nivel, no una ruta conectada a un grid real.
- Ningún flaky detectado.
