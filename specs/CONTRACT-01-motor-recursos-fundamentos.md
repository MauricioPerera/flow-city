# Contrato 01 — Motor de recursos: fundamentos

Prerrequisitos: `DEFINITION.md` cerrado. Ningún código existe todavía; este contrato abre la
implementación del motor de simulación de Flow City empezando por las funciones puras de
cálculo de recursos, que no dependen de estado de grid ni de rutas.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Cálculo de producción por ratio

No existe todavía ninguna función de producción. Toda construcción productiva (bomba de agua,
granja, reforestación, taller de tala, fábrica de muebles) necesita transformar un input de
recurso en un output según un ratio fijo.

FIX/OBJETIVO: función pura `calcularProduccion(entrada, ratioEntrada, ratioSalida)` en
`src/calcularProduccion.js`, con oráculo congelado en `tests/test_calcular_produccion.js`.
Invariante que no puede cambiar: aritmética entera con descarte del resto (floor), sin
fracciones ni acarreo entre llamadas.

Task contract: `knowledge/contracts/calcular-produccion.md`.

## T2 — Reglas de emplazamiento por terreno

Todavía no definida en detalle: `DEFINITION.md` deja abierto si construcciones no-extractivas
pueden emplazarse en celdas elevadas/agua profunda además de verdes. Se resuelve al tomar esta
tarea, antes de escribir su task contract.

FIX/OBJETIVO: función que determina si una categoría de construcción puede emplazarse en un
tipo de celda de terreno dado (verde, elevada, agua profunda, neutra).

## T3 — Saturación de tramo

FIX/OBJETIVO: función que determina el efecto de saturación (enlentecimiento o pérdida de
mercadería) de un tramo de ruta según su carga actual vs. su capacidad declarada.

## T4 — Modelo de grid/vértice

FIX/OBJETIVO: estructura de datos base de la grilla acotada por chunks y sus vértices como
puntos de conexión posibles.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_calcular_produccion.js` exit 0 (todos los tests del oráculo en
  verde).
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `calcular-produccion`.
- [ ] Final del contrato (cuando T1-T4 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/calcularProduccion.js`, `tests/test_calcular_produccion.js`,
  `knowledge/contracts/calcular-produccion.md` (conjunto disjunto de T2-T4, que aún no tienen
  archivos asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el ratio de una receta real de Flow City no es expresable como dos enteros
  positivos (ej. resulta ser una tasa continua) → PARAR, documentar con evidencia en el
  reporte, no forzar una aproximación silenciosa.

## Checklist antes de delegar

- [x] RECON corrido: `python --version` (3.14.6) y `node --version` (v24.16.0) confirmados
  disponibles en el entorno antes de elegir el lenguaje del target (Node stdlib, sin deps).
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: casos límite (entrada 0, ratio inválido, resto no divisible) están en el
  oráculo antes de implementar, para que no puedan pasar sin cumplir la intención.
- [x] Perímetro de T1 declarado y disjunto de T2-T4.
- [x] Condición de aborto explícita para T1 (arriba).
