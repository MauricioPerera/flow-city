# Contrato 05 — Tesorería

Prerrequisitos: Contratos 01-04 completos (grid, rutas, integración, motor de tráfico por
tick). Ninguno modela dinero. Decisión confirmada en conversación antes de escribir este
contrato: el jugador tiene una tesorería real — construir cuesta dinero, cada nodo tiene
mantenimiento periódico, la venta es el ingreso, y llegar a 0 (o negativo) tiene consecuencias
mecánicas reales (degradación de nodos, no implementada todavía) sin ser una derrota formal
(el juego es sandbox puro, decisión ya confirmada en `DEFINITION.md`).

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Crear tesorería

No existe todavía ninguna estructura de tesorería.

FIX/OBJETIVO: función pura `crearTesoreria(saldoInicial)` en `src/crearTesoreria.js`, con
oráculo congelado en `tests/test_crear_tesoreria.js`.

Task contract: `knowledge/contracts/crear-tesoreria.md`.

## T2 — Registrar gasto

FIX/OBJETIVO: función que descuenta un monto de la tesorería (construcción o mantenimiento),
permitiendo que el saldo quede en 0 o negativo (la quiebra es un estado válido del sistema, no
un error que la función deba impedir).

## T3 — Registrar ingreso

FIX/OBJETIVO: función que suma un monto a la tesorería (ingreso por venta).

## T4 — Aplicar mantenimiento de un tick

FIX/OBJETIVO: dado el costo de mantenimiento de cada nodo activo, descuenta el total acumulado
de la tesorería en una sola operación por tick.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_crear_tesoreria.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `crear-tesoreria`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/crearTesoreria.js`, `tests/test_crear_tesoreria.js`,
  `knowledge/contracts/crear-tesoreria.md` (conjunto disjunto de T2-T4, sin archivos asignados
  hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: aparece un requisito de costos/monedas no numéricos (ej. múltiples divisas) →
  PARAR, documentar con evidencia en el reporte, no inventar la regla.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: saldo negativo, monto 0 o negativo, y valores no numéricos están en el
  oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
