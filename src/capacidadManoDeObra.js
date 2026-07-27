function capacidadManoDeObra(poblacionTotal, esLaboral) {
  if (!Number.isInteger(poblacionTotal) || poblacionTotal < 0) {
    throw new RangeError('poblacionTotal debe ser un entero no negativo');
  }
  if (typeof esLaboral !== 'boolean') {
    throw new RangeError('esLaboral debe ser un booleano');
  }
  return esLaboral ? poblacionTotal : 0;
}

module.exports = { capacidadManoDeObra };
