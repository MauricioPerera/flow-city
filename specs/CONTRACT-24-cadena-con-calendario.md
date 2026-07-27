# Contrato 24 — Cadena real con calendario integrado

Prerrequisitos: Contrato 04 (`calendario-de-tick`, nunca usado fuera de sus propios tests) y
Contrato 12 (cadena real multi-tick bomba→granja→comercio→tesorería, cuyo `historial` ya expone
un campo `tick` por entrada pero sin información de calendario).

Decisión de alcance (confirmada explícitamente por el usuario antes de escribir este contrato,
entre dos alternativas presentadas): **solo trazabilidad, sin nueva mecánica económica**. Cada
entrada del historial de una cadena real de 8 ticks lleva adjunta su información de calendario
completa (`calendarioDeTick`) — día de semana, si es laborable, semana del mes, estación, año.
NO se cambia ninguna regla económica existente (el mantenimiento condicionado a día laboral,
mencionado como alternativa, queda explícitamente fuera de alcance de este contrato).

Alcance deliberadamente acotado: no se reimplementa la cadena bomba→granja→comercio, se reusa
tal cual (`ejecutarCadenaBombaGranjaComercio`) y solo se decora su `historial` con calendario.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena con calendario integrado

FIX/OBJETIVO: función `ejecutarCadenaConCalendario()` que corre la cadena real existente
(`ejecutarCadenaBombaGranjaComercio(8)`) y devuelve el mismo resultado, con cada entrada de
`historial` decorada con un campo `calendario: calendarioDeTick(tick)`. `8` ticks eligidos para
cubrir una semana completa más un día (`lunes` a `lunes`), demostrando `esLaboral: false` en
sábado/domingo y el cambio de `semanaDelMes` en el tick `7`.

Task contract: `knowledge/contracts/ejecutar-cadena-con-calendario.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_con_calendario.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-con-calendario`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaConCalendario.js`,
  `tests/test_ejecutar_cadena_con_calendario.js`,
  `knowledge/contracts/ejecutar-cadena-con-calendario.md`. NO tocar
  `src/ejecutarCadenaBombaGranjaComercio.js`, `src/calendarioDeTick.js`, ni ninguna integración
  anterior.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `ejecutarCadenaBombaGranjaComercio(8)` produce un historial distinto al esperado
  (indicaría un cambio de comportamiento en una integración ya cerrada) → PARAR, documentar, no
  ajustar el oráculo a un resultado inesperado sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó `ejecutarCadenaBombaGranjaComercio(8)` +
  `calendarioDeTick` en vivo antes de congelar el oráculo, confirmando los valores exactos
  (incluye el estado estable sin cuellos de botella y el cruce de fin de semana en ticks `5`-`6`).
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
