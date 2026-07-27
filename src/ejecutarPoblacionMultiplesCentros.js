const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { estaEnZonaInfluencia } = require('./estaEnZonaInfluencia.js');
const { poblacionTotalCasas } = require('./poblacionTotalCasas.js');

function ejecutarPoblacionMultiplesCentros() {
  const grid = crearGrid(6, 6, 'neutra');
  const centros = [{ x: 1, y: 1, radio: 2 }, { x: 4, y: 4, radio: 2 }];
  const casasAIntentar = [{ x: 0, y: 0 }, { x: 5, y: 5 }, { x: 3, y: 3 }, { x: 0, y: 5 }];

  const casasIntentadas = [];
  for (const casa of casasAIntentar) {
    const cubierta = centros.some((centro) =>
      estaEnZonaInfluencia(centro.x, centro.y, centro.radio, casa.x, casa.y)
    );
    let construida = false;
    if (cubierta) {
      colocarNodo(grid, casa.x, casa.y, 'no_extractiva', 'casa');
      construida = true;
    }
    casasIntentadas.push({ x: casa.x, y: casa.y, construida });
  }

  const casasConstruidas = casasIntentadas.filter((c) => c.construida).length;
  const poblacionTotal = poblacionTotalCasas(
    casasIntentadas.filter((c) => c.construida).map(() => 10)
  );

  return { centros, casasIntentadas, casasConstruidas, poblacionTotal };
}

module.exports = { ejecutarPoblacionMultiplesCentros };
