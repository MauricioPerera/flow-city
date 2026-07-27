# Contrato 02 — Modelo de rutas: vértices y tramos

Prerrequisitos: Contrato 01 completo (grid, celdas, colocación de nodos, saturación). El grid
modela celdas y nodos, pero no las rutas que conectan vértices entre sí. Este contrato agrega
esa capa.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Crear tramo

No existe todavía ninguna estructura de tramo de ruta. `DEFINITION.md` define 4 tipos de ruta
(carretera, ferrocarril, marítima, subte) con restricciones de tráfico distintas: ferrocarril
es fijo a mercadería, subte es fijo a personas; carretera y marítima son configurables
(mercadería/personas/ambos, default ambos) — confirmado en conversación antes de escribir este
contrato.

FIX/OBJETIVO: función pura `crearTramo(tipoRuta, capacidad, longitud, tipoTrafico)` en
`src/crearTramo.js`, con oráculo congelado en `tests/test_crear_tramo.js`. Invariante que no
puede cambiar: ferrocarril y subte rechazan cualquier `tipoTrafico` explícito que contradiga su
tipo fijo.

Task contract: `knowledge/contracts/crear-tramo.md`.

## T2 — Validar tráfico de tramo

FIX/OBJETIVO: función que, dado un tramo y un tipo de tráfico (mercadería o personas),
determina si ese tramo lo admite según su `tipoTrafico`.

## T3 — Conectar vértices

FIX/OBJETIVO: registrar un tramo entre dos vértices dados en una estructura de grafo de rutas.

## T4 — Pathfinding

FIX/OBJETIVO: cálculo de ruta automática entre dos vértices, acotado a los tramos realmente
disponibles y su tipo de tráfico permitido. Pieza más compuesta del contrato; depende de T1-T3.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_crear_tramo.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `crear-tramo`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/crearTramo.js`, `tests/test_crear_tramo.js`,
  `knowledge/contracts/crear-tramo.md` (conjunto disjunto de T2-T4, sin archivos asignados
  hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: aparece un quinto tipo de ruta o una combinación tipo-tráfico no contemplada en
  `DEFINITION.md` → PARAR, documentar con evidencia en el reporte, no inventar la regla.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en Contrato 01, sin cambios de entorno
  para este contrato.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: casos de contradicción (`ferrocarril` + `tipoTrafico: 'personas'`,
  `subte` + `tipoTrafico: 'ambos'`) están en el oráculo antes de implementar.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
