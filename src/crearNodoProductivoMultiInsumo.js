function crearNodoProductivoMultiInsumo(categoria, receta, ratioSalida) {
  // categoria: string no vacio
  if (typeof categoria !== 'string' || categoria.length === 0) {
    throw new RangeError('categoria debe ser un string no vacio');
  }

  // receta: array de al menos 2 elementos
  if (!Array.isArray(receta) || receta.length < 2) {
    throw new RangeError('receta debe ser un array de al menos 2 elementos');
  }

  // cada insumo: nombre (string no vacio) y ratioEntrada (entero positivo)
  for (const insumo of receta) {
    if (insumo === null || typeof insumo !== 'object') {
      throw new RangeError('cada insumo debe ser un objeto');
    }
    if (typeof insumo.nombre !== 'string' || insumo.nombre.length === 0) {
      throw new RangeError('nombre debe ser un string no vacio');
    }
    if (!Number.isInteger(insumo.ratioEntrada) || insumo.ratioEntrada <= 0) {
      throw new RangeError('ratioEntrada debe ser un entero positivo');
    }
  }

  // nombres de insumo unicos dentro de la receta
  const nombres = receta.map((insumo) => insumo.nombre);
  if (new Set(nombres).size !== nombres.length) {
    throw new RangeError('los nombres de insumo deben ser unicos');
  }

  // ratioSalida: entero positivo
  if (!Number.isInteger(ratioSalida) || ratioSalida <= 0) {
    throw new RangeError('ratioSalida debe ser un entero positivo');
  }

  return { categoria, receta, ratioSalida };
}

module.exports = { crearNodoProductivoMultiInsumo };
