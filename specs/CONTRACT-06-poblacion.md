# Contrato 06 — Población: necesidades y crecimiento

Prerrequisitos: Contratos 01-05 completos (grid, rutas, integración, motor de tráfico,
tesorería). Ninguno modela población. `DEFINITION.md` fija el loop: necesidades cubiertas ->
población crece/decrece -> mano de obra disponible -> producción/consumo -> economía.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Calcular cobertura de una necesidad

No existe todavía ninguna función de necesidades. Antes de combinar varias necesidades en un
índice general (T2), hace falta la unidad atómica: qué fracción de UNA necesidad concreta está
cubierta.

FIX/OBJETIVO: función pura `calcularCoberturaNecesidad(requerido, recibido)` en
`src/calcularCoberturaNecesidad.js`, con oráculo congelado en
`tests/test_calcular_cobertura_necesidad.js`.

Task contract: `knowledge/contracts/calcular-cobertura-necesidad.md`.

## T2 — Combinar coberturas de necesidades

Decisión confirmada en conversación antes de escribir este contrato: el índice general de
cobertura es el MÍNIMO entre todas las coberturas individuales (cuello de botella) — una
carencia grave en un recurso no se compensa con superávit en otro.

FIX/OBJETIVO: función pura que, dado un conjunto de coberturas individuales (cada una en
`[0,1]`, calculadas por [`calcularCoberturaNecesidad`](../knowledge/contracts/calcular-cobertura-necesidad.md)),
devuelve el índice general (el mínimo).

## T3 — Calcular crecimiento de población

Decisión confirmada en conversación antes de escribir este contrato: fórmula proporcional
centrada en `0.5` — `cambioPoblacion = poblacionActual * tasaBase * (indice - 0.5) * 2`. Con
índice `1` crece a `tasaBase` completa; con índice `0.5` no cambia; con índice `0` decrece a
`tasaBase` completa.

FIX/OBJETIVO: función que, dado el índice general de cobertura (de T2), la población actual y
una tasa base, calcula el cambio de población resultante.

## T4 — Vértice/celda en zona de influencia

Todavía no definida en detalle: falta resolver la métrica de distancia (euclídea, Manhattan,
Chebyshev) para el radio de influencia del centro cívico.

FIX/OBJETIVO: función que determina si una celda está dentro del radio de influencia de un
centro cívico dado.

## T5 — Capacidad de mano de obra

FIX/OBJETIVO: función que, dado la población total, determina cuánta está disponible para
trabajar.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_calcular_cobertura_necesidad.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `calcular-cobertura-necesidad`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/calcularCoberturaNecesidad.js`,
  `tests/test_calcular_cobertura_necesidad.js`,
  `knowledge/contracts/calcular-cobertura-necesidad.md` (conjunto disjunto de T2-T4, sin
  archivos asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: la combinación de necesidades (T2) requiere pesos por tipo de recurso que
  `DEFINITION.md` no fija y el usuario no puede resolver con una regla simple → PARAR,
  documentar con evidencia en el reporte, no inventar los pesos.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: `requerido = 0` (necesidad inexistente) y superávit de `recibido` están
  en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
