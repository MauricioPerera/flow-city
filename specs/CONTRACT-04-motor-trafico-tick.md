# Contrato 04 — Motor de tráfico por tick

Prerrequisitos: Contrato 01 (grid), Contrato 02 (grafo de rutas, pathfinding) y Contrato 03
(integración grid↔rutas) completos. Ninguno de los contratos anteriores modela el paso del
tiempo ni la acumulación de carga real sobre un tramo. Este contrato lo agrega.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Calendario de tick

No existe todavía ninguna función de calendario. Decisión confirmada en conversación antes de
escribir este contrato: **un tick equivale a un día completo**; las 3 fases (trabajo/sueño/
tiempo libre) son sub-pasos internos de la resolución de ESE mismo tick, no ticks separados. El
calendario (semana/mes/estación/año) avanza 1 unidad por tick.

FIX/OBJETIVO: función pura `calendarioDeTick(numeroTick)` en `src/calendarioDeTick.js`, con
oráculo congelado en `tests/test_calendario_de_tick.js`. Jerarquía fija de
`DEFINITION.md`: semana = 7 días (lunes-viernes laboral, sábado-domingo descanso), mes = 4
semanas, estación = 3 meses (otoño, invierno, primavera, verano, en ese orden cíclico), año = 12
meses.

Task contract: `knowledge/contracts/calendario-de-tick.md`.

## T2 — Registrar carga en tramo

FIX/OBJETIVO: función que acumula una cantidad de tráfico (mercadería o personas) sobre un
tramo dado, respetando la restricción de tipo de tráfico que ya admite el tramo
(`tramoAdmiteTrafico`).

## T3 — Resolver un viaje

FIX/OBJETIVO: dado un grafo, origen, destino, tipo de tráfico y cantidad, calcula la ruta
(`encontrarRuta`) y determina cuánto llega efectivamente a destino aplicando saturación
(`calcularSaturacion`) en cada tramo atravesado.

## T4 — Resolver un tick completo

FIX/OBJETIVO: agrupa múltiples viajes simultáneos de un mismo tick, acumulando toda la carga
por tramo ANTES de aplicar saturación (la saturación se calcula sobre el total agregado del
tick, no viaje por viaje en el orden en que llegaron).

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_calendario_de_tick.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `calendario-de-tick`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/calendarioDeTick.js`, `tests/test_calendario_de_tick.js`,
  `knowledge/contracts/calendario-de-tick.md` (conjunto disjunto de T2-T4, sin archivos
  asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: la simulación de viajes en tránsito requiere que un mismo viaje persista carga
  sobre un tramo a lo largo de MÁS de un tick (viaje más largo que 1 día) → PARAR, documentar
  con evidencia en el reporte antes de asumir un modelo de resolución instantánea por tick.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: transiciones de calendario (fin de semana, fin de mes, fin de estación,
  fin de año) están cubiertas en el oráculo de T1 antes de implementar.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
