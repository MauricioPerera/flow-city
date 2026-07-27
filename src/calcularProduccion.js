function calcularProduccion(entrada, ratioEntrada, ratioSalida) {
  if (entrada < 0) {
    throw new RangeError('entrada no puede ser negativa');
  }
  if (ratioEntrada <= 0 || ratioSalida <= 0) {
    throw new RangeError('ratioEntrada y ratioSalida deben ser positivos');
  }
  const unidadesConsumidas = Math.floor(entrada / ratioEntrada);
  return unidadesConsumidas * ratioSalida;
}

module.exports = { calcularProduccion };
