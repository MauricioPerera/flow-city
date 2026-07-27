const test = require('node:test');
const assert = require('node:assert/strict');
const { puedeConstruir } = require('../src/puedeConstruir.js');

test('agricultura solo en verde', () => {
  assert.equal(puedeConstruir('verde', 'agricultura'), true);
  assert.equal(puedeConstruir('neutra', 'agricultura'), false);
  assert.equal(puedeConstruir('elevada', 'agricultura'), false);
  assert.equal(puedeConstruir('agua_profunda', 'agricultura'), false);
});

test('reforestacion solo en verde', () => {
  assert.equal(puedeConstruir('verde', 'reforestacion'), true);
  assert.equal(puedeConstruir('neutra', 'reforestacion'), false);
});

test('mineria solo en elevada', () => {
  assert.equal(puedeConstruir('elevada', 'mineria'), true);
  assert.equal(puedeConstruir('verde', 'mineria'), false);
  assert.equal(puedeConstruir('neutra', 'mineria'), false);
  assert.equal(puedeConstruir('agua_profunda', 'mineria'), false);
});

test('pesca solo en agua_profunda', () => {
  assert.equal(puedeConstruir('agua_profunda', 'pesca'), true);
  assert.equal(puedeConstruir('verde', 'pesca'), false);
  assert.equal(puedeConstruir('elevada', 'pesca'), false);
  assert.equal(puedeConstruir('neutra', 'pesca'), false);
});

test('no_extractiva solo en verde o neutra, nunca en elevada ni agua_profunda', () => {
  assert.equal(puedeConstruir('verde', 'no_extractiva'), true);
  assert.equal(puedeConstruir('neutra', 'no_extractiva'), true);
  assert.equal(puedeConstruir('elevada', 'no_extractiva'), false);
  assert.equal(puedeConstruir('agua_profunda', 'no_extractiva'), false);
});

test('tipo de terreno desconocido lanza RangeError', () => {
  assert.throws(() => puedeConstruir('lava', 'agricultura'), RangeError);
});

test('categoria de construccion desconocida lanza RangeError', () => {
  assert.throws(() => puedeConstruir('verde', 'castillo'), RangeError);
});
