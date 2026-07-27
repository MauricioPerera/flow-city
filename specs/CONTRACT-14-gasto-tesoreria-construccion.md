# Contrato 14 — Gasto de tesorería en construcción y mantenimiento

Prerrequisitos: Contrato 05 (tesorería, `registrarGasto`/`aplicarMantenimientoTick`) y Contrato
09 (`crearNodoProductivo`, `colocarNodo`) completos. `DEFINITION.md` fija: "construir cuesta
dinero, cada nodo tiene mantenimiento periódico". Ningún contrato anterior conectó el costo real
de un nodo con su categoría — `aplicarMantenimientoTick` recibe una lista de costos ya
calculados, pero nada calcula esos costos a partir de qué tipo de nodo es.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Costo de construcción de un nodo

No existe todavía ninguna tabla de costos. Valores fijados (constantes del proyecto, análogos a
`produccionFija`/`precioUnitario` ya fijados en integraciones previas — no derivados de
`DEFINITION.md`, que no los especifica): `'extraccion-agua'` cuesta `50`, `'agricultura'` cuesta
`30`. Un tercer tipo no registrado es un error explícito, no un costo `0` por defecto.

FIX/OBJETIVO: función pura `costoConstruccionNodo(categoria)` en
`src/costoConstruccionNodo.js`, con oráculo congelado en `tests/test_costo_construccion_nodo.js`.

Task contract: `knowledge/contracts/costo-construccion-nodo.md`.

## T2 — Costo de mantenimiento de un nodo

FIX/OBJETIVO: función pura análoga a T1 para el costo de mantenimiento periódico: valores
fijados `'extraccion-agua'`: `2`, `'agricultura'`: `1`.

## T3 — Construir un nodo con costo

FIX/OBJETIVO: función que coloca un nodo en el grid (`colocarNodo`) y, SOLO si la colocación no
falla, gasta su costo de construcción (`registrarGasto` con el monto de `costoConstruccionNodo`)
de la tesorería. Orden seguro: nunca gasta si la colocación resultó inválida.

## T4 — Calcular mantenimiento total

FIX/OBJETIVO: función que, dado un array de categorías de nodos activos, suma el costo de
mantenimiento de todos (vía `costoMantenimientoNodo`), lista para pasar a
`aplicarMantenimientoTick`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_costo_construccion_nodo.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `costo-construccion-nodo`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/costoConstruccionNodo.js`,
  `tests/test_costo_construccion_nodo.js`, `knowledge/contracts/costo-construccion-nodo.md`
  (conjunto disjunto de T2-T4, sin archivos asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: aparece un tercer tipo de nodo real (más allá de `'extraccion-agua'` y
  `'agricultura'`) que necesite costo antes de que el usuario confirme su valor → PARAR,
  documentar con evidencia en el reporte, no inventar el número.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: categoría desconocida (no lanzar `0` en silencio) está en el oráculo antes
  de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
