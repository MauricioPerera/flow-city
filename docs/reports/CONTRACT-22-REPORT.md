# CONTRACT-22 — Cadena taller de tala → fábrica de muebles — REPORT

Fecha: 2026-07-27
Spec: `specs/CONTRACT-22-cadena-taller-fabrica-muebles.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 62 archivos) |
| Suite de tests | ✅ verde 2× (410 tests) | `node --test tests/test_*.js` — 410/410 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `pool` (Poolside CLI)**, con contrato + oráculo congelado
autorados por el orquestador antes de la delegación y verificación independiente después. Nota:
el primer intento de delegación falló con `403 Forbidden` (token de API vencido del lado de
`pool`); tras la renovación del token por el usuario, la reejecución fue exitosa sin cambios al
prompt ni al contrato.

## T1 — Ejecutar cadena taller de tala → fábrica de muebles

Entregado: `src/ejecutarCadenaTallerFabricaMuebles.js` (`ejecutarCadenaTallerFabricaMuebles()`).
Cierra el pendiente documentado en el Contrato 21: conecta la salida de madera del taller de
tala (nodo multi-insumo, `crearNodoProductivoMultiInsumo`/`producirTickNodoMultiInsumo`) por una
ruta real (`conectarVertices`/`resolverViaje`) a la fábrica de muebles (nodo receta simple de un
insumo, `crearNodoProductivo`/`producirTickNodo`, ratio `2 madera : 1 mueble`), demostrando que
un nodo multi-insumo puede alimentar en el grid a un consumidor de receta simple. Reusa el mismo
patrón de posiciones/vértices/tramo de `ejecutar-cadena-fanout` (Contrato 20), ya verificado
libre de colisión.

Resultado: `agua: 10, comida: 10, personas: 6, tandasAgua: 10, tandasComida: 10,
tandasPersonas: 3, tandasProducidas: 3, maderaProducida: 3, maderaEnviada: 3, maderaRecibida: 3,
mueblesProducidos: 1`.

## Verificación final (independiente del implementador, por el orquestador)

- `node tests/test_ejecutar_cadena_taller_fabrica_muebles.js`: 2/2 tests verdes.
- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 62 archivos).
- Comparación de mtime confirmó que SOLO el archivo del `touch_only` de la tarea fue modificado
  (más el reporte temporal del agente).
- Suite completa 2× consecutivas: 410/410 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- Sin comercio, tesorería, almacenes ni degradación en este escenario (alcance deliberadamente
  acotado a la conexión multi-insumo → receta simple).
- El ratio `2 madera : 1 mueble` es una constante de diseño elegida para este contrato, no
  especificada numéricamente en `DEFINITION.md`.
- Ningún flaky detectado.
