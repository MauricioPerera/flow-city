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
- **Sin resolver todavía**: tamaño de nodo en celdas (todo nodo construido hasta ahora ocupa
  exactamente 1 celda), límite de conexiones por vértice, y si las rutas pueden cruzar agua
  profunda o zonas elevadas.
- **Fuera de alcance, confirmado durante la ejecución** (no solo pendiente de PLAN, sino
  descartado explícitamente por riesgo/alcance): combinar recetas multi-insumo y múltiples
  centros cívicos dentro de la misma cadena económica de referencia — ver
  [Contrato 32](specs/CONTRACT-32-cadena-referencia-ampliada.md). Tampoco existe capa de
  UI/renderizado — el proyecto es, hasta ahora, lógica de simulación pura.
