function crearAlmacenPetroleo(capacidadCrudo, capacidadRefinado) {
  if (!Number.isInteger(capacidadCrudo) || capacidadCrudo <= 0) {
    throw new RangeError('capacidadCrudo debe ser un entero positivo');
  }
  if (!Number.isInteger(capacidadRefinado) || capacidadRefinado <= 0) {
    throw new RangeError('capacidadRefinado debe ser un entero positivo');
  }
  return { capacidadCrudo, capacidadRefinado, stockCrudo: 0, stockRefinado: 0 };
}

module.exports = { crearAlmacenPetroleo };
