const { idVertice } = require('./idVertice.js');

function verticesDeCelda(x, y) {
  return {
    noroeste: idVertice(x, y),
    noreste: idVertice(x + 1, y),
    suroeste: idVertice(x, y + 1),
    sureste: idVertice(x + 1, y + 1),
  };
}

module.exports = { verticesDeCelda };
