# Contrato 31 — Decisión de orquestación de cuándo un viaje pasa a ser multi-tick

Prerrequisitos: Contrato 08 (viajes multi-tick: `calcular-ticks-viaje`, `iniciar-viaje-en-transito`,
`avanzar-viaje-tick`, `resolver-tick-con-transito`). El propio task contract de
`resolver-tick-con-transito` deja explícito que "la decisión de CUÁNDO convertir un viaje nuevo
en viaje en tránsito... queda del lado de quien orquesta, no de esta función" — nunca antes
construida. Este contrato cierra ese último pendiente del roadmap.

Alcance: una función de integración que, dado un viaje nuevo (ruta real vía `encontrarRuta`,
que ya devuelve `distanciaTotal`), decide con `calcularTicksViaje(distanciaTotal, velocidadBase)`
si se resuelve INSTANTÁNEO (`ticks <= 1`, vía `resolverViaje` existente) o si debe iniciarse
como viaje en tránsito (`ticks > 1`, vía `iniciarViajeEnTransito` + llamadas repetidas a
`resolverTickConTransito` hasta que llega). Demuestra AMBAS ramas de la decisión en el mismo
escenario: una ruta corta (resuelve en el mismo tick) y una ruta larga (tarda varios ticks).

Alcance deliberadamente acotado: sin producción, comercio, tesorería, población ni calendario
(ya demostrados en otros contratos) — el foco es exclusivamente la decisión de orquestación
instantáneo-vs-tránsito, aislada de cualquier otra mecánica.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar decisión de orquestación de viaje

FIX/OBJETIVO: función `ejecutarDecisionOrquestacionViaje()` (sin parámetros) que define dos
rutas reales sobre el mismo grafo — una corta y una larga — y para cada una: calcula
`distanciaTotal` (vía `encontrarRuta`), decide `ticksViaje` (vía `calcularTicksViaje` con una
`velocidadBase` fija), y resuelve por la rama correspondiente (instantáneo o tránsito
multi-tick), reportando cuántos ticks tardó realmente cada una.

Valores fijados: grid `5x4`; ruta corta `A(0,0)→B(1,0)` (tramo longitud `5`); ruta larga
`C(3,3)→D(4,3)` (tramo longitud `25`); ambas coordenadas elegidas para que los 4 vértices de
entrada sean pairwise distintos (evitando colisión de `verticeEntrada`); `velocidadBase: 10`;
`cantidad: 6` (mercadería, ambas rutas); capacidad de ambos tramos `20` (sin saturación).

Task contract: `knowledge/contracts/ejecutar-decision-orquestacion-viaje.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_decision_orquestacion_viaje.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-decision-orquestacion-viaje`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarDecisionOrquestacionViaje.js`,
  `tests/test_ejecutar_decision_orquestacion_viaje.js`,
  `knowledge/contracts/ejecutar-decision-orquestacion-viaje.md`. NO tocar ninguna integración
  anterior ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: los 4 vértices de entrada (`A`, `B`, `C`, `D`) no resultan pairwise distintos
  (indicaría colisión de `verticeEntrada`, ya visto en contratos anteriores) → PARAR, documentar,
  recalcular coordenadas antes de forzar el resultado esperado.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó un prototipo en vivo (`node -e`) del escenario
  completo antes de congelar el oráculo — la primera elección de coordenadas colisionó
  (`verticeEntrada(0,0,'este') === verticeEntrada(1,1,'oeste')`), corregida antes de escribir el
  test.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
