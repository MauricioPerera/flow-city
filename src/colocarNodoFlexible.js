const { obtenerCelda } = require('./obtenerCelda.js');
const { puedeConstruirFlexible } = require('./puedeConstruirFlexible.js');
const { asignarNodoCelda } = require('./asignarNodoCelda.js');

function colocarNodoFlexible(grid, x, y, categoriaConstruccion, nodo) {
  const celda = obtenerCelda(grid, x, y);
  const puede = puedeConstruirFlexible(celda.terreno, categoriaConstruccion);
  if (!puede) {
    throw new Error(`el terreno ${celda.terreno} no admite la categoria ${categoriaConstruccion}`);
  }
  return asignarNodoCelda(grid, x, y, nodo);
}

module.exports = { colocarNodoFlexible };
