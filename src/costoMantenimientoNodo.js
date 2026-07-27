const COSTOS_MANTENIMIENTO = {
  'extraccion-agua': 2,
  'agricultura': 1,
};

function costoMantenimientoNodo(categoria) {
  if (Object.prototype.hasOwnProperty.call(COSTOS_MANTENIMIENTO, categoria)) {
    return COSTOS_MANTENIMIENTO[categoria];
  }
  throw new RangeError(`categoria no registrada: ${categoria}`);
}

module.exports = { costoMantenimientoNodo };