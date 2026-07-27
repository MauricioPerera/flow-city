const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { calcularFactorRendimientoGranjaPorNivel } = require('./calcularFactorRendimientoGranjaPorNivel.js');
const { calcularCostoConstruccionGranjaPorNivel } = require('./calcularCostoConstruccionGranjaPorNivel.js');

function ejecutarProduccionGranjaPorNivel() {
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  const aguaRecibida = 4;
  const historial = ['S', 'M', 'L'].map((nivel) => {
    const rawManzanas = producirTickNodo(granja, aguaRecibida);
    const factor = calcularFactorRendimientoGranjaPorNivel(nivel);
    const manzanasProducidas = rawManzanas * factor;
    const costoConstruccion = calcularCostoConstruccionGranjaPorNivel(nivel);
    return { nivel, aguaRecibida, rawManzanas, factor, manzanasProducidas, costoConstruccion };
  });
  return { historial };
}

module.exports = { ejecutarProduccionGranjaPorNivel };
