function aplicarDegradacionProduccion(produccionPotencial, degradado) {
  if (typeof produccionPotencial !== 'number' || !Number.isFinite(produccionPotencial) || produccionPotencial < 0) {
    throw new RangeError('produccionPotencial debe ser un numero finito no negativo');
  }
  if (typeof degradado !== 'boolean') {
    throw new RangeError('degradado debe ser un booleano');
  }
  if (degradado === false) {
    return produccionPotencial;
  }
  return Math.floor(produccionPotencial / 2);
}

module.exports = { aplicarDegradacionProduccion };