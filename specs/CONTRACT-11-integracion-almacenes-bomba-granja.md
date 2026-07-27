# Contrato 11 — Integración con almacenes: bomba → granja

Prerrequisitos: Contrato 09 (`ejecutarCadenaBombaGranja`, integración sin almacenes) y Contrato
10 (`crearAlmacen`, `agregarStockAlmacen`, `retirarStockAlmacen`,
`producirTickNodoConAlmacen`) completos. `ejecutarCadenaBombaGranja` ya tiene su task contract
con oráculo sellado (`touch_only: ['src/ejecutarCadenaBombaGranja.js']`) y documenta
explícitamente que evita almacenes — no se modifica. Este contrato agrega una función NUEVA que
reintegra la misma cadena, esta vez con almacenes reales en ambos nodos.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar la cadena bomba → granja con almacenes

FIX/OBJETIVO: función `ejecutarCadenaBombaGranjaConAlmacen(numTicks)` que arma el mismo grid,
nodos y ruta real que `ejecutarCadenaBombaGranja` (Contrato 09), pero además crea un almacén
propio para la bomba (capacidad de producto `10`, suficiente para su producción fija de `4`) y
para la granja (capacidad de producto `20`, deliberadamente menor a lo que acumularía sin
retirar en 3 ticks de `8` manzanas cada uno). Cada tick: la bomba produce agua vía
`producirTickNodoConAlmacen`, se retira TODO el stock de su almacén
(`retirarStockAlmacen`) y se envía por la ruta real (`resolverViaje`); la granja recibe el agua
y produce manzanas vía `producirTickNodoConAlmacen`, acumulando en su propio almacén (nunca se
retira). El escenario está calibrado para que la granja se quede sin espacio en el tercer tick
(capacidad `20`, `8+8=16` acumulados, el tercer `8` no entra) y demuestre el frenado real
documentado en el Contrato 10 — no una simulación forzada.

Task contract: `knowledge/contracts/ejecutar-cadena-bomba-granja-con-almacen.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_bomba_granja_con_almacen.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-bomba-granja-con-almacen`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaBombaGranjaConAlmacen.js`,
  `tests/test_ejecutar_cadena_bomba_granja_con_almacen.js`,
  `knowledge/contracts/ejecutar-cadena-bomba-granja-con-almacen.md`. NO tocar
  `src/ejecutarCadenaBombaGranja.js` (Contrato 09) ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el agua recibida mientras la granja está bloqueada (almacén lleno) necesitara
  almacenarse en algún lado para no perderse → PARAR, documentar con evidencia en el reporte que
  esa agua se pierde ese tick (no hay almacén de materia prima en el alcance de este contrato),
  no inventar un buffer no contratado.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el tick de bloqueo real de la granja (tercer tick del escenario
  calibrado) está en el oráculo, no solo el camino feliz.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
