const test = require('node:test');
const assert = require('node:assert/strict');
const { costoMantenimientoNodo } = require('../src/costoMantenimientoNodo.js');

test('extraccion-agua cuesta 2 de mantenimiento', () => {
  assert.equal(costoMantenimientoNodo('extraccion-agua'), 2);
});

test('agricultura cuesta 1 de mantenimiento', () => {
  assert.equal(costoMantenimientoNodo('agricultura'), 1);
});

test('categoria no registrada lanza RangeError (no devuelve 0 en silencio)', () => {
  assert.throws(() => costoMantenimientoNodo('mineria'), RangeError);
});

test('categoria vacia o no string lanza RangeError', () => {
  assert.throws(() => costoMantenimientoNodo(''), RangeError);
  assert.throws(() => costoMantenimientoNodo(null), RangeError);
  assert.throws(() => costoMantenimientoNodo(undefined), RangeError);
});
