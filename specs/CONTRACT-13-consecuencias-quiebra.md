# Contrato 13 — Consecuencias de la quiebra

Prerrequisitos: Contrato 05 (tesorería) completo. `DEFINITION.md` fija: si el saldo llega a 0 o
negativo hay consecuencias mecánicas reales (degradación de nodos), sin que sea una derrota
formal (el juego es sandbox puro). Ningún contrato lo implementó todavía.

Decisiones confirmadas en conversación antes de escribir este contrato: la degradación es
**progresiva** (contador de ticks consecutivos en quiebra, no un castigo instantáneo al primer
tick negativo) y su efecto es **producción a la mitad** (redondeada hacia abajo), reversible en
cuanto la tesorería vuelve a ser positiva.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Actualizar contador de quiebra

No existe todavía ninguna función de este subsistema.

FIX/OBJETIVO: función pura `actualizarContadorQuiebra(contadorActual, saldoTesoreria)` en
`src/actualizarContadorQuiebra.js`, con oráculo congelado en
`tests/test_actualizar_contador_quiebra.js`. Incrementa el contador si `saldoTesoreria <= 0`;
lo reinicia a `0` si es positivo.

Task contract: `knowledge/contracts/actualizar-contador-quiebra.md`.

## T2 — Nodo degradado

FIX/OBJETIVO: función que determina si un nodo está degradado, dado el contador de ticks en
quiebra y un umbral (cantidad de ticks consecutivos necesarios para degradar).

## T3 — Aplicar degradación a la producción

FIX/OBJETIVO: función que, dada una producción potencial y si el nodo está degradado, devuelve
la producción efectiva (mitad redondeada hacia abajo si degradado, completa si no).

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_actualizar_contador_quiebra.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `actualizar-contador-quiebra`.
- [ ] Final del contrato (cuando T1-T3 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/actualizarContadorQuiebra.js`,
  `tests/test_actualizar_contador_quiebra.js`,
  `knowledge/contracts/actualizar-contador-quiebra.md` (conjunto disjunto de T2-T3, sin
  archivos asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: aparece un requisito de severidad creciente más allá de "mitad de producción" (ej.
  degradación en varios niveles) → PARAR, documentar con evidencia en el reporte, no inventar
  niveles adicionales no confirmados.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: saldo exactamente 0 (no solo negativo) y transición de quiebra a
  recuperación en el mismo test están en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T3.
- [x] Condición de aborto explícita para el contrato (arriba).
