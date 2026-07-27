# Contrato 37 — Ciclo de vida del árbol

Prerrequisitos: ninguno de los contratos previos modela estado por celda más allá de
`{terreno, nodo}`. Segunda ronda de diseño conceptual (ver `DEFINITION.md`, sección "Ciclo de
vida de árboles"): cada celda dentro del área de acción de reforestación/tala tiene un estado
Árbol→Tocón→Limpio→Árbol.

Decisión de diseño (aditiva, NO toca `crearGrid.js`/`obtenerCelda.js`): el estado de árbol vive
en un `Map` plano `"x,y" → {estado, ticksEnEstado}`, independiente del grid — el mismo patrón ya
usado por `grafo` en `conectarVertices` (objeto/estructura auxiliar mantenida junto al grid, no
dentro de él). Una celda SIN entrada en el mapa se considera `'arbol'` por defecto (todo el
bosque empieza maduro).

Decisión de diseño (ad hoc, no preguntada al usuario, documentada aquí): umbrales de
temporización elegidos como `UMBRAL_TOCON_A_LIMPIO = 2` y `UMBRAL_LIMPIO_A_ARBOL = 3` ticks.
Tocón→Limpio y Limpio→Árbol son automáticos por tiempo (no requieren una acción explícita, solo
avanzar el tick); Árbol→Tocón es SIEMPRE una acción explícita de tala (nunca ocurre por el paso
del tiempo).

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Crear estado de árboles

FIX/OBJETIVO: función `crearEstadoArboles()` en `src/crearEstadoArboles.js`, con oráculo
congelado en `tests/test_crear_estado_arboles.js`. Devuelve un `Map` vacío nuevo.

Task contract: `knowledge/contracts/crear-estado-arboles.md`.

## T2 — Talar árbol

FIX/OBJETIVO: función `talarArbol(estadoArboles, x, y)` en `src/talarArbol.js`, con oráculo
congelado en `tests/test_talar_arbol.js`. Transición Árbol→Tocón explícita; lanza `Error` si la
celda no está en estado Árbol (por defecto o explícito).

Task contract: `knowledge/contracts/talar-arbol.md`.

## T3 — Avanzar ciclo de árbol un tick

FIX/OBJETIVO: función `avanzarCicloArbolTick(estadoArboles, x, y)` en
`src/avanzarCicloArbolTick.js`, con oráculo congelado en
`tests/test_avanzar_ciclo_arbol_tick.js`. Avanza el contador de ticks de la celda; aplica las
transiciones Tocón→Limpio (`>=2` ticks) y Limpio→Árbol (`>=3` ticks); Árbol se mantiene
indefinidamente (sin decaimiento).

Task contract: `knowledge/contracts/avanzar-ciclo-arbol-tick.md`.

## T4 — Tala produce en zona

FIX/OBJETIVO: función `talaProduceEnZona(estadoArboles, celdasEnZona)` en
`src/talaProduceEnZona.js`, con oráculo congelado en `tests/test_tala_produce_en_zona.js`.
Devuelve `true` si al menos una celda de la lista dada está en estado Árbol.

Task contract: `knowledge/contracts/tala-produce-en-zona.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_crear_estado_arboles.js` exit 0.
- [ ] T2: `node tests/test_talar_arbol.js` exit 0.
- [ ] T3: `node tests/test_avanzar_ciclo_arbol_tick.js` exit 0.
- [ ] T4: `node tests/test_tala_produce_en_zona.js` exit 0.
- [ ] Final del contrato (T1-T4 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/crearEstadoArboles.js`, `tests/test_crear_estado_arboles.js`,
  `knowledge/contracts/crear-estado-arboles.md`. T2 → `src/talarArbol.js`,
  `tests/test_talar_arbol.js`, `knowledge/contracts/talar-arbol.md`. T3 →
  `src/avanzarCicloArbolTick.js`, `tests/test_avanzar_ciclo_arbol_tick.js`,
  `knowledge/contracts/avanzar-ciclo-arbol-tick.md`. T4 → `src/talaProduceEnZona.js`,
  `tests/test_tala_produce_en_zona.js`, `knowledge/contracts/tala-produce-en-zona.md`.
  Conjuntos disjuntos. NO tocar `src/crearGrid.js` ni `src/obtenerCelda.js`.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el estado de árbol resulta necesitar más de un campo temporizador por celda
  (ej. temporización distinta según qué nodo de reforestación la esté "atendiendo") → PARAR,
  documentar, no forzar un diseño de estado compartido incorrecto sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el ciclo completo (tala → 2 ticks → limpio → 3 ticks → árbol) se trazó a
  mano antes de escribir el oráculo de T3, verificando el conteo exacto de ticks en cada
  transición.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
