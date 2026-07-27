# CONTRACT-09 — Integración end-to-end: bomba de agua → granja — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-09-integracion-bomba-granja.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 37 archivos) |
| Suite de tests | ✅ verde 2× (281 tests) | `node --test tests/test_*.js` — 281/281 ambas corridas, sin flaky |

## Delegación

Las 3 tareas de este contrato (T1-T3) fueron **implementadas por `glm-5.2:cloud`**, con
contrato + oráculo congelado autorados por el orquestador antes de cada delegación, y
verificación independiente del orquestador después de cada una (re-corrida de tests + gate +
chequeo de `touch_only` real, y para T3 además una corrida en vivo con salida inspeccionada a
mano).

## T1 — Crear nodo productivo

Entregado: `src/crearNodoProductivo.js` (`crearNodoProductivo(categoria, ratioEntrada,
ratioSalida, produccionFija)`). Dos modos exclusivos: receta (con insumo) o extracción
(producción fija), nunca ambos ni ninguno.

## T2 — Producir en un tick

Entregado: `src/producirTickNodo.js` (`producirTickNodo(nodo, entradaRecibida)`). Nodo de
extracción ignora `entradaRecibida` y devuelve su `produccionFija`; nodo de receta usa
`calcularProduccion`.

## T3 — Ejecutar la cadena bomba → granja

Entregado: `src/ejecutarCadenaBombaGranja.js` (`ejecutarCadenaBombaGranja(numTicks)`). Primera
integración real del proyecto: arma un grid de verdad (`crearGrid`), coloca ambos nodos
(`colocarNodo`), calcula sus vértices de entrada enfrentados (`verticeEntrada`), los conecta con
un tramo real (`crearTramo` + `conectarVertices`), y simula N ticks completos usando el motor de
tráfico real (`resolverViaje`). Corrida en vivo confirmada: 4 agua/tick producidos → transporte
real sin pérdida (capacidad 10 > producción 4) → 8 manzanas/tick (ratio 1:2), estable en 3
ticks consecutivos.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 37 archivos) — corrido tras cada una de las 3 implementaciones.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar, en las 3 tareas.
- Tras cada entrega de GLM: comparación de mtime confirmó que SOLO el archivo del `touch_only`
  de la tarea fue modificado (más su propio reporte local).
- T3 (la pieza de integración) se corrió además en vivo (`node -e ...`) para inspeccionar la
  salida real, no solo confiar en los asserts del oráculo.
- Suite completa 2× consecutivas: 281/281 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- **Almacenes limitados por nodo**: mencionados en `DEFINITION.md`, nunca construidos en ningún
  contrato — esta integración los evita deliberadamente (conversión instantánea sin
  acumulación). Sigue siendo el ítem de seguimiento más importante para integraciones futuras
  más realistas.
- La integración fija la capacidad de la ruta muy por encima de la producción a propósito, para
  no ejercitar saturación real — una integración futura debería probar explícitamente el caso
  con saturación (pérdida parcial de agua en tránsito).
- Fuera de alcance: consecuencias mecánicas de la quiebra, cadenas de producción más complejas
  (taller de tala, fábrica de muebles, comercio), población real conectada al grid.
- Ningún flaky detectado.
