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
  var verticeEntrada = window.__cjs['verticeEntrada'].verticeEntrada;
  var crearTramo = window.__cjs['crearTramo'].crearTramo;
  var conectarVertices = window.__cjs['conectarVertices'].conectarVertices;
  var encontrarRuta = window.__cjs['encontrarRuta'].encontrarRuta;
  var resolverViaje = window.__cjs['resolverViaje'].resolverViaje;
  var calcularTicksViaje = window.__cjs['calcularTicksViaje'].calcularTicksViaje;
  var iniciarViajeEnTransito = window.__cjs['iniciarViajeEnTransito'].iniciarViajeEnTransito;
  var resolverTickConTransito = window.__cjs['resolverTickConTransito'].resolverTickConTransito;

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
  };
  var COSTO_CASA_POR_NIVEL = { S: 40, M: 70, L: 110 };
  var PRECIO_UNITARIO = { agricultura: 3, reforestacion: 2, mineria: 4, pesca: 3, no_extractiva: 2 };
  var CAPACIDAD_COMPRA_COMERCIO = 5; // ad hoc, unidades vendidas por nodo por tick
  var SALDO_INICIAL = 100; // ad hoc

  // Poblacion: no hay categoria "extraccion-agua" en esta UI (el patron
  // bomba->granja de los Contratos 09/17/25 usa esa categoria, que no existe
  // en el vocabulario de puedeConstruir.js/puedeConstruirFlexible.js de esta
  // UI). Convencion ad hoc, documentada: 'pesca' cubre la necesidad de agua,
  // 'agricultura' cubre la necesidad de comida. Ambas son categorias que el
  // jugador ya puede construir.
  var categoriasVivienda = { residencial: true, casa: true };
  var CATEGORIA_AGUA = 'pesca';
  var CATEGORIA_COMIDA = 'agricultura';
  var NECESIDAD_PER_CAPITA = 0.2; // mismo valor ad hoc que ejecutarCadenaPoblacionDinamica.js
  // ad hoc, mas alta que en los ejecutores de referencia (que usan poblaciones
  // de 10+): con capacidades de vivienda de esta UI (4-9), calcularCrecimientoPoblacion
  // aplicada por-vivienda con tasas bajas nunca redondea hacia +1 (Math.floor
  // asimetrico) y la poblacion solo podria encoger, nunca recuperarse. Por eso
  // el crecimiento se calcula sobre el TOTAL de la ciudad (ver mas abajo), no
  // por vivienda, y con una tasa mayor para que sea visible a esta escala.
  var TASA_BASE_POBLACION = 0.3;
  var POBLACION_RESIDENCIAL_FIJA = 4; // ad hoc, equivale a una casa nivel S

  var tesoreria = crearTesoreria(SALDO_INICIAL);

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
  var capacidadRutaEl = document.getElementById('capacidadRuta');
  var origenViajeEl = document.getElementById('origenViaje');
  var destinoViajeEl = document.getElementById('destinoViaje');
  var tipoTraficoViajeEl = document.getElementById('tipoTraficoViaje');
  var cantidadViajeEl = document.getElementById('cantidadViaje');
  var enviarViajeBtn = document.getElementById('enviarViaje');
  var avanzarTickProduccionBtn = document.getElementById('avanzarTickProduccion');
  var venderProduccionBtn = document.getElementById('venderProduccion');
  var saldoEl = document.getElementById('saldo');
  var costoConstruccionEl = document.getElementById('costoConstruccion');
  var poblacionTotalEl = document.getElementById('poblacionTotal');

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

  function crearNodoDeMuestra(categoria) {
    if (categoriasReceta[categoria]) {
      return crearNodoProductivo(categoria, 1, 1, null);
    }
    if (categoriasExtraccion[categoria]) {
      return crearNodoProductivo(categoria, null, null, 1);
    }
    if (categoriasFlexibles[categoria]) {
      return { categoria: categoria };
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

  function dibujarOverlay() {
    quitarToken();
    var lineas = overlayEl.querySelectorAll('line');
    lineas.forEach(function (l) { l.remove(); });
    rutasDibujadas.forEach(function (r) {
      var line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', r.ax);
      line.setAttribute('y1', r.ay);
      line.setAttribute('x2', r.bx);
      line.setAttribute('y2', r.by);
      line.setAttribute('class', 'ruta-' + r.tipoRuta);
      line.setAttribute('stroke-width', '3');
      overlayEl.appendChild(line);
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

  function posicionEnCamino(camino, fraccion) {
    var puntos = camino.map(pixelDeVertice);
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
      // Longitud = distancia Manhattan entre anclas de celda (decision ad hoc,
      // no hay ninguna nocion de "distancia" impuesta por src/ para esto).
      var longitud = Math.abs(rutaOrigenSeleccionado.x - x) + Math.abs(rutaOrigenSeleccionado.y - y);
      if (longitud <= 0) longitud = 1;
      var tramo = crearTramo(tipoRuta, capacidad, longitud, undefined);
      conectarVertices(grafo, rutaOrigenSeleccionado.vertice, nodoInfo.vertice, tramo);
      var pa = pixelDeVertice(rutaOrigenSeleccionado.vertice);
      var pb = pixelDeVertice(nodoInfo.vertice);
      rutasDibujadas.push({ ax: pa.x, ay: pa.y, bx: pb.x, by: pb.y, tipoRuta: tipoRuta });
      dibujarOverlay();
      mostrarMensaje(
        'OK: ' + tipoRuta + ' conectada (' + rutaOrigenSeleccionado.etiqueta + ' <-> ' +
          nodoInfo.etiqueta + ', longitud ' + longitud + ')',
        false
      );
    } catch (error) {
      mostrarMensaje('Error: ' + error.message, true);
    }
    rutaOrigenSeleccionado = null;
    render();
  }

  gridEl.addEventListener('click', function (evento) {
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
    var resumen = [];

    // Fase 1: produccion (igual que antes).
    nodosColocados.forEach(function (info) {
      if (!info.almacen) return;
      var nodo = obtenerCelda(grid, info.x, info.y).nodo;
      var entradaRecibida = 0;
      if (nodo.ratioEntrada !== null && info.almacen.stockMateriaPrima > 0) {
        entradaRecibida = retirarStockAlmacen(info.almacen, 'materiaPrima', info.almacen.stockMateriaPrima);
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

    function consumirDeCategoria(categoria, requerido) {
      var disponible = 0;
      nodosColocados.forEach(function (info) {
        if (info.categoria === categoria && info.almacen) disponible += info.almacen.stockProducto;
      });
      var recibido = Math.min(requerido, disponible);
      var porRetirar = Math.floor(recibido);
      nodosColocados.forEach(function (info) {
        if (porRetirar <= 0) return;
        if (info.categoria === categoria && info.almacen && info.almacen.stockProducto > 0) {
          var tomar = Math.min(porRetirar, info.almacen.stockProducto);
          retirarStockAlmacen(info.almacen, 'producto', tomar);
          porRetirar -= tomar;
        }
      });
      return recibido;
    }

    var aguaRecibida = consumirDeCategoria(CATEGORIA_AGUA, aguaRequerida);
    var comidaRecibida = consumirDeCategoria(CATEGORIA_COMIDA, comidaRequerida);
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

    renderSaldo();
    renderPoblacion();
    mostrarMensaje(
      resumen.length > 0 ? 'Tick de produccion -> ' + resumen.join(' | ') : 'No hay nodos productivos colocados',
      false
    );
    render();
  });

  venderProduccionBtn.addEventListener('click', function () {
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

  enviarViajeBtn.addEventListener('click', function () {
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
};
