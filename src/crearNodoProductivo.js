function crearNodoProductivo(categoria, ratioEntrada, ratioSalida, produccionFija) {
  if (typeof categoria !== 'string' || categoria === '') {
    throw new RangeError('categoria debe ser un string no vacio');
  }

  const esEnteroPositivo = (n) => Number.isInteger(n) && n > 0;
  const esFinitoPositivo = (n) => typeof n === 'number' && Number.isFinite(n) && n > 0;

  const modoReceta =
    esEnteroPositivo(ratioEntrada) &&
    esEnteroPositivo(ratioSalida) &&
    produccionFija === null;

  const modoExtraccion =
    ratioEntrada === null &&
    ratioSalida === null &&
    esFinitoPositivo(produccionFija);

  if (modoReceta && modoExtraccion) {
    throw new RangeError('ambos modos a la vez no son validos');
  }
  if (!modoReceta && !modoExtraccion) {
    throw new RangeError('debe ser exactamente un modo valido (receta o extraccion)');
  }

  return { categoria, ratioEntrada, ratioSalida, produccionFija };
}

module.exports = { crearNodoProductivo };