function calcularCostoConstruccionRutaPorNivel(nivel) {
  const tabla = { S: 20, M: 40, L: 70 };
  if (!Object.prototype.hasOwnProperty.call(tabla, nivel)) {
    throw new RangeError(`Nivel desconocido: ${nivel}`);
  }
  return tabla[nivel];
}

module.exports = { calcularCostoConstruccionRutaPorNivel };
