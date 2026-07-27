# CONTRACT-14 — Gasto de tesorería en construcción y mantenimiento — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-14-gasto-tesoreria-construccion.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 50 archivos) |
| Suite de tests | ✅ verde 2× (358 tests) | `node --test tests/test_*.js` — 358/358 ambas corridas, sin flaky |

## Delegación

Las 4 tareas (T1-T4) fueron **implementadas por `glm-5.2:cloud`**, con contrato + oráculo
congelado autorados por el orquestador antes de cada delegación y verificación independiente
después de cada una.

## T1 — Costo de construcción de un nodo

Entregado: `src/costoConstruccionNodo.js` (`costoConstruccionNodo(categoria)`). Tabla explícita
(`'extraccion-agua': 50`, `'agricultura': 30`), sin valor por defecto para categorías
desconocidas.

## T2 — Costo de mantenimiento de un nodo

Entregado: `src/costoMantenimientoNodo.js` (`costoMantenimientoNodo(categoria)`). Análoga a T1
(`'extraccion-agua': 2`, `'agricultura': 1`).

## T3 — Construir un nodo con costo

Entregado: `src/construirNodoConCosto.js` (`construirNodoConCosto(grid, tesoreria, x, y,
categoriaTerreno, categoriaCosto, nodo)`). Orden de ejecución deliberado: costo calculado
primero (falla barata sin efectos secundarios), colocación después, gasto solo si ambos pasos
anteriores tuvieron éxito. Distingue explícitamente `categoriaTerreno` (vocabulario de
`colocarNodo`) de `categoriaCosto` (vocabulario de `crearNodoProductivo`/costos).

## T4 — Calcular mantenimiento total

Entregado: `src/calcularMantenimientoTotal.js` (`calcularMantenimientoTotal(categorias)`). Suma
el costo de mantenimiento de un conjunto de nodos activos, listo para pasar a
`aplicarMantenimientoTick` (Contrato 05).

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 50 archivos) — corrido tras cada una de las 4 implementaciones.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar, en las 4 tareas.
- Tras cada entrega de GLM: comparación de mtime confirmó que SOLO el archivo del `touch_only`
  de la tarea fue modificado (más su propio reporte local).
- Suite completa 2× consecutivas: 358/358 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- `construirNodoConCosto` y `calcularMantenimientoTotal` siguen sin integrarse a ninguna
  cadena real (`ejecutarCadenaBombaGranjaComercio` u otra) — la cadena existente construye sus
  nodos con `colocarNodo` directo, sin costo. Sería la integración natural de un contrato
  futuro, junto con `aplicarMantenimientoTick` y potencialmente la degradación (Contrato 13).
- Los costos de construcción (`50`/`30`) y mantenimiento (`2`/`1`) son valores fijados por el
  orquestador, no derivados de `DEFINITION.md` ni de ninguna regla de balance — quedan como
  parámetros a ajustar cuando exista una integración real que los ejercite.
- Solo hay dos categorías registradas (`'extraccion-agua'`, `'agricultura'`) — cualquier tipo
  de nodo nuevo (taller de tala, fábrica de muebles, casa, centro cívico, comercio) necesita su
  propia entrada en ambas tablas antes de poder construirse con costo.
- Ningún flaky detectado.
