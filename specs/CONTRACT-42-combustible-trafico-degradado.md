# Contrato 42 — Combustible y tráfico degradado

Prerrequisitos: Contrato 39 (reglas de terreno/elevación de rutas) y Contrato 41 (petróleo,
refinería, almacén tipado). Último contrato del roadmap de esta segunda ronda de diseño
conceptual (ver `DEFINITION.md`, sección "Petróleo, combustible y almacenes tipados"): el
combustible (derivado del petróleo refinado) es necesario para que circule el tráfico vehicular
de carretera; su ausencia degrada ese tráfico. No afecta a subte ni a ferrocarril, ni a
embarcaciones de pesca chicas/medianas; sí afecta a las rutas marítimas largas.

Decisión de diseño (ad hoc, no preguntada al usuario): degradación LINEAL y gradual (mismo
idioma que `calcularSaturacion` ya usa en el proyecto), no un corte binario — el tráfico escala
proporcionalmente al combustible disponible, hasta `0` si no hay nada. Umbral de "ruta larga"
(pendiente explícito del Contrato 39, deliberadamente diferido a este contrato porque es donde
realmente se consume): `15` unidades de longitud, elegido para ser consistente con los valores
ya usados en el Contrato 31 (`5` = corta, `25` = larga, ambos claramente a cada lado del
umbral).

> Capa: este es un **contrato de ejecución** (nivel proyecto). Las tareas llevan además su
> **task contract** CCDD en `knowledge/contracts/<task>.md` (validado por
> `scripts/validate_contracts.py`).

## T1 — Clasificar longitud de ruta

FIX/OBJETIVO: función pura `clasificarLongitudRuta(longitud)` en
`src/clasificarLongitudRuta.js`, con oráculo congelado en
`tests/test_clasificar_longitud_ruta.js`. `'corta'` si `longitud < 15`; `'larga'` si
`longitud >= 15`.

Task contract: `knowledge/contracts/clasificar-longitud-ruta.md`.

## T2 — Tramo requiere combustible

FIX/OBJETIVO: función pura `tramoRequiereCombustible(tipoRuta, esRutaLarga)` en
`src/tramoRequiereCombustible.js`, con oráculo congelado en
`tests/test_tramo_requiere_combustible.js`. Carretera: siempre `true`. Subte/ferrocarril:
siempre `false`. Marítima: `true` solo si `esRutaLarga`.

Task contract: `knowledge/contracts/tramo-requiere-combustible.md`.

## T3 — Aplicar escasez de combustible a tramo

FIX/OBJETIVO: función pura `aplicarEscasezCombustibleTramo(cargaSolicitada,
combustibleDisponible)` en `src/aplicarEscasezCombustibleTramo.js`, con oráculo congelado en
`tests/test_aplicar_escasez_combustible_tramo.js`. Degradación lineal: `factorDegradacion =
min(1, combustibleDisponible / cargaSolicitada)`, `cargaEfectiva = floor(cargaSolicitada *
factorDegradacion)`.

Task contract: `knowledge/contracts/aplicar-escasez-combustible-tramo.md`.

## T4 — Ejecutar tráfico con combustible

FIX/OBJETIVO: función `ejecutarTraficoConCombustible()` (sin parámetros) en
`src/ejecutarTraficoConCombustible.js`, con oráculo congelado en
`tests/test_ejecutar_trafico_con_combustible.js`. Combina T1+T2+T3 en 6 escenarios fijos:
carretera con combustible suficiente/nulo/parcial, subte sin combustible (no afectado), marítima
corta sin combustible (no afectada), marítima larga sin combustible (afectada) — cierra el ciclo
completo del roadmap de niveles/petróleo/rutas.

Task contract: `knowledge/contracts/ejecutar-trafico-con-combustible.md`.

## Criterios de aceptación

- [ ] Por tarea: `python scripts/validate_contracts.py knowledge/contracts` exit 0.
- [ ] T1-T4: `node tests/test_<nombre>.js` exit 0 para cada uno.
- [ ] Final del contrato (T1-T4 verdes): suite completa 2× verde.

## Restricciones

- Tocar SOLO, por tarea (archivos listados arriba junto a cada tarea). Conjuntos disjuntos. NO
  tocar `src/calcularSaturacion.js` ni ninguna integración anterior.
- Sin dependencias nuevas (Node stdlib únicamente); sin red ni proceso hijo en el código de
  producción.
- Respetar OKF: todo nodo nuevo en `knowledge/` con frontmatter válido; los task contracts pasan
  el validador antes de delegar su implementación.
- NO commitear (se commitea por tarea verificada).
- ABORTAR SI: la degradación lineal resulta insuficiente para modelar el escenario (ej. si se
  necesitara un corte binario real en algún caso) → PARAR, documentar con evidencia, no cambiar
  el modelo de degradación sin reportarlo.

## Checklist antes de delegar

- [x] RECON corrido: entorno Node/Python ya confirmado en contratos previos, sin cambios.
- [x] Todo criterio de aceptación tiene comando + resultado esperado (arriba).
- [x] Red-team hecho: el orquestador ejecutó un prototipo en vivo (`node -e`) de los 6 escenarios
  de T4 antes de congelar el oráculo.
- [x] Perímetro de cada tarea declarado y disjunto.
- [x] Condición de aborto explícita para el contrato (arriba).
