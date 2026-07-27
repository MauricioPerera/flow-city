# Contrato 08 — Viajes multi-tick

Prerrequisitos: Contratos 01-07 completos. `resolverViaje`/`resolverTick` (Contrato 04)
resuelven todo viaje de forma instantánea dentro de un único tick — límite documentado
explícitamente en `docs/reports/CONTRACT-04-REPORT.md`. `DEFINITION.md` fija: "la distancia
real de un tramo determina cuántos ticks tarda un trayecto; mientras dura, el trayecto ocupa
capacidad del tramo". Este contrato cierra ese hueco.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Calcular ticks de viaje

No existe todavía ninguna función de tiempo de viaje.

FIX/OBJETIVO: función pura `calcularTicksViaje(distanciaTotal, velocidadBase)` en
`src/calcularTicksViaje.js`, con oráculo congelado en `tests/test_calcular_ticks_viaje.js`.

Task contract: `knowledge/contracts/calcular-ticks-viaje.md`.

## T2 — Iniciar viaje en tránsito

FIX/OBJETIVO: función que crea el estado inicial de un viaje que va a tardar más de 1 tick.

## T3 — Avanzar viaje en tránsito un tick

FIX/OBJETIVO: función que avanza un viaje en tránsito un tick, determinando si llega a destino
este tick (con la pérdida final aplicada) o sigue en tránsito.

## T4 — Integrar tránsito en la resolución de un tick

Alcance ajustado al tomar la tarea (igual que T4 de grid/rutas en contratos anteriores se
recortó a su primera pieza atómica real): esta función recibe el conjunto YA UNIFICADO de
viajes en tránsito activos este tick (tanto los recién iniciados con
[`iniciarViajeEnTransito`](./iniciar-viaje-en-transito.md) como los que ya venían de ticks
anteriores) — la decisión de CUÁNDO convertir un viaje nuevo en viaje en tránsito (usando
[`calcularTicksViaje`](./calcular-ticks-viaje.md) + `iniciarViajeEnTransito`) queda del lado de
quien orquesta, no de esta función.

FIX/OBJETIVO: dado el grafo y el array de viajes en tránsito activos, reinicia la carga de
todos los tramos, acumula la carga de TODOS esos viajes en sus caminos completos ANTES de
avanzar ninguno (mismo patrón de `resolverTick`, Contrato 04), y luego avanza cada uno un tick
con [`avanzarViajeTick`](./avanzar-viaje-tick.md), separando los que llegan de los que siguen en
tránsito para el próximo tick.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_calcular_ticks_viaje.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `calcular-ticks-viaje`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/calcularTicksViaje.js`, `tests/test_calcular_ticks_viaje.js`,
  `knowledge/contracts/calcular-ticks-viaje.md` (conjunto disjunto de T2-T4, sin archivos
  asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: modelar la saturación variable tramo-a-tramo DURANTE el tránsito (no solo al
  iniciar el viaje) resulta necesario para que el resultado sea coherente → PARAR, documentar
  con evidencia en el reporte antes de asumir que la velocidad se fija solo al iniciar el viaje.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: distancia 0 (llegada inmediata) y distancia no múltiplo exacto de la
  velocidad (redondeo) están en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
