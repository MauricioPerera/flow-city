function planoDeTerreno(tipoTerreno) {
  const TERRENOS_VALIDOS = ['verde', 'elevada', 'agua_profunda', 'neutra'];
  if (!TERRENOS_VALIDOS.includes(tipoTerreno)) {
    throw new RangeError(`tipoTerreno inválido: ${tipoTerreno}`);
  }
  return tipoTerreno === 'elevada' ? 'elevada' : 'base';
}

module.exports = { planoDeTerreno };
