const TERRENOS_VALIDOS = ['verde', 'elevada', 'agua_profunda', 'neutra'];
const CATEGORIAS_FLEXIBLES = ['residencial', 'industrial'];

function puedeConstruirFlexible(tipoTerreno, categoriaConstruccion) {
  if (!TERRENOS_VALIDOS.includes(tipoTerreno)) {
    throw new RangeError(`tipoTerreno inválido: ${tipoTerreno}`);
  }
  if (!CATEGORIAS_FLEXIBLES.includes(categoriaConstruccion)) {
    throw new RangeError(`categoriaConstruccion no flexible: ${categoriaConstruccion}`);
  }
  return tipoTerreno !== 'agua_profunda';
}

module.exports = { puedeConstruirFlexible };
