const test = require('node:test');
const assert = require('node:assert/strict');
const { capacidadManoDeObra } = require('../src/capacidadManoDeObra.js');

test('en dia laboral, toda la poblacion esta disponible para trabajar', () => {
  assert.equal(capacidadManoDeObra(1000, true), 1000);
});

test('en dia de descanso, no hay mano de obra disponible', () => {
  assert.equal(capacidadManoDeObra(1000, false), 0);
});

test('sin poblacion, no hay mano de obra sin importar el dia', () => {
  assert.equal(capacidadManoDeObra(0, true), 0);
  assert.equal(capacidadManoDeObra(0, false), 0);
});

test('poblacionTotal negativa o no entera lanza RangeError', () => {
  assert.throws(() => capacidadManoDeObra(-1, true), RangeError);
  assert.throws(() => capacidadManoDeObra(1.5, true), RangeError);
});

test('esLaboral no booleano lanza RangeError', () => {
  assert.throws(() => capacidadManoDeObra(1000, 'true'), RangeError);
  assert.throws(() => capacidadManoDeObra(1000, 1), RangeError);
  assert.throws(() => capacidadManoDeObra(1000, null), RangeError);
});
