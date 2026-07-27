const { obtenerCelda } = require('./obtenerCelda.js');

function asignarNodoCelda(grid, x, y, nodo) {
  if (nodo === null || nodo === undefined) {
    throw new RangeError('nodo es null o undefined');
  }
  const celda = obtenerCelda(grid, x, y);
  if (celda.nodo !== null) {
    throw new Error('la celda ya esta ocupada');
  }
  celda.nodo = nodo;
  return celda;
}

module.exports = { asignarNodoCelda };
