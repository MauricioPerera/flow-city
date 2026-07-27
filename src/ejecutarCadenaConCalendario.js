const { ejecutarCadenaBombaGranjaComercio } = require('./ejecutarCadenaBombaGranjaComercio.js');
const { calendarioDeTick } = require('./calendarioDeTick.js');

function ejecutarCadenaConCalendario() {
  const resultado = ejecutarCadenaBombaGranjaComercio(8);
  const historialConCalendario = resultado.historial.map((entrada) => ({
    ...entrada,
    calendario: calendarioDeTick(entrada.tick),
  }));
  return {
    historial: historialConCalendario,
    almacenBombaFinal: resultado.almacenBombaFinal,
    almacenGranjaFinal: resultado.almacenGranjaFinal,
    tesoreriaFinal: resultado.tesoreriaFinal,
  };
}

module.exports = { ejecutarCadenaConCalendario };
