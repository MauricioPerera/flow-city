# CONTRACT-03 — Integración grid ↔ grafo de rutas — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-03-integracion-grid-rutas.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 13 archivos) |
| Suite de tests | ✅ verde 2× (95 tests) | `node --test tests/test_*.js` — 95/95 ambas corridas, sin flaky |
| Test-command-gate | ✅ | `python scripts/validate_test_commands.py knowledge/contracts .` → `PASS` en los 13 contratos |

## T1 — Identificador canónico de vértice

Entregado: `src/idVertice.js` (`idVertice(x, y)`). Formato `` `${x},${y}` ``, determinístico e
inyectivo para coordenadas enteras no negativas. Es el puente entre las coordenadas de la
grilla (Contrato 01) y los identificadores de vértice opacos que ya consumían
`conectarVertices`/`encontrarRuta` (Contrato 02).

## T2 — Vértices que rodean una celda

Entregado: `src/verticesDeCelda.js` (`verticesDeCelda(x, y)`). Confirmó en conversación el
esquema de vértices: intersecciones/esquinas de la grilla (`(ancho+1) x (alto+1)` vértices para
una grilla de `ancho x alto` celdas), no centros de celda.

## T3 — Vértice de entrada según rotación

Entregado: `src/verticeEntrada.js` (`verticeEntrada(x, y, rotacion)`). Resolvió la ambigüedad de
qué esquina exacta usa la entrada de un nodo según su dirección (cada lado de la celda tiene 2
esquinas candidatas): convención horaria confirmada en conversación — `norte→noreste`,
`este→sureste`, `sur→suroeste`, `oeste→noroeste`.

## T4 retirado de este contrato

"Motor de tráfico por tick" resultó ser un subsistema completo, no una tarea atómica —
decidido en conversación antes de construir nada. Pasa a ser su propio contrato de ejecución
futuro (`CONTRACT-04`), con su propio desglose en tareas atómicas.

## Verificación final (independiente, tras cada implementación)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 13 archivos) — corrido tras cada una de las 3 implementaciones de este
  contrato.
- `python scripts/validate_test_commands.py knowledge/contracts .`: `PASS` en los 13 contratos,
  corrido tras cada implementación.
- Suite completa 2× consecutivas: 95/95 ambas, exit 0, sin discrepancia entre corridas.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real;
  se confirmó estado rojo contra el stub antes de implementar, en las 3 tareas.

## Pendientes / ítems de seguimiento

- `CONTRACT-04` (motor de tráfico por tick): integrar `calcularSaturacion` con carga acumulada
  real por tramo a lo largo del tiempo, resolución de múltiples viajes simultáneos, y las 3
  fases del día (trabajo/sueño/tiempo libre) del calendario de `DEFINITION.md`. Sin desglosar
  todavía en tareas atómicas.
- Fuera de alcance de este contrato (sigue igual que en reportes previos): tesorería,
  calendario completo, comercio.
- Ningún flaky detectado.
