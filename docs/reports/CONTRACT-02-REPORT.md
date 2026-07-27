# CONTRACT-02 — Modelo de rutas: vértices y tramos — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-02-modelo-rutas.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 10 archivos) |
| Suite de tests | ✅ verde 2× (77 tests) | `node --test tests/test_*.js` — 77/77 ambas corridas, sin flaky |
| Test-command-gate | ✅ | `python scripts/validate_test_commands.py knowledge/contracts .` → `PASS` en los 10 contratos |

## T1 — Crear tramo

Entregado: `src/crearTramo.js` (`crearTramo(tipoRuta, capacidad, longitud, tipoTrafico)`).
Resolvió el hueco abierto en `DEFINITION.md`: ferrocarril fijo a `mercaderia`, subte fijo a
`personas` (no configurables); carretera y marítima configurables (default `ambos`) —
confirmado en conversación antes de escribir el contrato.

## T2 — Validar tráfico de tramo

Entregado: `src/tramoAdmiteTrafico.js` (`tramoAdmiteTrafico(tramo, tipoTraficoConsulta)`).
Consulta siempre de un tipo concreto (`mercaderia`/`personas`), nunca `ambos`.

## T3 — Conectar vértices

Entregado: `src/conectarVertices.js` (`conectarVertices(grafo, verticeA, verticeB, tramo)`).
Grafo como objeto plano `{ [vertice]: { [otroVertice]: tramo } }`; conexión bidireccional con
la misma referencia de tramo en ambos sentidos; duplicados y auto-conexión rechazados. Los
identificadores de vértice se trataron como strings opacos — el esquema de coordenadas real de
los vértices de la grilla queda como decisión pendiente para un contrato futuro que integre
grid y grafo de rutas.

## T4 — Pathfinding

Entregado: `src/encontrarRuta.js` (`encontrarRuta(grafo, origen, destino, tipoTrafico)`).
Dijkstra ponderado por `longitud` del tramo (no por cantidad de saltos), filtrando aristas con
`tramoAdmiteTrafico`. Caso trivial `origen === destino` resuelto sin excepción; destino
inalcanzable devuelve `null` en vez de lanzar error (es un resultado legítimo, no una entrada
inválida).

## Verificación final (independiente, tras cada implementación)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 10 archivos) — corrido tras cada una de las 4 implementaciones de este
  contrato.
- `python scripts/validate_test_commands.py knowledge/contracts .`: `PASS` en los 10 contratos,
  corrido tras cada implementación.
- Suite completa 2× consecutivas: 77/77 ambas, exit 0, sin discrepancia entre corridas.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real;
  se confirmó estado rojo contra el stub antes de implementar, en las 4 tareas.

## Pendientes / ítems de seguimiento

- El esquema de coordenadas de los vértices (si coinciden con las celdas del grid del Contrato
  01 o son sus intersecciones) sigue sin resolver — necesario antes de integrar grid y grafo de
  rutas en un contrato futuro.
- Fuera de alcance de este contrato: motor de tráfico por tick (uso real de `calcularSaturacion`
  sobre la carga acumulada de un tramo en el tiempo), tesorería, calendario, comercio.
- Ningún flaky detectado.
