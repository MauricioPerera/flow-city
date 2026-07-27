# Contrato 30 — Fase de tiempo libre y su gasto asociado

Prerrequisitos: Contrato 23 (`ejecutar-comercio-comprador-viaja-al-bien`, patrón de venta con
aforo, nunca corrido a lo largo de varios ticks) y Contrato 28 (`ejecutar-viajes-fase-laboral`,
que dejó explícitamente fuera de alcance esta fase). `DEFINITION.md` (sección "Calendario"):
"Día = tick, dividido en 3 fases iguales (trabajo, sueño, tiempo libre)... **en tiempo libre la
población puede gastar dinero (impacta consumo/economía)**".

Diferencia clave frente al Contrato 28: la fase de tiempo libre ocurre TODOS los días (no solo
en días laborales) — a diferencia del viaje ida/vuelta laboral, el gasto en tiempo libre no se
condiciona a `esLaboral`. Este contrato reusa exactamente el patrón "comprador viaja al bien"
del Contrato 23 (viaje real de personas + venta limitada por aforo/stock/demanda + ingreso real
en tesorería) y lo corre a lo largo de una semana completa (`7` ticks), acumulando tesorería
tick a tick.

Alcance deliberadamente acotado: sin producción, almacenes, degradación ni crecimiento
poblacional (ya demostrados en otros contratos); el restaurante se asume re-abastecido cada
tick (mismo `stockDisponible` fijo en todos los ticks, no se modela un almacén real) — el foco
es demostrar el gasto recurrente en tiempo libre, no una cadena de suministro del comercio.

> Capa: este es un **contrato de ejecución** (nivel proyecto). La tarea lleva además su **task
> contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Ejecutar gasto de tiempo libre

FIX/OBJETIVO: función `ejecutarGastoTiempoLibre()` (sin parámetros, `7` ticks fijos, una semana
completa) que, en CADA tick (laboral o no), corre el patrón de venta del Contrato 23 (viaje real
de personas al restaurante, venta limitada por aforo, ingreso real) y acumula el resultado en
`historial`, con la tesorería acumulando el ingreso tick a tick.

Valores fijados (idénticos al Contrato 23): grid casa `(0,0)` / restaurante `(1,0)`, tramo
`carretera` tráfico `personas` capacidad `20`; `personasQueViajan: 10`; `aforoMaximo: 6`,
`ocupacionActual: 0`; `stockDisponible: 8`; `precioUnitario: 3`.

Task contract: `knowledge/contracts/ejecutar-gasto-tiempo-libre.md`.

## Criterios de aceptación

- [ ] `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] `node tests/test_ejecutar_gasto_tiempo_libre.js` exit 0.
- [ ] `python scripts/validate_test_commands.py knowledge/contracts .` reporta `PASS` para
  `ejecutar-gasto-tiempo-libre`.
- [ ] Suite completa 2× verde.

## Restricciones

- Tocar SOLO: `src/ejecutarGastoTiempoLibre.js`, `tests/test_ejecutar_gasto_tiempo_libre.js`,
  `knowledge/contracts/ejecutar-gasto-tiempo-libre.md`. NO tocar
  `src/ejecutarComercioCompradorViajaAlBien.js` ni ninguna integración anterior.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: el nodo nuevo en `knowledge/` con frontmatter válido; el task contract pasa el
  validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: el saldo acumulado tras `7` ticks no es exactamente `7 × 18 = 126` (indicaría una
  variación no prevista entre ticks) → PARAR, documentar, no ajustar el oráculo a un resultado
  inesperado sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó un prototipo en vivo (`node -e`) del escenario
  completo de `7` ticks antes de congelar el oráculo, confirmando que el gasto es idéntico cada
  día (laboral o no).
- [x] Perímetro declarado, disjunto de todo archivo existente.
- [x] Condición de aborto explícita (arriba).
