# Contrato 28 — Generación real de viajes desde las 3 fases del día (ida/vuelta laboral)

Prerrequisitos: Contrato 04 (`calendario-de-tick`, cuyo propio contrato dejó explícito que "las
3 fases del día — trabajo/sueño/tiempo libre — son sub-pasos internos... responsabilidad de una
tarea posterior") y Contrato 23 (patrón "comprador viaja al bien", primer uso de tráfico
`personas` sobre una ruta real). `DEFINITION.md` (sección "Calendario"): "Día = tick, dividido
en 3 fases iguales (trabajo, sueño, tiempo libre); **la transición entre fases genera picos de
tráfico (ida/vuelta laboral)**".

Decisión de alcance (confirmada explícitamente por el usuario, entre dos alternativas
presentadas): **solo la transición laboral (ida/vuelta casa↔trabajo)**, únicamente en ticks
donde `calendarioDeTick(tick).esLaboral === true`; en fin de semana no se genera ningún viaje
(no hay fase de trabajo). La fase de "tiempo libre" y su gasto asociado (mencionada en
`DEFINITION.md`: "en tiempo libre la población puede gastar dinero") queda explícitamente FUERA
de alcance de este contrato — es un pendiente futuro, no se inventa aquí.

Alcance deliberadamente acotado: sin producción, almacenes, comercio, tesorería, degradación ni
crecimiento poblacional (ya demostrados en otros contratos) — el foco es exclusivamente generar
los dos viajes reales (ida y vuelta) que corresponden a la transición de fase laboral, cuando
corresponde según el calendario.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar viajes de la fase laboral

FIX/OBJETIVO: función `ejecutarViajesFaseLaboral()` (sin parámetros, `7` ticks fijos, una
semana completa) que, para cada tick donde `esLaboral === true`, genera dos viajes reales
(casa→trabajo, trabajo→casa) por una ruta real de tráfico `personas`; en ticks no laborales no
genera ningún viaje.

Valores fijados: grid con casa en `(0,0)` y trabajo en `(1,0)`, conectados vértice
`este`→`oeste` con un tramo `carretera` tráfico `personas` capacidad `20`;
`personasQueTrabajan: 8` (sin saturación, capacidad `20` >> `8`).

Task contract: `knowledge/contracts/ejecutar-viajes-fase-laboral.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_viajes_fase_laboral.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-viajes-fase-laboral`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarViajesFaseLaboral.js`, `tests/test_ejecutar_viajes_fase_laboral.js`,
  `knowledge/contracts/ejecutar-viajes-fase-laboral.md`. NO tocar ninguna integración anterior
  ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `resolverViaje` con tipo de tráfico `personas` sobre `carretera` es rechazado o
  produce saturación no prevista (capacidad `20` >> `8`, no debería ocurrir) → PARAR,
  documentar, no forzar valores distintos sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó un prototipo en vivo (`node -e`) del escenario
  completo de `7` ticks antes de congelar el oráculo, confirmando el patrón laboral/fin de
  semana.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
