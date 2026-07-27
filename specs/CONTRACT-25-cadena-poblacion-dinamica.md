# Contrato 25 — Población dinámica junto con la degradación (loops combinados)

Prerrequisitos: Contrato 19 (`ejecutar-cadena-completa-poblacion`), cuyo pendiente explícito era
justamente este: la población era un conteo FIJO durante la simulación, sin componerse tick a
tick junto con la degradación de tesorería. Este contrato cierra ese pendiente.

Hallazgo de viabilidad detectado ANTES de escribir el oráculo (no inventado, descubierto al
prototipar en vivo): con población variable, `poblacion * NECESIDAD_PER_CAPITA` deja de ser
siempre un entero (ej. `11 * 0.2 = 2.2`), y el remanente que se intenta guardar en el almacén
también deja de ser entero — `agregarStockAlmacen`/`retirarStockAlmacen` exigen cantidades
enteras (`Number.isInteger`). Presentado al usuario como decisión explícita entre dos alternativas;
elegida: **redondear hacia abajo (`Math.floor`) el remanente que va al almacén**, no la
necesidad de la población. La fracción de producción que no alcanza a formar una unidad entera
de remanente se pierde (se desperdicia), sin alterar cuánto recibe la población.

Alcance: se reusa el setup y las reglas de `ejecutar-cadena-completa-poblacion` (Contrato 19) —
construcción con costo, almacenes, comercio, tesorería, mantenimiento, degradación, "población
primero" — pero ahora la población se recalcula AL FINAL de cada tick con el índice de
cobertura DE ESE MISMO tick, y ese nuevo valor es el que se usa para calcular la necesidad del
tick SIGUIENTE. Función nueva e independiente, no modifica la del Contrato 19.

Hallazgo emergente (verificado a mano por el orquestador vía prototipo ejecutado en vivo, `10`
ticks): a diferencia del Contrato 19 (donde la población fija nunca permitía que el sistema
saliera del colapso), aquí la población SÍ reacciona — decrece mientras la cobertura es baja
(`11 → 9 → 8 → 7 → 6 → 5`) hasta estabilizarse en `5`, tamaño donde la producción degradada
(`2` agua) alcanza para cubrir el `100%` de su necesidad (`cobertura: 1`) sin más decrecimiento.
Sin embargo, la TESORERÍA no se recupera: toda el agua/comida degradada la consume la
población, sin excedente para vender, y el saldo sigue cayendo indefinidamente por
mantenimiento puro (`-3`/tick) — un colapso económico permanente pese a que la población
encontró un tamaño sostenible. Es la primera integración que muestra a la población
"adaptándose" a la degradación sin que eso rescate la economía.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena con población dinámica y degradación combinadas

FIX/OBJETIVO: función `ejecutarCadenaPoblacionDinamica()` (sin parámetros, `10` ticks fijos)
que combina degradación por quiebra con población que se recompone tick a tick según su propio
índice de cobertura, usando el mismo setup económico del Contrato 19.

Task contract: `knowledge/contracts/ejecutar-cadena-poblacion-dinamica.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_poblacion_dinamica.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-poblacion-dinamica`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaPoblacionDinamica.js`,
  `tests/test_ejecutar_cadena_poblacion_dinamica.js`,
  `knowledge/contracts/ejecutar-cadena-poblacion-dinamica.md`. NO tocar
  `src/ejecutarCadenaCompletaConPoblacion.js` ni ninguna otra integración anterior.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: algún remanente fraccionario, tras aplicar `Math.floor`, sigue produciendo un
  error de `agregarStockAlmacen`/`retirarStockAlmacen` (indicaría un caso no cubierto por la
  decisión de redondeo) → PARAR, documentar, no ajustar el redondeo sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador prototipó el escenario COMPLETO en vivo (`node -e`) antes
  de escribir el oráculo, descubriendo el problema de enteros y trazando los `10` ticks
  completos con la decisión de redondeo ya aplicada.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
