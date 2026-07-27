const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarTallerDeTala } = require('../src/ejecutarTallerDeTala.js');

test('personas es el insumo mas escaso y limita la produccion de madera', () => {
  const resultado = ejecutarTallerDeTala();
  assert.deepEqual(resultado, {
    agua: 10,
    comida: 10,
    personas: 6,
    tandasAgua: 10,
    tandasComida: 10,
    tandasPersonas: 3,
    tandasProducidas: 3,
    maderaProducida: 3,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarTallerDeTala(), ejecutarTallerDeTala());
});
