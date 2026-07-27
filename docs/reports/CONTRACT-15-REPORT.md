# CONTRACT-15 — Integración completa: producción, comercio, tesorería y degradación — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-15-integracion-completa-degradacion.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 51 archivos) |
| Suite de tests | ✅ verde 2× (364 tests) | `node --test tests/test_*.js` — 364/364 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `glm-5.2:cloud`**, con contrato + oráculo congelado autorados
por el orquestador antes de la delegación. Dada la complejidad (8 ticks con transición
quiebra→degradación→recuperación), el orquestador trazó a mano el escenario COMPLETO antes de
escribir el oráculo, verificando saldo y contador tick a tick — el oráculo no depende de que la
implementación "confirme" un cálculo no verificado independientemente. La implementación de GLM
siguió el algoritmo paso a paso tal como se especificó en el prompt, sin desviaciones.

## T1 — Ejecutar la cadena completa con degradación

Entregado: `src/ejecutarCadenaCompleta.js` (`ejecutarCadenaCompleta(numTicks)`). Combina TODO lo
construido hasta ahora: `construirNodoConCosto` (gasto real de construcción, saldo inicial `50`
vs. costo total `80` — arranca en quiebra por sobre-construcción deliberada), producción cruda
(`producirTickNodo`) + degradación (`aplicarDegradacionProduccion`) aplicada ANTES del gating de
almacén (no usa `producirTickNodoConAlmacen` porque no tiene punto de inyección para la
degradación), transporte real (`resolverViaje`), comercio (`resolverCompraAlmacen` +
`calcularMontoVenta` + `registrarIngreso`), mantenimiento (`calcularMantenimientoTotal` +
`aplicarMantenimientoTick`), y actualización del contador de quiebra
(`actualizarContadorQuiebra` + `estaNodoDegradado`) al final de cada tick.

Corrida en vivo a 10 ticks confirmó el ciclo económico completo y coherente: quiebra inicial
(saldo `-17`) → degradación progresiva a partir del tick `2` (producción a la mitad, saldo
subiendo de a `+1`/tick) → cruce a saldo positivo en el tick `6` → recuperación completa en el
tick `7` (producción vuelve a `4`/`8`) → crecimiento sostenido (`+13`/tick) en los ticks
siguientes.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 51 archivos).
- El oráculo (tabla `ESPERADO` de 8 ticks, campo por campo) se escribió y selló
  (`tests_sha256`) ANTES de existir la implementación real, basado en un trazado manual
  independiente del orquestador.
- Tras la entrega de GLM: comparación de mtime confirmó que SOLO el archivo del `touch_only` de
  la tarea fue modificado (más su propio reporte local) — ninguna integración anterior
  (Contratos 09, 11, 12) fue tocada.
- Corrida en vivo (`node -e ...`) a 10 ticks, más allá del oráculo (que cubre 8), confirmando
  que el ciclo de recuperación se sostiene correctamente más allá del punto de prueba.
- Suite completa 2× consecutivas: 364/364 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- La degradación se aplica de forma IDÉNTICA y SIMULTÁNEA a ambos nodos (bomba y granja) según
  un único contador global de tesorería — el efecto se COMPONE (agua de la bomba ya reducida a
  la mitad, y la conversión de esa agua en manzanas también reducida a la mitad), resultando en
  una caída de producción más que proporcional durante la quiebra. Es un efecto emergente
  observado, no un bug, pero vale la pena documentarlo si se agregan más nodos en cadena.
- El escenario numérico completo (saldo inicial `50`, costos `50`/`30`, mantenimiento `2`/`1`,
  umbral de degradación `2`) es una combinación de constantes elegida por el orquestador para
  producir un ciclo demostrable en pocos ticks — no deriva de ninguna regla de balance de
  `DEFINITION.md`.
- Esta es la integración de referencia del proyecto hasta la fecha, pero sigue sin cubrir:
  población conectada al grid real, comercio con patrón "comprador viaja al bien", viajes
  multi-tick orquestados dentro de esta misma cadena, ni más de dos nodos productivos.
- Ningún flaky detectado.
