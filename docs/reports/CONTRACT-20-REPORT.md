# CONTRACT-20 — Cadena de producción con fan-out — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-20-cadena-fanout.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 58 archivos) |
| Suite de tests | ✅ verde 2× (390 tests) | `node --test tests/test_*.js` — 390/390 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación (coordenadas de vértices verificadas a
mano para evitar colisiones) y verificación independiente después.

## T1 — Ejecutar cadena con fan-out

Entregado: `src/ejecutarCadenaFanOut.js` (`ejecutarCadenaFanOut()`). Primera integración del
proyecto con más de dos nodos productivos y ramificación: la bomba reparte su producción de
agua (`4`) entre la granja (`2` → `4` manzanas) y un nodo de reforestación (`2` → `1` árbol),
cada uno conectado por su propia ruta real (`conectarVertices` + `resolverViaje`). Confirma que
el patrón de integración escala sin necesitar cambios en ningún módulo existente — un mismo
vértice de origen puede tener múltiples conexiones salientes distintas.

Límite honesto documentado: el taller de tala real de `DEFINITION.md` (agua+comida+personas→
madera, 3 insumos) no pudo usarse porque `crearNodoProductivo` solo soporta receta de UN
insumo — se usó reforestación (agua→árboles, 1 insumo) como sustituto que sí demuestra el
patrón de fan-out sin necesitar esa extensión.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 58 archivos).
- El oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; el
  orquestador verificó a mano que las coordenadas elegidas producen vértices de entrada
  distintos entre los tres nodos, evitando el rechazo de auto-conexión/duplicado de
  `conectarVertices`.
- Tras la entrega: comparación de mtime confirmó que SOLO el archivo del `touch_only` de la
  tarea fue modificado — ninguna integración anterior fue tocada.
- Suite completa 2× consecutivas: 390/390 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- **Recetas multi-insumo**: para construir el taller de tala real (o la fábrica de muebles,
  agua+comida+personas o madera→muebles) hace falta extender `crearNodoProductivo` (o crear una
  variante) que soporte más de un insumo por receta — no construido, requeriría su propio
  contrato.
- El reparto de agua entre granja y reforestación es una constante fija (`2`/`2`), no una
  decisión dinámica basada en necesidad o prioridad — a diferencia de la lógica "población
  primero" de los Contratos 17-19.
- Sin comercio, tesorería, almacenes ni degradación en este escenario (alcance deliberadamente
  acotado al patrón de fan-out).
- Ningún flaky detectado.
