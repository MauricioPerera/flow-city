# Contrato 07 — Comercio: compra y venta

Prerrequisitos: Contratos 01-06 completos (grid, rutas, integración, motor de tráfico,
tesorería, población). Ninguno modela comercio. `DEFINITION.md` fija: aforo por comercio, dos
patrones de venta (bien viaja al comprador / comprador viaja al bien), y comercio inter-zona vía
estaciones/puertos con almacenes.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Aforo disponible de un comercio

No existe todavía ninguna función de comercio.

FIX/OBJETIVO: función pura `aforoDisponible(aforoMaximo, ocupacionActual)` en
`src/aforoDisponible.js`, con oráculo congelado en `tests/test_aforo_disponible.js`.

Task contract: `knowledge/contracts/aforo-disponible.md`.

## T2 — Calcular monto de venta

FIX/OBJETIVO: función que, dada una cantidad vendida y un precio unitario, calcula el monto de
ingreso resultante.

## T3 — Resolver compra en almacén

FIX/OBJETIVO: dado lo que ofrece un tren/barco y la capacidad de compra restante del almacén
destino, determina cuánto se compra realmente — el menor entre ambos (`DEFINITION.md`: "siempre
limitado a lo que el ferrocarril o barco tiene y el puerto o estación puede comprar").

## T4 — Resolver venta local

FIX/OBJETIVO: combina aforo disponible, stock disponible y demanda del comprador para
determinar cuánto se vende efectivamente en un comercio local (patrón "comprador viaja al
bien").

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_aforo_disponible.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `aforo-disponible`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/aforoDisponible.js`, `tests/test_aforo_disponible.js`,
  `knowledge/contracts/aforo-disponible.md` (conjunto disjunto de T2-T4, sin archivos asignados
  hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el patrón "bien viaja al comprador" (muebles a casa) resulta necesitar una función
  distinta de las ya existentes de tráfico (`resolverViaje`/`resolverTick`) → PARAR, documentar
  con evidencia en el reporte antes de duplicar lógica de tráfico bajo otro nombre.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: aforo agotado, ocupación mayor al máximo (estado inconsistente), y
  ofertas/capacidades en 0 están en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para el contrato (arriba).
