const { planoDeTerreno } = require('./planoDeTerreno.js');
const { rutaCruzaTerrenoValido } = require('./rutaCruzaTerrenoValido.js');
const { rutaPuedeCambiarPlano } = require('./rutaPuedeCambiarPlano.js');

function evaluarEscenario(nombre, nivel, tipoRuta, terrenoOrigen, terrenoDestino) {
  const terrenoValido = rutaCruzaTerrenoValido(terrenoOrigen, terrenoDestino, tipoRuta);
  const planoOrigen = planoDeTerreno(terrenoOrigen);
  const planoDestino = planoDeTerreno(terrenoDestino);
  const mismoPlano = planoOrigen === planoDestino;
  const puedeCambiarPlano = rutaPuedeCambiarPlano(nivel);
  const conexionPermitida = !terrenoValido ? false : (mismoPlano ? true : puedeCambiarPlano);
  return { nombre, nivel, tipoRuta, terrenoOrigen, terrenoDestino, terrenoValido, planoOrigen, planoDestino, mismoPlano, puedeCambiarPlano, conexionPermitida };
}

function ejecutarConexionRutaConElevacion() {
  const escenarios = [
    evaluarEscenario('carretera-bloqueada-por-agua', 'S', 'carretera', 'verde', 'agua_profunda'),
    evaluarEscenario('carretera-nivel-S-no-cambia-plano', 'S', 'carretera', 'verde', 'elevada'),
    evaluarEscenario('carretera-nivel-M-si-cambia-plano', 'M', 'carretera', 'verde', 'elevada'),
    evaluarEscenario('maritima-bloqueada-por-tierra', 'L', 'maritima', 'agua_profunda', 'verde'),
  ];
  return { escenarios };
}

module.exports = { ejecutarConexionRutaConElevacion };
