# Contrato 23 — Comercio con patrón "comprador viaja al bien"

Prerrequisitos: Contrato 07 (comercio, `aforo-disponible` + `resolver-venta-local` — nunca usados
en una integración real) y Contrato 12 (comercio conectado al grid real, pero solo el patrón
"bien viaja al comprador" — drenaje de almacén). `DEFINITION.md` describe explícitamente los DOS
patrones de venta (sección "Comercio y economía"): bienes que viajan hacia el comprador (ya
demostrado) y compradores que viajan hacia el bien (ej. clientes a un restaurante — nunca
demostrado en una cadena real).

Alcance deliberadamente acotado: sin producción, almacenes, degradación ni población real con
crecimiento (ya demostrados en otros contratos) — el foco es probar el segundo patrón de
comercio: un comprador viaja por una ruta real hacia un comercio con aforo limitado, y la venta
se resuelve por el mínimo entre demanda (personas que llegan), stock disponible y aforo
disponible.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar comercio con patrón "comprador viaja al bien"

FIX/OBJETIVO: función `ejecutarComercioCompradorViajaAlBien()` que arma un grid con una casa y
un restaurante, conectados por una ruta real de tráfico `personas`; un número fijo de personas
viaja desde la casa al restaurante; la venta real se resuelve como el mínimo entre las personas
que llegan, el stock disponible del restaurante y su aforo disponible; el monto de la venta se
registra como ingreso real en tesorería.

Valores fijados (elegidos para que el AFORO sea deliberadamente el cuello de botella, no la
demanda ni el stock — el factor distintivo de este patrón frente al de Contrato 07): personas
que viajan `10` (ruta con capacidad `20`, sin saturación → llegan las `10`); `aforoMaximo: 6`,
`ocupacionActual: 0` → `aforoDisp: 6`; `stockDisponible: 8`; `precioUnitario: 3`.

Task contract: `knowledge/contracts/ejecutar-comercio-comprador-viaja-al-bien.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_comercio_comprador_viaja_al_bien.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-comercio-comprador-viaja-al-bien`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarComercioCompradorViajaAlBien.js`,
  `tests/test_ejecutar_comercio_comprador_viaja_al_bien.js`,
  `knowledge/contracts/ejecutar-comercio-comprador-viaja-al-bien.md`. NO tocar ninguna
  integración anterior ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `resolverViaje` con tipo de tráfico `personas` sobre un tramo `carretera` es
  rechazado o produce saturación no prevista (capacidad `20` >> `10` personas, no debería
  ocurrir) → PARAR, documentar, no forzar valores distintos sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador verificó a mano que `crearTramo('carretera', 20, 1,
  'personas')` es una combinación válida (tráfico `personas` no está fijo para `carretera`,
  a diferencia de `ferrocarril`/`subte`) y que `resolverViaje` sin `registrarCargaTramo` previo
  no introduce saturación (carga por defecto `0`).
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
