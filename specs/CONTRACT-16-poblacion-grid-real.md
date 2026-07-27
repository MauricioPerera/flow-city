# Contrato 16 — Población conectada al grid real

Prerrequisitos: Contrato 01 (`crearGrid`, `colocarNodo`) y Contrato 06 (`estaEnZonaInfluencia`,
`calcularCoberturaNecesidad`, `combinarCoberturas`, `calcularCrecimientoPoblacion`,
`capacidadManoDeObra`) completos. Ninguna integración anterior conectó población con el grid
real — "la única forma de construir casas es dentro de la zona de influencia de un centro
cívico" (`DEFINITION.md`) nunca se validó de punta a punta.

Alcance deliberadamente acotado: sin conectar todavía la producción real de agua/comida de la
cadena bomba→granja (Contratos 09-15) — los suministros de necesidades son constantes fijas de
esta integración. Sin costo de construcción (`construirNodoConCosto`) para casas/centro
cívico — sus categorías no están registradas en las tablas de costo del Contrato 14, y agregar
entradas ahí requeriría modificar oráculos ya sellados; se usa `colocarNodo` directo. Un solo
tick de crecimiento poblacional, no un ciclo multi-tick.

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas que impliquen código
> delegado llevan además su **task contract** CCDD en `knowledge/contracts/<task>.md`
> (validado por `scripts/validate_contracts.py`).

## T1 — Construir una casa en zona de influencia

No existe todavía ninguna función que valide la zona de influencia antes de construir.

FIX/OBJETIVO: función `construirCasaEnZona(grid, xCentro, yCentro, radio, xCasa, yCasa,
categoriaTerreno, nodo)` en `src/construirCasaEnZona.js`, con oráculo congelado en
`tests/test_construir_casa_en_zona.js`. Valida con `estaEnZonaInfluencia` ANTES de llamar a
`colocarNodo` — una casa fuera de zona no toca el grid.

Task contract: `knowledge/contracts/construir-casa-en-zona.md`.

## T2 — Población total de casas

FIX/OBJETIVO: función que suma la población de un array de casas construidas (cada una aporta
un número fijo de población).

## T3 — Ejecutar población en zona

FIX/OBJETIVO: función de integración que arma un grid real con un centro cívico y 3 intentos de
casa (2 dentro de la zona de influencia, 1 fuera — debe rechazarse sin tocar el grid), calcula
la población total, calcula cobertura de 2 necesidades (agua, comida) con suministros fijos,
las combina y calcula un tick de crecimiento poblacional y la mano de obra resultante.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1: `node tests/test_construir_casa_en_zona.js` exit 0.
- [ ] T1: `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `construir-casa-en-zona`.
- [ ] Final del contrato (cuando T1-T3 estén verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea: T1 → `src/construirCasaEnZona.js`,
  `tests/test_construir_casa_en_zona.js`, `knowledge/contracts/construir-casa-en-zona.md`
  (conjunto disjunto de T2-T3, sin archivos asignados hasta que se tomen).
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts
  pasan el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: conectar la cobertura de necesidades a la producción real de la cadena
  bomba-granja resulta necesario para que la integración sea coherente → PARAR, documentar con
  evidencia en el reporte que los suministros fijos son una simplificación deliberada, no
  inventar la conexión sin confirmarla.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: casa exactamente en el borde del radio (dentro) y casa justo fuera están
  en el oráculo antes de implementar T1.
- [x] Perímetro de T1 declarado y disjunto de T2-T3.
- [x] Condición de aborto explícita para el contrato (arriba).
