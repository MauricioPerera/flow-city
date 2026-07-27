# CONTRACT-23 — Comercio con patrón "comprador viaja al bien" — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-23-comercio-comprador-viaja-al-bien.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 63 archivos) |
| Suite de tests | ✅ verde 2× (412 tests) | `node --test tests/test_*.js` — 412/412 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación y verificación independiente después.

## T1 — Ejecutar comercio con patrón "comprador viaja al bien"

Entregado: `src/ejecutarComercioCompradorViajaAlBien.js`
(`ejecutarComercioCompradorViajaAlBien()`). Cierra el segundo patrón de venta de
`DEFINITION.md`, nunca antes integrado: un comprador viaja por una ruta real (tráfico
`personas`, `conectarVertices`/`resolverViaje`) hacia un comercio (restaurante); la venta se
resuelve como el mínimo entre las personas que llegan (demanda), el stock disponible y el aforo
disponible (`aforoDisponible`/`resolverVentaLocal`); el monto se registra como ingreso real en
tesorería (`calcularMontoVenta`/`registrarIngreso`).

Valores elegidos deliberadamente para que el AFORO sea el cuello de botella (no la demanda ni el
stock, el factor distintivo de este patrón frente al de Contrato 07/12): `personasQueViajan: 10`
→ `personasQueLlegan: 10` (sin saturación), `aforoDisp: 6`, `stockDisponible: 8` →
`ventaResuelta: 6`, `montoVenta: 18`.

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_comercio_comprador_viaja_al_bien.js`: 2/2 tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 63 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente).
- Suite completa 2× consecutivas: 412/412 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Sin producción, almacenes, degradación ni crecimiento poblacional real en este escenario
  (alcance deliberadamente acotado al patrón de venta).
- El primer intento de delegación de Contrato 22 había fallado por `403 Forbidden` (token de
  `pool` vencido); ya resuelto por el usuario, esta tarea corrió sin incidentes.
- Ningún flaky detectado.
