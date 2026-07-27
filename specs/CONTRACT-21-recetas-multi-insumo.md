# Contrato 21 — Recetas multi-insumo

Prerrequisitos: Contrato 09 (`crearNodoProductivo`) y Contrato 20 (`ejecutarCadenaFanOut`,
donde quedó documentado que el taller de tala real de `DEFINITION.md` no se podía construir por
esta limitación). `crearNodoProductivo` solo soporta receta de UN insumo — no se modifica (su
oráculo está sellado); este contrato agrega un modelo NUEVO, independiente, para recetas de
2 o más insumos.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Crear nodo productivo multi-insumo

No existe todavía ninguna estructura de receta con más de un insumo.

FIX/OBJETIVO: función pura `crearNodoProductivoMultiInsumo(categoria, receta, ratioSalida)` en
`src/crearNodoProductivoMultiInsumo.js`, con oráculo congelado en
`tests/test_crear_nodo_productivo_multi_insumo.js`. `receta` es un array de `{ nombre,
ratioEntrada }`, con AL MENOS 2 elementos (si tuviera 1 solo insumo, correspondería al modelo
existente de `crearNodoProductivo`, no a este).

Task contract: `knowledge/contracts/crear-nodo-productivo-multi-insumo.md`.

## T2 — Producir en un tick con múltiples insumos

FIX/OBJETIVO: función que, dado un nodo multi-insumo y las cantidades recibidas de cada uno,
calcula la producción limitada por el insumo más escaso (cuello de botella): para cada insumo
se calculan cuántas "tandas" completas permite (`floor(recibido / ratioEntrada)`), y la
producción real es el mínimo de esas tandas multiplicado por `ratioSalida`.

## T3 — Ejecutar el taller de tala

FIX/OBJETIVO: integración real del taller de tala de `DEFINITION.md` (agua + comida + personas
→ madera), con cantidades fijas de cada insumo elegidas para que UNO de los tres sea
deliberadamente el limitante (demuestra el cuello de botella, no solo el camino feliz donde
todos alcanzan igual).

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_crear_nodo_productivo_multi_insumo.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `crear-nodo-productivo-multi-insumo`.
- [ ] Final del contrato (cuando T1-T3 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/crearNodoProductivoMultiInsumo.js`,
  `tests/test_crear_nodo_productivo_multi_insumo.js`,
  `knowledge/contracts/crear-nodo-productivo-multi-insumo.md` (conjunto disjunto de T2-T3, sin
  archivos asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: aparece un requisito de recetas con insumos OPCIONALES (no todos obligatorios
  para producir) → PARAR, documentar con evidencia en el reporte, no inventar esa variante sin
  confirmarla — el modelo de este contrato asume TODOS los insumos obligatorios.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: receta con 1 solo insumo (debe rechazarse), insumos con nombres
  duplicados, y ratios inválidos están en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T3.
- [x] Condición de aborto explícita para el contrato (arriba).
