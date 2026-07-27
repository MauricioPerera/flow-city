const TIPOS_VALIDOS = ['organico', 'petroleo'];

function esAlmacenIncompatible(tipoAlmacenA, tipoAlmacenB) {
  if (!TIPOS_VALIDOS.includes(tipoAlmacenA) || !TIPOS_VALIDOS.includes(tipoAlmacenB)) {
    throw new RangeError('Tipo de almacen invalido: debe ser "organico" o "petroleo"');
  }
  return tipoAlmacenA !== tipoAlmacenB;
}

module.exports = { esAlmacenIncompatible };
