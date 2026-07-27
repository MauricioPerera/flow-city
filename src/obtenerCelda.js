function obtenerCelda(grid, x, y) {
  if (!Number.isInteger(x) || x < 0 || x >= grid.ancho) {
    throw new RangeError(`x fuera de rango: ${x}`);
  }
  if (!Number.isInteger(y) || y < 0 || y >= grid.alto) {
    throw new RangeError(`y fuera de rango: ${y}`);
  }
  return grid.celdas[y][x];
}

module.exports = { obtenerCelda };
