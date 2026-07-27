# Contrato 15 — Integración completa: bomba → granja → comercio → tesorería con degradación

Prerrequisitos: Contratos 09, 10, 11, 12 (cadena real con almacenes y comercio), 13
(consecuencias de la quiebra) y 14 (gasto de tesorería en construcción/mantenimiento)
completos. Ninguna integración anterior conectó TODO junto: costo real de construcción,
mantenimiento periódico, y degradación de producción por quiebra prolongada, todo sobre la
misma cadena real.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar la cadena completa con degradación

FIX/OBJETIVO: función `ejecutarCadenaCompleta(numTicks)` que arma el mismo grid/nodos/ruta que
`ejecutarCadenaBombaGranjaComercio` (Contrato 12), pero: (a) construye ambos nodos con
[`construirNodoConCosto`](../knowledge/contracts/construir-nodo-con-costo.md) (Contrato 14, gasta
tesorería real); (b) cada tick cobra mantenimiento con
[`calcularMantenimientoTotal`](../knowledge/contracts/calcular-mantenimiento-total.md) +
`aplicarMantenimientoTick`; (c) cada tick aplica degradación (Contrato 13) a AMBOS nodos según
el mismo contador global de ticks en quiebra.

Valores fijados (constantes internas, iguales a integraciones previas más las nuevas de
tesorería): saldo inicial de tesorería `50` (deliberadamente menor al costo total de
construcción, `50 + 30 = 80`, para arrancar en quiebra por sobre-construcción, sin inventar un
caso artificial — es la consecuencia matemática directa de construir con fondos insuficientes,
algo que `registrarGasto` permite por diseño desde el Contrato 05); `umbralDegradacion: 2`
ticks consecutivos en quiebra.

Orden de operaciones POR TICK (estricto, en este orden):
1. `degradado = estaNodoDegradado(contadorQuiebra, 2)` — usa el contador heredado del tick
   anterior (arranca en `0`).
2. Bomba produce: `producirTickNodo` (crudo) → `aplicarDegradacionProduccion` → si entra en su
   almacén, se agrega; si no, se bloquea.
3. Se retira TODO el stock de la bomba y se envía por la ruta real (`resolverViaje`).
4. Granja produce con el agua recibida: `producirTickNodo` (crudo) → `aplicarDegradacionProduccion`
   → si entra en su almacén, se agrega; si no, se bloquea.
5. Comercio compra el stock de la granja (`resolverCompraAlmacen` + `retirarStockAlmacen` +
   `calcularMontoVenta` + `registrarIngreso`).
6. Se cobra mantenimiento (`calcularMantenimientoTotal(['extraccion-agua','agricultura'])` +
   `aplicarMantenimientoTick`).
7. `contadorQuiebra = actualizarContadorQuiebra(contadorQuiebra, tesoreria.saldo)` — con el
   saldo YA actualizado por venta y mantenimiento de este tick. Este valor es el que hereda el
   tick siguiente.

Task contract: `knowledge/contracts/ejecutar-cadena-completa.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_completa.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-completa`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaCompleta.js`, `tests/test_ejecutar_cadena_completa.js`,
  `knowledge/contracts/ejecutar-cadena-completa.md`. NO tocar ninguna integración anterior
  (Contratos 09, 11, 12) ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el orden de operaciones fijado arriba resulta ambiguo o contradictorio al
  implementarlo → PARAR, documentar con evidencia en el reporte, no improvisar un orden
  distinto sin confirmarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el escenario completo (8 ticks) fue trazado a mano por el orquestador
  ANTES de escribir el oráculo, verificando saldo y contador tick a tick, para que el oráculo
  no dependa de que la implementación "confirme" un cálculo no verificado independientemente.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
