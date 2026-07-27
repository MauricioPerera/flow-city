# Contrato 12 — Comercio conectado al grid real

Prerrequisitos: Contratos 05 (tesorería), 07 (comercio), 10 (almacenes) y 11 (integración con
almacenes) completos. El Contrato 11 dejó pendiente explícito: "retiro de stock del almacén de
la granja (comercio que la desbloquee)". Este contrato lo cierra: agrega un comercio que compra
las manzanas acumuladas y genera ingreso real.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar la cadena bomba → granja → comercio

FIX/OBJETIVO: función `ejecutarCadenaBombaGranjaComercio(numTicks)` que extiende
`ejecutarCadenaBombaGranjaConAlmacen` (Contrato 11, no modificada): mismo grid, nodos, ruta y
almacenes de bomba/granja; cada tick, DESPUÉS de que la granja produce, un comercio compra el
stock de manzanas disponible (`resolverCompraAlmacen`), lo retira del almacén de la granja
(`retirarStockAlmacen`), calcula el ingreso (`calcularMontoVenta`) y lo registra en una
tesorería (`registrarIngreso`).

Valores fijados (constantes internas): `capacidadCompraComercio: 8` — igual a la producción de
manzanas por tick (`8`), para que el comercio drene completo el almacén de la granja todos los
ticks (nunca se bloquea, foco de este contrato es comercio+tesorería, no re-demostrar el
bloqueo ya probado en el Contrato 11); `precioUnitario: 2`; tesorería inicial `crearTesoreria(0)`.

Task contract: `knowledge/contracts/ejecutar-cadena-bomba-granja-comercio.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_bomba_granja_comercio.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-bomba-granja-comercio`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaBombaGranjaComercio.js`,
  `tests/test_ejecutar_cadena_bomba_granja_comercio.js`,
  `knowledge/contracts/ejecutar-cadena-bomba-granja-comercio.md`. NO tocar
  `src/ejecutarCadenaBombaGranjaConAlmacen.js` (Contrato 11) ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el comercio necesita su propio aforo (`aforoDisponible`) para esta integración
  puntual (comprador que no viaja al local, sino que el bien es retirado de un almacén) → PARAR,
  documentar con evidencia que el patrón "comprador viaja al bien" no aplica acá, no forzar
  `aforoDisponible` donde no corresponde.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el monto de venta acumulado y el vaciado exacto del almacén de la granja
  cada tick están en el oráculo.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
