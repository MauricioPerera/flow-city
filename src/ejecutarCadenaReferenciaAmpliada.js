const { crearGrid } = require('./crearGrid.js');
const { crearTesoreria } = require('./crearTesoreria.js');
const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { construirNodoConCosto } = require('./construirNodoConCosto.js');
const { colocarNodo } = require('./colocarNodo.js');
const { verticeEntrada } = require('./verticeEntrada.js');
const { crearTramo } = require('./crearTramo.js');
const { conectarVertices } = require('./conectarVertices.js');
const { crearAlmacen } = require('./crearAlmacen.js');
const { agregarStockAlmacen } = require('./agregarStockAlmacen.js');
const { retirarStockAlmacen } = require('./retirarStockAlmacen.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { aplicarDegradacionProduccion } = require('./aplicarDegradacionProduccion.js');
const { resolverViaje } = require('./resolverViaje.js');
const { resolverCompraAlmacen } = require('./resolverCompraAlmacen.js');
const { calcularMontoVenta } = require('./calcularMontoVenta.js');
const { registrarIngreso } = require('./registrarIngreso.js');
const { calcularMantenimientoTotal } = require('./calcularMantenimientoTotal.js');
const { aplicarMantenimientoTick } = require('./aplicarMantenimientoTick.js');
const { actualizarContadorQuiebra } = require('./actualizarContadorQuiebra.js');
const { estaNodoDegradado } = require('./estaNodoDegradado.js');
const { poblacionTotalCasas } = require('./poblacionTotalCasas.js');
const { calcularCoberturaNecesidad } = require('./calcularCoberturaNecesidad.js');
const { combinarCoberturas } = require('./combinarCoberturas.js');
const { calcularCrecimientoPoblacion } = require('./calcularCrecimientoPoblacion.js');
const { calendarioDeTick } = require('./calendarioDeTick.js');
const { calcularMultiplicadorClima } = require('./calcularMultiplicadorClima.js');

function ejecutarCadenaReferenciaAmpliada() {
  // SETUP (una sola vez, antes del loop)
  const DIA_INICIAL = 80;
  const grid = crearGrid(3, 1, 'verde');
  const tesoreria = crearTesoreria(50);
  const bomba = crearNodoProductivo('extraccion-agua', null, null, 4);
  const granja = crearNodoProductivo('agricultura', 1, 2, null);
  construirNodoConCosto(grid, tesoreria, 0, 0, 'no_extractiva', 'extraccion-agua', bomba);
  construirNodoConCosto(grid, tesoreria, 1, 0, 'agricultura', 'agricultura', granja);
  colocarNodo(grid, 2, 0, 'no_extractiva', 'casa-1');
  const verticeBomba = verticeEntrada(0, 0, 'este');
  const verticeGranja = verticeEntrada(1, 0, 'oeste');
  const grafo = {};
  conectarVertices(grafo, verticeBomba, verticeGranja, crearTramo('carretera', 10, 1, 'mercaderia'));
  const almacenBomba = crearAlmacen(1, 10);
  const almacenGranja = crearAlmacen(1, 20);
  const CAPACIDAD_COMPRA_COMERCIO = 8;
  const PRECIO_UNITARIO = 2;
  const UMBRAL_DEGRADACION = 2;
  const NECESIDAD_PER_CAPITA = 0.2;
  const TASA_BASE = 0.1;
  let poblacionActual = poblacionTotalCasas([10]);
  const poblacionInicial = poblacionActual;
  let contadorQuiebra = 0;
  const historial = [];

  // LOOP: para i de 0 a 9 (10 iteraciones)
  for (let i = 0; i < 10; i++) {
    // i. tick
    const tick = DIA_INICIAL + i;
    // ii. calendario
    const calendario = calendarioDeTick(tick);
    // iii. degradado
    const degradado = estaNodoDegradado(contadorQuiebra, UMBRAL_DEGRADACION);

    // iv. produccion de agua
    const rawAgua = producirTickNodo(bomba, 0);
    const aguaProducida = aplicarDegradacionProduccion(rawAgua, degradado);

    // v. cobertura de agua
    const aguaRequerida = poblacionActual * NECESIDAD_PER_CAPITA;
    const aguaParaPoblacion = Math.min(aguaRequerida, aguaProducida);
    const coberturaAgua = calcularCoberturaNecesidad(aguaRequerida, aguaParaPoblacion);

    // vi. envio de agua a la granja
    const aguaRestante = Math.floor(aguaProducida - aguaParaPoblacion);
    const espacioBomba = almacenBomba.capacidadProducto - almacenBomba.stockProducto;
    let bombaAlmacenLleno = false;
    if (aguaRestante > espacioBomba) {
      bombaAlmacenLleno = true;
    } else if (aguaRestante > 0) {
      agregarStockAlmacen(almacenBomba, 'producto', aguaRestante);
    }
    const cantidadAEnviar = almacenBomba.stockProducto;
    let aguaEnviadaGranja = 0;
    let aguaRecibidaGranja = 0;
    if (cantidadAEnviar > 0) {
      aguaEnviadaGranja = retirarStockAlmacen(almacenBomba, 'producto', cantidadAEnviar);
      const resultadoViaje = resolverViaje(grafo, verticeBomba, verticeGranja, 'mercaderia', aguaEnviadaGranja);
      aguaRecibidaGranja = resultadoViaje.entregado;
    }

    // vii. produccion de manzanas en la granja
    const rawManzanas = producirTickNodo(granja, aguaRecibidaGranja);
    const manzanasConDegradacion = aplicarDegradacionProduccion(rawManzanas, degradado);
    const multiplicadorClima = calcularMultiplicadorClima(calendario.estacion);
    const manzanasProducidas = manzanasConDegradacion * multiplicadorClima;

    // viii. cobertura de comida
    const comidaRequerida = poblacionActual * NECESIDAD_PER_CAPITA;
    const comidaParaPoblacion = Math.min(comidaRequerida, manzanasProducidas);
    const coberturaComida = calcularCoberturaNecesidad(comidaRequerida, comidaParaPoblacion);

    // ix. venta de manzanas
    const manzanasRestantes = Math.floor(manzanasProducidas - comidaParaPoblacion);
    const espacioGranja = almacenGranja.capacidadProducto - almacenGranja.stockProducto;
    let granjaAlmacenLleno = false;
    if (manzanasRestantes > espacioGranja) {
      granjaAlmacenLleno = true;
    } else if (manzanasRestantes > 0) {
      agregarStockAlmacen(almacenGranja, 'producto', manzanasRestantes);
    }
    const cantidadDisponibleVenta = almacenGranja.stockProducto;
    const manzanasVendidas = resolverCompraAlmacen(cantidadDisponibleVenta, CAPACIDAD_COMPRA_COMERCIO);
    let montoVenta = 0;
    if (manzanasVendidas > 0) {
      retirarStockAlmacen(almacenGranja, 'producto', manzanasVendidas);
      montoVenta = calcularMontoVenta(manzanasVendidas, PRECIO_UNITARIO);
      registrarIngreso(tesoreria, montoVenta);
    }

    // x. mantenimiento condicionado al calendario
    const montoMantenimiento = calcularMantenimientoTotal(['extraccion-agua', 'agricultura']);
    let mantenimientoCobrado = false;
    if (calendario.esLaboral) {
      aplicarMantenimientoTick(tesoreria, [montoMantenimiento]);
      mantenimientoCobrado = true;
    }

    // xi. contador de quiebra
    contadorQuiebra = actualizarContadorQuiebra(contadorQuiebra, tesoreria.saldo);

    // xii. indice de cobertura combinado
    const indiceCobertura = combinarCoberturas([coberturaAgua, coberturaComida]);

    // xiii. crecimiento poblacional
    const poblacionInicioTick = poblacionActual;
    const cambioPoblacionCrudo = calcularCrecimientoPoblacion(poblacionActual, indiceCobertura, TASA_BASE);
    const cambioPoblacion = Math.floor(cambioPoblacionCrudo);
    poblacionActual = poblacionActual + cambioPoblacion;

    // xiv. registrar en el historial
    historial.push({
      tick,
      diaDeSemana: calendario.diaDeSemana,
      esLaboral: calendario.esLaboral,
      estacion: calendario.estacion,
      degradado,
      aguaProducida,
      aguaParaPoblacion,
      coberturaAgua,
      aguaRestante,
      aguaRecibidaGranja,
      manzanasConDegradacion,
      multiplicadorClima,
      manzanasProducidas,
      comidaParaPoblacion,
      coberturaComida,
      manzanasRestantes,
      manzanasVendidas,
      montoVenta,
      mantenimientoCobrado,
      indiceCobertura,
      saldoTesoreria: tesoreria.saldo,
      contadorQuiebra,
      poblacionInicioTick,
      cambioPoblacion,
      poblacionFinTick: poblacionActual,
      bombaAlmacenLleno,
      granjaAlmacenLleno,
    });
  }

  // DEVOLVER (despues del loop)
  return {
    historial,
    almacenBombaFinal: almacenBomba,
    almacenGranjaFinal: almacenGranja,
    tesoreriaFinal: tesoreria,
    poblacionInicial,
    poblacionFinal: poblacionActual,
  };
}

module.exports = { ejecutarCadenaReferenciaAmpliada };
