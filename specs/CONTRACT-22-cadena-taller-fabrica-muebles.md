# Contrato 22 — Cadena taller de tala → fábrica de muebles

Prerrequisitos: Contrato 21 (recetas multi-insumo, `ejecutar-taller-de-tala`) y Contrato 20
(integración de más de un nodo en el grid, fan-out) completos. `DEFINITION.md` describe la
fábrica de muebles (madera → muebles) como el consumidor real de la madera del taller de tala —
nunca se conectó esa salida a un consumidor real por una ruta.

Alcance deliberadamente acotado: sin comercio ni tesorería (ya demostrados en otros contratos),
sin almacenes (ya demostrado en Contrato 10/11) — el foco es probar que la salida de un nodo
multi-insumo (taller de tala) puede alimentar, por una ruta real, a un nodo de receta simple de
UN insumo (fábrica de muebles, `crearNodoProductivo` modo receta).

Nota de diseño: la fábrica de muebles usa `crearNodoProductivo`/`producirTickNodo` (no la
variante multi-insumo), porque su receta real (madera → muebles) tiene un solo insumo —
`crearNodoProductivoMultiInsumo` exige ≥2 insumos y no aplica aquí.

Ratio elegido para la fábrica de muebles (no especificado numéricamente en `DEFINITION.md`):
`2 madera : 1 mueble` — consistente con el estilo de otros ratios ya fijados en el proyecto
(reforestación `2:1`), y elegido para que sobre 1 unidad de madera sin convertir (`3 madera`
recibida, `floor(3/2) = 1` tanda), demostrando que la conversión usa división real y no un
mapeo 1:1 trivial.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena taller de tala → fábrica de muebles

FIX/OBJETIVO: función `ejecutarCadenaTallerFabricaMuebles()` que arma un grid con el taller de
tala (nodo multi-insumo) y la fábrica de muebles (nodo receta simple), conectados por una ruta
real; el taller produce madera a partir de insumos fijos (mismos valores que
`ejecutarTallerDeTala`: agua `10`, comida `10`, personas `6`), toda la madera producida se envía
por la ruta a la fábrica, que la convierte en muebles.

Valores fijados: receta taller `agua:1, comida:1, personas:2 -> madera:1` (igual a Contrato 21);
fábrica de muebles ratio `2:1` (madera→muebles); grid y conexión (posiciones `(0,0)`/`(1,0)`,
vértices `este`/`oeste`, tramo `carretera` capacidad `10`) igual al patrón ya verificado en
Contrato 20 (bomba→granja) para evitar cualquier riesgo de colisión de vértices.

Task contract: `knowledge/contracts/ejecutar-cadena-taller-fabrica-muebles.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_taller_fabrica_muebles.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-taller-fabrica-muebles`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaTallerFabricaMuebles.js`,
  `tests/test_ejecutar_cadena_taller_fabrica_muebles.js`,
  `knowledge/contracts/ejecutar-cadena-taller-fabrica-muebles.md`. NO tocar ninguna integración
  anterior ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: la ruta entre el taller y la fábrica satura por debajo de la madera producida
  (capacidad `10` >> madera `3`, no debería ocurrir) → PARAR, documentar, no forzar un valor de
  capacidad distinto sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: coordenadas/vértices reusan EXACTAMENTE el patrón bomba→granja de
  Contrato 20, ya verificado como libre de colisión — no se introduce riesgo nuevo.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
