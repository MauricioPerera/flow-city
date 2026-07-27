# Contrato 20 — Cadena de producción con fan-out (más de 2 nodos)

Prerrequisitos: Contrato 09 (cadena real) completo. Todas las integraciones anteriores fueron
cadenas LINEALES (bomba → granja, 1 productor → 1 consumidor). `DEFINITION.md` describe otros
nodos que consumen agua (reforestación: 2 agua : 1 árbol) además de la granja — nunca se probó
que un mismo productor pueda alimentar a más de un consumidor en paralelo.

Alcance deliberadamente acotado: sin comercio ni tesorería (ya demostrados en otros
contratos) — el foco es probar que el patrón de integración escala a un grafo de producción
con ramificación (fan-out), no volver a demostrar venta/ingreso.

Nota honesta sobre un límite real descubierto al planificar este contrato: el taller de tala
de `DEFINITION.md` (agua + comida + personas → madera) tiene TRES insumos, pero
[`crearNodoProductivo`](../knowledge/contracts/crear-nodo-productivo.md) solo soporta receta de
UN insumo. Por eso este contrato usa reforestación (agua → árboles, un solo insumo) como el
tercer nodo — el taller de tala con receta multi-insumo queda fuera de alcance, requeriría una
extensión nueva de `crearNodoProductivo` no construida todavía.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena con fan-out

FIX/OBJETIVO: función `ejecutarCadenaFanOut()` que arma un grid con bomba, granja y un nodo de
reforestación; conecta la bomba a AMBOS por rutas reales separadas; reparte la producción de
agua de la bomba entre los dos consumidores (mitad y mitad); cada uno produce con su propia
receta.

Valores fijados: bomba `produccionFija: 4`; reparto `2` agua a la granja, `2` agua a
reforestación; granja ratio `1:2` (agua→manzanas); reforestación ratio `2:1` (agua→árboles).

Task contract: `knowledge/contracts/ejecutar-cadena-fanout.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_fanout.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-fanout`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaFanOut.js`, `tests/test_ejecutar_cadena_fanout.js`,
  `knowledge/contracts/ejecutar-cadena-fanout.md`. NO tocar ninguna integración anterior ni
  ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `conectarVertices` rechaza la segunda conexión desde el vértice de la bomba
  (tratándola como duplicada o inválida) → PARAR, documentar con evidencia que el modelo de
  grafo no soporta un vértice con múltiples conexiones distintas, antes de forzar una
  estructura de datos alternativa no contratada.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador verificó a mano que las coordenadas elegidas para bomba,
  granja y reforestación producen vértices de entrada DISTINTOS entre sí (evitando el error de
  auto-conexión de `conectarVertices`), antes de escribir el oráculo.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
