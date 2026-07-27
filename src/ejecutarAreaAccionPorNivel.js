const { radioAreaAccionPorNivel } = require('./radioAreaAccionPorNivel.js');
const { estaEnZonaInfluencia } = require('./estaEnZonaInfluencia.js');

function ejecutarAreaAccionPorNivel() {
  const centro = { x: 5, y: 5 };
  const casos = [
    { nivel: 'S', celdaDentro: { x: 7, y: 5 }, celdaFuera: { x: 8, y: 5 } },
    { nivel: 'M', celdaDentro: { x: 8, y: 5 }, celdaFuera: { x: 9, y: 5 } },
    { nivel: 'L', celdaDentro: { x: 9, y: 5 }, celdaFuera: { x: 10, y: 5 } },
  ];
  const historial = casos.map(({ nivel, celdaDentro, celdaFuera }) => {
    const radio = radioAreaAccionPorNivel(nivel);
    const celdaDentroEnAreaReforestacion = estaEnZonaInfluencia(centro.x, centro.y, radio, celdaDentro.x, celdaDentro.y);
    const celdaDentroEnAreaTala = estaEnZonaInfluencia(centro.x, centro.y, radio, celdaDentro.x, celdaDentro.y);
    const celdaFueraEnAreaReforestacion = estaEnZonaInfluencia(centro.x, centro.y, radio, celdaFuera.x, celdaFuera.y);
    const celdaFueraEnAreaTala = estaEnZonaInfluencia(centro.x, centro.y, radio, celdaFuera.x, celdaFuera.y);
    return { nivel, radio, celdaDentro, celdaDentroEnAreaReforestacion, celdaDentroEnAreaTala, celdaFuera, celdaFueraEnAreaReforestacion, celdaFueraEnAreaTala };
  });
  return { centro, historial };
}

module.exports = { ejecutarAreaAccionPorNivel };
