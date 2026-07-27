# CONTRACT-04 — Motor de tráfico por tick — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-04-motor-trafico-tick.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 17 archivos) |
| Suite de tests | ✅ verde 2× (131 tests) | `node --test tests/test_*.js` — 131/131 ambas corridas, sin flaky |
| Test-command-gate | ✅ | `python scripts/validate_test_commands.py knowledge/contracts .` → `PASS` en los 17 contratos |

## T1 — Calendario de tick

Entregado: `src/calendarioDeTick.js` (`calendarioDeTick(numeroTick)`). Confirmó en conversación:
un tick equivale a un día completo (las 3 fases son sub-pasos internos, no ticks separados).
Jerarquía fija semana(7)→mes(4 sem)→estación(3 meses)→año(4 estaciones), nombres de estación
sin tilde/eñe por consistencia ASCII con el resto del proyecto.

## T2 — Registrar carga en tramo

Entregado: `src/registrarCargaTramo.js` (`registrarCargaTramo(tramo, tipoTraficoConsulta,
cantidad)`). La capacidad de un tramo es un límite compartido de tráfico total, no cuotas
separadas por tipo — mercadería y personas acumulan sobre el mismo `cargaActual`.

## T3 — Resolver un viaje

Entregado: `src/resolverViaje.js` (`resolverViaje(grafo, origen, destino, tipoTrafico,
cantidad)`). Modelo de pérdida: la `perdida` absoluta de `calcularSaturacion` se convierte a
fracción (`perdida / cargaActual`) y se aplica proporcionalmente a la cantidad de ESTE viaje;
las pérdidas de tramos consecutivos se componen (multiplican). La velocidad efectiva del viaje
es el `factorVelocidad` mínimo entre los tramos atravesados (cuello de botella). Esta función no
registra carga — asume que ya fue acumulada por quien orquesta el tick.

## T4 — Resolver un tick completo

Entregado: `src/resolverTick.js` (`resolverTick(grafo, viajes)`). Orquesta las tres piezas
anteriores en dos fases estrictas: (1) reiniciar `cargaActual` de todos los tramos del grafo y
acumular la carga de TODOS los viajes del tick antes de resolver ninguno; (2) recién entonces
resolver cada viaje, para que la saturación refleje el total agregado y no dependa del orden de
llegada. Test dedicado confirma que resolver dos viajes que comparten un tramo da un resultado
distinto (y correcto) del que darían si se resolvieran aislados uno por uno.

## Verificación final (independiente, tras cada implementación)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 17 archivos) — corrido tras cada una de las 4 implementaciones de este
  contrato.
- `python scripts/validate_test_commands.py knowledge/contracts .`: `PASS` en los 17 contratos,
  corrido tras cada implementación.
- Suite completa 2× consecutivas: 131/131 ambas, exit 0, sin discrepancia entre corridas.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real;
  se confirmó estado rojo contra el stub antes de implementar, en las 4 tareas.

## Pendientes / ítems de seguimiento

- Viajes cuya distancia implica más de 1 tick de tránsito (`DEFINITION.md`: "la distancia real
  de un tramo determina cuántos ticks tarda un trayecto") NO están modelados todavía —
  `resolverViaje`/`resolverTick` resuelven cada viaje de forma instantánea dentro de un único
  tick. Es la condición de aborto que el spec de este contrato dejó explícita y que no se
  disparó porque no se llegó a construir esa parte; queda como alcance futuro genuino, no como
  deuda oculta.
- Fuera de alcance de este contrato: tesorería, comercio, población, tres fases internas del
  día (trabajo/sueño/libre) como generadoras concretas de los `viajes` de un tick — hoy
  `resolverTick` recibe la lista de viajes ya armada, no la genera.
- Ningún flaky detectado.
