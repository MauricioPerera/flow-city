window.onCjsReady = function () {
  var crearGrid = window.__cjs['crearGrid'].crearGrid;
  var obtenerCelda = window.__cjs['obtenerCelda'].obtenerCelda;
  var colocarNodo = window.__cjs['colocarNodo'].colocarNodo;
  var colocarNodoFlexible = window.__cjs['colocarNodoFlexible'].colocarNodoFlexible;
  var colocarCasaMultiCelda = window.__cjs['colocarCasaMultiCelda'].colocarCasaMultiCelda;
  var crearNodoProductivo = window.__cjs['crearNodoProductivo'].crearNodoProductivo;

  var ANCHO = 12;
  var ALTO = 10;
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

  var gridEl = document.getElementById('grid');
  var mensajeEl = document.getElementById('mensaje');
  var categoriaEl = document.getElementById('categoria');
  var nivelCasaWrap = document.getElementById('nivelCasaWrap');
  var nivelCasaEl = document.getElementById('nivelCasa');

  gridEl.style.gridTemplateColumns = 'repeat(' + ANCHO + ', 40px)';

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

  function render() {
    gridEl.innerHTML = '';
    for (var y = 0; y < ALTO; y += 1) {
      for (var x = 0; x < ANCHO; x += 1) {
        var celda = obtenerCelda(grid, x, y);
        var div = document.createElement('div');
        div.className = 'celda terreno-' + celda.terreno + (celda.nodo ? ' ocupada' : '');
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

  categoriaEl.addEventListener('change', function () {
    nivelCasaWrap.style.display = categoriaEl.value === 'casa' ? '' : 'none';
  });

  gridEl.addEventListener('click', function (evento) {
    var celdaEl = evento.target.closest('.celda');
    if (!celdaEl) return;
    var x = Number(celdaEl.dataset.x);
    var y = Number(celdaEl.dataset.y);
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
      mostrarMensaje('OK: ' + categoria + ' colocado en (' + x + ', ' + y + ')', false);
    } catch (error) {
      mostrarMensaje('Error: ' + error.message, true);
    }
    render();
  });

  render();
};
