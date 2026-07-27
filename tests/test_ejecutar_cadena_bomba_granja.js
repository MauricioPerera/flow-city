const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaBombaGranja } = require('../src/ejecutarCadenaBombaGranja.js');

test('simula N ticks y devuelve un historial con esa longitud', () => {
  const historial = ejecutarCadenaBombaGranja(3);
  assert.equal(historial.length, 3);
});

test('cada tick: la bomba produce su cantidad fija de agua', () => {
  const historial = ejecutarCadenaBombaGranja(2);
  assert.equal(historial[0].aguaProducida, 4);
  assert.equal(historial[1].aguaProducida, 4);
});

test('el agua producida llega completa a la granja (sin saturacion)', () => {
  const historial = ejecutarCadenaBombaGranja(1);
  assert.equal(historial[0].aguaRecibida, 4);
});

test('la granja produce manzanas segun ratio 1:2 sobre el agua recibida', () => {
  const historial = ejecutarCadenaBombaGranja(1);
  assert.equal(historial[0].manzanasProducidas, 8);
});

test('cada entrada del historial incluye el numero de tick en orden', () => {
  const historial = ejecutarCadenaBombaGranja(3);
  assert.deepEqual(historial.map((h) => h.tick), [0, 1, 2]);
});

test('el resultado es estable entre varias corridas (deterministico)', () => {
  assert.deepEqual(ejecutarCadenaBombaGranja(2), ejecutarCadenaBombaGranja(2));
});

test('numTicks no positivo o no entero lanza RangeError', () => {
  assert.throws(() => ejecutarCadenaBombaGranja(0), RangeError);
  assert.throws(() => ejecutarCadenaBombaGranja(-1), RangeError);
  assert.throws(() => ejecutarCadenaBombaGranja(1.5), RangeError);
});
