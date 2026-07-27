const { producirTickNodo } = require('./producirTickNodo.js');
const { agregarStockAlmacen } = require('./agregarStockAlmacen.js');

function producirTickNodoConAlmacen(nodo, almacen, entradaRecibida) {
  if (almacen === null || typeof almacen !== 'object') {
    throw new RangeError('almacen debe ser un objeto no nulo');
  }

  const produccionPotencial = producirTickNodo(nodo, entradaRecibida);
  const espacioDisponible = almacen.capacidadProducto - almacen.stockProducto;

  if (produccionPotencial <= espacioDisponible) {
    if (produccionPotencial > 0) {
      agregarStockAlmacen(almacen, 'producto', produccionPotencial);
    }
    return { producido: produccionPotencial, almacenLleno: false };
  }

  return { producido: 0, almacenLleno: true };
}

module.exports = { producirTickNodoConAlmacen };