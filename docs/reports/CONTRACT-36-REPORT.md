# CONTRACT-36 — Área de acción por nivel — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-36-area-de-accion-por-nivel.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 84 archivos) |
| Suite de tests | ✅ verde 2× (481 tests) | `node --test tests/test_*.js` — 481/481 ambas corridas, sin flaky |

Única excepción deliberada a la regla del proyecto de "cada dominio su propia tabla": el radio
de área de acción se comparte entre reforestación y tala, porque son un par complementario
(Contrato 38) que debe coincidir.

## Delegación

Dos tareas, **implementadas por `pool` (Poolside CLI)**, en secuencia (T2 depende de T1).
Ejecución autónoma, sin pausar entre tareas.

## T1 — Radio de área de acción por nivel

`src/radioAreaAccionPorNivel.js`. Tabla fija `{S:2, M:3, L:4}`, pasada directo a
`estaEnZonaInfluencia` (ya genérica, sin wrapper nuevo).

## T2 — Ejecutar área de acción por nivel

`src/ejecutarAreaAccionPorNivel.js`. Para un centro fijo `(5,5)` y los 3 niveles, verifica una
celda justo dentro del radio y otra justo fuera, demostrando que el mismo radio aplica
igual (mismo resultado) para "reforestación" y "tala".

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `4/4`, `2/2` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `estaEnZonaInfluencia.js` nunca tocado.
- Suite completa 2× consecutivas al cierre: 481/481 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- El área de acción todavía no está conectada a un ciclo de vida de árboles real (Contrato 37) ni
  a una integración de tala/reforestación completa (Contrato 38).
- Ningún flaky detectado.
