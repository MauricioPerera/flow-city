function retirarStockAlmacen(almacen, campo, cantidad) {
  if (almacen === null || typeof almacen !== 'object') {
    throw new RangeError('almacen debe ser un objeto no nulo');
  }
  if (campo !== 'materiaPrima' && campo !== 'producto') {
    throw new RangeError("campo debe ser 'materiaPrima' o 'producto'");
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }

  const stockActual = campo === 'materiaPrima' ? almacen.stockMateriaPrima : almacen.stockProducto;
  const retirado = Math.min(cantidad, stockActual);

  if (campo === 'materiaPrima') {
    almacen.stockMateriaPrima -= retirado;
  } else {
    almacen.stockProducto -= retirado;
  }

  return retirado;
}

module.exports = { retirarStockAlmacen };