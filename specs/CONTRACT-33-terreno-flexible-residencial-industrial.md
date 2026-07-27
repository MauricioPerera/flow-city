# Contrato 33 — Terreno flexible para residencial/industrial

Prerrequisitos: Contrato 01 (`puede-construir`, `colocar-nodo`, `obtener-celda`). Segunda ronda
de diseño conceptual (ver `DEFINITION.md`, sección "Terreno flexible para vivienda e industria"):
las construcciones de vivienda e industria pueden construirse en cualquier terreno no acuático
(verde, elevado, neutro), sacrificando el uso especializado de esa celda — a diferencia de
`puedeConstruir`, cuya tabla de compatibilidad es una whitelist estricta por categoría
(`agricultura→['verde']`, `mineria→['elevada']`, etc.) que nunca se toca.

Categorías de construcción nuevas introducidas en este contrato (decisión del orquestador,
documentada en `DEFINITION.md`): `residencial` (viviendas) e `industrial` (fábricas) — no
colisionan con las 5 categorías existentes (`agricultura`, `reforestacion`, `mineria`, `pesca`,
`no_extractiva`).

Alcance: SOLO la regla de terreno flexible y la colocación de una construcción industrial de
celda única (footprint fijo). El footprint multi-celda de viviendas por nivel es el Contrato 34,
que reusa las piezas de este contrato.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Puede construir flexible

FIX/OBJETIVO: función pura `puedeConstruirFlexible(tipoTerreno, categoriaConstruccion)` en
`src/puedeConstruirFlexible.js`, con oráculo congelado en
`tests/test_puede_construir_flexible.js`. Para `categoriaConstruccion` en
`['residencial', 'industrial']`: acepta cualquier terreno excepto `agua_profunda`. Para
cualquier otra categoría: lanza `RangeError` (esta función NUNCA reemplaza a `puedeConstruir`
para categorías no flexibles — quien necesite esas, sigue usando `puedeConstruir` directo).

Task contract: `knowledge/contracts/puede-construir-flexible.md`.

## T2 — Asignar nodo a celda

FIX/OBJETIVO: función `asignarNodoCelda(grid, x, y, nodo)` en `src/asignarNodoCelda.js` — la
mitad de `colocarNodo` que NO depende del chequeo de terreno (ocupación + asignación
únicamente), para uso exclusivo del camino de colocación flexible (`colocarNodo` no es
separable: llama internamente a `puedeConstruir`, no a `puedeConstruirFlexible`).

## T3 — Colocar nodo flexible

FIX/OBJETIVO: función `colocarNodoFlexible(grid, x, y, categoriaConstruccion, nodo)` en
`src/colocarNodoFlexible.js` que compone T1 (validar terreno) + T2 (asignar) — el equivalente de
`colocarNodo` pero para categorías de terreno flexible, celda única. Usada directo por
industrial; reusada por el Contrato 34 para el footprint multi-celda de viviendas.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_puede_construir_flexible.js` exit 0.
- [ ] T2: `node tests/test_asignar_nodo_celda.js` exit 0.
- [ ] T3: `node tests/test_colocar_nodo_flexible.js` exit 0.
- [ ] Final del contrato (T1-T3 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/puedeConstruirFlexible.js`,
  `tests/test_puede_construir_flexible.js`, `knowledge/contracts/puede-construir-flexible.md`. T2 →
  `src/asignarNodoCelda.js`, `tests/test_asignar_nodo_celda.js`,
  `knowledge/contracts/asignar-nodo-celda.md`. T3 → `src/colocarNodoFlexible.js`,
  `tests/test_colocar_nodo_flexible.js`, `knowledge/contracts/colocar-nodo-flexible.md`.
  Conjuntos disjuntos. NO tocar `src/puedeConstruir.js`, `src/colocarNodo.js` ni
  `src/obtenerCelda.js`.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `colocarNodo` resulta ser separable de forma más simple que reimplementar su mitad
  de ocupación (`asignarNodoCelda`) → PARAR, documentar, no forzar una dependencia sobre el
  archivo frozen `colocarNodo.js` sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: confirmado que `colocarNodo.js` llama internamente a `puedeConstruir` (no
  parametrizable), por lo que el camino flexible necesita su propio mutador (T2), no puede
  reusar `colocarNodo` directo.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
