# Contrato 19 — Integración completa con población real

Prerrequisitos: Contratos 11 (almacenes), 14 (costo de construcción/mantenimiento), 15
(degradación), 16-17 (población y zona de influencia real) completos. Ninguna integración
anterior combinó TODOS estos subsistemas a la vez.

Alcance simplificado explícito (decisión del orquestador, no del usuario, documentada para
transparencia): la población es un conteo FIJO (`10`) durante los ticks simulados — no se
compone tick a tick junto con la degradación de tesorería, para no encadenar dos loops de
retroalimentación completos en la misma traza manual. Al final de la simulación se evalúa UNA
sola vez cuánto crecería/decrecería la población con el índice de cobertura del ÚLTIMO tick.

Hallazgo emergente confirmado a mano antes de escribir el oráculo: con población tomando
prioridad real sobre el agua, una vez que la bomba se degrada (agua `4 → 2`), la población
consume el 100% del agua degradada (necesita exactamente `2`), dejando `0` para la granja — la
granja no vuelve a producir mientras dure la degradación, el comercio deja de vender, y a
diferencia del Contrato 15 (que sí se recuperaba), este escenario **no se recupera**: el saldo
sigue cayendo indefinidamente (`-3`/tick de puro mantenimiento sin ingreso).

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena completa con población real

FIX/OBJETIVO: función `ejecutarCadenaCompletaConPoblacion(numTicks)` — mismo grid/nodos/ruta/
almacenes/costos/mantenimiento/degradación del Contrato 15, más una casa (población fija `10`,
necesidad `0.2`/cápita) que toma su cobertura de agua/comida ANTES que la granja/el comercio
(regla "población primero" del Contrato 17), cada tick.

Valores fijados: saldo inicial `50`; costo de construcción `80` (arranca en quiebra, `-30`);
`umbralDegradacion: 2`; `capacidadCompraComercio: 8`; `precioUnitario: 2`; `tasaBase: 0.1`.

Task contract: `knowledge/contracts/ejecutar-cadena-completa-poblacion.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_completa_poblacion.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-completa-poblacion`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaCompletaConPoblacion.js`,
  `tests/test_ejecutar_cadena_completa_poblacion.js`,
  `knowledge/contracts/ejecutar-cadena-completa-poblacion.md`. NO tocar ninguna integración
  anterior (Contratos 09, 11, 15, 16, 17, 18) ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el orden de operaciones (población primero, luego almacén/envío/comercio/
  mantenimiento/contador) resulta ambiguo o contradictorio al implementarlo → PARAR, documentar
  con evidencia en el reporte, no improvisar un orden distinto sin confirmarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el escenario de 4 ticks fue trazado a mano por el orquestador ANTES de
  escribir el oráculo, confirmando que la degradación NO se recupera bajo estos valores
  (diferencia deliberada con el Contrato 15, documentada, no un error).
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
