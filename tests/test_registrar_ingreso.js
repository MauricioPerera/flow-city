const test = require('node:test');
const assert = require('node:assert/strict');
const { registrarIngreso } = require('../src/registrarIngreso.js');

test('suma el monto al saldo', () => {
  const tesoreria = { saldo: 100 };
  registrarIngreso(tesoreria, 30);
  assert.equal(tesoreria.saldo, 130);
});

test('devuelve la tesoreria mutada', () => {
  const tesoreria = { saldo: 100 };
  const resultado = registrarIngreso(tesoreria, 30);
  assert.equal(resultado, tesoreria);
});

test('un ingreso puede sacar a la tesoreria de saldo negativo', () => {
  const tesoreria = { saldo: -30 };
  registrarIngreso(tesoreria, 50);
  assert.equal(tesoreria.saldo, 20);
});

test('acumula ingresos sucesivos', () => {
  const tesoreria = { saldo: 100 };
  registrarIngreso(tesoreria, 30);
  registrarIngreso(tesoreria, 20);
  assert.equal(tesoreria.saldo, 150);
});

test('monto no positivo lanza RangeError', () => {
  const tesoreria = { saldo: 100 };
  assert.throws(() => registrarIngreso(tesoreria, 0), RangeError);
  assert.throws(() => registrarIngreso(tesoreria, -5), RangeError);
});

test('monto no finito lanza RangeError', () => {
  const tesoreria = { saldo: 100 };
  assert.throws(() => registrarIngreso(tesoreria, NaN), RangeError);
  assert.throws(() => registrarIngreso(tesoreria, Infinity), RangeError);
});

test('tesoreria invalida (null, no objeto, saldo no numerico) lanza RangeError', () => {
  assert.throws(() => registrarIngreso(null, 10), RangeError);
  assert.throws(() => registrarIngreso('no-es-tesoreria', 10), RangeError);
  assert.throws(() => registrarIngreso({ saldo: '100' }, 10), RangeError);
});
