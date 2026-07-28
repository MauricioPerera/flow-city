# Flow City

![tests](https://img.shields.io/badge/tests-556%2F556%20passing-brightgreen)

Repo: https://github.com/MauricioPerera/flow-city

City-tycoon de logística, gestión y automatización — ver [DEFINITION.md](DEFINITION.md).

Metodología: [KDD](../KDD/) (contratos de ejecución en `specs/`, task contracts CCDD en
`knowledge/contracts/`).

## Resumen final (2026-07-27)

Cerrados dos roadmaps completos sin pendientes explícitos abiertos dentro de su propio alcance:
el primero (Contratos 01-32, motor de simulación base) y el segundo (Contratos 33-42, ver
`DEFINITION.md`: niveles S/M/L, footprint multi-celda, terreno flexible, ciclo de vida de
árboles, elevación/niveles de ruta, petróleo y combustible), este último ejecutado de forma
autónoma sin pausar entre contratos. Estado verificado al último cierre:

- **42 contratos de ejecución** (`specs/CONTRACT-01` a `CONTRACT-42`), todos **completos** y
  cerrados con reporte propio en `docs/reports/`.
- **107 task contracts** CCDD en `knowledge/contracts/`, todos validados (`0 errores`).
- **556 tests** (`node --test tests/test_*.js`), verdes en 2 corridas consecutivas para cada
  cierre de contrato.
- Subsistemas cubiertos de punta a punta: grid/terreno, rutas y pathfinding (incl. viajes
  multi-tick con decisión de orquestación instantáneo-vs-tránsito), motor de tráfico por tick,
  producción (receta simple y multi-insumo, con y sin almacén), tesorería (construcción,
  mantenimiento, quiebra y degradación progresiva —sin recuperación—), población (zona de
  influencia con uno o varios centros cívicos, cobertura de necesidades, crecimiento/decrecimiento
  dinámico tick a tick), comercio (ambos patrones — bien viaja al comprador y comprador viaja al
  bien), calendario (día/semana/mes/estación/año, con efecto económico real en mantenimiento y
  producción por clima) y las 3 fases del día (tráfico laboral ida/vuelta y gasto en tiempo libre).
- Mayor integración: `ejecutar-cadena-referencia-ampliada` (Contrato 32) — construcción con
  costo + almacenes + comercio + tesorería + mantenimiento por calendario + degradación +
  clima estacional + población dinámica, todo junto en una sola simulación.
- Fuera de alcance deliberado (no combinado en una integración conjunta, por ser subsistemas
  estructuralmente disjuntos): recetas multi-insumo y múltiples centros cívicos dentro de la
  misma cadena económica ampliada. Tampoco existe capa de UI/renderizado — el proyecto es,
  hasta ahora, lógica de simulación pura.
- Todas las implementaciones fueron delegadas (mayormente a `pool` — Poolside CLI, y en
  contratos tempranos a `glm-5.2:cloud`) con oráculo de tests congelado ANTES de la
  implementación y verificación independiente posterior a cada entrega (nunca se confió en el
  autoreporte del agente delegado).

## Estado

- `specs/CONTRACT-01-motor-recursos-fundamentos.md` — **completo**. Ver
  [docs/reports/CONTRACT-01-REPORT.md](docs/reports/CONTRACT-01-REPORT.md).
  - T1 `calcular-produccion`, T2 `puede-construir`, T3 `calcular-saturacion`, T4
    (`crear-grid` + `obtener-celda` + `colocar-nodo`).
- `specs/CONTRACT-02-modelo-rutas.md` — **completo**. Ver
  [docs/reports/CONTRACT-02-REPORT.md](docs/reports/CONTRACT-02-REPORT.md).
  - T1 `crear-tramo`, T2 `tramo-admite-trafico`, T3 `conectar-vertices`, T4 `encontrar-ruta`.
- `specs/CONTRACT-03-integracion-grid-rutas.md` — **completo** (T4 original retirado, pasa a
  ser `CONTRACT-04`). Ver [docs/reports/CONTRACT-03-REPORT.md](docs/reports/CONTRACT-03-REPORT.md).
  - T1 `id-vertice`, T2 `vertices-de-celda`, T3 `vertice-entrada`.
- `specs/CONTRACT-04-motor-trafico-tick.md` — **completo**. Ver
  [docs/reports/CONTRACT-04-REPORT.md](docs/reports/CONTRACT-04-REPORT.md).
  - T1 `calendario-de-tick`, T2 `registrar-carga-tramo`, T3 `resolver-viaje`, T4
    `resolver-tick`.
- `specs/CONTRACT-05-tesoreria.md` — **completo**. Ver
  [docs/reports/CONTRACT-05-REPORT.md](docs/reports/CONTRACT-05-REPORT.md).
  - T1 `crear-tesoreria`, T2 `registrar-gasto`, T3 `registrar-ingreso`, T4
    `aplicar-mantenimiento-tick`.
- `specs/CONTRACT-06-poblacion.md` — **completo**. Ver
  [docs/reports/CONTRACT-06-REPORT.md](docs/reports/CONTRACT-06-REPORT.md).
  - T1 `calcular-cobertura-necesidad`, T2 `combinar-coberturas`, T3
    `calcular-crecimiento-poblacion`, T4 `esta-en-zona-influencia`, T5
    `capacidad-mano-de-obra`.
- `specs/CONTRACT-07-comercio.md` — **completo**. Ver
  [docs/reports/CONTRACT-07-REPORT.md](docs/reports/CONTRACT-07-REPORT.md).
  - T1 `aforo-disponible`, T2 `calcular-monto-venta`, T3 `resolver-compra-almacen`, T4
    `resolver-venta-local`.
- `specs/CONTRACT-08-viajes-multitick.md` — **completo** (T2-T4 implementados por
  `glm-5.2:cloud`, verificados por el orquestador). Ver
  [docs/reports/CONTRACT-08-REPORT.md](docs/reports/CONTRACT-08-REPORT.md).
  - T1 `calcular-ticks-viaje`, T2 `iniciar-viaje-en-transito`, T3 `avanzar-viaje-tick`, T4
    `resolver-tick-con-transito`.
- `specs/CONTRACT-09-integracion-bomba-granja.md` — **completo** (T1-T3 implementados por
  `glm-5.2:cloud`, verificados por el orquestador). Ver
  [docs/reports/CONTRACT-09-REPORT.md](docs/reports/CONTRACT-09-REPORT.md). **Primera
  integración real de punta a punta**: grid + rutas + producción + tráfico juntos.
  - T1 `crear-nodo-productivo`, T2 `producir-tick-nodo`, T3 `ejecutar-cadena-bomba-granja`.
- `specs/CONTRACT-10-almacenes.md` — **completo** (T1-T4 implementados por `glm-5.2:cloud`,
  verificados por el orquestador). Ver
  [docs/reports/CONTRACT-10-REPORT.md](docs/reports/CONTRACT-10-REPORT.md).
  - T1 `crear-almacen`, T2 `agregar-stock-almacen`, T3 `retirar-stock-almacen`, T4
    `producir-tick-nodo-con-almacen`.
- `specs/CONTRACT-11-integracion-almacenes-bomba-granja.md` — **completo** (implementado por
  `glm-5.2:cloud`, verificado por el orquestador). Ver
  [docs/reports/CONTRACT-11-REPORT.md](docs/reports/CONTRACT-11-REPORT.md). Extiende el
  Contrato 09 con almacenes reales; demuestra el bloqueo de producción por almacén lleno de
  forma determinista y persistente.
  - T1 `ejecutar-cadena-bomba-granja-con-almacen`.
- `specs/CONTRACT-12-comercio-grid-real.md` — **completo** (implementado por `glm-5.2:cloud`,
  verificado por el orquestador). Ver
  [docs/reports/CONTRACT-12-REPORT.md](docs/reports/CONTRACT-12-REPORT.md). Cierra el loop
  bomba→granja→comercio→tesorería, drenando el almacén de la granja y generando ingreso real.
  - T1 `ejecutar-cadena-bomba-granja-comercio`.
- `specs/CONTRACT-13-consecuencias-quiebra.md` — **completo** (T1-T3 implementados por
  `glm-5.2:cloud`, verificados por el orquestador). Ver
  [docs/reports/CONTRACT-13-REPORT.md](docs/reports/CONTRACT-13-REPORT.md).
  - T1 `actualizar-contador-quiebra`, T2 `esta-nodo-degradado`, T3
    `aplicar-degradacion-produccion`.
- `specs/CONTRACT-14-gasto-tesoreria-construccion.md` — **completo** (T1-T4 implementados por
  `glm-5.2:cloud`, verificados por el orquestador). Ver
  [docs/reports/CONTRACT-14-REPORT.md](docs/reports/CONTRACT-14-REPORT.md).
  - T1 `costo-construccion-nodo`, T2 `costo-mantenimiento-nodo`, T3
    `construir-nodo-con-costo`, T4 `calcular-mantenimiento-total`.
- `specs/CONTRACT-15-integracion-completa-degradacion.md` — **completo** (implementado por
  `glm-5.2:cloud`, verificado por el orquestador). Ver
  [docs/reports/CONTRACT-15-REPORT.md](docs/reports/CONTRACT-15-REPORT.md). **Integración de
  referencia del proyecto**: costo de construcción real, mantenimiento, comercio, tesorería y
  degradación progresiva por quiebra, todo junto sobre la cadena bomba→granja. Ciclo completo
  demostrado: quiebra → degradación → recuperación → crecimiento sostenido.
  - T1 `ejecutar-cadena-completa`.
- `specs/CONTRACT-16-poblacion-grid-real.md` — **completo** (T1-T2 por `glm-5.2:cloud`, T3 por
  `pool` — Poolside CLI, primera tarea delegada a este agente). Ver
  [docs/reports/CONTRACT-16-REPORT.md](docs/reports/CONTRACT-16-REPORT.md). Casas solo se
  construyen dentro de la zona de influencia real de un centro cívico; población, cobertura de
  necesidades y un tick de crecimiento demostrados con suministros fijos.
  - T1 `construir-casa-en-zona`, T2 `poblacion-total-casas`, T3 `ejecutar-poblacion-en-zona`.
- `specs/CONTRACT-17-cobertura-produccion-real.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-17-REPORT.md](docs/reports/CONTRACT-17-REPORT.md).
  La cobertura de necesidades de población ahora usa producción REAL (no suministros fijos):
  población toma su necesidad de agua/comida primero, el remanente sigue el flujo normal
  (granja/comercio). Demostrado: cobertura completa + excedente vendido + crecimiento
  poblacional en el mismo tick.
  - T1 `ejecutar-cadena-poblacion-real`.
- `specs/CONTRACT-18-escasez-real.md` — **completo** (implementado por `pool` — Poolside CLI).
  Ver [docs/reports/CONTRACT-18-REPORT.md](docs/reports/CONTRACT-18-REPORT.md). Primer caso del
  proyecto donde el loop producción↔población↔economía se demuestra en sentido NEGATIVO:
  población (`40`) supera la producción disponible, cobertura cae a `0`, población decrece
  realmente (`40 → 36`) en un solo tick.
  - T1 `ejecutar-cadena-escasez`.
- `specs/CONTRACT-19-integracion-completa-poblacion.md` — **completo** (implementado por
  `pool` — Poolside CLI). Ver
  [docs/reports/CONTRACT-19-REPORT.md](docs/reports/CONTRACT-19-REPORT.md). **La integración
  más completa del proyecto**: construcción con costo + almacenes + degradación + población
  real con prioridad, todo junto. Hallazgo emergente confirmado en vivo (10 ticks): una vez
  degradado, el sistema NO se recupera (a diferencia del Contrato 15) — la población agota el
  agua degradada, la granja nunca vuelve a producir, el colapso económico es permanente.
  - T1 `ejecutar-cadena-completa-poblacion`.
- `specs/CONTRACT-20-cadena-fanout.md` — **completo** (implementado por `pool` — Poolside
  CLI). Ver [docs/reports/CONTRACT-20-REPORT.md](docs/reports/CONTRACT-20-REPORT.md). Primera
  cadena con más de 2 nodos y ramificación (fan-out): la bomba reparte su producción entre
  granja y reforestación en paralelo, cada uno con su propia ruta real.
  - T1 `ejecutar-cadena-fanout`.
- `specs/CONTRACT-21-recetas-multi-insumo.md` — **completo** (implementado por `pool` — Poolside
  CLI). Ver [docs/reports/CONTRACT-21-REPORT.md](docs/reports/CONTRACT-21-REPORT.md). Extiende
  la producción a recetas con ≥2 insumos y cierra el límite documentado en el Contrato 20: el
  taller de tala real de `DEFINITION.md` (agua+comida+personas→madera) ahora es posible,
  demostrando el cuello de botella cuando `personas` es el insumo más escaso.
  - T1 `crear-nodo-productivo-multi-insumo`, T2 `producir-tick-nodo-multi-insumo`, T3
    `ejecutar-taller-de-tala`.
- `specs/CONTRACT-22-cadena-taller-fabrica-muebles.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver
  [docs/reports/CONTRACT-22-REPORT.md](docs/reports/CONTRACT-22-REPORT.md). Conecta la madera
  del taller de tala (nodo multi-insumo) por una ruta real a la fábrica de muebles (nodo receta
  simple, madera→muebles `2:1`), cerrando el pendiente del Contrato 21.
  - T1 `ejecutar-cadena-taller-fabrica-muebles`.
- `specs/CONTRACT-23-comercio-comprador-viaja-al-bien.md` — **completo** (implementado por
  `pool` — Poolside CLI). Ver
  [docs/reports/CONTRACT-23-REPORT.md](docs/reports/CONTRACT-23-REPORT.md). Segundo patrón de
  venta de `DEFINITION.md`, nunca antes integrado: un comprador viaja por una ruta real hacia un
  restaurante; la venta se resuelve por el mínimo entre demanda, stock y aforo (el aforo es el
  cuello de botella deliberado); el ingreso se registra en tesorería real.
  - T1 `ejecutar-comercio-comprador-viaja-al-bien`.
- `specs/CONTRACT-24-cadena-con-calendario.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-24-REPORT.md](docs/reports/CONTRACT-24-REPORT.md).
  Conecta `calendarioDeTick` a una cadena real de 8 ticks (bomba→granja→comercio→tesorería),
  decorando cada entrada del historial con su información de calendario — alcance
  explícitamente acotado a trazabilidad, sin nueva regla económica.
  - T1 `ejecutar-cadena-con-calendario`.
- `specs/CONTRACT-25-cadena-poblacion-dinamica.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-25-REPORT.md](docs/reports/CONTRACT-25-REPORT.md).
  Cierra el pendiente del Contrato 19: la población se recompone tick a tick junto con la
  degradación (dos loops de retroalimentación combinados). Hallazgo emergente: la población se
  estabiliza en un tamaño sostenible (`11→9→8→7→6→5`), pero la tesorería nunca se recupera.
  - T1 `ejecutar-cadena-poblacion-dinamica`.
