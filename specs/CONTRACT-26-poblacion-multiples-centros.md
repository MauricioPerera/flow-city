# Contrato 26 — Población con más de un centro cívico

Prerrequisitos: Contrato 06 (`esta-en-zona-influencia`) y Contrato 16
(`construir-casa-en-zona`/`ejecutar-poblacion-en-zona`) — ambos verificados SOLO con UN centro
cívico. `DEFINITION.md` no limita el número de centros cívicos; nunca se probó que una casa
pueda construirse por estar dentro de la zona de CUALQUIERA de varios centros, ni qué pasa en
una celda cubierta por el solapamiento de dos zonas.

Alcance deliberadamente acotado: sin producción, comercio, tesorería, degradación ni
crecimiento poblacional tick a tick (ya demostrados en otros contratos) — el foco es
exclusivamente la regla de construcción con múltiples centros: una casa se acepta si su celda
cae dentro del radio de AL MENOS UNO de los centros (unión de zonas, no intersección), sin
duplicar población en la celda de solapamiento.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar población con múltiples centros cívicos

FIX/OBJETIVO: función `ejecutarPoblacionMultiplesCentros()` que define dos centros cívicos con
zonas de influencia que se solapan parcialmente, intenta construir 4 casas (una cubierta solo
por el centro 1, una solo por el centro 2, una en la zona de solapamiento de ambos, una fuera de
ambas zonas) y reporta cuáles se construyeron y la población total resultante.

Valores fijados: grid `6x6` terreno `neutra`; centro 1 en `(1,1)` radio `2`; centro 2 en
`(4,4)` radio `2` (zonas se solapan en las celdas con `x` e `y` entre `2` y `3`); casas
intentadas en `(0,0)` (solo centro 1), `(5,5)` (solo centro 2), `(3,3)` (ambos centros — celda
de solapamiento), `(0,5)` (fuera de ambas zonas, debe rechazarse); cada casa construida aporta
`10` de población.

Task contract: `knowledge/contracts/ejecutar-poblacion-multiples-centros.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_poblacion_multiples_centros.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-poblacion-multiples-centros`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarPoblacionMultiplesCentros.js`,
  `tests/test_ejecutar_poblacion_multiples_centros.js`,
  `knowledge/contracts/ejecutar-poblacion-multiples-centros.md`. NO tocar
  `src/construirCasaEnZona.js`, `src/estaEnZonaInfluencia.js` ni ninguna integración anterior.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: la celda de solapamiento `(3,3)` NO resulta cubierta por ambos centros según
  `estaEnZonaInfluencia` (indicaría un error en las coordenadas elegidas) → PARAR, documentar,
  recalcular antes de forzar el resultado esperado.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador verificó a mano, con la fórmula Chebyshev de
  `estaEnZonaInfluencia`, que `(0,0)` solo cae en la zona del centro 1, `(5,5)` solo en la del
  centro 2, `(3,3)` en ambas, y `(0,5)` en ninguna.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
