// Shim minimo para cargar modulos CommonJS de ../src/ en el navegador,
// sin bundler y sin tocar ningun archivo de src/.
//
// Los <script src> clasicos comparten un unico scope lexico global: si dos
// modulos declaran el mismo const/let de nivel superior (ej. TERRENOS_VALIDOS,
// redeclarado en varios archivos de src/), o si un modulo hace
// `const { obtenerCelda } = require(...)` con el mismo nombre que una funcion
// ya declarada globalmente por otro modulo, el navegador lanza un
// SyntaxError de "Identifier ya declarado" al insertar el script (verificado
// en vivo). Por eso cada modulo se ejecuta en su PROPIO scope de funcion via
// `new Function(...)`, replicando el wrapper que Node usa para CommonJS
// (function(module, exports, require) { ...codigo del archivo... }).

window.__cjs = {};

window.require = function (path) {
  var clave = path.replace(/^\.\//, '').replace(/\.js$/, '');
  if (!window.__cjs[clave]) {
    throw new Error('modulo no cargado (revisar orden en MODULOS_REQUERIDOS): ' + path);
  }
  return window.__cjs[clave];
};

var MODULOS_REQUERIDOS = [
  'obtenerCelda.js',
  'puedeConstruir.js',
  'puedeConstruirFlexible.js',
  'asignarNodoCelda.js',
  'celdasDeCasaPorNivel.js',
  'crearGrid.js',
  'colocarNodo.js',
  'colocarNodoFlexible.js',
  'colocarCasaMultiCelda.js',
  'crearNodoProductivo.js',
  // Produccion por tick y almacenes (Contratos 09/10/11)
  'calcularProduccion.js',
  'producirTickNodo.js',
  'crearAlmacen.js',
  'agregarStockAlmacen.js',
  'retirarStockAlmacen.js',
  'producirTickNodoConAlmacen.js',
  // Tesoreria y comercio (Contratos 05/07)
  'crearTesoreria.js',
  'registrarGasto.js',
  'registrarIngreso.js',
  'calcularMontoVenta.js',
  'resolverCompraAlmacen.js',
  // Poblacion dinamica (Contratos 06/34)
  'calcularCapacidadPoblacionCasaPorNivel.js',
  'calcularCoberturaNecesidad.js',
  'combinarCoberturas.js',
  'calcularCrecimientoPoblacion.js',
  // Calendario y estaciones (Contratos 04/27/29)
  'calendarioDeTick.js',
  'calcularMultiplicadorClima.js',
  'aplicarMantenimientoTick.js',
  // Rutas y trafico (Contratos 03/04/08)
  'idVertice.js',
  'verticesDeCelda.js',
  'verticeEntrada.js',
  'crearTramo.js',
  'calcularToleranciaSaturacionRutaPorNivel.js',
  'crearTramoConNivel.js',
  'tramoAdmiteTrafico.js',
  'conectarVertices.js',
  'calcularSaturacion.js',
  'registrarCargaTramo.js',
  'encontrarRuta.js',
  'resolverViaje.js',
  'calcularTicksViaje.js',
  'iniciarViajeEnTransito.js',
  'avanzarViajeTick.js',
  'resolverTickConTransito.js',
];

function cargarModulo(archivo) {
  return fetch('../src/' + archivo)
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error('no se pudo cargar el modulo: ' + archivo);
      }
      return respuesta.text();
    })
    .then(function (codigo) {
      var moduloWrapper = new Function('module', 'exports', 'require', codigo);
      var module = { exports: {} };
      moduloWrapper(module, module.exports, window.require);
      var clave = archivo.replace(/\.js$/, '');
      window.__cjs[clave] = module.exports;
    });
}

function cargarSecuencial(indice) {
  if (indice >= MODULOS_REQUERIDOS.length) {
    if (typeof window.onCjsReady === 'function') {
      window.onCjsReady();
    }
    return;
  }
  cargarModulo(MODULOS_REQUERIDOS[indice]).then(function () {
    cargarSecuencial(indice + 1);
  });
}

cargarSecuencial(0);
