# Contrato 41 — Petróleo, refinería y almacén tipado

Prerrequisitos: Contrato 09 (`crear-nodo-productivo`, `producir-tick-nodo`). Segunda ronda de
diseño conceptual (ver `DEFINITION.md`, sección "Petróleo, combustible y almacenes tipados"):
petróleo es un recurso infinito (igual patrón que el agua) que necesita refinarse antes de
usarse; los almacenes que guardan petróleo no pueden compartirse con productos orgánicos.

Extracción y refinería NO requieren primitivos nuevos: reusan `crearNodoProductivo` tal cual
(extracción con `produccionFija`, refinería con receta simple `ratioEntrada`/`ratioSalida`) —
solo son nuevas categorías de datos, exactamente como anticipó el usuario ("esto se resume al
mismo modelo... solo cambia el nombre y datos"). Lo genuinamente nuevo es el almacén tipado
(estructuralmente distinto de `crearAlmacen`, que está fijo a `materiaPrima`/`producto`) y la
regla de incompatibilidad.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Crear almacén de petróleo

FIX/OBJETIVO: función `crearAlmacenPetroleo(capacidadCrudo, capacidadRefinado)` en
`src/crearAlmacenPetroleo.js`, con oráculo congelado en `tests/test_crear_almacen_petroleo.js`.
Gemelo estructural de `crearAlmacen` (mismo patrón de 2 buffers, `crudo`/`refinado` en vez de
`materiaPrima`/`producto`), NO genérico a un `tipo` arbitrario.

Task contract: `knowledge/contracts/crear-almacen-petroleo.md`.

## T2 — Agregar stock a almacén de petróleo

FIX/OBJETIVO: función `agregarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad)` en
`src/agregarStockAlmacenPetroleo.js`, con oráculo congelado en
`tests/test_agregar_stock_almacen_petroleo.js`. Mismo patrón que `agregar-stock-almacen`
(clamp al espacio libre, `{aceptado, rechazado}`), `campo` restringido a `'crudo'`/`'refinado'`.

Task contract: `knowledge/contracts/agregar-stock-almacen-petroleo.md`.

## T3 — Retirar stock de almacén de petróleo

FIX/OBJETIVO: función `retirarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad)` en
`src/retirarStockAlmacenPetroleo.js`, con oráculo congelado en
`tests/test_retirar_stock_almacen_petroleo.js`. Mismo patrón que `retirar-stock-almacen`.

Task contract: `knowledge/contracts/retirar-stock-almacen-petroleo.md`.

## T4 — Es almacén incompatible

FIX/OBJETIVO: función pura `esAlmacenIncompatible(tipoAlmacenA, tipoAlmacenB)` en
`src/esAlmacenIncompatible.js`, con oráculo congelado en
`tests/test_es_almacen_incompatible.js`. `true` si un tipo es `'petroleo'` y el otro
`'organico'` (en cualquier orden); `false` si son del mismo tipo.

Task contract: `knowledge/contracts/es-almacen-incompatible.md`.

## T5 — Ejecutar extracción y refino de petróleo

FIX/OBJETIVO: función `ejecutarExtraccionRefinoPetroleo()` (sin parámetros) en
`src/ejecutarExtraccionRefinoPetroleo.js`, con oráculo congelado en
`tests/test_ejecutar_extraccion_refino_petroleo.js`. Extrae petróleo crudo (`crearNodoProductivo`
extracción), lo retira del almacén dedicado (T1-T3) para refinarlo (`crearNodoProductivo`
receta), guarda el refinado, y demuestra concretamente la regla de incompatibilidad (T4)
petróleo/orgánico.

Task contract: `knowledge/contracts/ejecutar-extraccion-refino-petroleo.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1-T5: `node tests/test_<nombre>.js` exit 0 para cada uno.
- [ ] Final del contrato (T1-T5 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea (archivos listados arriba junto a cada tarea). Conjuntos disjuntos. NO
  tocar `src/crearAlmacen.js`, `src/agregarStockAlmacen.js`, `src/retirarStockAlmacen.js`,
  `src/crearNodoProductivo.js` ni `src/producirTickNodo.js`.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el almacén de petróleo resulta necesitar más de 2 buffers (ej. un tercer producto
  derivado con su propia capacidad) → PARAR, documentar, no forzar una estructura de 2 buffers
  insuficiente sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: `crearNodoProductivo('petroleo', null, null, 5)` +
  `producirTickNodo` + `crearNodoProductivo('refineria', 2, 1, null)` confirmados en vivo
  (crudo `5` → refinado `2`) antes de escribir el oráculo de T5.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: valores de T5 verificados por composición explícita de T1-T4.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
