const test = require('node:test');
const assert = require('node:assert/strict');
const { calcularMantenimientoTotal } = require('../src/calcularMantenimientoTotal.js');

test('suma el mantenimiento de varias categorias distintas', () => {
  assert.equal(calcularMantenimientoTotal(['extraccion-agua', 'agricultura']), 3);
});

test('suma el mantenimiento de categorias repetidas', () => {
  assert.equal(calcularMantenimientoTotal(['agricultura', 'agricultura', 'agricultura']), 3);
});

test('lista vacia da mantenimiento total 0', () => {
  assert.equal(calcularMantenimientoTotal([]), 0);
});

test('una sola categoria', () => {
  assert.equal(calcularMantenimientoTotal(['extraccion-agua']), 2);
});

test('una categoria desconocida lanza RangeError (delegado de costoMantenimientoNodo)', () => {
  assert.throws(() => calcularMantenimientoTotal(['mineria']), RangeError);
  assert.throws(() => calcularMantenimientoTotal(['agricultura', 'mineria']), RangeError);
});

test('categorias no es un array lanza RangeError', () => {
  assert.throws(() => calcularMantenimientoTotal('no-es-array'), RangeError);
  assert.throws(() => calcularMantenimientoTotal(null), RangeError);
});
