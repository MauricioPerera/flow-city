window.onCjsReady = function () {
  var crearGrid = window.__cjs['crearGrid'].crearGrid;
  var obtenerCelda = window.__cjs['obtenerCelda'].obtenerCelda;
  var colocarNodo = window.__cjs['colocarNodo'].colocarNodo;
  var colocarNodoFlexible = window.__cjs['colocarNodoFlexible'].colocarNodoFlexible;
  var colocarCasaMultiCelda = window.__cjs['colocarCasaMultiCelda'].colocarCasaMultiCelda;
  var crearNodoProductivo = window.__cjs['crearNodoProductivo'].crearNodoProductivo;
  var crearAlmacen = window.__cjs['crearAlmacen'].crearAlmacen;
  var agregarStockAlmacen = window.__cjs['agregarStockAlmacen'].agregarStockAlmacen;
  var retirarStockAlmacen = window.__cjs['retirarStockAlmacen'].retirarStockAlmacen;
  var asignarNodoCelda = window.__cjs['asignarNodoCelda'].asignarNodoCelda;
  var producirTickNodo = window.__cjs['producirTickNodo'].producirTickNodo;
  var producirTickNodoConAlmacen = window.__cjs['producirTickNodoConAlmacen'].producirTickNodoConAlmacen;
  var crearTesoreria = window.__cjs['crearTesoreria'].crearTesoreria;
  var registrarGasto = window.__cjs['registrarGasto'].registrarGasto;
  var registrarIngreso = window.__cjs['registrarIngreso'].registrarIngreso;
  var calcularMontoVenta = window.__cjs['calcularMontoVenta'].calcularMontoVenta;
  var resolverCompraAlmacen = window.__cjs['resolverCompraAlmacen'].resolverCompraAlmacen;
  var calcularCapacidadPoblacionCasaPorNivel = window.__cjs['calcularCapacidadPoblacionCasaPorNivel'].calcularCapacidadPoblacionCasaPorNivel;
  var calcularCoberturaNecesidad = window.__cjs['calcularCoberturaNecesidad'].calcularCoberturaNecesidad;
  var combinarCoberturas = window.__cjs['combinarCoberturas'].combinarCoberturas;
  var calcularCrecimientoPoblacion = window.__cjs['calcularCrecimientoPoblacion'].calcularCrecimientoPoblacion;
  var calendarioDeTick = window.__cjs['calendarioDeTick'].calendarioDeTick;
  var calcularMultiplicadorClima = window.__cjs['calcularMultiplicadorClima'].calcularMultiplicadorClima;
  var aplicarMantenimientoTick = window.__cjs['aplicarMantenimientoTick'].aplicarMantenimientoTick;
  var verticeEntrada = window.__cjs['verticeEntrada'].verticeEntrada;
  var crearTramoConNivel = window.__cjs['crearTramoConNivel'].crearTramoConNivel;
  var conectarVertices = window.__cjs['conectarVertices'].conectarVertices;
  var encontrarRuta = window.__cjs['encontrarRuta'].encontrarRuta;
  var resolverViaje = window.__cjs['resolverViaje'].resolverViaje;
  var calcularTicksViaje = window.__cjs['calcularTicksViaje'].calcularTicksViaje;
  var iniciarViajeEnTransito = window.__cjs['iniciarViajeEnTransito'].iniciarViajeEnTransito;
  var resolverTickConTransito = window.__cjs['resolverTickConTransito'].resolverTickConTransito;
  var registrarCargaTramo = window.__cjs['registrarCargaTramo'].registrarCargaTramo;
  var calcularSaturacion = window.__cjs['calcularSaturacion'].calcularSaturacion;

  var ANCHO = 12;
  var ALTO = 10;
  var TAM = 40;
  var VELOCIDAD_BASE = 10; // ad hoc, mismo valor usado en ejecutarDecisionOrquestacionViaje.js
  var TICK_MS = 600;

  var grid = crearGrid(ANCHO, ALTO, 'neutra');

  // Patron fijo de terreno mixto para poder probar las 4 categorias de terreno.
  for (var x = 0; x < ANCHO; x += 1) {
    for (var y = 0; y <= 1; y += 1) obtenerCelda(grid, x, y).terreno = 'verde';
    for (var y2 = 2; y2 <= 3; y2 += 1) obtenerCelda(grid, x, y2).terreno = 'elevada';
    for (var y3 = 4; y3 <= 5; y3 += 1) obtenerCelda(grid, x, y3).terreno = 'agua_profunda';
    // y 6..9 queda 'neutra' (default de crearGrid)
  }

  var categoriasReceta = { agricultura: true, reforestacion: true, no_extractiva: true };
  var categoriasExtraccion = { mineria: true, pesca: true };
  var categoriasFlexibles = { residencial: true, industrial: true };
  var categoriasProductivas = { agricultura: true, reforestacion: true, no_extractiva: true, mineria: true, pesca: true };
  var CAPACIDAD_ALMACEN = 50; // ad hoc, misma capacidad para materia prima y producto

  // Costos y precios ad hoc: costoConstruccionNodo.js de src/ solo cubre
  // 'agricultura'/'extraccion-agua' (Contrato 14), no las 8 categorias que
  // esta UI construye (incluye residencial/industrial/casa del Contrato 33/34,
  // que ni siquiera colocarNodo acepta). Se define una tabla propia aca, mismo
  // patron ad hoc que el resto del proyecto (ej. PRECIO_UNITARIO del Contrato 12).
  var COSTO_CONSTRUCCION = {
    agricultura: 30,
    reforestacion: 25,
    mineria: 40,
    pesca: 35,
    no_extractiva: 20,
    residencial: 50,
    industrial: 60,
    puerto: 45,
  };
  var COSTO_CASA_POR_NIVEL = { S: 40, M: 70, L: 110 };
  var PRECIO_UNITARIO = { agricultura: 3, reforestacion: 2, mineria: 4, pesca: 3, no_extractiva: 2 };
  var CAPACIDAD_COMPRA_COMERCIO = 5; // ad hoc, unidades vendidas por nodo por tick
  // ad hoc: con produccionFija=1 (valor original), mineria/pesca vendian 1/tick
  // (max $4 o $3) contra un mantenimiento de $3-$2/tick solo esa construccion
  // - practicamente empataba, sin margen para financiar nada mas (hallazgo real
  // del playtest de punta a punta). Se sube a 3/tick para que dejen margen neto.
  var PRODUCCION_FIJA_EXTRACCION = 3;
  var SALDO_INICIAL = 100; // ad hoc

  // Poblacion: no hay categoria "extraccion-agua" en esta UI (el patron
  // bomba->granja de los Contratos 09/17/25 usa esa categoria, que no existe
  // en el vocabulario de puedeConstruir.js/puedeConstruirFlexible.js de esta
  // UI). Convencion ad hoc, documentada: 'pesca' cubre la necesidad de agua,
  // 'agricultura' Y 'no_extractiva' cubren la necesidad de comida (segundo
  // productor de comida agregado tras el playtest: sostener una casa grande
  // con una sola cadena de suministro dejaba la economia siempre ajustada).
  // 'no_extractiva' NO recibe el multiplicador de clima (ver Fase 1 mas abajo)
  // - igual que el Contrato 29, el clima solo afecta 'agricultura'.
  var categoriasVivienda = { residencial: true, casa: true };
  // Puerto: infraestructura pura (sin produccion/almacen/poblacion), solo
  // habilita rutas maritimas. Ni puedeConstruir.js (tabla clasica de src/,
  // no tiene 'puerto') ni puedeConstruirFlexible.js (excluye agua_profunda,
  // justo lo que un puerto necesita) sirven para colocarlo - se valida el
  // terreno a mano en manejarClickConstruir y se asigna directo con
  // asignarNodoCelda.js. Requiere agua_profunda, igual que 'pesca'.
  var CATEGORIA_PUERTO = 'puerto';
  // Cruce de agua abierta para ferrocarril/subte (pedido del usuario, no hay
  // regla equivalente en src/): nivel S nunca puede cruzar agua abierta;
  // M y L si, hasta un limite de celdas de agua abierta que crece con el
  // nivel. Ferrocarril = "puente" (cruza rios/arroyos, nunca un oceano ->
  // limite chico); subte = "tunel submarino" (algo mas generoso, mismo
  // patron de nivel). 'carretera' nunca puede cruzar agua abierta, en
  // ningun nivel. 'maritima' no tiene limite (para eso existe, siempre que
  // tenga puerto en cada extremo).
  var LIMITE_CRUCE_FERROCARRIL = { M: 2, L: 4 };
  var LIMITE_CRUCE_SUBTE = { M: 3, L: 6 };
  var CATEGORIAS_AGUA = ['pesca'];
  var CATEGORIAS_COMIDA = ['agricultura', 'no_extractiva'];
  var NECESIDAD_PER_CAPITA = 0.2; // mismo valor ad hoc que ejecutarCadenaPoblacionDinamica.js
  // ad hoc, mas alta que en los ejecutores de referencia (que usan poblaciones
  // de 10+): con capacidades de vivienda de esta UI (4-9), calcularCrecimientoPoblacion
  // aplicada por-vivienda con tasas bajas nunca redondea hacia +1 (Math.floor
  // asimetrico) y la poblacion solo podria encoger, nunca recuperarse. Por eso
  // el crecimiento se calcula sobre el TOTAL de la ciudad (ver mas abajo), no
  // por vivienda, y con una tasa mayor para que sea visible a esta escala.
  var TASA_BASE_POBLACION = 0.3;
  var POBLACION_RESIDENCIAL_FIJA = 4; // ad hoc, equivale a una casa nivel S

  // Mantenimiento: costoMantenimientoNodo.js de src/ (Contrato 14) tiene la
  // misma tabla acotada que costoConstruccionNodo.js ('extraccion-agua'/'agricultura'
  // solamente) - no cubre las 8 categorias de esta UI. Tabla propia ad hoc,
  // mismo patron que COSTO_CONSTRUCCION. Se cobra solo en dias laborales
  // (Contrato 27), vía aplicarMantenimientoTick.js (esa si es generica: solo
  // suma un array de costos ya resueltos y cobra una vez si el total > 0).
  var COSTO_MANTENIMIENTO = {
    agricultura: 2, reforestacion: 1, mineria: 3, pesca: 2,
    no_extractiva: 1, residencial: 1, industrial: 2, puerto: 2,
  };
  var COSTO_MANTENIMIENTO_CASA = 1; // ad hoc, igual para S/M/L en esta primera pasada

  // Condiciones de fin de partida (decision del usuario, no de src/): no hay
  // victoria fija - el objetivo es sobrevivir el mayor tiempo posible, asi
  // que el puntaje es tickActual (dias sobrevividos), mostrado siempre.
  // Derrota (ambas condiciones, la que ocurra primero): poblacion en 0
  // habiendo tenido vivienda construida, o saldo negativo UMBRAL_QUIEBRA
  // ticks SEGUIDOS (se reinicia el contador apenas el saldo vuelve a ser
  // >= 0, no es acumulativo). UMBRAL_QUIEBRA ad hoc.
  var UMBRAL_QUIEBRA = 5;

  var tickActual = 0;
  var tesoreria = crearTesoreria(SALDO_INICIAL);
  var ticksSaldoNegativoConsecutivos = 0;
  var juegoTerminado = false;

  // Acumulador de fraccion de poblacion: calcularCrecimientoPoblacion.js
  // devuelve un numero crudo sin redondear; truncarlo a entero CADA tick
  // (como hacen los ejecutores de referencia, ej. ejecutarCadenaPoblacionDinamica.js)
  // funciona con las poblaciones grandes (10+) de esos demos, pero con las
  // capacidades chicas de esta UI (4-9) un cambio tipico de +0.3/tick se
  // descarta entero cada vez y la poblacion queda atascada para siempre,
  // aun con cobertura 100% (verificado a mano). Se acumula la fraccion entre
  // ticks y solo se aplica el cambio entero cuando cruza un umbral.
  var poblacionFraccionAcumulada = 0;

  function costoDeCategoria(categoria) {
    if (categoria === 'casa') return COSTO_CASA_POR_NIVEL[nivelCasaEl.value];
    return COSTO_CONSTRUCCION[categoria];
  }

  var grafo = {};
  var nodosColocados = []; // { x, y, categoria, vertice, etiqueta }
  var rutasDibujadas = []; // { ax, ay, bx, by, tipoRuta }
  var rutaOrigenSeleccionado = null;
  var viajeActivo = null; // { intervalId }

  var gridEl = document.getElementById('grid');
  var overlayEl = document.getElementById('overlay');
  var mensajeEl = document.getElementById('mensaje');
  var modoEl = document.getElementById('modo');
  var panelConstruir = document.getElementById('panelConstruir');
  var panelRuta = document.getElementById('panelRuta');
  var panelViaje = document.getElementById('panelViaje');
  var categoriaEl = document.getElementById('categoria');
  var nivelCasaWrap = document.getElementById('nivelCasaWrap');
  var nivelCasaEl = document.getElementById('nivelCasa');
  var tipoRutaEl = document.getElementById('tipoRuta');
  var nivelRutaEl = document.getElementById('nivelRuta');
  var capacidadRutaEl = document.getElementById('capacidadRuta');
  var origenViajeEl = document.getElementById('origenViaje');
  var destinoViajeEl = document.getElementById('destinoViaje');
  var tipoTraficoViajeEl = document.getElementById('tipoTraficoViaje');
  var cantidadViajeEl = document.getElementById('cantidadViaje');
  var enviarViajeBtn = document.getElementById('enviarViaje');
  var avanzarTickProduccionBtn = document.getElementById('avanzarTickProduccion');
  var venderProduccionBtn = document.getElementById('venderProduccion');
  var guardarPartidaBtn = document.getElementById('guardarPartida');
  var cargarPartidaBtn = document.getElementById('cargarPartida');
  var reiniciarPartidaBtn = document.getElementById('reiniciarPartida');
  var CLAVE_GUARDADO = 'flowCityGuardado';
  var saldoEl = document.getElementById('saldo');
  var costoConstruccionEl = document.getElementById('costoConstruccion');
  var poblacionTotalEl = document.getElementById('poblacionTotal');
  var calendarioEl = document.getElementById('calendario');
  var puntajeEl = document.getElementById('puntaje');
  var gameOverEl = document.getElementById('gameOver');

  gridEl.style.gridTemplateColumns = 'repeat(' + ANCHO + ', ' + TAM + 'px)';
  overlayEl.setAttribute('width', ANCHO * TAM);
  overlayEl.setAttribute('height', ALTO * TAM);

  function parseVertice(id) {
    var partes = id.split(',');
    return { x: Number(partes[0]), y: Number(partes[1]) };
  }

  function pixelDeVertice(id) {
    var p = parseVertice(id);
    return { x: p.x * TAM, y: p.y * TAM };
  }

  // Traza el segmento a->b en L (horizontal y despues vertical), no en
  // diagonal recta: los vertices ya son intersecciones del grid (multiplos
  // de TAM), asi que un camino horizontal+vertical corre exactamente sobre
  // las aristas de las celdas en vez de cortar por arriba de otras
  // construcciones. Devuelve los 3 puntos del quiebre (a, esquina, b).
  function segmentoOrtogonal(a, b) {
    return [a, { x: b.x, y: a.y }, b];
  }

  // Cuenta cuantos "pasos" (celdas) de agua abierta cruza un camino
  // terrestre (pedido del usuario). No se reusa rutaCruzaTerrenoValido.js
  // de src/ (Contrato 39) porque esa funcion solo mira el terreno de los
  // DOS EXTREMOS - en esta UI un extremo puede ser legitimamente
  // agua_profunda si el nodo es 'puerto' o 'pesca' (ambos la requieren para
  // construirse), y aplicar esa regla ahi rompería la conexion
  // carretera/ferrocarril->puerto que ya se probo en un playtest real. En
  // cambio se revisa el CAMINO: se excluye el primer y ultimo paso de cada
  // segmento (adyacentes a los nodos conectados, donde tocar agua es
  // esperado si son puerto/pesca) y solo se cuenta un paso INTERIOR si
  // tiene agua_profunda a AMBOS lados (agua abierta de verdad, no la orilla
  // de un puerto).
  function contarPasosAguaAbiertaEnSegmento(p1, p2) {
    var pasos = 0;
    if (p1.y === p2.y) {
      var filaBorde = p1.y / TAM;
      var xIni = Math.min(p1.x, p2.x) / TAM;
      var xFin = Math.max(p1.x, p2.x) / TAM;
      for (var cx = xIni + 1; cx < xFin - 1; cx += 1) {
        var arriba = filaBorde - 1 >= 0 ? obtenerCelda(grid, cx, filaBorde - 1).terreno : null;
        var abajo = filaBorde < ALTO ? obtenerCelda(grid, cx, filaBorde).terreno : null;
        if (arriba === 'agua_profunda' && abajo === 'agua_profunda') pasos += 1;
      }
    } else if (p1.x === p2.x) {
      var colBorde = p1.x / TAM;
      var yIni = Math.min(p1.y, p2.y) / TAM;
      var yFin = Math.max(p1.y, p2.y) / TAM;
      for (var cy = yIni + 1; cy < yFin - 1; cy += 1) {
        var izq = colBorde - 1 >= 0 ? obtenerCelda(grid, colBorde - 1, cy).terreno : null;
        var der = colBorde < ANCHO ? obtenerCelda(grid, colBorde, cy).terreno : null;
        if (izq === 'agua_profunda' && der === 'agua_profunda') pasos += 1;
      }
    }
    return pasos;
  }

  function contarPasosAguaAbierta(a, b) {
    var puntos = segmentoOrtogonal(a, b);
    return contarPasosAguaAbiertaEnSegmento(puntos[0], puntos[1]) + contarPasosAguaAbiertaEnSegmento(puntos[1], puntos[2]);
  }

  function crearNodoDeMuestra(categoria) {
    if (categoriasReceta[categoria]) {
      return crearNodoProductivo(categoria, 1, 1, null);
    }
    if (categoriasExtraccion[categoria]) {
      return crearNodoProductivo(categoria, null, null, PRODUCCION_FIJA_EXTRACCION);
    }
    if (categoriasFlexibles[categoria]) {
      return { categoria: categoria };
    }
    if (categoria === CATEGORIA_PUERTO) {
      return { categoria: CATEGORIA_PUERTO };
    }
    if (categoria === 'casa') {
      return { categoria: 'residencial', nivel: nivelCasaEl.value };
    }
    throw new Error('categoria desconocida: ' + categoria);
  }

  function mostrarMensaje(texto, esError) {
    mensajeEl.textContent = texto;
    mensajeEl.className = esError ? 'error' : 'ok';
  }

  function renderSaldo() {
    saldoEl.textContent = 'Saldo: $' + tesoreria.saldo.toFixed(2);
  }

  function renderCosto() {
    costoConstruccionEl.textContent = 'Costo: $' + costoDeCategoria(categoriaEl.value);
  }

  function registrarNodoColocado(x, y, categoria, nivel) {
    var vertice = verticeEntrada(x, y, 'sur');
    var etiqueta = categoria + ' (' + x + ',' + y + ')';
    var info = { x: x, y: y, categoria: categoria, vertice: vertice, etiqueta: etiqueta };
    if (categoriasProductivas[categoria]) {
      info.almacen = crearAlmacen(CAPACIDAD_ALMACEN, CAPACIDAD_ALMACEN);
    }
    if (categoriasVivienda[categoria]) {
      info.poblacionMax = categoria === 'casa' ? calcularCapacidadPoblacionCasaPorNivel(nivel) : POBLACION_RESIDENCIAL_FIJA;
      info.poblacion = info.poblacionMax; // arranca ocupada al construirse (decision ad hoc)
    }
    nodosColocados.push(info);
    actualizarSelectsViaje();
    return info;
  }

  function poblacionTotal() {
    var total = 0;
    nodosColocados.forEach(function (info) {
      if (info.poblacion !== undefined) total += info.poblacion;
    });
    return total;
  }

  function renderPoblacion() {
    poblacionTotalEl.textContent = 'Población: ' + poblacionTotal();
  }

  function renderCalendario(calendario) {
    calendarioEl.textContent = 'Día ' + calendario.dia + ' (año ' + calendario.anio + ', mes ' +
      calendario.mesDelAnio + ', semana ' + calendario.semanaDelMes + ', ' + calendario.diaDeSemana +
      (calendario.esLaboral ? ', laboral' : ', fin de semana') + ') — ' + calendario.estacion;
  }

  function renderPuntaje() {
    puntajeEl.textContent = 'Sobrevividos: ' + tickActual + (tickActual === 1 ? ' día' : ' días');
  }

  function habilitarBotones(habilitado) {
    avanzarTickProduccionBtn.disabled = !habilitado;
    venderProduccionBtn.disabled = !habilitado;
    enviarViajeBtn.disabled = !habilitado;
  }

  function mostrarGameOver(motivo, dia) {
    juegoTerminado = true;
    gameOverEl.textContent = 'GAME OVER: ' + motivo + '. Sobreviviste ' + dia + (dia === 1 ? ' día' : ' días') + '.';
    gameOverEl.style.display = '';
    habilitarBotones(false);
  }

  function ocultarGameOver() {
    gameOverEl.style.display = 'none';
    gameOverEl.textContent = '';
  }

  function crearGridInicial() {
    var g = crearGrid(ANCHO, ALTO, 'neutra');
    for (var x = 0; x < ANCHO; x += 1) {
      for (var y = 0; y <= 1; y += 1) obtenerCelda(g, x, y).terreno = 'verde';
      for (var y2 = 2; y2 <= 3; y2 += 1) obtenerCelda(g, x, y2).terreno = 'elevada';
      for (var y3 = 4; y3 <= 5; y3 += 1) obtenerCelda(g, x, y3).terreno = 'agua_profunda';
    }
    return g;
  }

  function reiniciarPartida() {
    grid = crearGridInicial();
    tickActual = 0;
    tesoreria = crearTesoreria(SALDO_INICIAL);
    ticksSaldoNegativoConsecutivos = 0;
    juegoTerminado = false;
    poblacionFraccionAcumulada = 0;
    grafo = {};
    nodosColocados = [];
    rutasDibujadas = [];
    rutaOrigenSeleccionado = null;
    if (viajeActivo) {
      clearInterval(viajeActivo.intervalId);
      viajeActivo = null;
    }
    actualizarSelectsViaje();
    habilitarBotones(true);
    ocultarGameOver();
    render();
    dibujarOverlay();
    renderSaldo();
    renderCosto();
    renderPoblacion();
    renderCalendario(calendarioDeTick(tickActual));
    renderPuntaje();
  }

  function nodoPorVertice(vertice) {
    for (var i = 0; i < nodosColocados.length; i += 1) {
      if (nodosColocados[i].vertice === vertice) return nodosColocados[i];
    }
    return null;
  }

  function actualizarSelectsViaje() {
    [origenViajeEl, destinoViajeEl].forEach(function (select) {
      var valorPrevio = select.value;
      select.innerHTML = '';
      nodosColocados.forEach(function (n) {
        var opt = document.createElement('option');
        opt.value = n.vertice;
        opt.textContent = n.etiqueta;
        select.appendChild(opt);
      });
      if (valorPrevio) select.value = valorPrevio;
    });
  }

  function render() {
    gridEl.innerHTML = '';
    for (var y = 0; y < ALTO; y += 1) {
      for (var x = 0; x < ANCHO; x += 1) {
        var celda = obtenerCelda(grid, x, y);
        var div = document.createElement('div');
        var clases = 'celda terreno-' + celda.terreno + (celda.nodo ? ' ocupada' : '');
        if (rutaOrigenSeleccionado && rutaOrigenSeleccionado.x === x && rutaOrigenSeleccionado.y === y) {
          clases += ' origen-ruta';
        }
        div.className = clases;
        div.dataset.x = x;
        div.dataset.y = y;
        if (celda.nodo) {
          var etq = document.createElement('div');
          etq.textContent = celda.nodo.categoria.slice(0, 3);
          div.appendChild(etq);
          var nodoInfo = nodoPorVertice(verticeEntrada(x, y, 'sur'));
          if (nodoInfo && nodoInfo.almacen) {
            var stockDiv = document.createElement('div');
            stockDiv.className = 'stock';
            stockDiv.textContent = nodoInfo.almacen.stockMateriaPrima + '/' + nodoInfo.almacen.stockProducto;
            div.appendChild(stockDiv);
          }
          if (nodoInfo && nodoInfo.poblacion !== undefined) {
            var pobDiv = document.createElement('div');
            pobDiv.className = 'stock';
            pobDiv.textContent = nodoInfo.poblacion + '/' + nodoInfo.poblacionMax;
            div.appendChild(pobDiv);
          }
          div.title = JSON.stringify(celda.nodo) + (nodoInfo && nodoInfo.almacen ? ' | almacen: ' + JSON.stringify(nodoInfo.almacen) : '');
        }
        gridEl.appendChild(div);
      }
    }
  }

  // Color por saturacion actual del tramo (calcularSaturacion.js), no por
  // tipo de ruta - el tipo de ruta se distingue por el patron de trazo
  // (stroke-dasharray, ver style.css). Umbrales de color ad hoc.
  function colorDeSaturacion(cargaActual, capacidad) {
    var resultado = calcularSaturacion(cargaActual, capacidad);
    if (resultado.factorVelocidad >= 1) return '#4caf50';
    if (resultado.factorVelocidad >= 0.5) return '#ffb300';
    return '#e53935';
  }

  function dibujarOverlay() {
    quitarToken();
    var elementosViejos = overlayEl.querySelectorAll('polyline, text');
    elementosViejos.forEach(function (el) { el.remove(); });
    rutasDibujadas.forEach(function (r) {
      var cargaActual = r.tramo.cargaActual || 0;
      var puntos = segmentoOrtogonal({ x: r.ax, y: r.ay }, { x: r.bx, y: r.by });
      var polylinea = document.createElementNS('http://www.w3.org/2000/svg', 'polyline');
      polylinea.setAttribute('points', puntos.map(function (p) { return p.x + ',' + p.y; }).join(' '));
      polylinea.setAttribute('fill', 'none');
      polylinea.setAttribute('class', 'ruta-' + r.tipoRuta);
      polylinea.setAttribute('stroke-width', '4');
      polylinea.style.stroke = colorDeSaturacion(cargaActual, r.tramo.capacidad);
      overlayEl.appendChild(polylinea);

      var medio = puntos[1]; // esquina del quiebre, punto medio visual del recorrido
      var texto = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      texto.setAttribute('x', medio.x);
      texto.setAttribute('y', medio.y - 4);
      texto.setAttribute('class', 'etiqueta-saturacion');
      texto.textContent = cargaActual + '/' + r.tramo.capacidad;
      overlayEl.appendChild(texto);
    });
  }

  function reiniciarCargasRutas() {
    var vistos = new Set();
    Object.keys(grafo).forEach(function (origen) {
      Object.keys(grafo[origen]).forEach(function (destino) {
        var tramo = grafo[origen][destino];
        if (!vistos.has(tramo)) {
          tramo.cargaActual = 0;
          vistos.add(tramo);
        }
      });
    });
  }

  function dibujarToken(px, py) {
    quitarToken();
    var circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('id', 'token-viaje');
    circle.setAttribute('cx', px);
    circle.setAttribute('cy', py);
    circle.setAttribute('r', 6);
    overlayEl.appendChild(circle);
  }

  function quitarToken() {
    var existente = document.getElementById('token-viaje');
    if (existente) existente.remove();
  }

  function puntosDelCamino(camino) {
    // Expande TODO el camino (lista de vertices) a una polilinea ortogonal:
    // cada tramo entre dos vertices consecutivos se traza en L, igual que
    // dibujarOverlay, para que el token de "Enviar viaje" se mueva sobre las
    // mismas aristas del grid que la linea de la ruta, no en diagonal.
    var puntos = [pixelDeVertice(camino[0])];
    for (var i = 0; i < camino.length - 1; i += 1) {
      var a = pixelDeVertice(camino[i]);
      var b = pixelDeVertice(camino[i + 1]);
      var subtramo = segmentoOrtogonal(a, b);
      puntos.push(subtramo[1], subtramo[2]);
    }
    return puntos;
  }

  function posicionEnCamino(camino, fraccion) {
    var puntos = puntosDelCamino(camino);
    var segmentos = puntos.length - 1;
    if (segmentos <= 0) return puntos[0];
    var posGlobal = Math.max(0, Math.min(1, fraccion)) * segmentos;
    var indice = Math.min(Math.floor(posGlobal), segmentos - 1);
    var t = posGlobal - indice;
    var a = puntos[indice];
    var b = puntos[indice + 1];
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
  }

  modoEl.addEventListener('change', function () {
    var modo = modoEl.value;
    panelConstruir.style.display = modo === 'construir' ? '' : 'none';
    panelRuta.style.display = modo === 'ruta' ? '' : 'none';
    panelViaje.style.display = modo === 'viaje' ? '' : 'none';
    rutaOrigenSeleccionado = null;
    render();
  });

  categoriaEl.addEventListener('change', function () {
    nivelCasaWrap.style.display = categoriaEl.value === 'casa' ? '' : 'none';
    renderCosto();
  });

  nivelCasaEl.addEventListener('change', renderCosto);

  function manejarClickConstruir(x, y) {
    var categoria = categoriaEl.value;
    var costo = costoDeCategoria(categoria);
    if (tesoreria.saldo < costo) {
      mostrarMensaje('Error: saldo insuficiente (costo $' + costo + ', disponible $' + tesoreria.saldo.toFixed(2) + ')', true);
      return;
    }
    try {
      var nodo = crearNodoDeMuestra(categoria);
      if (categoria === 'casa') {
        colocarCasaMultiCelda(grid, nodo.nivel, x, y, nodo);
      } else if (categoria === CATEGORIA_PUERTO) {
        var celdaPuerto = obtenerCelda(grid, x, y);
        if (celdaPuerto.terreno !== 'agua_profunda') {
          throw new Error("el terreno '" + celdaPuerto.terreno + "' no admite la categoria 'puerto' (requiere agua_profunda)");
        }
        asignarNodoCelda(grid, x, y, nodo);
      } else if (categoriasFlexibles[categoria]) {
        colocarNodoFlexible(grid, x, y, categoria, nodo);
      } else {
        colocarNodo(grid, x, y, categoria, nodo);
      }
      registrarNodoColocado(x, y, categoria, nivelCasaEl.value);
      registrarGasto(tesoreria, costo);
      renderSaldo();
      renderPoblacion();
      mostrarMensaje('OK: ' + categoria + ' colocado en (' + x + ', ' + y + '), costo $' + costo, false);
    } catch (error) {
      mostrarMensaje('Error: ' + error.message, true);
    }
  }

  function manejarClickRuta(x, y) {
    var celda = obtenerCelda(grid, x, y);
    if (!celda.nodo) {
      mostrarMensaje('Error: la celda (' + x + ', ' + y + ') no tiene ninguna construccion', true);
      return;
    }
    var nodoInfo = null;
    for (var i = 0; i < nodosColocados.length; i += 1) {
      if (nodosColocados[i].x === x && nodosColocados[i].y === y) {
        nodoInfo = nodosColocados[i];
        break;
      }
    }
    if (!nodoInfo) {
      mostrarMensaje('Error: nodo sin vertice registrado', true);
      return;
    }
    if (!rutaOrigenSeleccionado) {
      rutaOrigenSeleccionado = nodoInfo;
      mostrarMensaje('Origen: ' + nodoInfo.etiqueta + '. Click en el destino.', false);
      render();
      return;
    }
    if (rutaOrigenSeleccionado.x === x && rutaOrigenSeleccionado.y === y) {
      mostrarMensaje('Origen y destino no pueden ser el mismo nodo', true);
      rutaOrigenSeleccionado = null;
      render();
      return;
    }
    try {
      var tipoRuta = tipoRutaEl.value;
      var capacidad = Number(capacidadRutaEl.value);
      var nivel = nivelRutaEl.value;
      // Rutas maritimas requieren puerto en AMBOS extremos (pedido del
      // usuario, no hay regla equivalente en src/) - de lo contrario no hay
      // forma de cruzar de una orilla a la otra. Sin limite de distancia
      // (para eso existe maritima).
      if (tipoRuta === 'maritima' && (rutaOrigenSeleccionado.categoria !== CATEGORIA_PUERTO || nodoInfo.categoria !== CATEGORIA_PUERTO)) {
        throw new Error('las rutas maritimas requieren un puerto en cada extremo');
      }
      var pa = pixelDeVertice(rutaOrigenSeleccionado.vertice);
      var pb = pixelDeVertice(nodoInfo.vertice);
      var pasosAgua = contarPasosAguaAbierta(pa, pb);
      if (pasosAgua > 0) {
        if (tipoRuta === 'carretera') {
          throw new Error('la carretera cruza agua abierta - usa una ruta maritima con puertos, o ferrocarril/subte de nivel M o L');
        }
        if (tipoRuta === 'ferrocarril' || tipoRuta === 'subte') {
          // Puente (ferrocarril) o tunel submarino (subte): nivel S nunca
          // puede cruzar agua abierta, M/L si hasta un limite que crece con
          // el nivel (pedido del usuario).
          if (nivel === 'S') {
            throw new Error(tipoRuta + ' nivel S no puede cruzar agua abierta - se necesita nivel M o L');
          }
          var limite = (tipoRuta === 'ferrocarril' ? LIMITE_CRUCE_FERROCARRIL : LIMITE_CRUCE_SUBTE)[nivel];
          if (pasosAgua > limite) {
            throw new Error(
              tipoRuta + ' nivel ' + nivel + ' cruza como maximo ' + limite + ' celda(s) de agua abierta (esta ruta cruza ' + pasosAgua + ')'
            );
          }
        }
      }
      // Longitud = distancia Manhattan entre anclas de celda (decision ad hoc,
      // no hay ninguna nocion de "distancia" impuesta por src/ para esto).
      var longitud = Math.abs(rutaOrigenSeleccionado.x - x) + Math.abs(rutaOrigenSeleccionado.y - y);
      if (longitud <= 0) longitud = 1;
      var tramo = crearTramoConNivel(tipoRuta, capacidad, longitud, undefined, nivel);
      conectarVertices(grafo, rutaOrigenSeleccionado.vertice, nodoInfo.vertice, tramo);
      rutasDibujadas.push({
        ax: pa.x, ay: pa.y, bx: pb.x, by: pb.y, tipoRuta: tipoRuta, tramo: tramo,
        verticeA: rutaOrigenSeleccionado.vertice, verticeB: nodoInfo.vertice,
      });
      dibujarOverlay();
      mostrarMensaje(
        'OK: ' + tipoRuta + ' nivel ' + nivel + ' conectada (' + rutaOrigenSeleccionado.etiqueta + ' <-> ' +
          nodoInfo.etiqueta + ', longitud ' + longitud + ', capacidad efectiva ' + tramo.capacidad +
          (pasosAgua > 0 ? ', cruza ' + pasosAgua + ' celda(s) de agua' : '') + ')',
        false
      );
    } catch (error) {
      mostrarMensaje('Error: ' + error.message, true);
    }
    rutaOrigenSeleccionado = null;
    render();
  }

  gridEl.addEventListener('click', function (evento) {
    if (juegoTerminado) return;
    var celdaEl = evento.target.closest('.celda');
    if (!celdaEl) return;
    var x = Number(celdaEl.dataset.x);
    var y = Number(celdaEl.dataset.y);
    var modo = modoEl.value;
    if (modo === 'construir') {
      manejarClickConstruir(x, y);
      render();
    } else if (modo === 'ruta') {
      manejarClickRuta(x, y);
    }
  });

  avanzarTickProduccionBtn.addEventListener('click', function () {
    if (juegoTerminado) return;
    var resumen = [];
    var calendario = calendarioDeTick(tickActual);
    tickActual += 1;

    // La carga de cada tramo representa el trafico de ESTE tick (mismo
    // criterio que resolverTick.js/resolverTickConTransito.js: reiniciar
    // todas las cargas al arrancar el tick, antes de que se despachen los
    // viajes de este ciclo). Sin este reset, la saturacion visual quedaria
    // acumulada para siempre y nunca bajaria.
    reiniciarCargasRutas();

    // Fase 1: produccion. La agricultura recibe el multiplicador de clima de
    // la estacion actual (Contrato 29: solo afecta agricultura, aplicado
    // DESPUES de producirTickNodo, sobre el crudo, antes de guardarlo en el
    // almacen - mismo orden que ejecutarProduccionEstacional.js). Para el
    // resto de categorias se sigue usando producirTickNodoConAlmacen tal cual.
    nodosColocados.forEach(function (info) {
      if (!info.almacen) return;
      var nodo = obtenerCelda(grid, info.x, info.y).nodo;
      var entradaRecibida = 0;
      if (nodo.ratioEntrada !== null && info.almacen.stockMateriaPrima > 0) {
        entradaRecibida = retirarStockAlmacen(info.almacen, 'materiaPrima', info.almacen.stockMateriaPrima);
      }
      if (info.categoria === 'agricultura') {
        var crudo = producirTickNodo(nodo, entradaRecibida);
        var multiplicador = calcularMultiplicadorClima(calendario.estacion);
        var entero = Math.floor(crudo * multiplicador);
        var espacioLibre = info.almacen.capacidadProducto - info.almacen.stockProducto;
        if (entero > espacioLibre) {
          resumen.push(info.etiqueta + ': almacen de producto lleno, produccion perdida');
        } else {
          if (entero > 0) agregarStockAlmacen(info.almacen, 'producto', entero);
          resumen.push(info.etiqueta + ': +' + entero + ' (clima x' + multiplicador + ')');
        }
        return;
      }
      var resultado = producirTickNodoConAlmacen(nodo, info.almacen, entradaRecibida);
      if (resultado.almacenLleno) {
        resumen.push(info.etiqueta + ': almacen de producto lleno, produccion perdida');
      } else {
        resumen.push(info.etiqueta + ': +' + resultado.producido);
      }
    });

    // Fase 2: poblacion consume PRIMERO (mismo orden que
    // ejecutarCadenaConPoblacionReal.js / ejecutarCadenaPoblacionDinamica.js:
    // "poblacion primero", el remanente sigue a comercio en la fase 3).
    // Alcance ad hoc de esta UI (sin centro civico/zona de influencia
    // todavia): el consumo es una bolsa unica a nivel ciudad, no por ruta.
    var poblacionCiudad = poblacionTotal();
    var aguaRequerida = poblacionCiudad * NECESIDAD_PER_CAPITA;
    var comidaRequerida = poblacionCiudad * NECESIDAD_PER_CAPITA;

    // Acepta una lista de categorias (no solo una) - la necesidad se cubre
    // con la suma del stock de TODAS las categorias de esa lista (bolsa
    // unica a nivel ciudad, ver nota mas arriba), retirando de a una fuente
    // por vez en el orden en que fueron colocadas hasta cubrir lo requerido.
    function consumirDeCategorias(categorias, requerido) {
      var disponible = 0;
      nodosColocados.forEach(function (info) {
        if (categorias.indexOf(info.categoria) !== -1 && info.almacen) disponible += info.almacen.stockProducto;
      });
      var recibido = Math.min(requerido, disponible);
      var porRetirar = Math.floor(recibido);
      nodosColocados.forEach(function (info) {
        if (porRetirar <= 0) return;
        if (categorias.indexOf(info.categoria) !== -1 && info.almacen && info.almacen.stockProducto > 0) {
          var tomar = Math.min(porRetirar, info.almacen.stockProducto);
          retirarStockAlmacen(info.almacen, 'producto', tomar);
          porRetirar -= tomar;
        }
      });
      return recibido;
    }

    var aguaRecibida = consumirDeCategorias(CATEGORIAS_AGUA, aguaRequerida);
    var comidaRecibida = consumirDeCategorias(CATEGORIAS_COMIDA, comidaRequerida);
    var coberturaAgua = calcularCoberturaNecesidad(aguaRequerida, aguaRecibida);
    var coberturaComida = calcularCoberturaNecesidad(comidaRequerida, comidaRecibida);
    var indiceCobertura = combinarCoberturas([coberturaAgua, coberturaComida]);

    // El crecimiento se calcula sobre el TOTAL de la ciudad (no por vivienda,
    // ver nota en TASA_BASE_POBLACION mas arriba) y se distribuye de a una
    // unidad por vivienda con lugar/habitantes disponibles. No hay regla de
    // distribucion en src/ (sus ejecutores de referencia modelan poblacion
    // agregada, nunca mas de una vivienda) - orden de array, decision ad hoc.
    var crudoCiudad = calcularCrecimientoPoblacion(poblacionCiudad, indiceCobertura, TASA_BASE_POBLACION);
    poblacionFraccionAcumulada += crudoCiudad;
    var cambioTotal = Math.trunc(poblacionFraccionAcumulada);
    poblacionFraccionAcumulada -= cambioTotal;
    var viviendas = nodosColocados.filter(function (info) { return info.poblacion !== undefined; });
    var restante = cambioTotal;
    var cambioAplicado = 0;
    while (restante > 0) {
      var conLugar = viviendas.filter(function (v) { return v.poblacion < v.poblacionMax; })[0];
      if (!conLugar) break;
      conLugar.poblacion += 1;
      restante -= 1;
      cambioAplicado += 1;
    }
    while (restante < 0) {
      var conHabitantes = viviendas.filter(function (v) { return v.poblacion > 0; })[0];
      if (!conHabitantes) break;
      conHabitantes.poblacion -= 1;
      restante += 1;
      cambioAplicado -= 1;
    }

    if (poblacionCiudad > 0) {
      resumen.push(
        'poblacion: cobertura agua ' + (coberturaAgua * 100).toFixed(0) + '% / comida ' +
          (coberturaComida * 100).toFixed(0) + '% -> indice ' + indiceCobertura.toFixed(2) +
          ', cambio ' + (cambioAplicado >= 0 ? '+' : '') + cambioAplicado
      );
    }

    // Fase 3: mantenimiento, solo en dias laborales (Contrato 27) - se salta
    // por completo el fin de semana, sin acumularse ni cobrarse doble despues.
    if (calendario.esLaboral) {
      var costos = nodosColocados.map(function (info) {
        return info.categoria === 'casa' ? COSTO_MANTENIMIENTO_CASA : (COSTO_MANTENIMIENTO[info.categoria] || 0);
      });
      var totalMantenimiento = costos.reduce(function (a, b) { return a + b; }, 0);
      aplicarMantenimientoTick(tesoreria, costos);
      if (totalMantenimiento > 0) resumen.push('mantenimiento: -$' + totalMantenimiento.toFixed(2));
    }

    // Fase 4: condiciones de fin de partida, verificadas con el estado ya
    // actualizado de este tick. No hay victoria fija - el objetivo es
    // sobrevivir el mayor tiempo posible (puntaje = tickActual). Derrota
    // (la que ocurra primero): poblacion en 0 habiendo tenido vivienda
    // construida, o saldo negativo UMBRAL_QUIEBRA ticks SEGUIDOS.
    if (tesoreria.saldo < 0) {
      ticksSaldoNegativoConsecutivos += 1;
    } else {
      ticksSaldoNegativoConsecutivos = 0;
    }
    var hayVivienda = nodosColocados.some(function (info) { return info.poblacion !== undefined; });
    if (hayVivienda && poblacionTotal() === 0) {
      mostrarGameOver('la poblacion llego a 0', calendario.dia);
    } else if (ticksSaldoNegativoConsecutivos >= UMBRAL_QUIEBRA) {
      mostrarGameOver('quiebra prolongada (' + UMBRAL_QUIEBRA + ' dias seguidos en rojo)', calendario.dia);
    }

    renderSaldo();
    renderPoblacion();
    renderCalendario(calendario);
    renderPuntaje();
    mostrarMensaje(
      resumen.length > 0 ? 'Tick de produccion -> ' + resumen.join(' | ') : 'No hay nodos productivos colocados',
      false
    );
    render();
    dibujarOverlay();
  });

  venderProduccionBtn.addEventListener('click', function () {
    if (juegoTerminado) return;
    // Comercio como accion explicita del jugador (no automatica dentro del
    // tick): asi el stock puede acumularse y tambien enviarse por ruta a
    // otro nodo (modo 'viaje') antes de decidir vender. Mismo patron de
    // calculo que ejecutarCadenaBombaGranjaComercio.js (Contrato 12).
    var resumen = [];
    nodosColocados.forEach(function (info) {
      if (!info.almacen || info.almacen.stockProducto <= 0) return;
      var vendido = resolverCompraAlmacen(info.almacen.stockProducto, CAPACIDAD_COMPRA_COMERCIO);
      if (vendido > 0) {
        retirarStockAlmacen(info.almacen, 'producto', vendido);
        var monto = calcularMontoVenta(vendido, PRECIO_UNITARIO[info.categoria]);
        registrarIngreso(tesoreria, monto);
        resumen.push(info.etiqueta + ': vendio ' + vendido + ' por $' + monto.toFixed(2));
      }
    });
    renderSaldo();
    mostrarMensaje(resumen.length > 0 ? 'Venta -> ' + resumen.join(' | ') : 'No hay stock para vender', false);
    render();
  });

  reiniciarPartidaBtn.addEventListener('click', function () {
    reiniciarPartida();
    mostrarMensaje('Partida nueva iniciada', false);
  });

  guardarPartidaBtn.addEventListener('click', function () {
    // Todo el estado es objetos planos (grid/nodosColocados/grafo/tramos),
    // serializa directo a JSON. La unica referencia compartida real es
    // rutasDibujadas[i].tramo === grafo[verticeA][verticeB]; guardar el
    // objeto tramo duplicado no rompe nada al guardar, pero al CARGAR hay
    // que re-vincularlo por vertice (ver cargarPartidaBtn) para que sea la
    // MISMA referencia que grafo, no una copia divergente.
    var snapshot = {
      version: 1,
      tickActual: tickActual,
      poblacionFraccionAcumulada: poblacionFraccionAcumulada,
      ticksSaldoNegativoConsecutivos: ticksSaldoNegativoConsecutivos,
      tesoreria: tesoreria,
      grid: grid,
      nodosColocados: nodosColocados,
      grafo: grafo,
      rutas: rutasDibujadas.map(function (r) {
        return { ax: r.ax, ay: r.ay, bx: r.bx, by: r.by, tipoRuta: r.tipoRuta, verticeA: r.verticeA, verticeB: r.verticeB };
      }),
    };
    try {
      localStorage.setItem(CLAVE_GUARDADO, JSON.stringify(snapshot));
      mostrarMensaje('OK: partida guardada (tick ' + tickActual + ')', false);
    } catch (error) {
      mostrarMensaje('Error al guardar: ' + error.message, true);
    }
  });

  cargarPartidaBtn.addEventListener('click', function () {
    var texto = localStorage.getItem(CLAVE_GUARDADO);
    if (!texto) {
      mostrarMensaje('Error: no hay ninguna partida guardada', true);
      return;
    }
    try {
      var snapshot = JSON.parse(texto);
      if (viajeActivo) {
        clearInterval(viajeActivo.intervalId);
        viajeActivo = null;
      }
      tickActual = snapshot.tickActual;
      poblacionFraccionAcumulada = snapshot.poblacionFraccionAcumulada;
      ticksSaldoNegativoConsecutivos = snapshot.ticksSaldoNegativoConsecutivos || 0;
      tesoreria = snapshot.tesoreria;
      grid = snapshot.grid;
      nodosColocados = snapshot.nodosColocados;
      grafo = snapshot.grafo;
      rutasDibujadas = snapshot.rutas.map(function (r) {
        return {
          ax: r.ax, ay: r.ay, bx: r.bx, by: r.by, tipoRuta: r.tipoRuta,
          tramo: grafo[r.verticeA][r.verticeB], verticeA: r.verticeA, verticeB: r.verticeB,
        };
      });
      rutaOrigenSeleccionado = null;
      ocultarGameOver();
      habilitarBotones(true);
      actualizarSelectsViaje();
      render();
      dibujarOverlay();
      renderSaldo();
      renderCosto();
      renderPoblacion();
      renderCalendario(calendarioDeTick(tickActual));
      renderPuntaje();
      mostrarMensaje('OK: partida cargada (tick ' + tickActual + ')', false);
    } catch (error) {
      mostrarMensaje('Error al cargar: ' + error.message, true);
    }
  });

  enviarViajeBtn.addEventListener('click', function () {
    if (juegoTerminado) return;
    if (viajeActivo) {
      mostrarMensaje('Ya hay un viaje en transito, esperá a que llegue', true);
      return;
    }
    var verticeOrigen = origenViajeEl.value;
    var verticeDestino = destinoViajeEl.value;
    var tipoTrafico = tipoTraficoViajeEl.value;
    var cantidad = Number(cantidadViajeEl.value);
    if (!verticeOrigen || !verticeDestino) {
      mostrarMensaje('Error: elegí origen y destino (colocá al menos 2 construcciones)', true);
      return;
    }
    if (verticeOrigen === verticeDestino) {
      mostrarMensaje('Error: origen y destino no pueden ser el mismo', true);
      return;
    }
    if (!Number.isInteger(cantidad) || cantidad <= 0) {
      mostrarMensaje('Error: cantidad debe ser un entero positivo', true);
      return;
    }

    var origenInfo = nodoPorVertice(verticeOrigen);
    var destinoInfo = nodoPorVertice(verticeDestino);

    // Si el origen tiene almacen (nodo productivo), el viaje transporta
    // produccion real: no se puede enviar mas de lo que hay en stock, y se
    // retira del almacen al DESPACHAR (no al llegar), para no contabilizar
    // dos veces si el viaje es multi-tick.
    if (origenInfo && origenInfo.almacen) {
      if (cantidad > origenInfo.almacen.stockProducto) {
        mostrarMensaje(
          'Error: stock insuficiente en ' + origenInfo.etiqueta +
            ' (disponible: ' + origenInfo.almacen.stockProducto + ')',
          true
        );
        return;
      }
    }

    try {
      var ruta = encontrarRuta(grafo, verticeOrigen, verticeDestino, tipoTrafico);
      if (!ruta) {
        mostrarMensaje('Error: no hay ruta que admita trafico de ' + tipoTrafico + ' entre esos nodos', true);
        return;
      }

      if (origenInfo && origenInfo.almacen) {
        retirarStockAlmacen(origenInfo.almacen, 'producto', cantidad);
      }

      // Registrar la carga de este despacho en cada tramo del camino, para
      // que la saturacion visual (color de la linea) refleje el viaje recien
      // enviado sin esperar al siguiente tick. resolverTickConTransito.js
      // vuelve a registrar esto mismo en cada avance (reinicia y reacumula),
      // asi que este registro inicial solo cubre el primer instante visual.
      for (var iTramo = 0; iTramo < ruta.camino.length - 1; iTramo += 1) {
        var tramoTramo = grafo[ruta.camino[iTramo]][ruta.camino[iTramo + 1]];
        registrarCargaTramo(tramoTramo, tipoTrafico, cantidad);
      }
      dibujarOverlay();

      function entregarEnDestino(entregado) {
        if (destinoInfo && destinoInfo.almacen) {
          var entero = Math.floor(entregado);
          if (entero > 0) agregarStockAlmacen(destinoInfo.almacen, 'materiaPrima', entero);
        }
        render();
      }

      var ticks = calcularTicksViaje(ruta.distanciaTotal, VELOCIDAD_BASE);

      if (ticks <= 1) {
        var resultado = resolverViaje(grafo, verticeOrigen, verticeDestino, tipoTrafico, cantidad);
        var pDestino = pixelDeVertice(verticeDestino);
        dibujarToken(pDestino.x, pDestino.y);
        entregarEnDestino(resultado.entregado);
        mostrarMensaje(
          'OK: viaje instantaneo. Entregado: ' + resultado.entregado.toFixed(2) +
            ' (factor velocidad: ' + resultado.factorVelocidadMinimo.toFixed(2) + ')',
          false
        );
        setTimeout(quitarToken, 800);
        return;
      }

      var viajeEstado = iniciarViajeEnTransito(ruta.camino, tipoTrafico, cantidad, ticks);
      var ticksTotal = ticks;
      mostrarMensaje('Viaje en transito: ' + ticksTotal + ' ticks...', false);

      var intervalId = setInterval(function () {
        try {
          var resultadoTick = resolverTickConTransito(grafo, [viajeEstado]);
          if (resultadoTick.llegados.length > 0) {
            clearInterval(intervalId);
            viajeActivo = null;
            dibujarOverlay();
            var pFinal = pixelDeVertice(verticeDestino);
            dibujarToken(pFinal.x, pFinal.y);
            entregarEnDestino(resultadoTick.llegados[0].entregado);
            mostrarMensaje('OK: viaje llego. Entregado: ' + resultadoTick.llegados[0].entregado.toFixed(2), false);
            setTimeout(quitarToken, 800);
            return;
          }
          viajeEstado = resultadoTick.enTransito[0];
          var fraccion = (ticksTotal - viajeEstado.ticksRestantes) / ticksTotal;
          var posicion = posicionEnCamino(ruta.camino, fraccion);
          dibujarOverlay();
          dibujarToken(posicion.x, posicion.y);
        } catch (errorTick) {
          clearInterval(intervalId);
          viajeActivo = null;
          mostrarMensaje('Error durante el viaje: ' + errorTick.message, true);
        }
      }, TICK_MS);

      viajeActivo = { intervalId: intervalId };
      render();
    } catch (error) {
      mostrarMensaje('Error: ' + error.message, true);
    }
  });

  render();
  dibujarOverlay();
  renderSaldo();
  renderCosto();
  renderPoblacion();
  renderCalendario(calendarioDeTick(tickActual));
  renderPuntaje();
};
