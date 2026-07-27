# Flow City — Definición

## Qué es

Flow City es un city-tycoon de logística, gestión y automatización: el jugador construye una ciudad como un grafo de nodos (construcciones) conectados por rutas tipadas sobre un lienzo en grilla, al estilo del editor visual de n8n aplicado a una ciudad.

## Arquitectura

- **Plataforma**: web standalone (HTML/JS), sin backend. Un servidor queda abierto como posible evolución futura si hiciera falta, pero no es parte del alcance actual.
- **Modo**: single-player, un único lienzo por partida.
- **Tiempo**: discreto, por ticks (no tiempo real continuo). Ver jerarquía temporal en Capacidades objetivo.
- **Espacio**: grilla acotada por chunks (no lienzo libre ni infinito real). Cada vértice de la grilla es un punto de conexión posible; las rutas se tienden entre vértices.
- **Motor de simulación vs. datos**: siguiendo la separación propia del protocolo GAME, el contenido/balance (tipos de construcción, recetas, tipos de ruta, layout inicial) se definirá más adelante como dato declarativo (perfil GAME.md); el motor de simulación (resolución de tráfico, pathfinding, economía tick a tick) es lógica de motor separada, gobernada por contratos KDD. Esta división no se implementa en este documento, solo se dejan sentadas las reglas que ese motor deberá resolver.

## Capacidades objetivo

**Grilla y construcción**
- Lienzo en grilla acotada por chunks; vértices como puntos de conexión.
- Nodos (construcciones) anclados a celdas, rotables, sin superposición entre sí, con una entrada que debe conectar a una ruta.
- Terreno con 4 tipos de celda: verde (cultivable/reforestable), elevada (minería), agua profunda (pesca) y neutra (sin recurso explotable, pero construible). Construcciones no extractivas pueden ocupar celdas verdes, restando espacio cultivable/reforestable disponible.
- Recursos "a mano" (bosque, mineral en montaña) que se agotan y no se regeneran solos: requieren un nodo dedicado (reforestación, mina) para sostenerse en el tiempo.

**Rutas y tráfico**
- Cuatro tipos de ruta: carretera (vehículos y mercadería), ferrocarril (solo mercadería), marítima (mercadería y personas, puerto a puerto), subte (solo personas).
- Cada tramo (segmento entre una conexión y la siguiente) tiene capacidad de carga limitada; el jugador puede restringir un tramo a mercadería, personas o ambos (default: ambos).
- Saturación de tramo: enlentecimiento del movimiento o, en saturación extrema, pérdida de la mercadería en tránsito.
- La distancia real de un tramo determina cuántos ticks tarda un trayecto; mientras dura, el trayecto ocupa capacidad del tramo (no es entrega instantánea).
- Cálculo de ruta automático (pathfinding) para personas y mercadería, siempre acotado a las rutas realmente disponibles y a su tipo de tráfico permitido.

**Producción y cadenas de recursos**
- Construcciones con receta de entrada→salida (ej. bomba de agua produce agua; granja consume agua y produce manzanas en proporción 1:2; nodo de reforestación consume agua y produce árboles en proporción 2:1; taller de tala consume agua, comida, personas y árboles, y produce madera; fábrica de muebles consume madera y produce muebles).
- Cada construcción productiva tiene almacén propio, de capacidad limitada, para materia prima y para parte de su producción terminada. Si el buffer de producto terminado se llena y no se despacha a tiempo, la producción se detiene hasta liberar espacio.

**Población**
- Centro cívico con zona de influencia: única forma habilitada de construir casas dentro de su radio.
- Casas habilitan población; la población tiene necesidades (agua, comida, muebles, etc.).
- La población crece o decrece según cuán bien cubiertas están sus necesidades. La población total determina la mano de obra disponible, que determina cuánto se produce y se consume, lo que impacta directamente en la economía (loop cerrado).

