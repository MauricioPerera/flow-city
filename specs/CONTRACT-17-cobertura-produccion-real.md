# Contrato 17 — Cobertura de necesidades conectada a la producción real

Prerrequisitos: Contratos 09 (cadena real), 06/16 (población, zona de influencia) completos.
El Contrato 16 dejó explícito como pendiente: "la cobertura de necesidades usa suministros
FIJOS de agua/comida, no conectados a la producción real de la cadena bomba-granja". Este
contrato lo cierra.

Decisión confirmada en conversación antes de escribir este contrato: **población primero** —
toma su cobertura de agua/comida ANTES que nada; el remanente sigue el camino normal (agua
sobrante de la bomba → granja para producir manzanas; manzanas sobrantes → comercio).

Alcance deliberadamente acotado: sin almacenes ni degradación (ya demostrados en los Contratos
11 y 15) — flujo instantáneo simple, como el Contrato 09 original, para aislar la única
novedad real de este contrato.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena con cobertura de población real

FIX/OBJETIVO: función `ejecutarCadenaConPoblacionReal()` que arma un grid real (bomba, granja,
una casa), calcula la población, y en un solo tick: la bomba produce agua → la población toma
su necesidad de agua PRIMERO → el agua sobrante se envía a la granja por la ruta real → la
granja produce manzanas → la población toma su necesidad de comida PRIMERO → las manzanas
sobrantes se venden al comercio, generando ingreso real en una tesorería. Calcula cobertura,
índice combinado y un tick de crecimiento poblacional con la producción REAL (no suministros
fijos).

Valores fijados (constantes internas): 1 casa con población `10`; necesidad per cápita `0.2`
tanto de agua como de comida (`aguaRequerida = comidaRequerida = poblacionActual * 0.2`);
`capacidadCompraComercio: 8`; `precioUnitario: 2`; `tasaBase: 0.1`.

Task contract: `knowledge/contracts/ejecutar-cadena-poblacion-real.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_poblacion_real.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-poblacion-real`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaConPoblacionReal.js`,
  `tests/test_ejecutar_cadena_poblacion_real.js`,
  `knowledge/contracts/ejecutar-cadena-poblacion-real.md`. NO tocar ninguna integración
  anterior ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: la producción real resulta insuficiente para cubrir la necesidad de población
  incluso tomándola primero (cobertura `< 1`) con los valores fijados → PARAR, documentar con
  evidencia en el reporte antes de recalibrar constantes sin confirmarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el escenario fue trazado a mano por el orquestador ANTES de escribir el
  oráculo, verificando que la producción real (`4` agua, `4` manzanas) alcanza para cubrir
  ambas necesidades (`2` cada una) con margen suficiente para seguir vendiendo al comercio.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
