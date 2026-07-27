# Contrato 18 — Escenario de escasez real

Prerrequisitos: Contrato 17 (cobertura de necesidades conectada a producción real) completo.
Su reporte dejó pendiente explícito: la condición de aborto (producción insuficiente) nunca se
disparó — los valores elegidos ahí garantizaban cobertura completa. Este contrato prueba
deliberadamente el caso contrario: población mucho mayor que la producción disponible.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena con escasez real

FIX/OBJETIVO: función `ejecutarCadenaConEscasez()` — mismo grid/nodos/ruta y misma regla
"población primero" del Contrato 17, pero con `4` casas (población `40`) contra la misma
producción fija de la bomba (`4` agua/tick). La necesidad de agua (`40 * 0.2 = 8`) supera la
producción disponible: la población se queda con TODA el agua producida (`4`, cobertura
`0.5`), no queda nada para enviar a la granja, la granja no produce nada, la necesidad de
comida queda en cobertura `0`, el índice combinado es `0` (mínimo), y la población decrece
realmente en este tick.

Valores fijados: `4` casas × `10` población; `NECESIDAD_PER_CAPITA: 0.2` (igual que el
Contrato 17); `tasaBase: 0.1`; misma bomba (`produccionFija: 4`) y granja (ratio `1:2`) que
integraciones previas.

Task contract: `knowledge/contracts/ejecutar-cadena-escasez.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_escasez.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-escasez`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaConEscasez.js`, `tests/test_ejecutar_cadena_escasez.js`,
  `knowledge/contracts/ejecutar-cadena-escasez.md`. NO tocar ninguna integración anterior
  (Contrato 17 en particular) ni ningún otro módulo existente.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: `resolverViaje` o `resolverCompraAlmacen` rechazan una cantidad `0` (por ejemplo
  si `aguaEnviadaGranja` termina siendo `0` y eso no está contemplado) → PARAR, documentar con
  evidencia que la implementación debe saltear la llamada cuando la cantidad es `0`, no forzarla.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador trazó el escenario a mano ANTES de escribir el oráculo,
  eligiendo números que dan resultados exactos (`0.5`, `0`) sin ambigüedad de punto flotante,
  y confirmando que `aguaEnviadaGranja === 0` y `manzanasVendidas === 0` deben manejarse sin
  llamar a las funciones que rechazan cantidad `0`.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
