const TERRENOS_VALIDOS = ['verde', 'elevada', 'agua_profunda', 'neutra'];

const COMPATIBILIDAD = {
  agricultura: ['verde'],
  reforestacion: ['verde'],
  mineria: ['elevada'],
  pesca: ['agua_profunda'],
  no_extractiva: ['verde', 'neutra'],
};

function puedeConstruir(tipoTerreno, categoriaConstruccion) {
  if (!TERRENOS_VALIDOS.includes(tipoTerreno)) {
    throw new RangeError(`tipoTerreno desconocido: ${tipoTerreno}`);
  }
  const terrenosPermitidos = COMPATIBILIDAD[categoriaConstruccion];
  if (!terrenosPermitidos) {
    throw new RangeError(`categoriaConstruccion desconocida: ${categoriaConstruccion}`);
  }
  return terrenosPermitidos.includes(tipoTerreno);
}

module.exports = { puedeConstruir };
