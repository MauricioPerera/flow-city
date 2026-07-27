function calcularMultiplicadorClima(estacion) {
  const multiplicadores = {
    verano: 1.5,
    invierno: 0.5,
    otono: 1,
    primavera: 1,
  };

  if (typeof estacion !== 'string' || !(estacion in multiplicadores)) {
    throw new RangeError(`Estacion invalida: ${estacion}`);
  }

  return multiplicadores[estacion];
}

module.exports = { calcularMultiplicadorClima };
