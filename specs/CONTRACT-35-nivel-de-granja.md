# Contrato 35 — Nivel de granja

Prerrequisitos: Contrato 09 (`crear-nodo-productivo`, `producir-tick-nodo`), Contrato 14
(`costo-construccion-nodo`). Segunda ronda de diseño conceptual (ver `DEFINITION.md`, sección
"Niveles (S/M/L)"): subir de nivel una granja aumenta su rendimiento (más manzanas por la misma
agua recibida) y su costo de construcción. Primer contrato del roadmap de niveles — sienta el
patrón (tabla de factor propia del dominio + costo propio del dominio, sin módulo "sistema de
niveles" compartido, según la decisión de arquitectura del proyecto) que se repetirá, con sus
propias tablas, en otros dominios (rutas, fábricas, etc.) sin acoplarse a este.

Decisión de diseño (documentada aquí, no preguntada al usuario): factor de rendimiento
`{S:1, M:2, L:3}` (lineal); recargo de costo `{S:0, M:20, L:50}` sobre el costo base ya existente
de `costoConstruccionNodo('agricultura')` (`30`), dando `{S:30, M:50, L:80}`.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Calcular factor de rendimiento de granja por nivel

FIX/OBJETIVO: función pura `calcularFactorRendimientoGranjaPorNivel(nivel)` en
`src/calcularFactorRendimientoGranjaPorNivel.js`, con oráculo congelado en
`tests/test_calcular_factor_rendimiento_granja_por_nivel.js`. Tabla fija `{S:1, M:2, L:3}`.

Task contract: `knowledge/contracts/calcular-factor-rendimiento-granja-por-nivel.md`.

## T2 — Calcular costo de construcción de granja por nivel

FIX/OBJETIVO: función pura `calcularCostoConstruccionGranjaPorNivel(nivel)` en
`src/calcularCostoConstruccionGranjaPorNivel.js`, con oráculo congelado en
`tests/test_calcular_costo_construccion_granja_por_nivel.js`. Compone el costo base existente
(`costoConstruccionNodo('agricultura')`, `30`) con un recargo por nivel `{S:0, M:20, L:50}`.

Task contract: `knowledge/contracts/calcular-costo-construccion-granja-por-nivel.md`.

## T3 — Ejecutar producción de granja por nivel

FIX/OBJETIVO: función `ejecutarProduccionGranjaPorNivel()` (sin parámetros) en
`src/ejecutarProduccionGranjaPorNivel.js`, con oráculo congelado en
`tests/test_ejecutar_produccion_granja_por_nivel.js`. Para los 3 niveles S/M/L, con la MISMA
agua recibida fija (`4`), calcula la producción cruda (reusando `crearNodoProductivo`/
`producirTickNodo` sin modificarlos) y la multiplica por el factor de rendimiento de T1,
demostrando que a mayor nivel, mayor producción con el mismo insumo.

Task contract: `knowledge/contracts/ejecutar-produccion-granja-por-nivel.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_calcular_factor_rendimiento_granja_por_nivel.js` exit 0.
- [ ] T2: `node tests/test_calcular_costo_construccion_granja_por_nivel.js` exit 0.
- [ ] T3: `node tests/test_ejecutar_produccion_granja_por_nivel.js` exit 0.
- [ ] Final del contrato (T1-T3 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/calcularFactorRendimientoGranjaPorNivel.js`,
  `tests/test_calcular_factor_rendimiento_granja_por_nivel.js`,
  `knowledge/contracts/calcular-factor-rendimiento-granja-por-nivel.md`. T2 →
  `src/calcularCostoConstruccionGranjaPorNivel.js`,
  `tests/test_calcular_costo_construccion_granja_por_nivel.js`,
  `knowledge/contracts/calcular-costo-construccion-granja-por-nivel.md`. T3 →
  `src/ejecutarProduccionGranjaPorNivel.js`, `tests/test_ejecutar_produccion_granja_por_nivel.js`,
  `knowledge/contracts/ejecutar-produccion-granja-por-nivel.md`. Conjuntos disjuntos. NO tocar
  `src/crearNodoProductivo.js`, `src/producirTickNodo.js` ni `src/costoConstruccionNodo.js`.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `costoConstruccionNodo('agricultura')` no devuelve `30` (indicaría un cambio en el
  costo base ya cerrado) → PARAR, documentar, no ajustar el oráculo de T2 a un valor distinto
  sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: `costoConstruccionNodo('agricultura')` confirmado en `30`,
  `producirTickNodo` con ratio `1:2` y `entrada=4` confirmado en `8`, ambos ejecutados en vivo
  antes de escribir los oráculos.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: valores de T1/T2 verificados por composición explícita (no adivinados) con
  el costo base ya existente.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
