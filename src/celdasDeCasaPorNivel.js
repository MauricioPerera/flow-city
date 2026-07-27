const FORMAS = {
  S: [[0, 0], [1, 0], [0, 1], [1, 1]],
  M: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1]],
  L: [[0, 0], [1, 0], [2, 0], [0, 1], [1, 1], [2, 1], [0, 2], [1, 2], [2, 2]],
};

function celdasDeCasaPorNivel(nivel, xAncla, yAncla) {
  if (!Number.isInteger(xAncla) || xAncla < 0 || !Number.isInteger(yAncla) || yAncla < 0) {
    throw new RangeError('xAncla e yAncla deben ser enteros no negativos');
  }
  const offsets = FORMAS[nivel];
  if (!offsets) {
    throw new RangeError("nivel debe ser 'S', 'M' o 'L'");
  }
  return offsets.map(([dx, dy]) => ({ x: xAncla + dx, y: yAncla + dy }));
}

module.exports = { celdasDeCasaPorNivel };
