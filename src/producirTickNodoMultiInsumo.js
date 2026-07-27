function producirTickNodoMultiInsumo(nodo, entradasRecibidas) {
  // a. Validar nodo: objeto no nulo con receta = Array de >= 2 elementos,
  //    cada uno con nombre (string no vacio) y ratioEntrada (entero positivo),
  //    y ratioSalida (entero positivo).
  if (nodo === null || typeof nodo !== 'object' || Array.isArray(nodo)) {
    throw new RangeError('nodo invalido: debe ser un objeto no nulo');
  }
  if (!Array.isArray(nodo.receta) || nodo.receta.length < 2) {
    throw new RangeError('nodo invalido: receta debe ser un array de al menos 2 elementos');
  }
  for (const insumo of nodo.receta) {
    if (
      insumo === null ||
      typeof insumo !== 'object' ||
      Array.isArray(insumo) ||
      typeof insumo.nombre !== 'string' ||
      insumo.nombre.length === 0 ||
      !Number.isInteger(insumo.ratioEntrada) ||
      insumo.ratioEntrada <= 0
    ) {
      throw new RangeError('nodo invalido: cada insumo debe tener nombre (string no vacio) y ratioEntrada (entero positivo)');
    }
  }
  if (!Number.isInteger(nodo.ratioSalida) || nodo.ratioSalida <= 0) {
    throw new RangeError('nodo invalido: ratioSalida debe ser un entero positivo');
  }

  // b. Validar entradasRecibidas: objeto plano (typeof === 'object', no null, no array).
  if (
    entradasRecibidas === null ||
    typeof entradasRecibidas !== 'object' ||
    Array.isArray(entradasRecibidas)
  ) {
    throw new RangeError('entradasRecibidas debe ser un objeto plano');
  }

  // c. Para cada valor PRESENTE en entradasRecibidas: numero finito y no negativo.
  for (const clave of Object.keys(entradasRecibidas)) {
    const valor = entradasRecibidas[clave];
    if (!Number.isFinite(valor) || valor < 0) {
      throw new RangeError('entradasRecibidas: los valores presentes deben ser finitos y no negativos');
    }
  }

  // d. Para cada insumo en nodo.receta: recibido = (typeof === 'number') ? valor : 0,
  //    tandas = Math.floor(recibido / ratioEntrada).
  const tandas = nodo.receta.map((insumo) => {
    const recibido =
      typeof entradasRecibidas[insumo.nombre] === 'number'
        ? entradasRecibidas[insumo.nombre]
        : 0;
    return Math.floor(recibido / insumo.ratioEntrada);
  });

  // e. tandasMinimas = Math.min(...todasLasTandas)
  const tandasMinimas = Math.min(...tandas);

  // f. Devolver tandasMinimas * nodo.ratioSalida
  return tandasMinimas * nodo.ratioSalida;
}

module.exports = { producirTickNodoMultiInsumo };
