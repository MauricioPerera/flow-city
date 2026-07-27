const TERRENOS_VALIDOS = ['verde', 'elevada', 'agua_profunda', 'neutra'];
const RUTAS_VALIDAS = ['carretera', 'ferrocarril', 'maritima', 'subte'];

function rutaCruzaTerrenoValido(terrenoOrigen, terrenoDestino, tipoRuta) {
  if (!TERRENOS_VALIDOS.includes(terrenoOrigen) || !TERRENOS_VALIDOS.includes(terrenoDestino)) {
    throw new RangeError('terreno invalido');
  }
  if (!RUTAS_VALIDAS.includes(tipoRuta)) {
    throw new RangeError('tipo de ruta invalido');
  }
  if (tipoRuta === 'carretera') {
    return terrenoOrigen !== 'agua_profunda' && terrenoDestino !== 'agua_profunda';
  }
  if (tipoRuta === 'maritima') {
    return terrenoOrigen === 'agua_profunda' && terrenoDestino === 'agua_profunda';
  }
  return true;
}

module.exports = { rutaCruzaTerrenoValido };