- `specs/CONTRACT-26-poblacion-multiples-centros.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-26-REPORT.md](docs/reports/CONTRACT-26-REPORT.md).
  Primera integración con más de un centro cívico: una casa se acepta si cae en la zona de
  CUALQUIERA de varios centros (unión, no intersección), incluyendo una celda cubierta por
  ambos a la vez.
  - T1 `ejecutar-poblacion-multiples-centros`.
- `specs/CONTRACT-27-mantenimiento-por-dia-laboral.md` — **completo** (implementado por `pool`
  — Poolside CLI). Ver [docs/reports/CONTRACT-27-REPORT.md](docs/reports/CONTRACT-27-REPORT.md).
  Primera regla económica real atada al calendario: el mantenimiento periódico se cobra solo en
  días laborales, saltando el fin de semana sin acumularse.
  - T1 `ejecutar-cadena-mantenimiento-calendario`.
- `specs/CONTRACT-28-viajes-fase-laboral.md` — **completo** (implementado por `pool` — Poolside
  CLI). Ver [docs/reports/CONTRACT-28-REPORT.md](docs/reports/CONTRACT-28-REPORT.md). Primera
  construcción de "la transición entre fases genera picos de tráfico (ida/vuelta laboral)":
  genera dos viajes reales (casa→trabajo, trabajo→casa) solo en días laborales, ninguno en fin
  de semana. Fase de tiempo libre y su gasto asociado, explícitamente fuera de alcance.
  - T1 `ejecutar-viajes-fase-laboral`.
- `specs/CONTRACT-29-impacto-estacion-produccion.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-29-REPORT.md](docs/reports/CONTRACT-29-REPORT.md).
  Primera construcción del impacto de clima en producción: un multiplicador fijo por estación
  (verano `x1.5`, invierno `x0.5`, otoño/primavera `x1`) afecta solo a la granja, verificado en
  4 ticks representativos (uno por estación) en vez de un año completo.
  - T1 `calcular-multiplicador-clima`, T2 `ejecutar-produccion-estacional`.
