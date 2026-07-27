const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaTallerFabricaMuebles } = require('../src/ejecutarCadenaTallerFabricaMuebles.js');

test('el taller de tala produce madera y la fabrica de muebles la convierte en muebles', () => {
  const resultado = ejecutarCadenaTallerFabricaMuebles();
  assert.deepEqual(resultado, {
    agua: 10,
    comida: 10,
    personas: 6,
    tandasAgua: 10,
    tandasComida: 10,
    tandasPersonas: 3,
    tandasProducidas: 3,
    maderaProducida: 3,
    maderaEnviada: 3,
    maderaRecibida: 3,
    mueblesProducidos: 1,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarCadenaTallerFabricaMuebles(), ejecutarCadenaTallerFabricaMuebles());
});
