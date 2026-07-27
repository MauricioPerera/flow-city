const { crearTramoConNivel } = require('./crearTramoConNivel.js');
const { calcularCostoConstruccionRutaPorNivel } = require('./calcularCostoConstruccionRutaPorNivel.js');
const { calcularCostoMejoraNivelRuta } = require('./calcularCostoMejoraNivelRuta.js');

function ejecutarRutaEscaladaPorNivel() {
  const CAPACIDAD_BASE = 10;
  const historialCapacidad = ['S', 'M', 'L'].map((nivel) => {
    const tramo = crearTramoConNivel('carretera', CAPACIDAD_BASE, 5, 'mercaderia', nivel);
    return { nivel, capacidad: tramo.capacidad };
  });

  const historialCosto = ['S', 'M', 'L'].map((nivel) => ({ nivel, costo: calcularCostoConstruccionRutaPorNivel(nivel) }));

  const mejoras = [
    { nivelActual: 'S', nivelNuevo: 'M' },
    { nivelActual: 'M', nivelNuevo: 'L' },
    { nivelActual: 'S', nivelNuevo: 'L' },
  ].map(({ nivelActual, nivelNuevo }) => ({ nivelActual, nivelNuevo, costoMejora: calcularCostoMejoraNivelRuta(nivelActual, nivelNuevo) }));

  let degradarLanzaError = false;
  try {
    calcularCostoMejoraNivelRuta('M', 'S');
  } catch (error) {
    degradarLanzaError = true;
  }

  return { historialCapacidad, historialCosto, mejoras, degradarLanzaError };
}

module.exports = { ejecutarRutaEscaladaPorNivel };
