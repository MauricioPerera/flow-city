# CONTRACT-21 — Recetas multi-insumo — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-21-recetas-multi-insumo.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 61 archivos) |
| Suite de tests | ✅ verde 2× (408 tests) | `node --test tests/test_*.js` — 408/408 ambas corridas, sin flaky |

## Delegación

Las tres tareas (T1, T2, T3) **implementadas por `pool` (Poolside CLI)**, con contrato + oráculo
congelado autorados por el orquestador antes de cada delegación, y verificación independiente
después de cada una.

## T1 — Crear nodo productivo multi-insumo

Entregado: `src/crearNodoProductivoMultiInsumo.js` (`crearNodoProductivoMultiInsumo(categoria,
receta, ratioSalida)`). Extiende `crearNodoProductivo` (limitado a 1 insumo) para aceptar una
receta con ≥2 insumos, cada uno con `{ nombre, ratioEntrada }`. Valida categoría no vacía, receta
array de al menos 2 elementos, cada insumo con nombre único no vacío y `ratioEntrada` entero
positivo, y `ratioSalida` entero positivo.

## T2 — Producir tick de nodo multi-insumo

Entregado: `src/producirTickNodoMultiInsumo.js` (`producirTickNodoMultiInsumo(nodo,
entradasRecibidas)`). Calcula, para cada insumo de la receta, las tandas posibles
(`floor(recibido / ratioEntrada)`, tratando insumo ausente como `0`), toma el mínimo (cuello de
botella) y devuelve `tandasMinimas * ratioSalida`. Valida forma de `nodo` y que los valores
presentes en `entradasRecibidas` sean finitos y no negativos.

## T3 — Ejecutar taller de tala

Entregado: `src/ejecutarTallerDeTala.js` (`ejecutarTallerDeTala()`). Cierra el límite documentado
en el Contrato 20: el taller de tala real de `DEFINITION.md` (agua + comida + personas → madera)
ahora es posible componiendo T1 + T2. Cantidades fijas (`agua: 10`, `comida: 10`, `personas: 6`)
elegidas para que `personas` (ratio `2`) sea deliberadamente el insumo más escaso (`3` tandas
posibles vs. `10` de agua/comida), demostrando el cuello de botella y no solo el camino feliz.

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo (`node tests/test_*.js` de la tarea) — 8/8, 8/8, 2/2 tests
  respectivamente, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: `OK: todos los
  contratos son validos`, 0 errores (59, 60 y 61 archivos según avanzaba).
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado (más el reporte temporal del agente, fuera del repo de tests/contratos).
- Suite completa 2× consecutivas al cierre: 408/408 ambas, exit 0, sin discrepancia entre
  corridas.

## Pendientes / ítems de seguimiento

- Fábrica de muebles (madera → muebles) aún no construida — puede reusar T1/T2 con receta de 1
  insumo o extenderse a multi-insumo si la receta real lo requiere.
- Sin variantes de insumo opcional (todo insumo de la receta es obligatorio) — fuera de alcance
  de este contrato, confirmado explícitamente antes de empezar.
- Ningún flaky detectado.
