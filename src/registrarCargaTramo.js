const { tramoAdmiteTrafico } = require('./tramoAdmiteTrafico.js');

function esObjetoPlano(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function registrarCargaTramo(tramo, tipoTraficoConsulta, cantidad) {
  if (!esObjetoPlano(tramo)) {
    throw new RangeError('tramo debe ser un objeto');
  }
  if (!Number.isInteger(cantidad) || cantidad <= 0) {
    throw new RangeError('cantidad debe ser un entero positivo');
  }
  if (!tramoAdmiteTrafico(tramo, tipoTraficoConsulta)) {
    throw new Error(`el tramo no admite trafico de tipo '${tipoTraficoConsulta}'`);
  }

  tramo.cargaActual = (tramo.cargaActual || 0) + cantidad;
  return tramo;
}

module.exports = { registrarCargaTramo };
