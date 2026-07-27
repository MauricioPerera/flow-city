# CONTRACT-37 — Ciclo de vida del árbol — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-37-ciclo-de-vida-del-arbol.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 88 archivos) |
| Suite de tests | ✅ verde 2× (491 tests) | `node --test tests/test_*.js` — 491/491 ambas corridas, sin flaky |

## Delegación

Cuatro tareas, **implementadas por `pool` (Poolside CLI)**. T1 sola (fundacional), T2 depende
de T1, T3 y T4 delegadas en paralelo tras verificar T1+T2 (ambas solo dependen de esas dos).
Ejecución autónoma, sin pausar entre tareas.

## T1 — Crear estado de árboles

`src/crearEstadoArboles.js`. `Map` plano vacío, independiente del grid (mismo patrón que
`grafo` en `conectar-vertices`).

## T2 — Talar árbol

`src/talarArbol.js`. Transición Árbol→Tocón explícita; lanza `Error` si la celda no está en
estado Árbol.

## T3 — Avanzar ciclo de árbol un tick

`src/avanzarCicloArbolTick.js`. Transiciones automáticas por tiempo: Tocón→Limpio (`2` ticks),
Limpio→Árbol (`3` ticks); Árbol se mantiene indefinidamente.

## T4 — Tala produce en zona

`src/talaProduceEnZona.js`. `true` si al menos una celda de una lista dada está en estado
Árbol — condición de producción de la tala (Contrato 38 la usará).

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `2/2`, `3/3`, `2/2`, `3/3` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado.
- Suite completa 2× consecutivas al cierre: 491/491 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- El ciclo de vida todavía no está conectado a nodos reales de reforestación/tala con área de
  acción (Contrato 38 los combina).
- Los umbrales de temporización (`2`/`3` ticks) son una decisión ad hoc, no especificada por el
  usuario — documentada en el contrato, ajustable en un futuro rebalanceo.
- Ningún flaky detectado.
