const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaCompleta } = require('../src/ejecutarCadenaCompleta.js');

const ESPERADO = [
  {
    tick: 0,
    degradado: false,
    aguaProducida: 4,
    aguaEnviada: 4,
    aguaRecibida: 4,
    manzanasProducidas: 8,
    manzanasCompradas: 8,
    montoVenta: 16,
    montoMantenimiento: 3,
    saldoTesoreria: -17,
    contadorQuiebra: 1,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 1,
    degradado: false,
    aguaProducida: 4,
    aguaEnviada: 4,
    aguaRecibida: 4,
    manzanasProducidas: 8,
    manzanasCompradas: 8,
    montoVenta: 16,
    montoMantenimiento: 3,
    saldoTesoreria: -4,
    contadorQuiebra: 2,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 2,
    degradado: true,
    aguaProducida: 2,
    aguaEnviada: 2,
    aguaRecibida: 2,
    manzanasProducidas: 2,
    manzanasCompradas: 2,
    montoVenta: 4,
    montoMantenimiento: 3,
    saldoTesoreria: -3,
    contadorQuiebra: 3,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 3,
    degradado: true,
    aguaProducida: 2,
    aguaEnviada: 2,
    aguaRecibida: 2,
    manzanasProducidas: 2,
    manzanasCompradas: 2,
    montoVenta: 4,
    montoMantenimiento: 3,
    saldoTesoreria: -2,
    contadorQuiebra: 4,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 4,
    degradado: true,
    aguaProducida: 2,
    aguaEnviada: 2,
    aguaRecibida: 2,
    manzanasProducidas: 2,
    manzanasCompradas: 2,
    montoVenta: 4,
    montoMantenimiento: 3,
    saldoTesoreria: -1,
    contadorQuiebra: 5,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 5,
    degradado: true,
    aguaProducida: 2,
    aguaEnviada: 2,
    aguaRecibida: 2,
    manzanasProducidas: 2,
    manzanasCompradas: 2,
    montoVenta: 4,
    montoMantenimiento: 3,
    saldoTesoreria: 0,
    contadorQuiebra: 6,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 6,
    degradado: true,
    aguaProducida: 2,
    aguaEnviada: 2,
    aguaRecibida: 2,
    manzanasProducidas: 2,
    manzanasCompradas: 2,
    montoVenta: 4,
    montoMantenimiento: 3,
    saldoTesoreria: 1,
    contadorQuiebra: 0,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 7,
    degradado: false,
    aguaProducida: 4,
    aguaEnviada: 4,
    aguaRecibida: 4,
    manzanasProducidas: 8,
    manzanasCompradas: 8,
    montoVenta: 16,
    montoMantenimiento: 3,
    saldoTesoreria: 14,
    contadorQuiebra: 0,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
];

test('8 ticks: arranca en quiebra por sobre-construccion, degrada en el tick 2, se recupera en el tick 7', () => {
  const resultado = ejecutarCadenaCompleta(8);
  assert.equal(resultado.historial.length, 8);
  for (let i = 0; i < 8; i += 1) {
    assert.deepEqual(resultado.historial[i], ESPERADO[i], `tick ${i} no coincide`);
  }
});

test('la tesoreria final refleja el saldo del ultimo tick', () => {
  const resultado = ejecutarCadenaCompleta(8);
  assert.equal(resultado.tesoreriaFinal.saldo, 14);
});

test('los almacenes de bomba y granja quedan vacios (se drenan cada tick)', () => {
  const resultado = ejecutarCadenaCompleta(8);
  assert.equal(resultado.almacenBombaFinal.stockProducto, 0);
  assert.equal(resultado.almacenGranjaFinal.stockProducto, 0);
});

test('con menos ticks, la quiebra y degradacion todavia no se disparan', () => {
  const resultado = ejecutarCadenaCompleta(2);
  assert.equal(resultado.historial[0].degradado, false);
  assert.equal(resultado.historial[1].degradado, false);
  assert.equal(resultado.tesoreriaFinal.saldo, -4);
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarCadenaCompleta(3), ejecutarCadenaCompleta(3));
});

test('numTicks no positivo o no entero lanza RangeError', () => {
  assert.throws(() => ejecutarCadenaCompleta(0), RangeError);
  assert.throws(() => ejecutarCadenaCompleta(-1), RangeError);
  assert.throws(() => ejecutarCadenaCompleta(1.5), RangeError);
});
