const TERRENOS_VALIDOS = ['verde', 'elevada', 'agua_profunda', 'neutra'];

function crearGrid(ancho, alto, terrenoDefault) {
  if (!Number.isInteger(ancho) || ancho <= 0) {
    throw new RangeError('ancho debe ser un entero positivo');
  }
  if (!Number.isInteger(alto) || alto <= 0) {
    throw new RangeError('alto debe ser un entero positivo');
  }
  if (!TERRENOS_VALIDOS.includes(terrenoDefault)) {
    throw new RangeError(`terrenoDefault desconocido: ${terrenoDefault}`);
  }

  const celdas = [];
  for (let y = 0; y < alto; y += 1) {
    const fila = [];
    for (let x = 0; x < ancho; x += 1) {
      fila.push({ terreno: terrenoDefault, nodo: null });
    }
    celdas.push(fila);
  }

  return { ancho, alto, celdas };
}

module.exports = { crearGrid };
