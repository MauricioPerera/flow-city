function combinarCoberturas(coberturas) {
  if (!Array.isArray(coberturas) || coberturas.length === 0) {
    throw new RangeError('coberturas debe ser un array no vacio');
  }
  for (const cobertura of coberturas) {
    if (typeof cobertura !== 'number' || !Number.isFinite(cobertura) || cobertura < 0 || cobertura > 1) {
      throw new RangeError('cada cobertura debe ser un numero finito en el rango [0, 1]');
    }
  }
  return Math.min(...coberturas);
}

module.exports = { combinarCoberturas };
