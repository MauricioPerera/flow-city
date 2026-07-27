# CONTRACT-05 — Tesorería — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-05-tesoreria.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 21 archivos) |
| Suite de tests | ✅ verde 2× (161 tests) | `node --test tests/test_*.js` — 161/161 ambas corridas, sin flaky |
| Test-command-gate | ✅ | `python scripts/validate_test_commands.py knowledge/contracts .` → `PASS` en los 21 contratos |

## T1 — Crear tesorería

Entregado: `src/crearTesoreria.js` (`crearTesoreria(saldoInicial)`). Saldo inicial debe ser no
negativo (empezar en quiebra no tiene sentido); decimales de moneda permitidos.

## T2 — Registrar gasto

Entregado: `src/registrarGasto.js` (`registrarGasto(tesoreria, monto)`). Confirmado en
conversación: NO bloquea el gasto por fondos insuficientes — el saldo puede quedar en 0 o
negativo (quiebra es un estado válido, sin derrota formal).

## T3 — Registrar ingreso

Entregado: `src/registrarIngreso.js` (`registrarIngreso(tesoreria, monto)`). Simétrica a
`registrarGasto`, sin lógica compartida (operación independiente, no su inverso reutilizado).

## T4 — Aplicar mantenimiento de un tick

Entregado: `src/aplicarMantenimientoTick.js` (`aplicarMantenimientoTick(tesoreria,
costosMantenimiento)`). Suma todos los costos de mantenimiento del tick y hace una única
llamada a `registrarGasto`; una lista vacía o de ceros es no-op (evita el `RangeError` que
`registrarGasto` lanzaría con monto `0`). Valida la `tesoreria` siempre, incluso cuando el
total termina siendo `0`.

## Verificación final (independiente, tras cada implementación)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 21 archivos) — corrido tras cada una de las 4 implementaciones de este
  contrato.
- `python scripts/validate_test_commands.py knowledge/contracts .`: `PASS` en los 21 contratos,
  corrido tras cada implementación.
- Suite completa 2× consecutivas: 161/161 ambas, exit 0, sin discrepancia entre corridas.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real;
  se confirmó estado rojo contra el stub antes de implementar, en las 4 tareas.

## Pendientes / ítems de seguimiento

- La consecuencia mecánica real de la quiebra (degradación de nodos cuando el saldo es 0 o
  negativo) sigue sin implementarse — solo el estado de saldo negativo existe, no sus efectos
  sobre el grid/producción.
- Fuera de alcance de este contrato: comercio (de dónde sale el monto de un ingreso real de
  venta), población, viajes multi-tick.
- Ningún flaky detectado.
