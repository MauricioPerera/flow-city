const { crearGrid } = require('./crearGrid.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { crearAlmacen } = require('./crearAlmacen.js');
const { producirTickNodoConAlmacen } = require('./producirTickNodoConAlmacen.js');
const { retirarStockAlmacen } = require('./retirarStockAlmacen.js');
const { resolverViaje } = require('./resolverViaje.js');
const { resolverCompraAlmacen } = require('./resolverCompraAlmacen.js');
const { calcularMontoVenta } = require('./calcularMontoVenta.js');
const { crearTesoreria } = require('./crearTesoreria.js');
const { registrarIngreso } = require('./registrarIngreso.js');
const { calcularMantenimientoTotal } = require('./calcularMantenimientoTotal.js');
const { aplicarMantenimientoTick } = require('./aplicarMantenimientoTick.js');
const { calendarioDeTick } = require('./calendarioDeTick.js');

function ejecutarCadenaMantenimientoCalendario() {
  // a. SETUP (una sola vez, antes del loop)
  const grid = crearGrid(2, 1, 'verde');
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  colocarNodo(grid, 0, 0, 'no_extractiva', bomba);
  colocarNodo(grid, 1, 0, 'agricultura', granja);
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));
  const almacenBomba = crearAlmacen(1, 10);
  const almacenGranja = crearAlmacen(1, 20);
  const tesoreria = crearTesoreria(0);
  const CAPACIDAD_COMPRA_COMERCIO = 8;
  const PRECIO_UNITARIO = 2;
  const MONTO_MANTENIMIENTO = calcularMantenimientoTotal(['extraccion-agua', 'agricultura']);
  const historial = [];

  // b. LOOP: para tick de 0 a 7 (8 iteraciones)
  for (let tick = 0; tick < 8; tick += 1) {
    const calendario = calendarioDeTick(tick);

    const resultadoBomba = producirTickNodoConAlmacen(bomba, almacenBomba, 0);
    const aguaProducida = resultadoBomba.producido;

    const cantidadAEnviar = almacenBomba.stockProducto;
    let aguaEnviada = 0;
    let aguaRecibida = 0;
    if (cantidadAEnviar > 0) {
      aguaEnviada = retirarStockAlmacen(almacenBomba, 'producto', cantidadAEnviar);
      const resultadoViaje = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaEnviada);
      aguaRecibida = resultadoViaje.entregado;
    }

    const resultadoGranja = producirTickNodoConAlmacen(granja, almacenGranja, aguaRecibida);
    const manzanasProducidas = resultadoGranja.producido;

    const cantidadDisponible = almacenGranja.stockProducto;
    const manzanasCompradas = resolverCompraAlmacen(cantidadDisponible, CAPACIDAD_COMPRA_COMERCIO);
    let montoVenta = 0;
    if (manzanasCompradas > 0) {
      retirarStockAlmacen(almacenGranja, 'producto', manzanasCompradas);
      montoVenta = calcularMontoVenta(manzanasCompradas, PRECIO_UNITARIO);
      registrarIngreso(tesoreria, montoVenta);
    }

    let mantenimientoCobrado = false;
    if (calendario.esLaboral) {
      aplicarMantenimientoTick(tesoreria, [MONTO_MANTENIMIENTO]);
      mantenimientoCobrado = true;
    }

    historial.push({
      tick,
      diaDeSemana: calendario.diaDeSemana,
      esLaboral: calendario.esLaboral,
      aguaProducida,
      aguaEnviada,
      aguaRecibida,
      manzanasProducidas,
      manzanasCompradas,
      montoVenta,
      mantenimientoCobrado,
      saldoTesoreria: tesoreria.saldo,
    });
  }

  // c. DEVOLVER (despues del loop)
  return {
    historial,
    almacenBombaFinal: almacenBomba,
    almacenGranjaFinal: almacenGranja,
    tesoreriaFinal: tesoreria,
  };
}

module.exports = { ejecutarCadenaMantenimientoCalendario };
