# CONTRACT-17 — Cobertura de necesidades conectada a la producción real — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-17-cobertura-produccion-real.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 55 archivos) |
| Suite de tests | ✅ verde 2× (380 tests) | `node --test tests/test_*.js` — 380/380 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación (escenario trazado a mano) y verificación
independiente después.

## T1 — Ejecutar cadena con cobertura de población real

Entregado: `src/ejecutarCadenaConPoblacionReal.js` (`ejecutarCadenaConPoblacionReal()`). Cierra
el ítem de seguimiento explícito del Contrato 16. Decisión confirmada en conversación:
**población primero** — toma su necesidad de agua directamente de la producción de la bomba
(antes de enviar el remanente a la granja) y su necesidad de comida directamente de la
producción de la granja (antes de vender el remanente al comercio). Con los valores fijados (1
casa, `10` de población, necesidad `0.2`/cápita, bomba `4`, ratio granja `1:2`), la producción
real cubre exactamente ambas necesidades (`cobertura: 1` en ambas) y todavía deja excedente
para vender (`2` manzanas, ingreso `4`), demostrando un ciclo saludable de punta a punta:
producción → cobertura de población → excedente vendido → crecimiento poblacional (`+1`).

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 55 archivos).
- El oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real,
  basado en un trazado manual independiente del orquestador confirmando que la producción
  alcanza para cubrir ambas necesidades con margen.
- Tras la entrega: comparación de mtime confirmó que SOLO el archivo del `touch_only` de la
  tarea fue modificado — ninguna integración anterior fue tocada.
- Suite completa 2× consecutivas: 380/380 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Este contrato deliberadamente NO incluye almacenes ni degradación (ya demostrados en los
  Contratos 11 y 15) — una integración futura podría combinar ambos con esta conexión
  población↔producción para un escenario más completo (y potencialmente uno donde la
  producción NO alcance, ejercitando cobertura `< 1` y decrecimiento poblacional real).
- La condición de aborto del contrato (producción insuficiente para cubrir la necesidad) no se
  disparó — los valores elegidos garantizaron cobertura completa; sigue sin probarse el caso de
  escasez real conectado a producción real.
- Ningún flaky detectado.
