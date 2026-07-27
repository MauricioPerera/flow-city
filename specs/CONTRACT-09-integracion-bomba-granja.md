# Contrato 09 — Integración end-to-end: bomba de agua → granja

Prerrequisitos: Contratos 01-08 completos. Hasta ahora cada contrato construyó funciones puras
aisladas (grid, rutas, tráfico, tesorería, población, comercio) sin conectarlas entre sí sobre
un grid real. Este contrato prueba la integración real con la cadena de producción más simple
descrita en `DEFINITION.md`: la bomba de agua produce agua, la granja la recibe transportada por
ruta y produce manzanas (ratio 1:2).

Alcance deliberadamente acotado (decisión confirmada en conversación antes de escribir este
contrato): **sin almacenes limitados por nodo** (mencionados en `DEFINITION.md` pero nunca
construidos en ningún contrato anterior — quedan como pendiente explícito, no como deuda
oculta). Cada tick, un nodo productivo convierte TODO el insumo recibido ESE tick en producto,
sin acumulación entre ticks.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Crear nodo productivo

No existe todavía ninguna estructura de "nodo productivo" con receta.

FIX/OBJETIVO: función pura `crearNodoProductivo(categoria, ratioEntrada, ratioSalida,
produccionFija)` en `src/crearNodoProductivo.js`, con oráculo congelado en
`tests/test_crear_nodo_productivo.js`. `ratioEntrada`/`ratioSalida` son `null` cuando el nodo es
de extracción (usa `produccionFija`); `produccionFija` es `null` cuando el nodo depende de
insumo transportado (usa `ratioEntrada`/`ratioSalida`) — nunca ambos a la vez, ni ninguno.

Task contract: `knowledge/contracts/crear-nodo-productivo.md`.

## T2 — Producir en un tick

FIX/OBJETIVO: función que, dado un nodo productivo y la cantidad de insumo recibida en el tick
actual (irrelevante si el nodo es de extracción), calcula su producción de salida de ese tick —
usando [`calcularProduccion`](../knowledge/contracts/calcular-produccion.md) si el nodo depende
de insumo, o devolviendo `produccionFija` si es de extracción.

## T3 — Ejecutar la cadena bomba → granja

FIX/OBJETIVO: función de integración que arma un grid real (2 celdas: una neutra o verde para
la bomba, una verde para la granja), coloca ambos nodos (`colocarNodo`), los conecta por una
ruta real (`conectarVertices` entre sus vértices de entrada, vía `verticeEntrada`), y simula N
ticks completos usando el motor de tráfico real (`resolverViaje`/`resolverTickConTransito`
según corresponda): la bomba produce agua cada tick, esa agua viaja por la ruta real hacia la
granja, la granja recibe lo efectivamente entregado (con saturación real si aplica) y produce
manzanas. Devuelve el historial de producción por tick.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_crear_nodo_productivo.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `crear-nodo-productivo`.
- [ ] Final del contrato (cuando T1-T3 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/crearNodoProductivo.js`,
  `tests/test_crear_nodo_productivo.js`, `knowledge/contracts/crear-nodo-productivo.md`
  (conjunto disjunto de T2-T3, sin archivos asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: simular la cadena real revela que hace falta el almacén limitado por nodo para que
  el resultado sea coherente (ej. la granja no puede "guardar" agua sobrante de un tick con
  saturación) → PARAR, documentar con evidencia en el reporte, no improvisar un almacén
  implícito no contratado.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: nodo con `ratioEntrada`/`ratioSalida` Y `produccionFija` simultáneos (o
  ninguno de los dos) están en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T3.
- [x] Condición de aborto explícita para el contrato (arriba).
