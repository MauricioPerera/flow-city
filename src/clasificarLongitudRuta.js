function clasificarLongitudRuta(longitud) {
  if (!(longitud > 0)) {
    throw new RangeError('longitud debe ser un numero positivo');
  }
  return longitud >= 15 ? 'larga' : 'corta';
}

module.exports = { clasificarLongitudRuta };
