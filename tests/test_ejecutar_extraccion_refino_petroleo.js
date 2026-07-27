const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarExtraccionRefinoPetroleo } = require('../src/ejecutarExtraccionRefinoPetroleo.js');

test('el petroleo extraido se refina y se almacena en un almacen dedicado; mezclar con organico se rechaza', () => {
  const resultado = ejecutarExtraccionRefinoPetroleo();
  assert.deepEqual(resultado, {
    crudoProducido: 5,
    crudoRetirado: 5,
    refinadoProducido: 2,
    almacenPetroleoFinal: { capacidadCrudo: 10, capacidadRefinado: 10, stockCrudo: 0, stockRefinado: 2 },
    incompatibilidadPetroleoOrganico: true,
    incompatibilidadPetroleoPetroleo: false,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarExtraccionRefinoPetroleo(), ejecutarExtraccionRefinoPetroleo());
});
