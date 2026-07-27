function calcularFactorRendimientoGranjaPorNivel(nivel) {
  const tabla = { S: 1, M: 2, L: 3 };
  if (!(nivel in tabla)) {
    throw new RangeError(`Nivel desconocido: ${nivel}`);
  }
  return tabla[nivel];
}

module.exports = { calcularFactorRendimientoGranjaPorNivel };
