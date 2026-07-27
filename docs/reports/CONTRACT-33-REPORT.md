# CONTRACT-33 — Terreno flexible para residencial/industrial — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-33-terreno-flexible-residencial-industrial.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 76 archivos) |
| Suite de tests | ✅ verde 2× (450 tests) | `node --test tests/test_*.js` — 450/450 ambas corridas, sin flaky |

Primer contrato de la expansión de mecánicas consolidada en `DEFINITION.md` (segunda ronda de
diseño conceptual). Introduce las categorías de construcción `residencial` e `industrial`.

## Delegación

Tres tareas, **implementadas por `pool` (Poolside CLI)**, con contratos + oráculos congelados
autorados por el orquestador antes de cada delegación, ejecutadas en secuencia sin pausar (modo
autónomo, per plan aprobado) y verificadas independientemente cada una.

## T1 — Puede construir flexible

`src/puedeConstruirFlexible.js`. Gate aditivo: para `residencial`/`industrial`, acepta cualquier
terreno excepto `agua_profunda`; para cualquier otra categoría, lanza `RangeError` (nunca
reemplaza a `puedeConstruir`).

## T2 — Asignar nodo a celda

`src/asignarNodoCelda.js`. Mitad de `colocarNodo` sin el chequeo de terreno (solo ocupación +
asignación), necesaria porque `colocarNodo` no es separable (llama internamente a
`puedeConstruir`, no parametrizable).

## T3 — Colocar nodo flexible

`src/colocarNodoFlexible.js`. Compone T1+T2 — equivalente de `colocarNodo` para las categorías
flexibles, celda única. Base para el footprint multi-celda de viviendas (Contrato 34).

## Verificación final (independiente del implementador, por el orquestador)

- Cada tarea: oráculo corrido directo — `5/5`, `4/4`, `5/5` tests, todos verdes.
- `python scripts/validate_contracts.py knowledge/contracts` tras cada entrega: 0 errores (74,
  75, 76 archivos según avanzaba).
- Comparación de mtime tras cada entrega: solo el archivo del `touch_only` de cada tarea fue
  modificado — `puedeConstruir.js`, `colocarNodo.js` y `obtenerCelda.js` NUNCA tocados.
- Suite completa 2× consecutivas al cierre: 450/450 ambas, exit 0, sin discrepancia.

## Pendientes / ítems de seguimiento

- El footprint multi-celda de viviendas (que reusará `puedeConstruirFlexible`/
  `asignarNodoCelda`/`colocarNodoFlexible` celda por celda) es el Contrato 34.
- Ningún flaky detectado.
