const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivoMultiInsumo } = require('./crearNodoProductivoMultiInsumo.js');
const { producirTickNodoMultiInsumo } = require('./producirTickNodoMultiInsumo.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { resolverViaje } = require('./resolverViaje.js');

function ejecutarCadenaTallerFabricaMuebles() {
  // a. SETUP DEL GRID
  const grid = crearGrid(2, 2, 'verde');
  const taller = crearNodoProductivoMultiInsumo(
    'taller-tala',
    [{ nombre: 'agua', ratioEntrada: 1 }, { nombre: 'comida', ratioEntrada: 1 }, { nombre: 'personas', ratioEntrada: 2 }],
    1
  );
  const fabrica = crearNodoProductivo('fabrica-muebles', 2, 1, null);
  colocarNodo(grid, 0, 0, 'no_extractiva', taller);
  colocarNodo(grid, 1, 0, 'no_extractiva', fabrica);
  const verticeTaller = verticeEntrada(0, 0, 'este');
  const verticeFabrica = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeTaller, verticeFabrica, crearTramo('carretera', 10, 1, 'mercaderia'));

  // b. PRODUCCION DEL TALLER (insumos fijos)
  const agua = 10, comida = 10, personas = 6;
  const tandasAgua = Math.floor(agua / 1);
  const tandasComida = Math.floor(comida / 1);
  const tandasPersonas = Math.floor(personas / 2);
  const tandasProducidas = Math.min(tandasAgua, tandasComida, tandasPersonas);
  const maderaProducida = producirTickNodoMultiInsumo(taller, { agua, comida, personas });

  // c. ENVIO POR LA RUTA
  const maderaEnviada = maderaProducida;
  const resultadoViaje = resolverViaje(grafo, verticeTaller, verticeFabrica, 'mercaderia', maderaEnviada);
  const maderaRecibida = resultadoViaje.entregado;

  // d. PRODUCCION DE LA FABRICA
  const mueblesProducidos = producirTickNodo(fabrica, maderaRecibida);

  // e. Devolver
  return {
    agua,
    comida,
    personas,
    tandasAgua,
    tandasComida,
    tandasPersonas,
    tandasProducidas,
    maderaProducida,
    maderaEnviada,
    maderaRecibida,
    mueblesProducidos,
  };
}

module.exports = { ejecutarCadenaTallerFabricaMuebles };
