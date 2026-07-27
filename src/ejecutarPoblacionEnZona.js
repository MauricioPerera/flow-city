const { crearGrid } = require('./crearGrid.js');
const { construirCasaEnZona } = require('./construirCasaEnZona.js');
const { poblacionTotalCasas } = require('./poblacionTotalCasas.js');
const { calcularCoberturaNecesidad } = require('./calcularCoberturaNecesidad.js');
const { combinarCoberturas } = require('./combinarCoberturas.js');
const { calcularCrecimientoPoblacion } = require('./calcularCrecimientoPoblacion.js');
const { capacidadManoDeObra } = require('./capacidadManoDeObra.js');

function ejecutarPoblacionEnZona() {
  // a. Armar el grid del centro civico.
  const grid = crearGrid(4, 4, 'neutra');

  // b. Centro civico y radio de influencia.
  const xCentro = 1, yCentro = 1, radio = 1;

  // c. Casa 1: dentro de zona (distancia 1). No deberia lanzar.
  construirCasaEnZona(grid, xCentro, yCentro, radio, 0, 0, 'no_extractiva', 'casa-1');

  // d. Casa 2: dentro de zona, justo en el borde (distancia 1). No deberia lanzar.
  construirCasaEnZona(grid, xCentro, yCentro, radio, 2, 1, 'no_extractiva', 'casa-2');

  // e. Intento de casa 3: fuera de zona (distancia 2). Va a lanzar Error; se captura.
  let casaFueraDeZonaRechazada = false;
  try {
    construirCasaEnZona(grid, xCentro, yCentro, radio, 3, 3, 'no_extractiva', 'casa-3');
  } catch (err) {
    casaFueraDeZonaRechazada = true;
  }

  // f. Las 2 casas que efectivamente se construyeron (casa-1 y casa-2).
  const casasConstruidas = 2;

  // g. Cada casa aporta 10 de poblacion.
  const poblacionInicial = poblacionTotalCasas([10, 10]);

  // h. Cobertura de agua: requerido = poblacionInicial, recibido = 15.
  const coberturaAgua = calcularCoberturaNecesidad(poblacionInicial, 15);

  // i. Cobertura de comida: requerido = poblacionInicial, recibido = 25.
  const coberturaComida = calcularCoberturaNecesidad(poblacionInicial, 25);

  // j. Indice de cobertura: minimo de ambas coberturas.
  const indiceCobertura = combinarCoberturas([coberturaAgua, coberturaComida]);

  // k. Tick de crecimiento poblacional (valor crudo, puede ser fraccionario).
  const cambioPoblacionCrudo = calcularCrecimientoPoblacion(poblacionInicial, indiceCobertura, 0.1);

  // l. Redondear el cambio hacia abajo ANTES de sumarlo a la poblacion.
  const cambioPoblacion = Math.floor(cambioPoblacionCrudo);

  // m. Poblacion final del tick.
  const poblacionFinal = poblacionInicial + cambioPoblacion;

  // n. Mano de obra disponible (esLaboral fijo en true).
  const manoDeObraDisponible = capacidadManoDeObra(poblacionFinal, true);

  // o. Resultado del escenario.
  return {
    poblacionInicial,
    casasConstruidas,
    casaFueraDeZonaRechazada,
    coberturaAgua,
    coberturaComida,
    indiceCobertura,
    cambioPoblacion,
    poblacionFinal,
    manoDeObraDisponible,
  };
}

module.exports = { ejecutarPoblacionEnZona };
