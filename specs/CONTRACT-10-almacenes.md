# Contrato 10 — Almacenes limitados por nodo

Prerrequisitos: Contratos 01-09 completos. `DEFINITION.md` fija que cada construcción
productiva tiene almacén propio, de capacidad limitada, para materia prima y para parte de su
producción terminada; si el buffer de producto terminado se llena, la producción se detiene
hasta liberar espacio. Ningún contrato anterior lo construyó — la integración del Contrato 09
lo evitó deliberadamente.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Crear almacén

No existe todavía ninguna estructura de almacén.

FIX/OBJETIVO: función pura `crearAlmacen(capacidadMateriaPrima, capacidadProducto)` en
`src/crearAlmacen.js`, con oráculo congelado en `tests/test_crear_almacen.js`.

Task contract: `knowledge/contracts/crear-almacen.md`.

## T2 — Agregar stock a un almacén

FIX/OBJETIVO: función que agrega una cantidad de materia prima o producto a un almacén,
respetando su capacidad — devuelve cuánto entró realmente y cuánto no cupo (rechazado).

## T3 — Retirar stock de un almacén

FIX/OBJETIVO: función que retira (para transportar) una cantidad de materia prima o producto de
un almacén, limitada a lo que hay disponible.

## T4 — Producir en un tick con almacén

Decisión confirmada en conversación antes de escribir este contrato: si la producción completa
de un tick no entra en el espacio disponible del almacén de producto, la producción se frena
del todo ese tick (no se produce nada, no se consume materia prima).

FIX/OBJETIVO: función que integra [`producirTickNodo`](../knowledge/contracts/producir-tick-nodo.md)
con el almacén: solo produce y descuenta materia prima si el producto resultante entra completo
en el espacio disponible del almacén de producto.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_crear_almacen.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `crear-almacen`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/crearAlmacen.js`, `tests/test_crear_almacen.js`,
  `knowledge/contracts/crear-almacen.md` (conjunto disjunto de T2-T4, sin archivos asignados
  hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: aparece un requisito de mezclar materia prima y producto en el MISMO espacio de
  almacén (capacidad compartida, no separada) → PARAR, documentar con evidencia en el reporte
  antes de asumir capacidades independientes sin verificarlo con el usuario.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: almacén lleno, cantidad que excede el espacio libre exacto por 1 unidad,
  y capacidad 0 están en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
