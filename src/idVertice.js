function idVertice(x, y) {
  if (!Number.isInteger(x) || x < 0) {
    throw new RangeError('x debe ser un entero no negativo');
  }
  if (!Number.isInteger(y) || y < 0) {
    throw new RangeError('y debe ser un entero no negativo');
  }
  return `${x},${y}`;
}

module.exports = { idVertice };
