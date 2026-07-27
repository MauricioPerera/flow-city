# CONTRACT-06 — Población: necesidades y crecimiento — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-06-poblacion.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 26 archivos) |
| Suite de tests | ✅ verde 2× (198 tests) | `node --test tests/test_*.js` — 198/198 ambas corridas, sin flaky |
| Test-command-gate | ✅ | `python scripts/validate_test_commands.py knowledge/contracts .` → `PASS` en los 26 contratos |

## T1 — Calcular cobertura de una necesidad

Entregado: `src/calcularCoberturaNecesidad.js` (`calcularCoberturaNecesidad(requerido,
recibido)`). Resultado capado en `[0,1]`; `requerido === 0` cuenta como cubierto trivialmente.

## T2 — Combinar coberturas

Entregado: `src/combinarCoberturas.js` (`combinarCoberturas(coberturas)`). Decisión confirmada
en conversación: mínimo (cuello de botella), no promedio — una carencia grave no se compensa
con superávit en otro recurso.

## T3 — Calcular crecimiento de población

Entregado: `src/calcularCrecimientoPoblacion.js` (`calcularCrecimientoPoblacion(poblacionActual,
indice, tasaBase)`). Fórmula confirmada: proporcional centrada en `0.5` — `poblacionActual *
tasaBase * (indice - 0.5) * 2`. Resultado no redondeado a entero (deliberado; acumulación de
fracciones de persona queda para una tarea futura).

## T4 — Celda en zona de influencia

Entregado: `src/estaEnZonaInfluencia.js` (`estaEnZonaInfluencia(xCentro, yCentro, radio,
xCelda, yCelda)`). Métrica Chebyshev confirmada en conversación (zona cuadrada nativa de
grilla), no Manhattan ni euclídea.

## T5 — Capacidad de mano de obra

Entregado: `src/capacidadManoDeObra.js` (`capacidadManoDeObra(poblacionTotal, esLaboral)`).
Interpretación explícita y no-inventada: sin modelo de edades/dependientes en `DEFINITION.md`,
toda la población es mano de obra potencial, disponible solo en días laborales
(`calendarioDeTick.esLaboral`).

## Verificación final (independiente, tras cada implementación)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 26 archivos) — corrido tras cada una de las 5 implementaciones de este
  contrato.
- `python scripts/validate_test_commands.py knowledge/contracts .`: `PASS` en los 26 contratos,
  corrido tras cada implementación.
- Suite completa 2× consecutivas: 198/198 ambas, exit 0, sin discrepancia entre corridas.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real;
  se confirmó estado rojo contra el stub antes de implementar, en las 5 tareas.

## Pendientes / ítems de seguimiento

- Ninguna pieza de este contrato integra todavía con el grid real (casas colocadas, centro
  cívico real, recepción real de agua/comida/muebles) — son funciones de cálculo puro,
  esperando su integración en un contrato futuro.
- Acumulación de fracciones de persona entre ticks (redondeo) no resuelta — deliberadamente
  fuera de `calcularCrecimientoPoblacion`.
- Fuera de alcance de este contrato: comercio, viajes multi-tick, consecuencias de la quiebra.
- Ningún flaky detectado.
