function calcularCapacidadPoblacionCasaPorNivel(nivel) {
  const tabla = { S: 4, M: 6, L: 9 };
  if (!(nivel in tabla)) {
    throw new RangeError(`Nivel desconocido: ${nivel}`);
  }
  return tabla[nivel];
}

module.exports = { calcularCapacidadPoblacionCasaPorNivel };