- `specs/CONTRACT-30-gasto-tiempo-libre.md` — **completo** (implementado por `pool` — Poolside
  CLI). Ver [docs/reports/CONTRACT-30-REPORT.md](docs/reports/CONTRACT-30-REPORT.md). Cierra el
  pendiente del Contrato 28: la población gasta dinero en tiempo libre TODOS los días (a
  diferencia del viaje laboral, no depende de `esLaboral`), reusando el patrón "comprador viaja
  al bien" del Contrato 23 a lo largo de una semana.
  - T1 `ejecutar-gasto-tiempo-libre`.
- `specs/CONTRACT-31-decision-orquestacion-viaje.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-31-REPORT.md](docs/reports/CONTRACT-31-REPORT.md).
  Cierra el último pendiente del roadmap: decide, según `calcularTicksViaje` sobre la distancia
  real de una ruta, si un viaje se resuelve instantáneo o como tránsito multi-tick,
  demostrando ambas ramas en el mismo escenario.
  - T1 `ejecutar-decision-orquestacion-viaje`.
- `specs/CONTRACT-32-cadena-referencia-ampliada.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-32-REPORT.md](docs/reports/CONTRACT-32-REPORT.md).
  Extiende la integración más completa (Contrato 25) con calendario (Contrato 27) y clima
  estacional (Contrato 29) combinados: 10 ticks (días 80-89) cruzando otoño→invierno. Hallazgo
  emergente: la población se estabiliza en cobertura `0.5` (no `1`), un equilibrio distinto
  causado por la interacción degradación+clima.
  - T1 `ejecutar-cadena-referencia-ampliada`.
