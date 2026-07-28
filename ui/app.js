window.onCjsReady = function () {
  var crearGrid = window.__cjs['crearGrid'].crearGrid;
  var obtenerCelda = window.__cjs['obtenerCelda'].obtenerCelda;
  var colocarNodo = window.__cjs['colocarNodo'].colocarNodo;
  var colocarNodoFlexible = window.__cjs['colocarNodoFlexible'].colocarNodoFlexible;
  var colocarCasaMultiCelda = window.__cjs['colocarCasaMultiCelda'].colocarCasaMultiCelda;
  var crearNodoProductivo = window.__cjs['crearNodoProductivo'].crearNodoProductivo;
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

  function registrarNodoColocado(x, y, categoria) {
    var vertice = verticeEntrada(x, y, 'sur');
    var etiqueta = categoria + ' (' + x + ',' + y + ')';
    var info = { x: x, y: y, categoria: categoria, vertice: vertice, etiqueta: etiqueta };
    nodosColocados.push(info);
    actualizarSelectsViaje();
    return info;
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
          div.textContent = celda.nodo.categoria.slice(0, 3);
          div.title = JSON.stringify(celda.nodo);
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
  });

  function manejarClickConstruir(x, y) {
    var categoria = categoriaEl.value;
    try {
      var nodo = crearNodoDeMuestra(categoria);
      if (categoria === 'casa') {
        colocarCasaMultiCelda(grid, nodo.nivel, x, y, nodo);
      } else if (categoriasFlexibles[categoria]) {
        colocarNodoFlexible(grid, x, y, categoria, nodo);
      } else {
        colocarNodo(grid, x, y, categoria, nodo);
      }
      registrarNodoColocado(x, y, categoria);
      mostrarMensaje('OK: ' + categoria + ' colocado en (' + x + ', ' + y + ')', false);
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

    try {
      var ruta = encontrarRuta(grafo, verticeOrigen, verticeDestino, tipoTrafico);
      if (!ruta) {
        mostrarMensaje('Error: no hay ruta que admita trafico de ' + tipoTrafico + ' entre esos nodos', true);
        return;
      }

      var ticks = calcularTicksViaje(ruta.distanciaTotal, VELOCIDAD_BASE);

      if (ticks <= 1) {
        var resultado = resolverViaje(grafo, verticeOrigen, verticeDestino, tipoTrafico, cantidad);
        var pDestino = pixelDeVertice(verticeDestino);
        dibujarToken(pDestino.x, pDestino.y);
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
    } catch (error) {
      mostrarMensaje('Error: ' + error.message, true);
    }
  });

  render();
  dibujarOverlay();
};
