function radioAreaAccionPorNivel(nivel) {
  const tabla = { S: 2, M: 3, L: 4 };
  if (!(nivel in tabla)) {
    throw new RangeError(`Nivel desconocido: ${nivel}`);
  }
  return tabla[nivel];
}

module.exports = { radioAreaAccionPorNivel };
