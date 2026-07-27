# CONTRACT-16 — Población conectada al grid real — REPORT

Fecha: 2026-07-26
Spec: `specs/CONTRACT-16-poblacion-grid-real.md`

## Resumen ejecutivo

| Criterio | Veredicto | Evidencia |
|---|---|---|
| Validador de contratos | ✅ | `python scripts/validate_contracts.py knowledge/contracts` → `OK: todos los contratos son validos` (0 errores, 54 archivos) |
| Suite de tests | ✅ verde 2× (378 tests) | `node --test tests/test_*.js` — 378/378 ambas corridas, sin flaky |

## Delegación

T1 y T2 implementadas por `glm-5.2:cloud`. **T3 implementada por `pool` (Poolside CLI,
`poolsideai/pool`)** — primera tarea del proyecto delegada a este agente, a pedido explícito
del usuario para evaluar su compatibilidad con el flujo KDD. Nota operativa del usuario,
confirmada en el uso: en modo no interactivo (`pool exec`) hace falta `--unsafe-auto-allow`
para que pueda escribir archivos sin bloquearse pidiendo aprobación; sin esa flag, el CLI entra
en "overthinking" y falla tras ~30 minutos — no documentado en el README de la herramienta.

Con esa flag, el flujo resultó totalmente compatible con la metodología: contrato + oráculo
congelado autorados por el orquestador antes de cada delegación, verificación independiente
después (re-corrida de tests + gate + chequeo de `touch_only` real) — mismo patrón que con
GLM, sin fricción adicional.

## T1 — Construir una casa en zona de influencia

Entregado (GLM): `src/construirCasaEnZona.js`
(`construirCasaEnZona(grid, xCentro, yCentro, radio, xCasa, yCasa, categoriaTerreno, nodo)`).
Valida la zona ANTES de tocar el grid — una casa fuera de zona no lo muta.

## T2 — Población total de casas

Entregado (GLM): `src/poblacionTotalCasas.js` (`poblacionTotalCasas(poblacionesPorCasa)`).

## T3 — Ejecutar población en zona

Entregado (`pool`): `src/ejecutarPoblacionEnZona.js` (`ejecutarPoblacionEnZona()`). Escenario
real: centro cívico con radio `1`, 2 casas dentro de zona (una justo en el borde), 1 intento
fuera de zona rechazado y capturado sin interrumpir el resto. Población total `20`, cobertura de
agua `0.75` y comida `1` (suministros fijos), índice combinado `0.75`, un tick de crecimiento
(`+1`, `Math.floor` aplicado antes de sumar), población final `21`, mano de obra `21`
(`esLaboral` fijo en `true`, calendario todavía sin integrar).

## Verificación final (independiente del implementador, por el orquestador)

- `python scripts/validate_contracts.py knowledge/contracts`: `OK: todos los contratos son
  validos` (0 errores, 54 archivos) — corrido tras cada una de las 3 implementaciones.
- Cada oráculo se escribió y selló (`tests_sha256`) ANTES de existir la implementación real; se
  confirmó estado rojo contra el stub antes de delegar, en las 3 tareas. Para T3, el
  orquestador trazó el escenario a mano ANTES de escribir el oráculo.
- Tras cada entrega: comparación de mtime confirmó que SOLO el archivo del `touch_only` de la
  tarea fue modificado (más su propio reporte local), en las 3 tareas — sin excepción entre
  GLM y `pool`.
- Suite completa 2× consecutivas: 378/378 ambas, exit 0, sin discrepancia entre corridas.

## Pendientes / ítems de seguimiento

- La cobertura de necesidades usa suministros FIJOS de agua/comida, no conectados a la
  producción real de la cadena bomba-granja (Contratos 09-15) — sería la integración natural
  de un contrato futuro.
- `esLaboral` fijo en `true`: el calendario (`calendarioDeTick`) sigue sin integrarse a ninguna
  cadena real.
- Solo se probó un centro cívico; superposición de zonas de influencia de más de uno sigue sin
  resolverse.
- Ningún flaky detectado.
