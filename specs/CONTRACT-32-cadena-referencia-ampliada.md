# Contrato 32 — Integración de referencia ampliada (población + degradación + calendario + clima)

Prerrequisitos: Contrato 25 (`ejecutar-cadena-poblacion-dinamica` — construcción con costo,
almacenes, comercio, tesorería, mantenimiento, degradación progresiva, población que se
recompone tick a tick), Contrato 27 (`ejecutar-cadena-mantenimiento-calendario` — mantenimiento
condicionado a día laboral) y Contrato 29 (`ejecutar-produccion-estacional` — multiplicador de
clima en la granja).

Decisión de alcance (confirmada explícitamente por el usuario, tras plantear el riesgo de
combinar TODO el ecosistema en una sola función): se extiende la integración MÁS completa
existente (Contrato 25) agregando ÚNICAMENTE calendario (mantenimiento condicionado a día
laboral, Contrato 27) y clima estacional en la granja (Contrato 29) — NO se agregan recetas
multi-insumo (taller de tala + fábrica de muebles) ni múltiples centros cívicos, por ser
subsistemas estructuralmente disjuntos (recetas de varios insumos vs. receta simple; colocación
de casas vs. un tick económico) que no combinan naturalmente en el mismo bucle sin una
re-arquitectura mayor.

Decisión de diseño para poder observar un cambio de estación DENTRO de una traza corta (`10`
ticks, no los `84` que dura una estación real): el contador de "tick" que se pasa a
`calendarioDeTick` arranca en el día `80` (no en `0`) — el estado económico (población,
tesorería, contador de quiebra) arranca fresco como cualquier otra integración, pero las
etiquetas de calendario consultadas corresponden a los días `80`-`89`, que cruzan el límite
otoño→invierno (día `84`) y alternan días laborales/fin de semana. Confirmado en vivo con
`calendarioDeTick` antes de escribir el oráculo.

**Hallazgo emergente** (verificado a mano por el orquestador vía prototipo en vivo, no un
descubrimiento de la implementación): a diferencia del Contrato 25 (donde la población se
estabilizaba en una cobertura de `1`, plenamente cubierta), aquí la población se estabiliza en
`5` con una cobertura de comida de exactamente `0.5` — el invierno (multiplicador `0.5`) reduce
la producción de la granja justo lo suficiente para que, incluso con la bomba ya degradada y la
población ya reducida a su tamaño "sostenible" del Contrato 25, la comida disponible cubra solo
la mitad de la necesidad. `calcularCrecimientoPoblacion` tiene un punto neutro exactamente en
índice `0.5` (`indice - 0.5`), así que la población deja de decrecer ahí — un equilibrio
DISTINTO al del Contrato 25, causado específicamente por la interacción degradación+clima.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar cadena de referencia ampliada

FIX/OBJETIVO: función `ejecutarCadenaReferenciaAmpliada()` (sin parámetros, `10` ticks fijos,
días de calendario `80` a `89`) que combina el bucle completo del Contrato 25 con mantenimiento
condicionado a `esLaboral` (Contrato 27) y multiplicador de clima aplicado a la producción de la
granja tras la degradación (Contrato 29).

Task contract: `knowledge/contracts/ejecutar-cadena-referencia-ampliada.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_cadena_referencia_ampliada.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-cadena-referencia-ampliada`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarCadenaReferenciaAmpliada.js`,
  `tests/test_ejecutar_cadena_referencia_ampliada.js`,
  `knowledge/contracts/ejecutar-cadena-referencia-ampliada.md`. NO tocar
  `src/ejecutarCadenaPoblacionDinamica.js`, `src/ejecutarCadenaMantenimientoCalendario.js`,
  `src/ejecutarProduccionEstacional.js` ni ninguna otra integración anterior.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el multiplicador de clima produce un remanente que, tras `Math.floor`, aún
  provoca un error de `agregarStockAlmacen`/`retirarStockAlmacen` → PARAR, documentar, no
  ajustar el redondeo sin reportarlo (mismo riesgo ya resuelto en el Contrato 25).

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador prototipó el escenario COMPLETO en vivo (`node -e`, días
  `80`-`89`) antes de escribir el oráculo, confirmando el cruce de estación y el hallazgo del
  equilibrio en cobertura `0.5`.
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
