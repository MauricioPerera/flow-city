function estaNodoDegradado(contadorQuiebra, umbral) {
  if (!Number.isInteger(contadorQuiebra) || contadorQuiebra < 0) {
    throw new RangeError('contadorQuiebra debe ser un entero no negativo');
  }
  if (!Number.isInteger(umbral) || umbral <= 0) {
    throw new RangeError('umbral debe ser un entero positivo');
  }
  return contadorQuiebra >= umbral;
}

module.exports = { estaNodoDegradado };