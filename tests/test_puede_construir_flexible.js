const test = require('node:test');
const assert = require('node:assert/strict');
const { puedeConstruirFlexible } = require('../src/puedeConstruirFlexible.js');

test('residencial acepta verde, elevada y neutra', () => {
  assert.equal(puedeConstruirFlexible('verde', 'residencial'), true);
  assert.equal(puedeConstruirFlexible('elevada', 'residencial'), true);
  assert.equal(puedeConstruirFlexible('neutra', 'residencial'), true);
});

test('industrial acepta verde, elevada y neutra', () => {
  assert.equal(puedeConstruirFlexible('verde', 'industrial'), true);
  assert.equal(puedeConstruirFlexible('elevada', 'industrial'), true);
  assert.equal(puedeConstruirFlexible('neutra', 'industrial'), true);
});

test('residencial e industrial rechazan agua_profunda', () => {
  assert.equal(puedeConstruirFlexible('agua_profunda', 'residencial'), false);
  assert.equal(puedeConstruirFlexible('agua_profunda', 'industrial'), false);
});

test('una categoria no flexible lanza RangeError', () => {
  assert.throws(() => puedeConstruirFlexible('verde', 'agricultura'), RangeError);
  assert.throws(() => puedeConstruirFlexible('verde', 'no_extractiva'), RangeError);
});

test('un terreno desconocido lanza RangeError', () => {
  assert.throws(() => puedeConstruirFlexible('lava', 'residencial'), RangeError);
});
