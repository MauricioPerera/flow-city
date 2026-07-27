function crearAlmacen(capacidadMateriaPrima, capacidadProducto) {
  if (!Number.isInteger(capacidadMateriaPrima) || capacidadMateriaPrima <= 0) {
    throw new RangeError('capacidadMateriaPrima debe ser un entero positivo');
  }
  if (!Number.isInteger(capacidadProducto) || capacidadProducto <= 0) {
    throw new RangeError('capacidadProducto debe ser un entero positivo');
  }
  return {
    capacidadMateriaPrima,
    capacidadProducto,
    stockMateriaPrima: 0,
    stockProducto: 0,
  };
}

module.exports = { crearAlmacen };