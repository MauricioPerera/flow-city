const test = require('node:test');
const assert = require('node:assert/strict');
const { esAlmacenIncompatible } = require('../src/esAlmacenIncompatible.js');

test('petroleo y organico son incompatibles', () => {
  assert.equal(esAlmacenIncompatible('petroleo', 'organico'), true);
  assert.equal(esAlmacenIncompatible('organico', 'petroleo'), true);
});

test('el mismo tipo nunca es incompatible consigo mismo', () => {
  assert.equal(esAlmacenIncompatible('petroleo', 'petroleo'), false);
  assert.equal(esAlmacenIncompatible('organico', 'organico'), false);
});

test('un tipo desconocido lanza RangeError', () => {
  assert.throws(() => esAlmacenIncompatible('petroleo', 'mineral'), RangeError);
});
