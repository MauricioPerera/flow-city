# Contrato 39 — Reglas de elevación y terreno para rutas

Prerrequisitos: ninguno de los contratos previos de rutas (Contrato 02/04) tiene conciencia de
terreno. Segunda ronda de diseño conceptual (ver `DEFINITION.md`, sección "Elevación y niveles
de ruta"): carretera nunca puede cruzar agua profunda; marítima nunca puede cruzar tierra; una
ruta de nivel S solo conecta dentro del mismo plano de elevación, M/L pueden cambiar de plano;
subte/ferrocarril quedan exentos de ambas reglas.

Decisión de diseño (aditiva, sin tocar `crearTramo.js`/`conectarVertices.js`/`encontrarRuta.js`):
el plano de elevación se DERIVA directamente del terreno (`elevada` = plano elevado; todo lo
demás = plano base) — no se introduce ningún estado nuevo por celda, evitando la necesidad de un
Map paralelo para esto (a diferencia del ciclo de vida de árboles del Contrato 37, que sí lo
necesitaba).

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Plano de terreno

FIX/OBJETIVO: función pura `planoDeTerreno(tipoTerreno)` en `src/planoDeTerreno.js`, con
oráculo congelado en `tests/test_plano_de_terreno.js`. `'elevada'` -> `'elevada'`; cualquier
otro terreno válido -> `'base'`.

Task contract: `knowledge/contracts/plano-de-terreno.md`.

## T2 — Ruta cruza terreno válido

FIX/OBJETIVO: función pura `rutaCruzaTerrenoValido(terrenoOrigen, terrenoDestino, tipoRuta)` en
`src/rutaCruzaTerrenoValido.js`, con oráculo congelado en
`tests/test_ruta_cruza_terreno_valido.js`. Carretera: `false` si algún extremo es
`agua_profunda`. Marítima: `false` si algún extremo NO es `agua_profunda`. Ferrocarril/subte:
siempre `true` (exentos).

Task contract: `knowledge/contracts/ruta-cruza-terreno-valido.md`.

## T3 — Ruta puede cambiar de plano

FIX/OBJETIVO: función pura `rutaPuedeCambiarPlano(nivelRuta)` en
`src/rutaPuedeCambiarPlano.js`, con oráculo congelado en
`tests/test_ruta_puede_cambiar_plano.js`. `'S'` -> `false`; `'M'`/`'L'` -> `true`.

Task contract: `knowledge/contracts/ruta-puede-cambiar-plano.md`.

## T4 — Ejecutar conexión de ruta con elevación

FIX/OBJETIVO: función `ejecutarConexionRutaConElevacion()` (sin parámetros) en
`src/ejecutarConexionRutaConElevacion.js`, con oráculo congelado en
`tests/test_ejecutar_conexion_ruta_con_elevacion.js`. Evalúa 4 escenarios fijos combinando T1+T2+T3:
carretera bloqueada por agua; carretera nivel S que NO puede cambiar de plano; carretera nivel M
que SÍ puede; marítima bloqueada por tierra.

Task contract: `knowledge/contracts/ejecutar-conexion-ruta-con-elevacion.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_plano_de_terreno.js` exit 0.
- [ ] T2: `node tests/test_ruta_cruza_terreno_valido.js` exit 0.
- [ ] T3: `node tests/test_ruta_puede_cambiar_plano.js` exit 0.
- [ ] T4: `node tests/test_ejecutar_conexion_ruta_con_elevacion.js` exit 0.
- [ ] Final del contrato (T1-T4 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/planoDeTerreno.js`, `tests/test_plano_de_terreno.js`,
  `knowledge/contracts/plano-de-terreno.md`. T2 → `src/rutaCruzaTerrenoValido.js`,
  `tests/test_ruta_cruza_terreno_valido.js`,
  `knowledge/contracts/ruta-cruza-terreno-valido.md`. T3 → `src/rutaPuedeCambiarPlano.js`,
  `tests/test_ruta_puede_cambiar_plano.js`, `knowledge/contracts/ruta-puede-cambiar-plano.md`.
  T4 → `src/ejecutarConexionRutaConElevacion.js`,
  `tests/test_ejecutar_conexion_ruta_con_elevacion.js`,
  `knowledge/contracts/ejecutar-conexion-ruta-con-elevacion.md`. Conjuntos disjuntos. NO tocar
  `src/crearTramo.js`, `src/conectarVertices.js` ni `src/encontrarRuta.js`.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el plano de elevación resulta necesitar estado independiente del terreno (no
  derivable directamente) → PARAR, documentar con evidencia, no forzar una derivación incorrecta
  sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó un prototipo en vivo (`node -e`) de los 4 escenarios
  de T4 antes de congelar el oráculo.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
