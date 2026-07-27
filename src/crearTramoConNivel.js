const { crearTramo } = require('./crearTramo.js');
const { calcularToleranciaSaturacionRutaPorNivel } = require('./calcularToleranciaSaturacionRutaPorNivel.js');

function crearTramoConNivel(tipoRuta, capacidad, longitud, tipoTrafico, nivel) {
  const tramoBase = crearTramo(tipoRuta, capacidad, longitud, tipoTrafico);
  const factor = calcularToleranciaSaturacionRutaPorNivel(nivel);
  return { ...tramoBase, capacidad: tramoBase.capacidad * factor, nivel };
}

module.exports = { crearTramoConNivel };
