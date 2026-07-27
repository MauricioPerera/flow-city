# Contrato 36 — Área de acción por nivel

Prerrequisitos: Contrato 06 (`esta-en-zona-influencia`, ya genérica, Chebyshev). Segunda ronda
de diseño conceptual (ver `DEFINITION.md`, sección "Footprint vs. área de acción"): para la
mayoría de construcciones (reforestación, tala, granja, centro cívico) el footprint se mantiene
igual en los 3 niveles; lo que crece con el nivel es el área de acción (un radio, reusando
`estaEnZonaInfluencia` sin ningún wrapper nuevo, ya que es genérica de nombre y de firma).

Única excepción documentada a la regla del proyecto de "cada dominio su propia tabla, sin
compartir": el radio de área de acción SÍ se comparte entre reforestación y tala, porque son un
par complementario (Contrato 38) que debe coincidir en su radio — divergir aquí rompería la
mecánica misma.

Decisión de diseño (ad hoc, no preguntada al usuario): `{S:2, M:3, L:4}`.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Radio de área de acción por nivel

FIX/OBJETIVO: función pura `radioAreaAccionPorNivel(nivel)` en
`src/radioAreaAccionPorNivel.js`, con oráculo congelado en
`tests/test_radio_area_accion_por_nivel.js`. Tabla fija `{S:2, M:3, L:4}`.

Task contract: `knowledge/contracts/radio-area-accion-por-nivel.md`.

## T2 — Ejecutar área de acción por nivel

FIX/OBJETIVO: función `ejecutarAreaAccionPorNivel()` (sin parámetros) en
`src/ejecutarAreaAccionPorNivel.js`, con oráculo congelado en
`tests/test_ejecutar_area_accion_por_nivel.js`. Para un centro fijo `(5,5)` y los 3 niveles,
usa T1 + `estaEnZonaInfluencia` DIRECTO (sin wrapper) para verificar, con una celda justo dentro
del radio y otra justo fuera, que el mismo radio aplica igual para "reforestación" y "tala"
(demostrando la coincidencia exigida entre el par complementario).

Task contract: `knowledge/contracts/ejecutar-area-accion-por-nivel.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_radio_area_accion_por_nivel.js` exit 0.
- [ ] T2: `node tests/test_ejecutar_area_accion_por_nivel.js` exit 0.
- [ ] Final del contrato (T1-T2 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/radioAreaAccionPorNivel.js`,
  `tests/test_radio_area_accion_por_nivel.js`,
  `knowledge/contracts/radio-area-accion-por-nivel.md`. T2 →
  `src/ejecutarAreaAccionPorNivel.js`, `tests/test_ejecutar_area_accion_por_nivel.js`,
  `knowledge/contracts/ejecutar-area-accion-por-nivel.md`. Conjuntos disjuntos. NO tocar
  `src/estaEnZonaInfluencia.js`.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `estaEnZonaInfluencia` resulta insuficiente para expresar el área de acción (por
  ejemplo, si necesitara una forma no cuadrada) → PARAR, documentar, no forzar un wrapper que
  cambie su semántica sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: distancias Chebyshev verificadas a mano para el centro `(5,5)` y las
  celdas de prueba de cada nivel, antes de escribir el oráculo de T2.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
