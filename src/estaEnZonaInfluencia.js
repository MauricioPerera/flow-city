function esEnteroNoNegativo(valor) {
  return Number.isInteger(valor) && valor >= 0;
}

function estaEnZonaInfluencia(xCentro, yCentro, radio, xCelda, yCelda) {
  if (
    !esEnteroNoNegativo(xCentro) ||
    !esEnteroNoNegativo(yCentro) ||
    !esEnteroNoNegativo(xCelda) ||
    !esEnteroNoNegativo(yCelda)
  ) {
    throw new RangeError('las coordenadas deben ser enteros no negativos');
  }
  if (!esEnteroNoNegativo(radio)) {
    throw new RangeError('radio debe ser un entero no negativo');
  }

  const distancia = Math.max(Math.abs(xCelda - xCentro), Math.abs(yCelda - yCentro));
  return distancia <= radio;
}

module.exports = { estaEnZonaInfluencia };
