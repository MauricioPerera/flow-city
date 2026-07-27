# Contrato 34 — Footprint de viviendas por nivel

Prerrequisitos: Contrato 33 (`puede-construir-flexible`, `asignar-nodo-celda`,
`colocar-nodo-flexible`). Segunda ronda de diseño conceptual (ver `DEFINITION.md`, sección
"Footprint vs. área de acción"): las casas son la única construcción cuyo footprint (celdas
físicamente ocupadas) crece con el nivel S/M/L, en vez de mantenerse fijo — S=2x2 (4 celdas),
M=3x2 (6 celdas), L=3x3 (9 celdas). La colocación debe ser atómica: si cualquier celda del
footprint falla (ocupada, terreno no válido, fuera de rango), no se coloca ninguna.

Decisión de diseño (documentada aquí, no preguntada al usuario, mismo patrón que otras
constantes ad hoc del proyecto): forma exacta del footprint M elegida como `3x2` (no `2x3`);
capacidad de población por nivel elegida como `{S:4, M:6, L:9}` (heurística de 1 persona por
celda de footprint).

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Celdas de casa por nivel

FIX/OBJETIVO: función pura `celdasDeCasaPorNivel(nivel, xAncla, yAncla)` en
`src/celdasDeCasaPorNivel.js`, con oráculo congelado en
`tests/test_celdas_de_casa_por_nivel.js`. Sin acceso a grid — solo geometría: devuelve el array
de `{x, y}` del footprint rectangular anclado en `(xAncla, yAncla)` como esquina superior
izquierda, según el nivel.

Task contract: `knowledge/contracts/celdas-de-casa-por-nivel.md`.

## T2 — Calcular capacidad de población de casa por nivel

FIX/OBJETIVO: función pura `calcularCapacidadPoblacionCasaPorNivel(nivel)` en
`src/calcularCapacidadPoblacionCasaPorNivel.js`, con oráculo congelado en
`tests/test_calcular_capacidad_poblacion_casa_por_nivel.js`. Tabla fija `{S:4, M:6, L:9}`.

Task contract: `knowledge/contracts/calcular-capacidad-poblacion-casa-por-nivel.md`.

## T3 — Colocar casa multi-celda

FIX/OBJETIVO: función `colocarCasaMultiCelda(grid, nivel, xAncla, yAncla, nodo)` en
`src/colocarCasaMultiCelda.js`, con oráculo congelado en
`tests/test_colocar_casa_multi_celda.js`. Compone T1 (geometría) +
[`puede-construir-flexible`](../knowledge/contracts/puede-construir-flexible.md) +
[`asignar-nodo-celda`](../knowledge/contracts/asignar-nodo-celda.md) (Contrato 33) en dos
pasadas: primero valida TODAS las celdas del footprint (terreno flexible para `residencial`,
sin mutar nada); recién si todas pasan, coloca en todas, compartiendo la MISMA referencia de
`nodo` en cada celda.

Task contract: `knowledge/contracts/colocar-casa-multi-celda.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_celdas_de_casa_por_nivel.js` exit 0.
- [ ] T2: `node tests/test_calcular_capacidad_poblacion_casa_por_nivel.js` exit 0.
- [ ] T3: `node tests/test_colocar_casa_multi_celda.js` exit 0.
- [ ] Final del contrato (T1-T3 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/celdasDeCasaPorNivel.js`,
  `tests/test_celdas_de_casa_por_nivel.js`, `knowledge/contracts/celdas-de-casa-por-nivel.md`. T2 →
  `src/calcularCapacidadPoblacionCasaPorNivel.js`,
  `tests/test_calcular_capacidad_poblacion_casa_por_nivel.js`,
  `knowledge/contracts/calcular-capacidad-poblacion-casa-por-nivel.md`. T3 →
  `src/colocarCasaMultiCelda.js`, `tests/test_colocar_casa_multi_celda.js`,
  `knowledge/contracts/colocar-casa-multi-celda.md`. Conjuntos disjuntos. NO tocar
  `src/puedeConstruirFlexible.js`, `src/asignarNodoCelda.js`, `src/obtenerCelda.js` ni
  `src/crearGrid.js` (Contrato 33/01, ya cerrados).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: la atomicidad de T3 (ninguna celda se coloca si alguna del footprint falla)
  resulta imposible de lograr sin una operación de "rollback" sobre `colocarNodo`/`asignarNodoCelda`
  → PARAR, documentar con evidencia, no forzar una colocación parcial silenciosa.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el diseño de T3 usa dos pasadas (validar todo antes de mutar cualquier
  cosa) precisamente para garantizar atomicidad sin necesitar rollback — verificado en el
  oráculo con un caso de celda ya ocupada y otro de footprint completo sobre agua.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