- Pendiente (fuera de alcance deliberado): recetas multi-insumo y múltiples centros cívicos
  combinados en una cadena económica completa — subsistemas estructuralmente disjuntos, no
  integrados con la referencia ampliada.
- Cerrado el primer roadmap sin pendientes explícitos conocidos (Contratos 01-32).

### Segunda ronda: niveles, footprint, árboles, elevación, petróleo (en curso, ejecución autónoma)

- `specs/CONTRACT-33-terreno-flexible-residencial-industrial.md` — **completo** (implementado
  por `pool` — Poolside CLI). Ver
  [docs/reports/CONTRACT-33-REPORT.md](docs/reports/CONTRACT-33-REPORT.md). Introduce las
  categorías `residencial`/`industrial`: pueden construirse en cualquier terreno excepto agua
  profunda, vía un gate aditivo nuevo que nunca reemplaza a `puedeConstruir` para las categorías
  existentes.
  - T1 `puede-construir-flexible`, T2 `asignar-nodo-celda`, T3 `colocar-nodo-flexible`.
- `specs/CONTRACT-34-footprint-viviendas-por-nivel.md` — **completo** (implementado por `pool`
  — Poolside CLI). Ver [docs/reports/CONTRACT-34-REPORT.md](docs/reports/CONTRACT-34-REPORT.md).
  Las casas son la única construcción cuyo footprint crece con el nivel (S=2x2, M=3x2, L=3x3),
  colocado de forma atómica (dos pasadas, sin rollback) reusando el terreno flexible del
  Contrato 33.
  - T1 `celdas-de-casa-por-nivel`, T2 `calcular-capacidad-poblacion-casa-por-nivel`, T3
    `colocar-casa-multi-celda`.
