const test = require('node:test');
const assert = require('node:assert/strict');
const { estaEnZonaInfluencia } = require('../src/estaEnZonaInfluencia.js');

test('la celda del propio centro civico esta en zona de influencia', () => {
  assert.equal(estaEnZonaInfluencia(5, 5, 2, 5, 5), true);
});

test('celda a distancia recta igual al radio esta dentro', () => {
  assert.equal(estaEnZonaInfluencia(5, 5, 2, 7, 5), true);
});

test('celda a distancia recta mayor al radio queda fuera', () => {
  assert.equal(estaEnZonaInfluencia(5, 5, 2, 8, 5), false);
});

test('celda diagonal usa Chebyshev: max(dx,dy), no dx+dy', () => {
  // dx=2, dy=2 -> Chebyshev=2 (dentro de radio 2); Manhattan seria 4 (fuera).
  assert.equal(estaEnZonaInfluencia(5, 5, 2, 7, 7), true);
});

test('celda diagonal fuera del radio Chebyshev queda fuera', () => {
  assert.equal(estaEnZonaInfluencia(5, 5, 2, 8, 8), false);
});

test('radio 0 solo incluye la propia celda del centro', () => {
  assert.equal(estaEnZonaInfluencia(5, 5, 0, 5, 5), true);
  assert.equal(estaEnZonaInfluencia(5, 5, 0, 6, 5), false);
});

test('coordenadas no enteras o negativas lanzan RangeError', () => {
  assert.throws(() => estaEnZonaInfluencia(-1, 5, 2, 5, 5), RangeError);
  assert.throws(() => estaEnZonaInfluencia(5, 5, 2, 5.5, 5), RangeError);
});

test('radio negativo o no entero lanza RangeError', () => {
  assert.throws(() => estaEnZonaInfluencia(5, 5, -1, 5, 5), RangeError);
  assert.throws(() => estaEnZonaInfluencia(5, 5, 1.5, 5, 5), RangeError);
});
