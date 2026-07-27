const { obtenerCelda } = require('./obtenerCelda.js');
const { puedeConstruir } = require('./puedeConstruir.js');

function colocarNodo(grid, x, y, categoriaConstruccion, nodo) {
  if (nodo === null || nodo === undefined) {
    throw new RangeError('nodo no puede ser null ni undefined');
  }
  const celda = obtenerCelda(grid, x, y);
  if (!puedeConstruir(celda.terreno, categoriaConstruccion)) {
    throw new Error(
      `el terreno '${celda.terreno}' no admite la categoria '${categoriaConstruccion}'`
    );
  }
  if (celda.nodo !== null) {
    throw new Error(`la celda (${x}, ${y}) ya esta ocupada`);
  }
  celda.nodo = nodo;
  return celda;
}

module.exports = { colocarNodo };
