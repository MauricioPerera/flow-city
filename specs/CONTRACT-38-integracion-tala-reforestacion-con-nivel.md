# Contrato 38 — Integración tala + reforestación con nivel

Prerrequisitos: Contrato 36 (`radio-area-accion-por-nivel`, `esta-en-zona-influencia`) y
Contrato 37 (ciclo de vida del árbol completo). Cierra el ciclo completo: un área de acción por
nivel (Contrato 36) sobre una celda cuyo estado de árbol evoluciona (Contrato 37), con tala
produciendo madera SOLO cuando hay un árbol listo, y el árbol regenerándose con el tiempo.

Alcance deliberadamente acotado: una sola celda candidata (simplifica el trazado manual del
oráculo sin perder la demostración del ciclo completo); sin almacenes, comercio, tesorería,
población ni calendario — ya demostrados en otros contratos, y explícitamente fuera de alcance
de este.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena tala + reforestación con nivel

FIX/OBJETIVO: función `ejecutarCadenaTalaReforestacionConNivel()` (sin parámetros, `6` ticks
fijos) que, para un centro `(5,5)` y nivel `'S'` (radio `2`), verifica que una celda candidata
`(5,5)` cae en el área de acción (`estaEnZonaInfluencia`), y en cada tick: si
`talaProduceEnZona` es verdadero, tala (`talarArbol`, madera `1`); siempre avanza el ciclo
(`avanzarCicloArbolTick`). Demuestra el ciclo completo: tala en tick `0` y `5` (separados por
exactamente `5` ticks, el tiempo total del ciclo Tocón→Limpio→Árbol), sin producción en los
ticks intermedios.

Task contract: `knowledge/contracts/ejecutar-cadena-tala-reforestacion-con-nivel.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_tala_reforestacion_con_nivel.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-tala-reforestacion-con-nivel`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaTalaReforestacionConNivel.js`,
  `tests/test_ejecutar_cadena_tala_reforestacion_con_nivel.js`,
  `knowledge/contracts/ejecutar-cadena-tala-reforestacion-con-nivel.md`. NO tocar ninguna
  integración anterior ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el ciclo completo (tala→2 ticks→limpio→3 ticks→árbol) no toma exactamente `5`
  ticks entre una tala y la siguiente oportunidad → PARAR, documentar, no ajustar el oráculo a
  un resultado inesperado sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó un prototipo en vivo (`node -e`) de los 6 ticks
  antes de congelar el oráculo, confirmando el ciclo completo tala→tocón→limpio→árbol→tala.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