- `specs/CONTRACT-35-nivel-de-granja.md` — **completo** (implementado por `pool` — Poolside
  CLI). Ver [docs/reports/CONTRACT-35-REPORT.md](docs/reports/CONTRACT-35-REPORT.md). Con la
  misma agua recibida, una granja produce más manzanas (y cuesta más construir) cuanto más alto
  es su nivel: `8/16/24` manzanas y `30/50/80` de costo para `S/M/L`.
  - T1 `calcular-factor-rendimiento-granja-por-nivel`, T2
    `calcular-costo-construccion-granja-por-nivel`, T3 `ejecutar-produccion-granja-por-nivel`.
- `specs/CONTRACT-36-area-de-accion-por-nivel.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-36-REPORT.md](docs/reports/CONTRACT-36-REPORT.md).
  Única tabla del roadmap de niveles deliberadamente compartida entre dominios: el radio de área
  de acción (`{S:2, M:3, L:4}`), reusado directo con `estaEnZonaInfluencia`, coincide siempre
  entre reforestación y tala.
  - T1 `radio-area-accion-por-nivel`, T2 `ejecutar-area-accion-por-nivel`.
- `specs/CONTRACT-37-ciclo-de-vida-del-arbol.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-37-REPORT.md](docs/reports/CONTRACT-37-REPORT.md).
  Cada celda tiene un estado Árbol/Tocón/Limpio en un `Map` aparte del grid; tala es siempre
  acción explícita, Tocón→Limpio y Limpio→Árbol son automáticos por tiempo (2 y 3 ticks).
  - T1 `crear-estado-arboles`, T2 `talar-arbol`, T3 `avanzar-ciclo-arbol-tick`, T4
    `tala-produce-en-zona`.
