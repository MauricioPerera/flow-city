const { verticesDeCelda } = require('./verticesDeCelda.js');

const ESQUINA_POR_ROTACION = {
  norte: 'noreste',
  este: 'sureste',
  sur: 'suroeste',
  oeste: 'noroeste',
};

function verticeEntrada(x, y, rotacion) {
  const esquina = ESQUINA_POR_ROTACION[rotacion];
  if (!esquina) {
    throw new RangeError(`rotacion desconocida: ${rotacion}`);
  }
  return verticesDeCelda(x, y)[esquina];
}

module.exports = { verticeEntrada };
