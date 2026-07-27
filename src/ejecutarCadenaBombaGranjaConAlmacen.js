const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { resolverViaje } = require('./resolverViaje.js');
const { crearAlmacen } = require('./crearAlmacen.js');
const { producirTickNodoConAlmacen } = require('./producirTickNodoConAlmacen.js');
const { retirarStockAlmacen } = require('./retirarStockAlmacen.js');

function ejecutarCadenaBombaGranjaConAlmacen(numTicks) {
  if (!Number.isInteger(numTicks) || numTicks <= 0) {
    throw new RangeError('numTicks debe ser un entero positivo');
  }

  const grid = crearGrid(2, 1, 'verde');
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  colocarNodo(grid, 0, 0, 'no_extractiva', bomba);
  colocarNodo(grid, 1, 0, 'agricultura', granja);
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));
  const almacenBomba = crearAlmacen(1, 10);
  const almacenGranja = crearAlmacen(1, 20);

  const historial = [];
  for (let tick = 0; tick < numTicks; tick += 1) {
    const resultadoBomba = producirTickNodoConAlmacen(bomba, almacenBomba, 0);
    const aguaProducida = resultadoBomba.producido;
    const bombaAlmacenLleno = resultadoBomba.almacenLleno;

    const cantidadAEnviar = almacenBomba.stockProducto;
    let aguaEnviada = 0;
    let aguaRecibida = 0;
    if (cantidadAEnviar > 0) {
      aguaEnviada = retirarStockAlmacen(almacenBomba, 'producto', cantidadAEnviar);
      const resultadoViaje = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaEnviada);
      aguaRecibida = resultadoViaje.entregado;
    }

    const resultadoGranja = producirTickNodoConAlmacen(granja, almacenGranja, aguaRecibida);
    const manzanasProducidas = resultadoGranja.producido;
    const granjaAlmacenLleno = resultadoGranja.almacenLleno;

    historial.push({
      tick,
      aguaProducida,
      aguaEnviada,
      aguaRecibida,
      manzanasProducidas,
      bombaAlmacenLleno,
      granjaAlmacenLleno,
    });
  }

  return {
    historial,
    almacenBombaFinal: almacenBomba,
    almacenGranjaFinal: almacenGranja,
  };
}

module.exports = { ejecutarCadenaBombaGranjaConAlmacen };