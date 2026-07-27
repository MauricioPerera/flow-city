# CONTRACT-32 — Integración de referencia ampliada — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-32-cadena-referencia-ampliada.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 73 archivos) |
| Suite de tests | ✅ verde 2× (436 tests) | `node --test tests/test_*.js` — 436/436 ambas corridas, sin flaky |

## Decisión de alcance

Presentada al usuario antes de escribir el contrato: combinar TODO el ecosistema (multi-insumo,
ambos patrones de comercio, calendario, clima, degradación, población dinámica, múltiples
centros cívicos) en una sola función era señalado como alto riesgo (oráculo frágil, complejidad
combinatoria). Se acotó a extender la integración más completa existente (Contrato 25:
población dinámica + degradación) agregando SOLO calendario (Contrato 27) y clima estacional
(Contrato 29) — multi-insumo y múltiples centros cívicos quedaron explícitamente fuera por ser
subsistemas estructuralmente disjuntos.

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación. Dada la complejidad (4 mecánicas
combinadas, aritmética de punto flotante), el orquestador trazó el escenario COMPLETO de 10
ticks ejecutando un prototipo en vivo (`node -e`, días de calendario 80-89) antes de congelar el
oráculo.

## T1 — Ejecutar cadena de referencia ampliada

Entregado: `src/ejecutarCadenaReferenciaAmpliada.js`
(`ejecutarCadenaReferenciaAmpliada()`). Combina el bucle del Contrato 25 (construcción con
costo, almacenes, comercio, tesorería, mantenimiento, degradación progresiva, población que se
recompone tick a tick) con mantenimiento condicionado a `esLaboral` (Contrato 27) y
multiplicador de clima en la granja (Contrato 29). Decisión de diseño: el contador de tick pasado
a `calendarioDeTick` arranca en el día `80` (no `0`) para cruzar el límite de estación
otoño→invierno dentro de una traza de solo `10` ticks, sin necesitar `84`+ ticks.

**Hallazgo emergente confirmado en vivo**: a diferencia del Contrato 25 (equilibrio en
cobertura `1`), aquí la población se estabiliza en `5` con cobertura de comida exactamente
`0.5` — el invierno reduce la producción justo lo suficiente para dejar a la población en el
punto neutro exacto de `calcularCrecimientoPoblacion` (`indice - 0.5`), un equilibrio distinto
causado por la interacción degradación+clima.

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_cadena_referencia_ampliada.js`: 2/2 tests verdes, incluyendo el
  `deepEqual` completo de los 10 ticks (valores de punto flotante coincidentes bit a bit con el
  prototipo del orquestador).
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 73 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente) — ninguna de las tres integraciones base (Contratos 25,
  27, 29) fue tocada.
- Suite completa 2× consecutivas: 436/436 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Recetas multi-insumo (taller de tala + fábrica de muebles) y múltiples centros cívicos siguen
  sin integrarse a una cadena económica combinada — explícitamente fuera de alcance de este
  contrato por ser subsistemas estructuralmente disjuntos.
- El hallazgo de "equilibrio en cobertura 0.5" es específico de esta calibración (necesidad
  `0.2`/cápita, tasa `0.1`, multiplicador de invierno `0.5`) — no es una propiedad general del
  sistema.
- Ningún flaky detectado.
