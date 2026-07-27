const test = require('node:test');
const assert = require('node:assert/strict');
const { iniciarViajeEnTransito } = require('../src/iniciarViajeEnTransito.js');

test('crea el estado inicial con los campos recibidos', () => {
  const estado = iniciarViajeEnTransito(['A', 'B', 'C'], 'mercaderia', 10, 3);
  assert.deepEqual(estado, {
    camino: ['A', 'B', 'C'],
    tipoTrafico: 'mercaderia',
    cantidad: 10,
    ticksRestantes: 3,
  });
});

test('acepta tipoTrafico personas', () => {
  const estado = iniciarViajeEnTransito(['X', 'Y'], 'personas', 5, 1);
  assert.equal(estado.tipoTrafico, 'personas');
});

test('camino debe tener al menos 2 vertices', () => {
  assert.throws(() => iniciarViajeEnTransito(['A'], 'mercaderia', 10, 3), RangeError);
  assert.throws(() => iniciarViajeEnTransito([], 'mercaderia', 10, 3), RangeError);
});

test('camino no array lanza RangeError', () => {
  assert.throws(() => iniciarViajeEnTransito('A,B', 'mercaderia', 10, 3), RangeError);
  assert.throws(() => iniciarViajeEnTransito(null, 'mercaderia', 10, 3), RangeError);
});

test('tipoTrafico invalido (incluido ambos) lanza RangeError', () => {
  assert.throws(() => iniciarViajeEnTransito(['A', 'B'], 'ambos', 10, 3), RangeError);
  assert.throws(() => iniciarViajeEnTransito(['A', 'B'], 'volador', 10, 3), RangeError);
});

test('cantidad no positiva o no entera lanza RangeError', () => {
  assert.throws(() => iniciarViajeEnTransito(['A', 'B'], 'mercaderia', 0, 3), RangeError);
  assert.throws(() => iniciarViajeEnTransito(['A', 'B'], 'mercaderia', 1.5, 3), RangeError);
});

test('ticksRestantes no positivo o no entero lanza RangeError', () => {
  assert.throws(() => iniciarViajeEnTransito(['A', 'B'], 'mercaderia', 10, 0), RangeError);
  assert.throws(() => iniciarViajeEnTransito(['A', 'B'], 'mercaderia', 10, -1), RangeError);
  assert.throws(() => iniciarViajeEnTransito(['A', 'B'], 'mercaderia', 10, 1.5), RangeError);
});
