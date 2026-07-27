const { crearGrid } = require('./crearGrid.js');
const { construirNodoConCosto } = require('./construirNodoConCosto.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { aplicarDegradacionProduccion } = require('./aplicarDegradacionProduccion.js');
const { agregarStockAlmacen } = require('./agregarStockAlmacen.js');
const { retirarStockAlmacen } = require('./retirarStockAlmacen.js');
const { crearAlmacen } = require('./crearAlmacen.js');
const { resolverViaje } = require('./resolverViaje.js');
const { resolverCompraAlmacen } = require('./resolverCompraAlmacen.js');
const { calcularMontoVenta } = require('./calcularMontoVenta.js');
const { crearTesoreria } = require('./crearTesoreria.js');
const { registrarIngreso } = require('./registrarIngreso.js');
const { calcularMantenimientoTotal } = require('./calcularMantenimientoTotal.js');
const { aplicarMantenimientoTick } = require('./aplicarMantenimientoTick.js');
const { actualizarContadorQuiebra } = require('./actualizarContadorQuiebra.js');
const { estaNodoDegradado } = require('./estaNodoDegradado.js');

function ejecutarCadenaCompleta(numTicks) {
  if (!Number.isInteger(numTicks) || numTicks <= 0) {
    throw new RangeError('numTicks debe ser un entero positivo');
  }

  // SETUP (una sola vez, antes del loop)
  const grid = crearGrid(2, 1, 'verde');
  const tesoreria = crearTesoreria(50);
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  construirNodoConCosto(grid, tesoreria, 0, 0, 'no_extractiva', 'extraccion-agua', bomba);
  construirNodoConCosto(grid, tesoreria, 1, 0, 'agricultura', 'agricultura', granja);
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));
  const almacenBomba = crearAlmacen(1, 10);
  const almacenGranja = crearAlmacen(1, 20);
  const CAPACIDAD_COMPRA_COMERCIO = 8;
  const PRECIO_UNITARIO = 2;
  const UMBRAL_DEGRADACION = 2;
  let contadorQuiebra = 0;

  const historial = [];

  for (let tick = 0; tick < numTicks; tick += 1) {
    // i. degradado se calcula con el contadorQuiebra heredado del tick anterior
    const degradado = estaNodoDegradado(contadorQuiebra, UMBRAL_DEGRADACION);

    // ii. PRODUCCION DE LA BOMBA (manual)
    const rawAgua = producirTickNodo(bomba, 0);
    const aguaPotencial = aplicarDegradacionProduccion(rawAgua, degradado);
    const espacioBomba = almacenBomba.capacidadProducto - almacenBomba.stockProducto;
    let aguaProducida;
    let bombaAlmacenLleno;
    if (aguaPotencial <= espacioBomba) {
      if (aguaPotencial > 0) {
        agregarStockAlmacen(almacenBomba, 'producto', aguaPotencial);
      }
      aguaProducida = aguaPotencial;
      bombaAlmacenLleno = false;
    } else {
      aguaProducida = 0;
      bombaAlmacenLleno = true;
    }

    // iii. ENVIO DE LA BOMBA A LA GRANJA
    const cantidadAEnviar = almacenBomba.stockProducto;
    let aguaEnviada = 0;
    let aguaRecibida = 0;
    if (cantidadAEnviar > 0) {
      aguaEnviada = retirarStockAlmacen(almacenBomba, 'producto', cantidadAEnviar);
      const resultadoViaje = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaEnviada);
      aguaRecibida = resultadoViaje.entregado;
    }

    // iv. PRODUCCION DE LA GRANJA (manual)
    const rawManzanas = producirTickNodo(granja, aguaRecibida);
    const manzanasPotencial = aplicarDegradacionProduccion(rawManzanas, degradado);
    const espacioGranja = almacenGranja.capacidadProducto - almacenGranja.stockProducto;
    let manzanasProducidas;
    let granjaAlmacenLleno;
    if (manzanasPotencial <= espacioGranja) {
      if (manzanasPotencial > 0) {
        agregarStockAlmacen(almacenGranja, 'producto', manzanasPotencial);
      }
      manzanasProducidas = manzanasPotencial;
      granjaAlmacenLleno = false;
    } else {
      manzanasProducidas = 0;
      granjaAlmacenLleno = true;
    }

    // v. COMERCIO COMPRA
    const cantidadDisponibleVenta = almacenGranja.stockProducto;
    const manzanasCompradas = resolverCompraAlmacen(cantidadDisponibleVenta, CAPACIDAD_COMPRA_COMERCIO);
    let montoVenta = 0;
    if (manzanasCompradas > 0) {
      retirarStockAlmacen(almacenGranja, 'producto', manzanasCompradas);
      montoVenta = calcularMontoVenta(manzanasCompradas, PRECIO_UNITARIO);
      registrarIngreso(tesoreria, montoVenta);
    }

    // vi. MANTENIMIENTO
    const montoMantenimiento = calcularMantenimientoTotal(['extraccion-agua', 'agricultura']);
    aplicarMantenimientoTick(tesoreria, [montoMantenimiento]);

    // vii. ACTUALIZAR CONTADOR DE QUIEBRA (saldo ya actualizado)
    contadorQuiebra = actualizarContadorQuiebra(contadorQuiebra, tesoreria.saldo);

    // viii. historial
    historial.push({
      tick,
      degradado,
      aguaProducida,
      aguaEnviada,
      aguaRecibida,
      manzanasProducidas,
      manzanasCompradas,
      montoVenta,
      montoMantenimiento,
      saldoTesoreria: tesoreria.saldo,
      contadorQuiebra,
      bombaAlmacenLleno,
      granjaAlmacenLleno,
    });
  }

  return {
    historial,
    almacenBombaFinal: almacenBomba,
    almacenGranjaFinal: almacenGranja,
    tesoreriaFinal: tesoreria,
  };
}

module.exports = { ejecutarCadenaCompleta };