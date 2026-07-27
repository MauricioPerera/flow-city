const { clasificarLongitudRuta } = require('./clasificarLongitudRuta.js');
const { tramoRequiereCombustible } = require('./tramoRequiereCombustible.js');
const { aplicarEscasezCombustibleTramo } = require('./aplicarEscasezCombustibleTramo.js');

function evaluarEscenario(nombre, tipoRuta, longitud, cargaSolicitada, combustibleDisponible) {
  const esRutaLarga = clasificarLongitudRuta(longitud) === 'larga';
  const requiereCombustible = tramoRequiereCombustible(tipoRuta, esRutaLarga);
  let cargaEfectiva, factorDegradacion;
  if (requiereCombustible) {
    const resultado = aplicarEscasezCombustibleTramo(cargaSolicitada, combustibleDisponible);
    cargaEfectiva = resultado.cargaEfectiva;
    factorDegradacion = resultado.factorDegradacion;
  } else {
    cargaEfectiva = cargaSolicitada;
    factorDegradacion = 1;
  }
  return { nombre, tipoRuta, longitud, esRutaLarga, requiereCombustible, cargaSolicitada, combustibleDisponible, cargaEfectiva, factorDegradacion };
}

function ejecutarTraficoConCombustible() {
  const escenarios = [
    evaluarEscenario('carretera-con-combustible-suficiente', 'carretera', 5, 10, 10),
    evaluarEscenario('carretera-sin-combustible', 'carretera', 5, 10, 0),
    evaluarEscenario('carretera-con-combustible-parcial', 'carretera', 5, 10, 5),
    evaluarEscenario('subte-sin-combustible-no-afectado', 'subte', 5, 10, 0),
    evaluarEscenario('maritima-corta-sin-combustible-no-afectada', 'maritima', 5, 10, 0),
    evaluarEscenario('maritima-larga-sin-combustible-afectada', 'maritima', 25, 10, 0),
  ];
  return { escenarios };
}

module.exports = { ejecutarTraficoConCombustible };
