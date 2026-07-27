# CONTRACT-08 — Viajes multi-tick — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-08-viajes-multitick.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 34 archivos) |
| Suite de tests | ✅ verde 2× (258 tests) | `node --test tests/test_*.js` — 258/258 ambas corridas, sin flaky |

## Delegación

Las 4 tareas de este contrato (T1-T4) fueron **implementadas por `glm-5.2:cloud`** (vía
`ollama launch claude`), con el contrato + oráculo congelado autorados por el orquestador antes
de cada delegación, y verificación independiente del orquestador (re-corrida de tests + gate +
chequeo de `touch_only` real vía `git`/`find`) después de cada una.

## T1 — Calcular ticks de viaje

Entregado (Claude): `src/calcularTicksViaje.js` (`calcularTicksViaje(distanciaTotal,
velocidadBase)`). `Math.ceil`, nunca `round`/`floor` — un trayecto parcial ocupa el tick
completo.

## T2 — Iniciar viaje en tránsito

Entregado (GLM): `src/iniciarViajeEnTransito.js` (`iniciarViajeEnTransito(camino, tipoTrafico,
cantidad, ticksRestantes)`). GLM detectó y reportó honestamente una discrepancia menor del
orquestador (el enunciado decía "8 tests", el oráculo real tiene 7) — confirmado por
verificación independiente.

## T3 — Avanzar viaje en tránsito un tick

Entregado (GLM): `src/avanzarViajeTick.js` (`avanzarViajeTick(viajeEnTransito, grafo)`).
Reutiliza `calcularSaturacion` para el modelo de pérdida proporcional compuesta, sin llamar a
`encontrarRuta` (el camino ya está fijo desde el inicio del tránsito).

## T4 — Resolver tick con tránsito

Entregado (GLM): `src/resolverTickConTransito.js` (`resolverTickConTransito(grafo,
viajesEnTransito)`). Valida la forma de TODOS los viajes antes de mutar el grafo; reinicia
cargas; acumula el camino completo de cada viaje (no solo un tramo) antes de avanzar ninguno;
separa `llegados` de `enTransito` preservando orden.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 34 archivos) — corrido tras cada una de las 4 implementaciones.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar, en las 4 tareas.
- Tras cada entrega de GLM: `find`/comparación de mtime confirmó que SOLO el archivo del
  `touch_only` de la tarea fue modificado (más su propio reporte local, cuando lo escribió).
- Suite completa 2× consecutivas: 258/258 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- La decisión de CUÁNDO convertir un viaje nuevo en viaje en tránsito (usar
  `calcularTicksViaje` + `iniciarViajeEnTransito` vs. resolución instantánea de
  `resolverViaje`/`resolverTick` del Contrato 04) sigue sin resolverse — es responsabilidad de
  quien orqueste el bucle de juego, no de un contrato de este proyecto todavía.
- La saturación se fija con la carga acumulada del tick en que el viaje LLEGA, no varía tick a
  tick durante el tránsito intermedio — límite explícito documentado en la condición de aborto
  del spec (no se disparó porque el diseño ya lo asumía desde el inicio).
- Ningún flaky detectado.
