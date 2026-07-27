function tramoRequiereCombustible(tipoRuta, esRutaLarga) {
  const RUTAS_VALIDAS = ['carretera', 'ferrocarril', 'maritima', 'subte'];
  if (!RUTAS_VALIDAS.includes(tipoRuta)) {
    throw new RangeError('tipoRuta no valido: ' + tipoRuta);
  }
  if (typeof esRutaLarga !== 'boolean') {
    throw new RangeError('esRutaLarga debe ser booleano');
  }
  if (['subte', 'ferrocarril'].includes(tipoRuta)) {
    return false;
  }
  if (tipoRuta === 'carretera') {
    return true;
  }
  return esRutaLarga;
}

module.exports = { tramoRequiereCombustible };
