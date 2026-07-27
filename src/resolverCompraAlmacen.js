function resolverCompraAlmacen(cantidadOfrecida, capacidadCompraAlmacen) {
  if (
    typeof cantidadOfrecida !== 'number' ||
    !Number.isFinite(cantidadOfrecida) ||
    cantidadOfrecida < 0
  ) {
    throw new RangeError('cantidadOfrecida debe ser un numero finito no negativo');
  }
  if (
    typeof capacidadCompraAlmacen !== 'number' ||
    !Number.isFinite(capacidadCompraAlmacen) ||
    capacidadCompraAlmacen < 0
  ) {
    throw new RangeError('capacidadCompraAlmacen debe ser un numero finito no negativo');
  }
  return Math.min(cantidadOfrecida, capacidadCompraAlmacen);
}

module.exports = { resolverCompraAlmacen };