**Comercio y economía**
- Comercios (ej. restaurantes) tienen aforo: capacidad máxima de personas simultáneas dentro del local, distinta de la capacidad de una ruta.
- Dos patrones de venta: bienes que viajan hacia el comprador (ej. muebles a la casa) y compradores que viajan hacia el bien (ej. clientes a un restaurante).
- El dinero es un resultado derivado de la venta de mercadería/servicios, no un recurso transportado físicamente.
- El jugador gestiona una tesorería real: construir cuesta dinero, cada nodo tiene mantenimiento periódico, y la venta es el ingreso. Si la tesorería llega a 0 hay consecuencias mecánicas reales (ej. degradación de nodos), sin que constituya una derrota formal.
- Comercio inter-zona/inter-ciudad vía estaciones de ferrocarril (conectan por tierra) y puertos (conectan por agua). Ambos dependen de almacenes para guardar mercadería comprada y la disponible para venta; cada estación/puerto define qué compra y qué vende. Un tren/barco que viaja de A a B transporta mercadería y la vende en B si coincide con lo que B compra; el regreso de B a A lleva lo que B vende, concretándose la venta en A si A compra. La transacción está siempre limitada por el menor valor entre la capacidad de carga del vehículo y la capacidad de compra de la estación/puerto destino.

**Calendario**
- Día = tick, dividido en 3 fases iguales (trabajo, sueño, tiempo libre); la transición entre fases genera picos de tráfico (ida/vuelta laboral); en tiempo libre la población puede gastar dinero (impacta consumo/economía).
- Semana = 7 días (lunes a viernes laboral, sábado y domingo de descanso), con patrón propio de tráfico y economía.
- Mes = 4 semanas.
- Estación = 3 meses (otoño, invierno, primavera, verano), con impacto propio en clima y por tanto en producción.
- Año = 12 meses.

**Niveles (S/M/L)**
- Toda construcción y toda ruta tiene un nivel: S (básico), M, L. Subir de nivel mejora la capacidad propia de ese tipo: los cultivos producen más, las rutas toleran más saturación y pueden cambiar de plano de elevación (ver más abajo), las fábricas producen más o requieren menos insumo, las casas alojan más población, los comercios atienden y venden más.
- Construir en un nivel más alto cuesta más dinero (S < M < L). Una construcción o ruta ya existente puede mejorarse de nivel pagando la diferencia de costo; nunca se puede degradar de nivel.

**Footprint vs. área de acción**
- Son dos conceptos distintos: el footprint es el conjunto de celdas que una construcción ocupa físicamente; el área de acción es el conjunto de celdas donde esa construcción actúa sin ocuparlas (un radio, igual en naturaleza a la zona de influencia del centro cívico).
- Para la mayoría de construcciones (reforestación, tala, granjas, centro cívico) el footprint se mantiene igual en los tres niveles; lo que crece con el nivel es el área de acción.
- Las casas son la excepción: su footprint crece con el nivel (por ejemplo S=2x2, M=3x2, L=3x3 celdas), y junto con él, la población que albergan.

**Terreno flexible para vivienda e industria**
- Las construcciones no extractivas de vivienda e industria pueden construirse en cualquier tipo de terreno (verde, elevado, neutro), no solo en el ideal (neutro), sacrificando el uso especializado que esa celda podría haber tenido (cultivo, minería). La única restricción dura: ninguna construcción no acuática puede ir sobre agua profunda.

**Ciclo de vida de árboles**
- Cada celda dentro del área de acción de un nodo de reforestación o de tala tiene un estado de árbol: Árbol (maduro, cosechable) → Tocón (recién talado) → Limpio (listo para replantar) → vuelve a convertirse en Árbol con el tiempo.
- El nodo de tala solo puede producir madera si existe al menos una celda en estado Árbol dentro de su área de acción; al cosechar, esa celda pasa a Tocón. El nodo de reforestación es quien, con el tiempo, hace que las celdas Limpias vuelvan a convertirse en Árbol dentro de su propia área de acción.

**Elevación y niveles de ruta**
- El terreno tiene planos de elevación (terreno elevado, frente al resto). Las rutas terrestres (carretera) nunca pueden cruzar agua profunda; las rutas marítimas nunca pueden cruzar tierra.
- Una ruta de nivel S solo conecta puntos dentro de un mismo plano de elevación; los niveles M y L permiten además cambiar de plano.
- Subte y ferrocarril quedan exentos de esta restricción de elevación: alcanza con colocar una terminal y conectarla a la red existente.
- Las rutas se clasifican por su distancia real (longitud del tramo) en cortas o largas; las rutas marítimas largas son las que permiten conectar con islas o continentes y acceder a recursos no disponibles en la zona inicial.

