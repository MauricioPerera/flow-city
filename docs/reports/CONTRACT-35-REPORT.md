# CONTRACT-35 — Nivel de granja — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-35-nivel-de-granja.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 82 archivos) |
| Suite de tests | ✅ verde 2× (475 tests) | `node --test tests/test_*.js` — 475/475 ambas corridas, sin flaky |

Primer contrato del roadmap de niveles que llega a producción real. Sienta el patrón (tabla de
factor propia del dominio, sin módulo "sistema de niveles" compartido) que se repite, con sus
propias tablas, en los contratos siguientes.

## Delegación

Tres tareas, **implementadas por `pool` (Poolside CLI)**. T1 y T2 delegadas en paralelo (sin
dependencia mutua), T3 delegada después de verificar ambas (las requiere). Ejecución autónoma,
sin pausar entre tareas.

## T1 — Factor de rendimiento de granja por nivel

`src/calcularFactorRendimientoGranjaPorNivel.js`. Tabla fija `{S:1, M:2, L:3}`.

## T2 — Costo de construcción de granja por nivel

`src/calcularCostoConstruccionGranjaPorNivel.js`. Compone el costo base ya existente
(`costoConstruccionNodo('agricultura')`, `30`) con un recargo `{S:0, M:20, L:50}`.

## T3 — Ejecutar producción de granja por nivel

`src/ejecutarProduccionGranjaPorNivel.js`. Con la misma agua recibida (`4`) en los 3 niveles,
demuestra que la producción cruda (`8`, idéntica) se multiplica por el factor de nivel:
`8/16/24` manzanas para `S/M/L`, con costo creciente `30/50/80`.

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `4/4`, `4/4`, `2/2` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `crearNodoProductivo.js`, `producirTickNodo.js` y `costoConstruccionNodo.js`
  nunca tocados.
- Suite completa 2× consecutivas al cierre: 475/475 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- El nivel no se combina todavía con almacenes, comercio, tesorería real, degradación ni
  población en la misma integración — alcance deliberadamente acotado a demostrar el efecto del
  nivel en aislamiento.
- Ningún flaky detectado.
