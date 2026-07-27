const { estaEnZonaInfluencia } = require('./estaEnZonaInfluencia.js');
const { colocarNodo } = require('./colocarNodo.js');

function construirCasaEnZona(grid, xCentro, yCentro, radio, xCasa, yCasa, categoriaTerreno, nodo) {
  const dentroDeZona = estaEnZonaInfluencia(xCentro, yCentro, radio, xCasa, yCasa);
  if (dentroDeZona === false) {
    throw new Error('la casa esta fuera de la zona de influencia del centro civico');
  }
  return colocarNodo(grid, xCasa, yCasa, categoriaTerreno, nodo);
}

module.exports = { construirCasaEnZona };