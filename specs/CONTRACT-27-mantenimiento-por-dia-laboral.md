# Contrato 27 — Efecto económico real del calendario (mantenimiento por día laboral)

Prerrequisitos: Contrato 24 (`ejecutar-cadena-con-calendario`, alcance explícitamente acotado a
"solo trazabilidad, sin nueva mecánica económica" — el efecto económico real quedó fuera de
alcance a propósito) y Contrato 04 (`calendario-de-tick`). `DEFINITION.md` (sección
"Calendario"): "Semana = 7 días (lunes a viernes laboral, sábado y domingo de descanso), **con
patrón propio de tráfico y economía**".

Alcance: primera regla económica real atada al calendario — el mantenimiento periódico
(Contrato 05/14) se cobra ÚNICAMENTE en ticks donde `calendarioDeTick(tick).esLaboral === true`;
en fin de semana se salta por completo (no se acumula, no se cobra doble el lunes siguiente).
Producción y comercio (bomba→granja→comercio) NO cambian por el calendario en este contrato —
siguen funcionando los 7 días de la semana, igual que en toda integración anterior; solo el
mantenimiento queda condicionado.

Alcance deliberadamente acotado: sin construcción con costo, almacenes con degradación, quiebra
ni población (ya demostrados en otros contratos) — el foco es exclusivamente demostrar el
condicionamiento del mantenimiento al día laboral, aislado de cualquier otra mecánica.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena con mantenimiento condicionado al calendario

FIX/OBJETIVO: función `ejecutarCadenaMantenimientoCalendario()` (sin parámetros, `8` ticks
fijos, lunes a lunes) que corre la cadena bomba→granja→comercio→tesorería (mismo patrón
económico del Contrato 12) y aplica el mantenimiento periódico SOLO en los ticks donde
`calendarioDeTick(tick).esLaboral === true`, demostrando que la tesorería crece más rápido en
fin de semana (sin descuento de mantenimiento) que en día laboral.

Task contract: `knowledge/contracts/ejecutar-cadena-mantenimiento-calendario.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_mantenimiento_calendario.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-mantenimiento-calendario`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaMantenimientoCalendario.js`,
  `tests/test_ejecutar_cadena_mantenimiento_calendario.js`,
  `knowledge/contracts/ejecutar-cadena-mantenimiento-calendario.md`. NO tocar
  `src/ejecutarCadenaBombaGranjaComercio.js`, `src/ejecutarCadenaConCalendario.js`,
  `src/calendarioDeTick.js` ni ninguna integración anterior.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el saldo final tras `8` ticks no refleja exactamente `5` cobros de mantenimiento
  (lunes a viernes, más el lunes siguiente en el tick `7`) y `2` ticks sin cobro (sábado,
  domingo) → PARAR, documentar, no ajustar el oráculo a un resultado inesperado sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó un prototipo en vivo (`node -e`) del escenario
  completo de `8` ticks antes de congelar el oráculo, confirmando el saldo final (`110`) y el
  patrón de cobro/salto de mantenimiento.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
