const test = require('node:test');
const assert = require('node:assert/strict');
const { crearNodoProductivo } = require('../src/crearNodoProductivo.js');

test('modo receta: crea un nodo con ratioEntrada/ratioSalida y produccionFija null', () => {
  assert.deepEqual(crearNodoProductivo('agricultura', 1, 2, null), {
    categoria: 'agricultura',
    ratioEntrada: 1,
    ratioSalida: 2,
    produccionFija: null,
  });
});

test('modo extraccion: crea un nodo con produccionFija y ratios null', () => {
  assert.deepEqual(crearNodoProductivo('extraccion-agua', null, null, 5), {
    categoria: 'extraccion-agua',
    ratioEntrada: null,
    ratioSalida: null,
    produccionFija: 5,
  });
});

test('categoria vacia o no string lanza RangeError', () => {
  assert.throws(() => crearNodoProductivo('', 1, 2, null), RangeError);
  assert.throws(() => crearNodoProductivo(null, 1, 2, null), RangeError);
});

test('los dos modos a la vez (receta y produccionFija) lanzan RangeError', () => {
  assert.throws(() => crearNodoProductivo('x', 1, 2, 5), RangeError);
});

test('ningun modo (todo null) lanza RangeError', () => {
  assert.throws(() => crearNodoProductivo('x', null, null, null), RangeError);
});

test('modo receta a medias (solo uno de los dos ratios) lanza RangeError', () => {
  assert.throws(() => crearNodoProductivo('x', 1, null, null), RangeError);
  assert.throws(() => crearNodoProductivo('x', null, 2, null), RangeError);
});

test('ratioEntrada o ratioSalida no positivos lanzan RangeError', () => {
  assert.throws(() => crearNodoProductivo('x', 0, 2, null), RangeError);
  assert.throws(() => crearNodoProductivo('x', 1, 0, null), RangeError);
});

test('produccionFija no positiva o no finita lanza RangeError', () => {
  assert.throws(() => crearNodoProductivo('x', null, null, 0), RangeError);
  assert.throws(() => crearNodoProductivo('x', null, null, -1), RangeError);
  assert.throws(() => crearNodoProductivo('x', null, null, Infinity), RangeError);
});