- `specs/CONTRACT-38-integracion-tala-reforestacion-con-nivel.md` — **completo** (implementado
  por `pool` — Poolside CLI). Ver
  [docs/reports/CONTRACT-38-REPORT.md](docs/reports/CONTRACT-38-REPORT.md). Cierra el ciclo:
  área de acción por nivel + ciclo de vida del árbol combinados — tala en el tick 0, silencio 4
  ticks mientras regenera, segunda tala en el tick 5.
  - T1 `ejecutar-cadena-tala-reforestacion-con-nivel`.
- `specs/CONTRACT-39-elevacion-terreno-rutas.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-39-REPORT.md](docs/reports/CONTRACT-39-REPORT.md).
  Carretera nunca cruza agua, marítima nunca cruza tierra, ferrocarril/subte exentos; nivel S no
  puede cambiar de plano de elevación, M/L sí. El plano se deriva directo del terreno, sin
  estado nuevo por celda.
  - T1 `plano-de-terreno`, T2 `ruta-cruza-terreno-valido`, T3 `ruta-puede-cambiar-plano`, T4
    `ejecutar-conexion-ruta-con-elevacion`.
- `specs/CONTRACT-40-rutas-escaladas-por-nivel.md` — **completo** (implementado por `pool` —
  Poolside CLI). Ver [docs/reports/CONTRACT-40-REPORT.md](docs/reports/CONTRACT-40-REPORT.md).
  Capacidad de ruta escalada por nivel (`10/20/30` sobre base `10`), costo de construcción
  creciente (`20/40/70`), y mejora pagando solo la diferencia — degradar siempre lanza error.
  - T1 `calcular-tolerancia-saturacion-ruta-por-nivel`, T2 `crear-tramo-con-nivel`, T3
    `calcular-costo-construccion-ruta-por-nivel`, T4 `calcular-costo-mejora-nivel-ruta`, T5
    `ejecutar-ruta-escalada-por-nivel`.
- `specs/CONTRACT-41-petroleo-refinería-almacen-tipado.md` — **completo** (implementado por
  `pool` — Poolside CLI). Ver
  [docs/reports/CONTRACT-41-REPORT.md](docs/reports/CONTRACT-41-REPORT.md). Extracción y
  refinería reusan `crearNodoProductivo` tal cual (solo nuevos datos); almacén de petróleo
  dedicado (crudo/refinado, gemelo de `crearAlmacen`), incompatible con almacenes orgánicos.
  - T1 `crear-almacen-petroleo`, T2 `agregar-stock-almacen-petroleo`, T3
    `retirar-stock-almacen-petroleo`, T4 `es-almacen-incompatible`, T5
    `ejecutar-extraccion-refino-petroleo`.
- `specs/CONTRACT-42-combustible-trafico-degradado.md` — **completo** (implementado por `pool`
  — Poolside CLI). Ver [docs/reports/CONTRACT-42-REPORT.md](docs/reports/CONTRACT-42-REPORT.md).
  Cierra el roadmap 33-42: combustible degrada linealmente el tráfico de carretera y de
  marítima larga; subte, ferrocarril y marítima corta quedan exentos.
  - T1 `clasificar-longitud-ruta`, T2 `tramo-requiere-combustible`, T3
    `aplicar-escasez-combustible-tramo`, T4 `ejecutar-trafico-con-combustible`.
- **Roadmap 33-42 completo** (10 contratos de ejecución, ejecutados de forma autónoma sin
  pausar entre ellos): niveles S/M/L, footprint de viviendas, ciclo de vida de árboles,
  elevación/terreno de rutas, petróleo/almacén tipado, combustible. Pendiente (fuera de
  alcance de este roadmap, por diseño): combinar estas mecánicas en una integración conjunta
  real; industrias derivadas de petróleo (datos, no motor).
- Suite: `node --test tests/test_*.js` — 556/556 verde.
- Gate: `python scripts/validate_contracts.py knowledge/contracts` — 0 errores, 107 contratos.
