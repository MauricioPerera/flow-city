function retirarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad) {
  if (campo !== 'crudo' && campo !== 'refinado') {
    throw new RangeError('campo debe ser "crudo" o "refinado"');
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }
  const stockActual = campo === 'crudo' ? almacenPetroleo.stockCrudo : almacenPetroleo.stockRefinado;
  const retirado = Math.min(cantidad, stockActual);
  if (campo === 'crudo') {
    almacenPetroleo.stockCrudo -= retirado;
  } else {
    almacenPetroleo.stockRefinado -= retirado;
  }
  return retirado;
}

module.exports = { retirarStockAlmacenPetroleo };
