const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { resolverViaje } = require('./resolverViaje.js');
const { resolverCompraAlmacen } = require('./resolverCompraAlmacen.js');
const { calcularMontoVenta } = require('./calcularMontoVenta.js');
const { crearTesoreria } = require('./crearTesoreria.js');
const { registrarIngreso } = require('./registrarIngreso.js');
const { poblacionTotalCasas } = require('./poblacionTotalCasas.js');
const { calcularCoberturaNecesidad } = require('./calcularCoberturaNecesidad.js');
const { combinarCoberturas } = require('./combinarCoberturas.js');
const { calcularCrecimientoPoblacion } = require('./calcularCrecimientoPoblacion.js');
const { capacidadManoDeObra } = require('./capacidadManoDeObra.js');

function ejecutarCadenaConEscasez() {
  // a. SETUP
  const grid = crearGrid(2, 2, 'verde');
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  colocarNodo(grid, 0, 0, 'no_extractiva', bomba);
  colocarNodo(grid, 1, 0, 'agricultura', granja);
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));
  const tesoreria = crearTesoreria(0);
  const NECESIDAD_PER_CAPITA = 0.2;
  const CAPACIDAD_COMPRA_COMERCIO = 8;
  const PRECIO_UNITARIO = 2;
  const TASA_BASE = 0.1;

  // b. POBLACION Y AGUA (4 casas, 10 poblacion cada una)
  const poblacionInicial = poblacionTotalCasas([10, 10, 10, 10]);
  const aguaProducida = producirTickNodo(bomba, 0);
  const aguaRequerida = poblacionInicial * NECESIDAD_PER_CAPITA;
  const aguaParaPoblacion = Math.min(aguaRequerida, aguaProducida);
  const coberturaAgua = calcularCoberturaNecesidad(aguaRequerida, aguaParaPoblacion);

  // c. AGUA RESTANTE A LA GRANJA (puede ser 0)
  const aguaEnviadaGranja = aguaProducida - aguaParaPoblacion;
  let aguaRecibidaGranja = 0;
  if (aguaEnviadaGranja > 0) {
    const resultadoViaje = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaEnviadaGranja);
    aguaRecibidaGranja = resultadoViaje.entregado;
  }

  // d. GRANJA Y COMIDA
  const manzanasProducidas = producirTickNodo(granja, aguaRecibidaGranja);
  const comidaRequerida = poblacionInicial * NECESIDAD_PER_CAPITA;
  const comidaParaPoblacion = Math.min(comidaRequerida, manzanasProducidas);
  const coberturaComida = calcularCoberturaNecesidad(comidaRequerida, comidaParaPoblacion);

  // e. MANZANAS RESTANTES AL COMERCIO (puede ser 0)
  const manzanasRestantes = manzanasProducidas - comidaParaPoblacion;
  const manzanasVendidas = resolverCompraAlmacen(manzanasRestantes, CAPACIDAD_COMPRA_COMERCIO);
  let montoVenta = 0;
  if (manzanasVendidas > 0) {
    montoVenta = calcularMontoVenta(manzanasVendidas, PRECIO_UNITARIO);
    registrarIngreso(tesoreria, montoVenta);
  }

  // f. CRECIMIENTO POBLACIONAL
  const indiceCobertura = combinarCoberturas([coberturaAgua, coberturaComida]);
  const cambioPoblacionCrudo = calcularCrecimientoPoblacion(poblacionInicial, indiceCobertura, TASA_BASE);
  const cambioPoblacion = Math.floor(cambioPoblacionCrudo);
  const poblacionFinal = poblacionInicial + cambioPoblacion;
  const manoDeObraDisponible = capacidadManoDeObra(poblacionFinal, true);

  // g. Devolver
  return {
    poblacionInicial,
    aguaProducida,
    aguaParaPoblacion,
    aguaEnviadaGranja,
    aguaRecibidaGranja,
    manzanasProducidas,
    comidaParaPoblacion,
    manzanasVendidas,
    montoVenta,
    coberturaAgua,
    coberturaComida,
    indiceCobertura,
    cambioPoblacion,
    poblacionFinal,
    manoDeObraDisponible,
    saldoTesoreria: tesoreria.saldo,
  };
}

module.exports = { ejecutarCadenaConEscasez };
