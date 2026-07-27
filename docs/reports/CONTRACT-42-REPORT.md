# CONTRACT-42 — Combustible y tráfico degradado — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-42-combustible-trafico-degradado.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 107 archivos) |
| Suite de tests | ✅ verde 2× (556 tests) | `node --test tests/test_*.js` — 556/556 ambas corridas, sin flaky |

**Último contrato del roadmap de la segunda ronda de diseño conceptual** (Contratos 33-42),
ejecutado de forma autónoma según el plan aprobado.

## Delegación

Cuatro tareas, **implementadas por `pool` (Poolside CLI)**. T1, T2, T3 delegadas en paralelo
(independientes entre sí), T4 (integración capstone) al final, combinando las tres. Ejecución
autónoma, sin pausar entre tareas en ningún momento del roadmap 33-42.

## T1 — Clasificar longitud de ruta

`src/clasificarLongitudRuta.js`. Umbral `15`: `<15` corta, `>=15` larga — pendiente diferido
explícitamente del Contrato 39, resuelto aquí donde realmente se consume.

## T2 — Tramo requiere combustible

`src/tramoRequiereCombustible.js`. Carretera siempre; subte/ferrocarril nunca; marítima solo si
es ruta larga.

## T3 — Aplicar escasez de combustible a tramo

`src/aplicarEscasezCombustibleTramo.js`. Degradación LINEAL (mismo idioma que
`calcularSaturacion`), no un corte binario.

## T4 — Ejecutar tráfico con combustible

`src/ejecutarTraficoConCombustible.js`. 6 escenarios: carretera se degrada proporcionalmente
(suficiente/nulo/parcial), subte nunca se ve afectado, marítima corta tampoco, marítima larga sí
se degrada igual que carretera sin combustible — cierra el ciclo completo del roadmap
(niveles + footprint + árboles + elevación + petróleo + combustible).

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `3/3`, `5/5`, `5/5`, `2/2` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores.
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `calcularSaturacion.js` y ninguna integración anterior fueron tocados.
- Suite completa 2× consecutivas al cierre: 556/556 ambas, exit 0, sin discrepancia.

## Cierre del roadmap 33-42

Los 10 contratos de esta segunda ronda de diseño (33 a 42) quedan completos: terreno flexible,
footprint de viviendas por nivel, nivel de granja, área de acción por nivel, ciclo de vida del
árbol, integración tala+reforestación, elevación/terreno de rutas, rutas escaladas por nivel,
petróleo/refinería/almacén tipado, y combustible/tráfico degradado. Ninguna tarea tocó un
archivo de un contrato ya cerrado (regla aditiva respetada en las 33 tareas atómicas del
roadmap). Industrias derivadas de petróleo (plásticos, neumáticos, etc.) y la integración de
todo esto en una cadena económica real combinada quedan como trabajo futuro ad hoc, fuera de
este roadmap.

## Pendientes / ítems de seguimiento

- Ninguna de las mecánicas de esta segunda ronda (niveles, footprint, árboles, elevación,
  petróleo, combustible) se combinó todavía en una integración conjunta real (tipo Contrato 32)
  — cada una se demostró en aislamiento o en pares acotados, por diseño explícito del plan
  aprobado.
- Ningún flaky detectado en ningún contrato del roadmap 33-42.
