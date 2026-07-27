const { crearGrid } = require('./crearGrid.js');
const { construirNodoConCosto } = require('./construirNodoConCosto.js');
const { colocarNodo } = require('./colocarNodo.js');
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
const { poblacionTotalCasas } = require('./poblacionTotalCasas.js');
const { calcularCoberturaNecesidad } = require('./calcularCoberturaNecesidad.js');
const { combinarCoberturas } = require('./combinarCoberturas.js');
const { calcularCrecimientoPoblacion } = require('./calcularCrecimientoPoblacion.js');
const { capacidadManoDeObra } = require('./capacidadManoDeObra.js');

function ejecutarCadenaCompletaConPoblacion(numTicks) {
  if (!Number.isInteger(numTicks) || numTicks <= 0) {
    throw new RangeError('numTicks debe ser un entero positivo');
  }

  // SETUP (una sola vez)
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
  const poblacionFija = poblacionTotalCasas([10]);
  let contadorQuiebra = 0;
  const historial = [];
  let ultimoIndiceCobertura = null;

  // LOOP: para cada tick de 0 a numTicks-1
  for (let tick = 0; tick < numTicks; tick += 1) {
    const degradado = estaNodoDegradado(contadorQuiebra, UMBRAL_DEGRADACION);

    // ii. PRODUCCION DE LA BOMBA (con degradacion, SIN almacen todavia)
    const rawAgua = producirTickNodo(bomba, 0);
    const aguaProducida = aplicarDegradacionProduccion(rawAgua, degradado);

    // iii. POBLACION TOMA SU NECESIDAD DE AGUA PRIMERO
    const aguaRequerida = poblacionFija * NECESIDAD_PER_CAPITA;
    const aguaParaPoblacion = Math.min(aguaRequerida, aguaProducida);
    const coberturaAgua = calcularCoberturaNecesidad(aguaRequerida, aguaParaPoblacion);

    // iv. AGUA RESTANTE AL ALMACEN DE LA BOMBA, LUEGO A LA GRANJA
    const aguaRestante = aguaProducida - aguaParaPoblacion;
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

    // v. PRODUCCION DE LA GRANJA (con degradacion)
    const rawManzanas = producirTickNodo(granja, aguaRecibidaGranja);
    const manzanasProducidas = aplicarDegradacionProduccion(rawManzanas, degradado);

    // vi. POBLACION TOMA SU NECESIDAD DE COMIDA PRIMERO
    const comidaRequerida = poblacionFija * NECESIDAD_PER_CAPITA;
    const comidaParaPoblacion = Math.min(comidaRequerida, manzanasProducidas);
    const coberturaComida = calcularCoberturaNecesidad(comidaRequerida, comidaParaPoblacion);

    // vii. MANZANAS RESTANTES AL ALMACEN DE LA GRANJA, LUEGO AL COMERCIO
    const manzanasRestantes = manzanasProducidas - comidaParaPoblacion;
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

    // viii. MANTENIMIENTO
    const montoMantenimiento = calcularMantenimientoTotal(['extraccion-agua', 'agricultura']);
    aplicarMantenimientoTick(tesoreria, [montoMantenimiento]);

    // ix. ACTUALIZAR CONTADOR DE QUIEBRA (con saldo ya actualizado por venta y mantenimiento)
    contadorQuiebra = actualizarContadorQuiebra(contadorQuiebra, tesoreria.saldo);

    // x. INDICE DE COBERTURA
    const indiceCobertura = combinarCoberturas([coberturaAgua, coberturaComida]);
    ultimoIndiceCobertura = indiceCobertura;

    // xi. Agregar al historial
    historial.push({
      tick,
      degradado,
      aguaProducida,
      aguaParaPoblacion,
      coberturaAgua,
      aguaEnviadaGranja,
      aguaRecibidaGranja,
      manzanasProducidas,
      comidaParaPoblacion,
      coberturaComida,
      manzanasVendidas,
      montoVenta,
      indiceCobertura,
      montoMantenimiento,
      saldoTesoreria: tesoreria.saldo,
      contadorQuiebra,
      bombaAlmacenLleno,
      granjaAlmacenLleno,
    });
  }

  // d. DESPUES DEL LOOP (evaluacion final, UNA sola vez)
  const cambioPoblacionCrudo = calcularCrecimientoPoblacion(poblacionFija, ultimoIndiceCobertura, TASA_BASE);
  const cambioPoblacionFinal = Math.floor(cambioPoblacionCrudo);
  const poblacionFinal = poblacionFija + cambioPoblacionFinal;
  const manoDeObraDisponible = capacidadManoDeObra(poblacionFinal, true);

  // e. Devolver
  return {
    historial,
    almacenBombaFinal: almacenBomba,
    almacenGranjaFinal: almacenGranja,
    tesoreriaFinal: tesoreria,
    poblacionFija,
    cambioPoblacionFinal,
    poblacionFinal,
    manoDeObraDisponible,
  };
}

module.exports = { ejecutarCadenaCompletaConPoblacion };
