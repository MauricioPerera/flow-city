const { celdasDeCasaPorNivel } = require('./celdasDeCasaPorNivel.js');
const { obtenerCelda } = require('./obtenerCelda.js');
const { puedeConstruirFlexible } = require('./puedeConstruirFlexible.js');
const { asignarNodoCelda } = require('./asignarNodoCelda.js');

function colocarCasaMultiCelda(grid, nivel, xAncla, yAncla, nodo) {
  const celdas = celdasDeCasaPorNivel(nivel, xAncla, yAncla);

  // PASADA 1 (validacion, SIN mutar): valida terreno y ocupacion de TODAS las
  // celdas del footprint antes de tocar ninguna. Si algo falla, se lanza aqui
  // y la pasada 2 nunca se ejecuta, garantizando atomicidad sin rollback.
  for (const { x, y } of celdas) {
    const celda = obtenerCelda(grid, x, y);
    if (celda.nodo !== null) {
      throw new Error(`la celda (${x}, ${y}) ya esta ocupada`);
    }
    if (!puedeConstruirFlexible(celda.terreno, 'residencial')) {
      throw new Error(`el terreno '${celda.terreno}' no admite residencial en (${x}, ${y})`);
    }
  }

  // PASADA 2 (commit): solo se ejecuta si la pasada 1 completo sin lanzar.
  // Se asigna la MISMA referencia de nodo a cada celda del footprint.
  for (const { x, y } of celdas) {
    asignarNodoCelda(grid, x, y, nodo);
  }

  return { celdas };
}

module.exports = { colocarCasaMultiCelda };
