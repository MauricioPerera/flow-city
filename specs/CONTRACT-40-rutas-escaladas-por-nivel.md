# Contrato 40 — Rutas escaladas por nivel

Prerrequisitos: Contrato 02 (`crear-tramo`). Segunda ronda de diseño conceptual (ver
`DEFINITION.md`, sección "Niveles (S/M/L)"): subir de nivel una ruta aumenta su tolerancia a
saturación (capacidad) y su costo de construcción; una ruta ya existente puede mejorarse
pagando la diferencia, nunca degradarse.

Decisión de diseño (ad hoc, no preguntada al usuario, propia de este dominio — NO comparte
tabla con `calcular-factor-rendimiento-granja-por-nivel` aunque los números numéricos
coincidan, por convención del proyecto de no compartir tablas entre dominios salvo el caso ya
documentado del área de acción): tolerancia a saturación `{S:1, M:2, L:3}` (multiplicador sobre
la capacidad base); costo de construcción `{S:20, M:40, L:70}`.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Calcular tolerancia de saturación de ruta por nivel

FIX/OBJETIVO: función pura `calcularToleranciaSaturacionRutaPorNivel(nivel)` en
`src/calcularToleranciaSaturacionRutaPorNivel.js`, con oráculo congelado en
`tests/test_calcular_tolerancia_saturacion_ruta_por_nivel.js`. Tabla fija `{S:1, M:2, L:3}`.

Task contract: `knowledge/contracts/calcular-tolerancia-saturacion-ruta-por-nivel.md`.

## T2 — Crear tramo con nivel

FIX/OBJETIVO: función `crearTramoConNivel(tipoRuta, capacidad, longitud, tipoTrafico, nivel)`
en `src/crearTramoConNivel.js`, con oráculo congelado en `tests/test_crear_tramo_con_nivel.js`.
Compone (sin editar) `crearTramo` con la capacidad multiplicada por T1, agregando el campo
`nivel` al tramo resultante.

Task contract: `knowledge/contracts/crear-tramo-con-nivel.md`.

## T3 — Calcular costo de construcción de ruta por nivel

FIX/OBJETIVO: función pura `calcularCostoConstruccionRutaPorNivel(nivel)` en
`src/calcularCostoConstruccionRutaPorNivel.js`, con oráculo congelado en
`tests/test_calcular_costo_construccion_ruta_por_nivel.js`. Tabla fija `{S:20, M:40, L:70}`.

Task contract: `knowledge/contracts/calcular-costo-construccion-ruta-por-nivel.md`.

## T4 — Calcular costo de mejora de nivel de ruta

FIX/OBJETIVO: función pura `calcularCostoMejoraNivelRuta(nivelActual, nivelNuevo)` en
`src/calcularCostoMejoraNivelRuta.js`, con oráculo congelado en
`tests/test_calcular_costo_mejora_nivel_ruta.js`. Devuelve la diferencia de costo (T3) entre
`nivelNuevo` y `nivelActual`; lanza `RangeError` si `nivelNuevo` no es estrictamente superior a
`nivelActual` (nunca degradar, nunca "mejorar" al mismo nivel).

Task contract: `knowledge/contracts/calcular-costo-mejora-nivel-ruta.md`.

## T5 — Ejecutar ruta escalada por nivel

FIX/OBJETIVO: función `ejecutarRutaEscaladaPorNivel()` (sin parámetros) en
`src/ejecutarRutaEscaladaPorNivel.js`, con oráculo congelado en
`tests/test_ejecutar_ruta_escalada_por_nivel.js`. Demuestra, con una capacidad base fija (`10`),
la capacidad resultante en los 3 niveles (T2), el costo de construcción en los 3 niveles (T3), y
3 mejoras válidas (T4: S→M, M→L, S→L) más la confirmación de que intentar degradar (M→S) lanza
error.

Task contract: `knowledge/contracts/ejecutar-ruta-escalada-por-nivel.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1-T5: `node tests/test_<nombre>.js` exit 0 para cada uno.
- [ ] Final del contrato (T1-T5 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea (archivos listados arriba junto a cada tarea, mismo patrón: `src/<archivo>.js`,
  `tests/test_<nombre>.js`, `knowledge/contracts/<nombre>.md`). Conjuntos disjuntos. NO tocar
  `src/crearTramo.js`.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `crearTramo` resulta requerir el campo `nivel` para funcionar correctamente
  (indicaría que no es separable como se asumió) → PARAR, documentar, no forzar una dependencia
  sobre el archivo frozen `crearTramo.js`.

## Checklist antes de delegar

- [x] RECON corrido: `crearTramo('carretera', 10, 5, 'mercaderia')` confirmado en vivo,
  devuelve `{tipoRuta, capacidad, longitud, tipoTrafico}` sin campo `nivel`, antes de escribir
  los oráculos.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: valores de T1/T3 verificados por composición explícita en T2/T4/T5.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
