function rutaPuedeCambiarPlano(nivelRuta) {
  const tabla = { S: false, M: true, L: true };
  if (!(nivelRuta in tabla)) {
    throw new RangeError(`Nivel de ruta desconocido: ${nivelRuta}`);
  }
  return tabla[nivelRuta];
}

module.exports = { rutaPuedeCambiarPlano };
