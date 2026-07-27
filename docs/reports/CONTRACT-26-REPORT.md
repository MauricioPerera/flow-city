# CONTRACT-26 — Población con más de un centro cívico — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-26-poblacion-multiples-centros.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 66 archivos) |
| Suite de tests | ✅ verde 2× (418 tests) | `node --test tests/test_*.js` — 418/418 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación (coordenadas de centros y casas verificadas
a mano contra la fórmula Chebyshev de `estaEnZonaInfluencia`) y verificación independiente
después.

## T1 — Ejecutar población con múltiples centros cívicos

Entregado: `src/ejecutarPoblacionMultiplesCentros.js`
(`ejecutarPoblacionMultiplesCentros()`). Primera integración con más de un centro cívico:
define dos centros con zonas de influencia que se solapan parcialmente y prueba las 4
combinaciones relevantes — una casa cubierta solo por el centro 1, una solo por el centro 2,
una en la celda de solapamiento (cubierta por ambos, se acepta una sola vez) y una fuera de
ambas zonas (rechazada). Regla de aceptación: unión de zonas (`Array.prototype.some`), no
intersección.

Resultado: `3` de `4` casas construidas, `poblacionTotal: 30`.

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_poblacion_multiples_centros.js`: 2/2 tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 66 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente) — `construirCasaEnZona.js` y `estaEnZonaInfluencia.js`
  no fueron tocados.
- Suite completa 2× consecutivas: 418/418 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Sin producción, comercio, tesorería, degradación ni crecimiento poblacional tick a tick en
  este escenario (alcance deliberadamente acotado a la regla de construcción con múltiples
  centros).
- No se probó qué pasa si dos centros están tan cerca que sus zonas cubren la MISMA celda ya
  ocupada por una casa de otro intento — en este escenario cada casa se intenta en una celda
  distinta, sin colisión de `colocarNodo`.
- Ningún flaky detectado.
