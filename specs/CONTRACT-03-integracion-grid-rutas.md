# Contrato 03 — Integración grid ↔ grafo de rutas

Prerrequisitos: Contrato 01 (grid, celdas, nodos) y Contrato 02 (grafo de rutas, pathfinding)
completos. Hoy viven separados: el grafo de rutas usa strings opacos como identificador de
vértice, sin relación con las coordenadas reales de la grilla. Este contrato cierra ese hueco.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Identificador canónico de vértice

No existe todavía una forma canónica de nombrar un vértice a partir de coordenadas de la
grilla. Decisión confirmada en conversación antes de escribir este contrato: los vértices son
las **intersecciones/esquinas** de la grilla — una grilla de `ancho x alto` celdas tiene
`(ancho+1) x (alto+1)` vértices.

FIX/OBJETIVO: función pura `idVertice(x, y)` en `src/idVertice.js`, con oráculo congelado en
`tests/test_id_vertice.js`. Devuelve un identificador canónico y determinista a partir de dos
coordenadas enteras no negativas, compatible con el formato de vértice ya usado por
`conectarVertices`/`encontrarRuta` (string).

Task contract: `knowledge/contracts/id-vertice.md`.

## T2 — Vértices que rodean una celda

FIX/OBJETIVO: función que, dado `(x, y)` de una celda, devuelve los 4 vértices-esquina que la
rodean (noroeste, noreste, suroeste, sureste), usando `idVertice`.

## T3 — Vértice de entrada según rotación

Todavía no definida en detalle: falta resolver cómo la rotación de un nodo (que orienta su
"entrada") mapea a UNO de los 4 vértices-esquina de su celda — se resuelve al tomar esta tarea.

FIX/OBJETIVO: función que, dado `(x, y)` de una celda y la rotación del nodo colocado ahí,
determina a qué vértice concreto se conecta su entrada.

## Nota: T4 se retira de este contrato

"Motor de tráfico por tick" (uso real de `calcularSaturacion` sobre la carga acumulada de un
tramo a lo largo de ticks, integrando grid, grafo de rutas y calendario) resultó ser un
subsistema completo, no una tarea atómica — decisión tomada en conversación: pasa a ser su
propio contrato de ejecución futuro (`CONTRACT-04`), con su propio desglose en tareas. Este
contrato (03) cierra con T1-T3: integración grid↔grafo de rutas.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_id_vertice.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `id-vertice`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/idVertice.js`, `tests/test_id_vertice.js`,
  `knowledge/contracts/id-vertice.md` (conjunto disjunto de T2-T4, sin archivos asignados hasta
  que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el esquema de rotación de un nodo (T3) resulta ser continuo en vez de 4
  direcciones discretas → PARAR, documentar con evidencia en el reporte, no inventar la regla.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: coordenadas negativas o no enteras están en el oráculo antes de
  implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
