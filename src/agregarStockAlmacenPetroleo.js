function agregarStockAlmacenPetroleo(almacenPetroleo, campo, cantidad) {
  if (campo !== 'crudo' && campo !== 'refinado') {
    throw new RangeError('campo debe ser "crudo" o "refinado"');
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }
  const stockActual = campo === 'crudo' ? almacenPetroleo.stockCrudo : almacenPetroleo.stockRefinado;
  const capacidad = campo === 'crudo' ? almacenPetroleo.capacidadCrudo : almacenPetroleo.capacidadRefinado;
  const espacioLibre = capacidad - stockActual;
  const aceptado = Math.max(0, Math.min(cantidad, espacioLibre));
  const rechazado = cantidad - aceptado;
  if (campo === 'crudo') {
    almacenPetroleo.stockCrudo += aceptado;
  } else {
    almacenPetroleo.stockRefinado += aceptado;
  }
  return { aceptado, rechazado };
}

module.exports = { agregarStockAlmacenPetroleo };
