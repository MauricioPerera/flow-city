const test = require('node:test');
const assert = require('node:assert/strict');
const { producirTickNodo } = require('../src/producirTickNodo.js');

test('nodo de extraccion devuelve su produccionFija, ignorando entradaRecibida', () => {
  const nodo = { categoria: 'extraccion-agua', ratioEntrada: null, ratioSalida: null, produccionFija: 5 };
  assert.equal(producirTickNodo(nodo, 100), 5);
  assert.equal(producirTickNodo(nodo, 0), 5);
});

test('nodo de receta usa calcularProduccion con su ratio', () => {
  const nodo = { categoria: 'agricultura', ratioEntrada: 1, ratioSalida: 2, produccionFija: null };
  assert.equal(producirTickNodo(nodo, 10), 20);
});

test('nodo de receta con ratio no exacto descarta el resto (floor)', () => {
  const nodo = { categoria: 'agricultura', ratioEntrada: 2, ratioSalida: 1, produccionFija: null };
  assert.equal(producirTickNodo(nodo, 5), 2);
});

test('nodo de receta con entradaRecibida 0 produce 0', () => {
  const nodo = { categoria: 'agricultura', ratioEntrada: 1, ratioSalida: 2, produccionFija: null };
  assert.equal(producirTickNodo(nodo, 0), 0);
});

test('entradaRecibida negativa lanza RangeError', () => {
  const nodo = { categoria: 'agricultura', ratioEntrada: 1, ratioSalida: 2, produccionFija: null };
  assert.throws(() => producirTickNodo(nodo, -1), RangeError);
});

test('entradaRecibida no finita lanza RangeError', () => {
  const nodo = { categoria: 'agricultura', ratioEntrada: 1, ratioSalida: 2, produccionFija: null };
  assert.throws(() => producirTickNodo(nodo, NaN), RangeError);
  assert.throws(() => producirTickNodo(nodo, Infinity), RangeError);
});

test('nodo invalido (ni receta ni extraccion) lanza RangeError', () => {
  const nodo = { categoria: 'x', ratioEntrada: 1, ratioSalida: null, produccionFija: null };
  assert.throws(() => producirTickNodo(nodo, 10), RangeError);
});

test('nodo null o no objeto lanza RangeError', () => {
  assert.throws(() => producirTickNodo(null, 10), RangeError);
  assert.throws(() => producirTickNodo('no-es-nodo', 10), RangeError);
});