**Petróleo, combustible y almacenes tipados**
- El petróleo es un recurso infinito (mismo patrón que el agua), pero a diferencia del agua necesita refinarse (una industria más, con el mismo modelo de receta entrada→salida) antes de poder usarse en la mayoría de los casos; algunas industrias piden petróleo crudo, otras piden refinado.
- Los almacenes que guardan petróleo no pueden compartirse con almacenes de productos orgánicos.
- El combustible (derivado del petróleo refinado) es necesario para que circule el tráfico vehicular de carretera; su ausencia degrada ese tráfico. No afecta a subte ni a ferrocarril, ni a embarcaciones de pesca chicas/medianas; sí afecta a las rutas marítimas largas.
- Sobre la base del petróleo se pueden definir industrias derivadas (plástico como alternativa a la madera, tapizados, neumáticos, pegamentos, pinturas), usando el mismo modelo de receta entrada→salida ya definido — son datos nuevos, no una mecánica de motor distinta.

## Por qué es un caso válido / motivación real

Formaliza un sistema de simulación logística con reglas de capacidad, flujo y dependencia de recursos genuinamente complejas (no un tycoon genérico), sirviendo como caso real para ejercitar la separación dato/lógica del protocolo GAME junto con el proceso de contratos de KDD sobre un dominio que no encaja en ningún perfil existente.

## Fuera de alcance

- Sin backend/servidor por ahora (evolución futura posible, no parte de este alcance).
- Sin multijugador: un usuario, un lienzo.
- Sin condición de victoria o derrota formal: es sandbox puro.
- Sin fórmulas exactas de consumo per cápita, tasas de crecimiento poblacional, costos concretos de construcción/mantenimiento, ni tamaños numéricos de zona de influencia — se definen en los contratos de tarea correspondientes durante PLAN, no aquí.
- Sin definición del perfil GAME.md ni del motor de simulación en sí — este documento formaliza reglas y alcance, no implementación.
- Sin resolver aún: tamaño de nodo en celdas (si puede ocupar más de una), límite de conexiones por vértice, si rutas pueden cruzar agua profunda o zonas elevadas, ni comportamiento ante superposición de zonas de influencia de más de un centro cívico — quedan para PLAN.

## Nota posterior (PLAN/ejecución, no modifica el alcance original)

Este documento no se edita retroactivamente con decisiones tomadas durante PLAN — esta nota solo
señala, sin tocar el resto del texto de arriba, qué puntos dejados abiertos en "Fuera de
alcance" terminaron resueltos en los contratos de tarea, y cuáles siguen sin resolver:

- **Resuelto**: comportamiento ante superposición de zonas de influencia de más de un centro
  cívico — unión de zonas (no intersección); una casa se acepta si cae dentro del radio de
  CUALQUIER centro, sin duplicar población en la celda de solapamiento. Ver
  [Contrato 26](specs/CONTRACT-26-poblacion-multiples-centros.md).
- **Resuelto**: fórmulas exactas de consumo per cápita, tasas de crecimiento poblacional,
  costos de construcción/mantenimiento y tamaño de zona de influencia — fijados como constantes
  de diseño en los Contratos [06](specs/CONTRACT-06-poblacion.md),
  [14](specs/CONTRACT-14-gasto-tesoreria-construccion.md) y
  [16](specs/CONTRACT-16-poblacion-grid-real.md) en adelante.
- **Resuelto (segunda ronda de diseño conceptual, ver "Capacidades objetivo" arriba)**: tamaño
  de nodo variable (footprint) para viviendas por nivel S/M/L, y si las rutas pueden cruzar agua
  profunda o zonas elevadas (carretera nunca sobre agua, marítima nunca sobre tierra, cambio de
  plano de elevación solo en niveles M/L). Pendiente de construcción real en contratos de tarea,
  no solo de diseño conceptual.
- **Sin resolver todavía**: límite de conexiones por vértice.
- **Fuera de alcance, confirmado durante la ejecución** (no solo pendiente de PLAN, sino
  descartado explícitamente por riesgo/alcance): combinar recetas multi-insumo y múltiples
  centros cívicos dentro de la misma cadena económica de referencia — ver
  [Contrato 32](specs/CONTRACT-32-cadena-referencia-ampliada.md). Tampoco existe capa de
  UI/renderizado — el proyecto es, hasta ahora, lógica de simulación pura.
