function calcularTicksViaje(distanciaTotal, velocidadBase) {
  if (typeof distanciaTotal !== 'number' || !Number.isFinite(distanciaTotal) || distanciaTotal < 0) {
    throw new RangeError('distanciaTotal debe ser un numero finito no negativo');
  }
  if (typeof velocidadBase !== 'number' || !Number.isFinite(velocidadBase) || velocidadBase <= 0) {
    throw new RangeError('velocidadBase debe ser un numero finito positivo');
  }
  return Math.ceil(distanciaTotal / velocidadBase);
}

module.exports = { calcularTicksViaje };
