const TIPOS_RUTA_VALIDOS = ['carretera', 'ferrocarril', 'maritima', 'subte'];
const TIPOS_TRAFICO_VALIDOS = ['mercaderia', 'personas', 'ambos'];
const TRAFICO_FIJO = {
  ferrocarril: 'mercaderia',
  subte: 'personas',
};

function crearTramo(tipoRuta, capacidad, longitud, tipoTrafico) {
  if (!TIPOS_RUTA_VALIDOS.includes(tipoRuta)) {
    throw new RangeError(`tipoRuta desconocido: ${tipoRuta}`);
  }
  if (!(capacidad > 0)) {
    throw new RangeError('capacidad debe ser positiva');
  }
  if (!(longitud > 0)) {
    throw new RangeError('longitud debe ser positiva');
  }

  const fijo = TRAFICO_FIJO[tipoRuta];
  let tipoTraficoFinal;

  if (fijo) {
    if (tipoTrafico !== undefined && tipoTrafico !== fijo) {
      throw new RangeError(
        `tipoTrafico '${tipoTrafico}' contradice el tipo fijo de '${tipoRuta}': '${fijo}'`
      );
    }
    tipoTraficoFinal = fijo;
  } else {
    tipoTraficoFinal = tipoTrafico === undefined ? 'ambos' : tipoTrafico;
    if (!TIPOS_TRAFICO_VALIDOS.includes(tipoTraficoFinal)) {
      throw new RangeError(`tipoTrafico desconocido: ${tipoTraficoFinal}`);
    }
  }

  return { tipoRuta, capacidad, longitud, tipoTrafico: tipoTraficoFinal };
}

module.exports = { crearTramo };
