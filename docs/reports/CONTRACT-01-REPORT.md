# CONTRACT-01 — Motor de recursos: fundamentos — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-01-motor-recursos-fundamentos.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 6 archivos) |
| Suite de tests | ✅ verde 2× (42 tests) | `node --test tests/test_*.js` — 42/42 ambas corridas, sin flaky |
| Test-command-gate | ✅ | `python scripts/validate_test_commands.py knowledge/contracts .` → `PASS` en los 6 contratos |

## T1 — Cálculo de producción por ratio

Entregado: `src/calcularProduccion.js` (`calcularProduccion(entrada, ratioEntrada,
ratioSalida)`). Aritmética entera con descarte del resto (floor), sin acarreo entre llamadas —
decisión de diseño explicitada en el contrato porque `DEFINITION.md` no la fijaba.

## T2 — Reglas de emplazamiento por terreno

Entregado: `src/puedeConstruir.js` (`puedeConstruir(tipoTerreno, categoriaConstruccion)`).
Resolvió el hueco abierto en `DEFINITION.md`: construcciones no-extractivas solo en `verde` o
`neutra`; `elevada` y `agua_profunda` quedan exclusivas de `mineria`/`pesca` respectivamente
(confirmado en conversación antes de escribir el contrato).

## T3 — Saturación de tramo

Entregado: `src/calcularSaturacion.js` (`calcularSaturacion(carga, capacidad)`). Modelo de
degradación proporcional continua (`factorVelocidad = min(1, capacidad/carga)`, `perdida =
max(0, carga - capacidad)`), sin umbrales discretos — decisión confirmada en conversación,
segundo hueco de `DEFINITION.md` resuelto.

## T4 — Modelo de grid/vértice

T4 tal como estaba anotado en el spec original era demasiado amplio para un solo task
contract (varias funciones, no un solo verbo) — se desglosó en 3 piezas atómicas, mostradas y
confirmadas antes de construir cada una:

- `src/crearGrid.js` (`crearGrid(ancho, alto, terrenoDefault)`): inicializa la grilla acotada.
- `src/obtenerCelda.js` (`obtenerCelda(grid, x, y)`): consulta una celda con validación de
  límites, devuelve la referencia real (no copia).
- `src/colocarNodo.js` (`colocarNodo(grid, x, y, categoriaConstruccion, nodo)`): compone las dos
  anteriores + `puedeConstruir`, agrega la regla de no-superposición. Distingue error
  estructural (`RangeError`) de error de negocio (`Error` común: terreno incompatible, celda
  ocupada) — decisión de diseño explicitada en el contrato.

## Verificación final (independiente, tras cada implementación)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 6 archivos) — corrido tras cada una de las 6 implementaciones.
- `python scripts/validate_test_commands.py knowledge/contracts .`: `PASS` en los 6 contratos,
  corrido tras cada implementación.
- Suite completa 2× consecutivas: 42/42 ambas, exit 0, sin discrepancia entre corridas.
- Cada oráculo (`tests/test_*.js`) se escribió y selló (`tests_sha256`) ANTES de existir la
  implementación real; se confirmó el estado rojo contra el stub antes de implementar, en las 6
  tareas.

## Pendientes / ítems de seguimiento

- `node --test tests/` (sin glob) no descubre los archivos `test_*.js` — Node busca
  `*.test.js` por convención propia. Cualquier automatización futura del CIERRE debe usar
  `tests/test_*.js` explícito o renombrar el patrón.
- Fuera de alcance de este contrato (quedan para contratos futuros, no son deuda de éste):
  motor de tráfico/tick real, conexión de vértices por rutas, tesorería, calendario, comercio.
  `DEFINITION.md` ya los deja explícitos como fuera de alcance de la fase de definición.
- Ningún flaky detectado.
