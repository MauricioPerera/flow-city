function agregarStockAlmacen(almacen, campo, cantidad) {
  if (almacen === null || typeof almacen !== 'object') {
    throw new RangeError('almacen debe ser un objeto no nulo');
  }
  if (campo !== 'materiaPrima' && campo !== 'producto') {
    throw new RangeError("campo debe ser 'materiaPrima' o 'producto'");
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }

  const capacidad = campo === 'materiaPrima' ? almacen.capacidadMateriaPrima : almacen.capacidadProducto;
  const stockActual = campo === 'materiaPrima' ? almacen.stockMateriaPrima : almacen.stockProducto;

  const espacioLibre = capacidad - stockActual;
  const aceptado = Math.max(0, Math.min(cantidad, espacioLibre));
  const rechazado = cantidad - aceptado;

  if (campo === 'materiaPrima') {
    almacen.stockMateriaPrima += aceptado;
  } else {
    almacen.stockProducto += aceptado;
  }

  return { aceptado, rechazado };
}

module.exports = { agregarStockAlmacen };