function calcularMontoVenta(cantidad, precioUnitario) {
  if (typeof cantidad !== 'number' || !Number.isFinite(cantidad) || cantidad < 0) {
    throw new RangeError('cantidad debe ser un numero finito no negativo');
  }
  if (typeof precioUnitario !== 'number' || !Number.isFinite(precioUnitario) || precioUnitario <= 0) {
    throw new RangeError('precioUnitario debe ser un numero finito positivo');
  }
  return cantidad * precioUnitario;
}

module.exports = { calcularMontoVenta };
