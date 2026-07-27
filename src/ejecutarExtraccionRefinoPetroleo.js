const { crearNodoProductivo } = require('./crearNodoProductivo.js');
const { producirTickNodo } = require('./producirTickNodo.js');
const { crearAlmacenPetroleo } = require('./crearAlmacenPetroleo.js');
const { agregarStockAlmacenPetroleo } = require('./agregarStockAlmacenPetroleo.js');
const { retirarStockAlmacenPetroleo } = require('./retirarStockAlmacenPetroleo.js');
const { esAlmacenIncompatible } = require('./esAlmacenIncompatible.js');

function ejecutarExtraccionRefinoPetroleo() {
  // a. Extracción de petróleo crudo (produccionFija: 5)
  const extraccion = crearNodoProductivo('petroleo', null, null, 5);
  const crudoProducido = producirTickNodo(extraccion, 0);

  // b. Almacén dedicado y agregado del crudo producido
  const almacenPetroleoFinal = crearAlmacenPetroleo(10, 10);
  agregarStockAlmacenPetroleo(almacenPetroleoFinal, 'crudo', crudoProducido);

  // c. Retiro del crudo para refinarlo
  const crudoRetirado = retirarStockAlmacenPetroleo(almacenPetroleoFinal, 'crudo', crudoProducido);

  // d. Refinería (ratioEntrada: 2, ratioSalida: 1) -> 5 crudo => 2 refinado
  const refineria = crearNodoProductivo('refineria', 2, 1, null);
  const refinadoProducido = producirTickNodo(refineria, crudoRetirado);

  // e. Almacenamiento del producto refinado
  agregarStockAlmacenPetroleo(almacenPetroleoFinal, 'refinado', refinadoProducido);

  // f. Regla de incompatibilidad: petroleo vs organico (incompatible), petroleo vs petroleo (compatible)
  const incompatibilidadPetroleoOrganico = esAlmacenIncompatible('petroleo', 'organico');
  const incompatibilidadPetroleoPetroleo = esAlmacenIncompatible('petroleo', 'petroleo');

  // g. Resultado
  return {
    crudoProducido,
    crudoRetirado,
    refinadoProducido,
    almacenPetroleoFinal,
    incompatibilidadPetroleoOrganico,
    incompatibilidadPetroleoPetroleo,
  };
}

module.exports = { ejecutarExtraccionRefinoPetroleo };
