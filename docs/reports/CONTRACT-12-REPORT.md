# CONTRACT-12 — Comercio conectado al grid real — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-12-comercio-grid-real.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 43 archivos) |
| Suite de tests | ✅ verde 2× (320 tests) | `node --test tests/test_*.js` — 320/320 ambas corridas, sin flaky |

## Delegación

Tarea única, **implementada por `glm-5.2:cloud`**, con contrato + oráculo congelado autorados
por el orquestador antes de la delegación y verificación independiente después (re-corrida de
tests + gate + chequeo de `touch_only` real + corrida en vivo extendida a 5 ticks).

## T1 — Ejecutar la cadena bomba → granja → comercio

Entregado: `src/ejecutarCadenaBombaGranjaComercio.js`
(`ejecutarCadenaBombaGranjaComercio(numTicks)`). Cierra el ítem de seguimiento explícito del
Contrato 11 ("comercio que desbloquee el almacén de la granja"): cada tick, después de que la
granja produce, un comercio compra el stock acumulado (`resolverCompraAlmacen`), lo retira
(`retirarStockAlmacen`), calcula el ingreso (`calcularMontoVenta`) y lo acumula en una tesorería
real (`crearTesoreria` + `registrarIngreso`). Capacidad de compra calibrada igual a la
producción por tick (`8`) para drenar completo el almacén todos los ticks — decisión
deliberada, documentada en el contrato, para no re-probar el bloqueo (ya demostrado en el
Contrato 11) y mantener el foco en comercio + tesorería. Corrida en vivo a 5 ticks confirmó
crecimiento lineal de la tesorería (`80 = 16 × 5`) con el almacén siempre drenado.

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 43 archivos).
- El oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar.
- Tras la entrega de GLM: comparación de mtime confirmó que SOLO el archivo del `touch_only` de
  la tarea fue modificado (más su propio reporte local) — `ejecutarCadenaBombaGranjaConAlmacen.js`
  (Contrato 11) permaneció intacto.
- Corrida en vivo (`node -e ...`) a 5 ticks, más allá del oráculo (que cubre 3), confirmando el
  crecimiento lineal esperado de la tesorería.
- Suite completa 2× consecutivas: 320/320 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- La capacidad de compra del comercio está fijada exactamente igual a la producción, por lo que
  el caso "comercio no puede comprar todo" (stock se acumula pese al comercio) sigue sin
  probarse — sería una integración futura combinando ambos límites (Contrato 11 + este) en una
  sola calibración.
- El precio (`2`) y la capacidad de compra (`8`) son constantes arbitrarias razonables, no
  derivadas de ninguna regla de balance de `DEFINITION.md` (que no las fija).
- Fuera de alcance: gasto de la tesorería (construcción/mantenimiento), consecuencias de la
  quiebra, comercio con patrón "comprador viaja al bien" (`aforoDisponible`), cadenas de
  producción más complejas.
- Ningún flaky detectado.
