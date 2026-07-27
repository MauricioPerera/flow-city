const test = require('node:test');
const assert = require('node:assert/strict');
const { costoConstruccionNodo } = require('../src/costoConstruccionNodo.js');

test('extraccion-agua cuesta 50', () => {
  assert.equal(costoConstruccionNodo('extraccion-agua'), 50);
});

test('agricultura cuesta 30', () => {
  assert.equal(costoConstruccionNodo('agricultura'), 30);
});

test('categoria no registrada lanza RangeError (no devuelve 0 en silencio)', () => {
  assert.throws(() => costoConstruccionNodo('mineria'), RangeError);
});

test('categoria vacia o no string lanza RangeError', () => {
  assert.throws(() => costoConstruccionNodo(''), RangeError);
  assert.throws(() => costoConstruccionNodo(null), RangeError);
  assert.throws(() => costoConstruccionNodo(undefined), RangeError);
});
