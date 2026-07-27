# CONTRACT-07 — Comercio: compra y venta — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-07-comercio.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 30 archivos) |
| Suite de tests | ✅ verde 2× (227 tests) | `node --test tests/test_*.js` — 227/227 ambas corridas, sin flaky |
| Test-command-gate | ✅ | `python scripts/validate_test_commands.py knowledge/contracts .` → `PASS` en los 30 contratos |

## T1 — Aforo disponible de un comercio

Entregado: `src/aforoDisponible.js` (`aforoDisponible(aforoMaximo, ocupacionActual)`). Clampea
en `0` (nunca negativo); ocupación mayor al máximo se trata defensivamente, no como error.

## T2 — Calcular monto de venta

Entregado: `src/calcularMontoVenta.js` (`calcularMontoVenta(cantidad, precioUnitario)`). Acepta
`cantidad` fraccionaria a propósito, porque puede provenir de la cantidad `entregado` de
`resolverViaje` (Contrato 04), ya fraccionaria por pérdida proporcional de saturación.

## T3 — Resolver compra en almacén

Entregado: `src/resolverCompraAlmacen.js` (`resolverCompraAlmacen(cantidadOfrecida,
capacidadCompraAlmacen)`). Implementa literalmente la regla de `DEFINITION.md` para comercio
inter-zona: el mínimo entre lo ofrecido y la capacidad de compra del destino.

## T4 — Resolver venta local

Entregado: `src/resolverVentaLocal.js` (`resolverVentaLocal(demanda, stockDisponible,
aforoDisponible)`). Mínimo de los tres factores. Simplificación explícita y documentada: 1
unidad de demanda = 1 comprador (mismas unidades que aforo).

## Verificación final (independiente, tras cada implementación)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 30 archivos) — corrido tras cada una de las 4 implementaciones de este
  contrato.
- `python scripts/validate_test_commands.py knowledge/contracts .`: `PASS` en los 30 contratos,
  corrido tras cada implementación.
- Suite completa 2× consecutivas: 227/227 ambas, exit 0, sin discrepancia entre corridas.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real;
  se confirmó estado rojo contra el stub antes de implementar, en las 4 tareas.

## Pendientes / ítems de seguimiento

- Ninguna pieza de este contrato está todavía conectada al motor de tráfico real (el patrón
  "bien viaja al comprador" seguiría necesitando pasar por `resolverViaje`/`resolverTick`, no
  implementado como integración) ni al grid real (comercios, almacenes y estaciones como nodos
  concretos).
- Fuera de alcance de este contrato: viajes multi-tick, consecuencias de la quiebra.
- Ningún flaky detectado.
