const test = require('node:test');
const assert = require('node:assert/strict');
const { registrarGasto } = require('../src/registrarGasto.js');

test('descuenta el monto del saldo', () => {
  const tesoreria = { saldo: 100 };
  registrarGasto(tesoreria, 30);
  assert.equal(tesoreria.saldo, 70);
});

test('devuelve la tesoreria mutada', () => {
  const tesoreria = { saldo: 100 };
  const resultado = registrarGasto(tesoreria, 30);
  assert.equal(resultado, tesoreria);
});

test('permite que el saldo quede en 0', () => {
  const tesoreria = { saldo: 50 };
  registrarGasto(tesoreria, 50);
  assert.equal(tesoreria.saldo, 0);
});

test('permite que el saldo quede negativo (quiebra, no es un error)', () => {
  const tesoreria = { saldo: 50 };
  registrarGasto(tesoreria, 80);
  assert.equal(tesoreria.saldo, -30);
});

test('acumula gastos sucesivos', () => {
  const tesoreria = { saldo: 100 };
  registrarGasto(tesoreria, 30);
  registrarGasto(tesoreria, 20);
  assert.equal(tesoreria.saldo, 50);
});

test('monto no positivo lanza RangeError', () => {
  const tesoreria = { saldo: 100 };
  assert.throws(() => registrarGasto(tesoreria, 0), RangeError);
  assert.throws(() => registrarGasto(tesoreria, -5), RangeError);
});

test('monto no finito lanza RangeError', () => {
  const tesoreria = { saldo: 100 };
  assert.throws(() => registrarGasto(tesoreria, NaN), RangeError);
  assert.throws(() => registrarGasto(tesoreria, Infinity), RangeError);
});

test('tesoreria invalida (null, no objeto, saldo no numerico) lanza RangeError', () => {
  assert.throws(() => registrarGasto(null, 10), RangeError);
  assert.throws(() => registrarGasto('no-es-tesoreria', 10), RangeError);
  assert.throws(() => registrarGasto({ saldo: '100' }, 10), RangeError);
});
