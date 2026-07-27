const test = require('node:test');
const assert = require('node:assert/strict');
const { aplicarMantenimientoTick } = require('../src/aplicarMantenimientoTick.js');

test('descuenta la suma total de los costos de mantenimiento en una sola operacion', () => {
  const tesoreria = { saldo: 100 };
  aplicarMantenimientoTick(tesoreria, [10, 20, 5]);
  assert.equal(tesoreria.saldo, 65);
});

test('devuelve la tesoreria mutada', () => {
  const tesoreria = { saldo: 100 };
  const resultado = aplicarMantenimientoTick(tesoreria, [10]);
  assert.equal(resultado, tesoreria);
});

test('lista vacia no modifica el saldo', () => {
  const tesoreria = { saldo: 100 };
  aplicarMantenimientoTick(tesoreria, []);
  assert.equal(tesoreria.saldo, 100);
});

test('lista de solo ceros no modifica el saldo', () => {
  const tesoreria = { saldo: 100 };
  aplicarMantenimientoTick(tesoreria, [0, 0, 0]);
  assert.equal(tesoreria.saldo, 100);
});

test('permite que el saldo quede negativo (quiebra, no es un error)', () => {
  const tesoreria = { saldo: 10 };
  aplicarMantenimientoTick(tesoreria, [8, 8]);
  assert.equal(tesoreria.saldo, -6);
});

test('costosMantenimiento no es un array lanza RangeError', () => {
  const tesoreria = { saldo: 100 };
  assert.throws(() => aplicarMantenimientoTick(tesoreria, 'no-es-array'), RangeError);
  assert.throws(() => aplicarMantenimientoTick(tesoreria, null), RangeError);
});

test('un costo negativo lanza RangeError', () => {
  const tesoreria = { saldo: 100 };
  assert.throws(() => aplicarMantenimientoTick(tesoreria, [10, -1]), RangeError);
});

test('un costo no finito lanza RangeError', () => {
  const tesoreria = { saldo: 100 };
  assert.throws(() => aplicarMantenimientoTick(tesoreria, [10, NaN]), RangeError);
  assert.throws(() => aplicarMantenimientoTick(tesoreria, [Infinity]), RangeError);
});

test('tesoreria invalida lanza RangeError incluso con lista vacia', () => {
  assert.throws(() => aplicarMantenimientoTick(null, []), RangeError);
  assert.throws(() => aplicarMantenimientoTick({ saldo: '100' }, []), RangeError);
});
