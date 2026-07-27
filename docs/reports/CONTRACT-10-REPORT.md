# CONTRACT-10 — Almacenes limitados por nodo — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-10-almacenes.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 41 archivos) |
| Suite de tests | ✅ verde 2× (307 tests) | `node --test tests/test_*.js` — 307/307 ambas corridas, sin flaky |

## Delegación

Las 4 tareas (T1-T4) fueron **implementadas por `glm-5.2:cloud`**, con contrato + oráculo
congelado autorados por el orquestador antes de cada delegación y verificación independiente
después. T3 y T4 se delegaron en cadena, sin pausa entre medio, a pedido explícito del usuario
("intenta concatenar tareas para avanzar más rápido") — los contratos de ambas se escribieron
por adelantado y se lanzó T4 apenas T3 quedó verificado.

## T1 — Crear almacén

Entregado: `src/crearAlmacen.js` (`crearAlmacen(capacidadMateriaPrima, capacidadProducto)`).
Capacidades y stocks separados para materia prima y producto.

## T2 — Agregar stock a un almacén

Entregado: `src/agregarStockAlmacen.js` (`agregarStockAlmacen(almacen, campo, cantidad)`).
Clampea al espacio disponible, devuelve `{ aceptado, rechazado }` en vez de lanzar error por
almacén lleno.

## T3 — Retirar stock de un almacén

Entregado: `src/retirarStockAlmacen.js` (`retirarStockAlmacen(almacen, campo, cantidad)`).
Simétrica a T2, clampea al stock disponible. No se usó en T4 (sirve para transporte de salida,
fuera del alcance de esta integración puntual).

## T4 — Producir en un tick con almacén

Entregado: `src/producirTickNodoConAlmacen.js` (`producirTickNodoConAlmacen(nodo, almacen,
entradaRecibida)`). Implementa la decisión confirmada en conversación: producción todo-o-nada
según el espacio disponible del almacén de producto — si no entra completa, no se produce nada
ese tick (ni se toca el almacén).

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 41 archivos) — corrido tras cada una de las 4 implementaciones.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar, en las 4 tareas.
- Tras cada entrega de GLM: comparación de mtime confirmó que SOLO el archivo del `touch_only`
  de la tarea fue modificado (más su propio reporte local).
- Suite completa 2× consecutivas: 307/307 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- `retirarStockAlmacen` (T3) todavía no está conectado a ningún flujo de transporte real (el
  "mover lo producido a almacenes extra" de `DEFINITION.md`) — queda disponible para una
  integración futura.
- El almacén de MATERIA PRIMA (capacidad, `agregarStockAlmacen`/`retirarStockAlmacen` sobre ese
  campo) no se ejercitó todavía en ninguna integración real — solo el de producto, vía T4.
- La integración del Contrato 09 (`ejecutarCadenaBombaGranja`) sigue sin usar almacenes; una
  integración futura debería combinarla con este contrato para una cadena fiel a
  `DEFINITION.md`.
- Ningún flaky detectado.
