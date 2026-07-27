const test = require('node:test');
const assert = require('node:assert/strict');
const { crearAlmacenPetroleo } = require('../src/crearAlmacenPetroleo.js');

test('crea un almacen de petroleo con capacidades separadas para crudo y refinado', () => {
  assert.deepEqual(crearAlmacenPetroleo(10, 5), {
    capacidadCrudo: 10, capacidadRefinado: 5, stockCrudo: 0, stockRefinado: 0,
  });
});

test('lanza RangeError si alguna capacidad no es un entero positivo', () => {
  assert.throws(() => crearAlmacenPetroleo(0, 5), RangeError);
  assert.throws(() => crearAlmacenPetroleo(10, -1), RangeError);
  assert.throws(() => crearAlmacenPetroleo(1.5, 5), RangeError);
});
