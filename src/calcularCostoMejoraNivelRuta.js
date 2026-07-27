const { calcularCostoConstruccionRutaPorNivel } = require('./calcularCostoConstruccionRutaPorNivel.js');

function calcularCostoMejoraNivelRuta(nivelActual, nivelNuevo) {
  const ORDEN = ['S', 'M', 'L'];
  const indiceActual = ORDEN.indexOf(nivelActual);
  const indiceNuevo = ORDEN.indexOf(nivelNuevo);
  if (indiceActual === -1 || indiceNuevo === -1) {
    throw new RangeError(`Nivel desconocido: ${nivelActual}/${nivelNuevo}`);
  }
  if (indiceNuevo <= indiceActual) {
    throw new RangeError(`No se puede degradar ni mantener el nivel: ${nivelActual} -> ${nivelNuevo}`);
  }
  return calcularCostoConstruccionRutaPorNivel(nivelNuevo) - calcularCostoConstruccionRutaPorNivel(nivelActual);
}

module.exports = { calcularCostoMejoraNivelRuta };
