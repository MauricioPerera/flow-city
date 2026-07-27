function calcularSaturacion(carga, capacidad) {
  if (carga < 0) {
    throw new RangeError('carga no puede ser negativa');
  }
  if (capacidad <= 0) {
    throw new RangeError('capacidad debe ser positiva');
  }
  if (carga <= capacidad) {
    return { factorVelocidad: 1, perdida: 0 };
  }
  return {
    factorVelocidad: capacidad / carga,
    perdida: carga - capacidad,
  };
}

module.exports = { calcularSaturacion };
