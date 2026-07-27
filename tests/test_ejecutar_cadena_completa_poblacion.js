const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ejecutarCadenaCompletaConPoblacion,
} = require('../src/ejecutarCadenaCompletaConPoblacion.js');

const ESPERADO_4_TICKS = [
  {
    tick: 0,
    degradado: false,
    aguaProducida: 4,
    aguaParaPoblacion: 2,
    coberturaAgua: 1,
    aguaEnviadaGranja: 2,
    aguaRecibidaGranja: 2,
    manzanasProducidas: 4,
    comidaParaPoblacion: 2,
    coberturaComida: 1,
    manzanasVendidas: 2,
    montoVenta: 4,
    indiceCobertura: 1,
    montoMantenimiento: 3,
    saldoTesoreria: -29,
    contadorQuiebra: 1,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 1,
    degradado: false,
    aguaProducida: 4,
    aguaParaPoblacion: 2,
    coberturaAgua: 1,
    aguaEnviadaGranja: 2,
    aguaRecibidaGranja: 2,
    manzanasProducidas: 4,
    comidaParaPoblacion: 2,
    coberturaComida: 1,
    manzanasVendidas: 2,
    montoVenta: 4,
    indiceCobertura: 1,
    montoMantenimiento: 3,
    saldoTesoreria: -28,
    contadorQuiebra: 2,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 2,
    degradado: true,
    aguaProducida: 2,
    aguaParaPoblacion: 2,
    coberturaAgua: 1,
    aguaEnviadaGranja: 0,
    aguaRecibidaGranja: 0,
    manzanasProducidas: 0,
    comidaParaPoblacion: 0,
    coberturaComida: 0,
    manzanasVendidas: 0,
    montoVenta: 0,
    indiceCobertura: 0,
    montoMantenimiento: 3,
    saldoTesoreria: -31,
    contadorQuiebra: 3,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
  {
    tick: 3,
    degradado: true,
    aguaProducida: 2,
    aguaParaPoblacion: 2,
    coberturaAgua: 1,
    aguaEnviadaGranja: 0,
    aguaRecibidaGranja: 0,
    manzanasProducidas: 0,
    comidaParaPoblacion: 0,
    coberturaComida: 0,
    manzanasVendidas: 0,
    montoVenta: 0,
    indiceCobertura: 0,
    montoMantenimiento: 3,
    saldoTesoreria: -34,
    contadorQuiebra: 4,
    bombaAlmacenLleno: false,
    granjaAlmacenLleno: false,
  },
];

test('4 ticks: sano en 0-1, degrada en el tick 2, y NO se recupera (a diferencia del Contrato 15)', () => {
  const resultado = ejecutarCadenaCompletaConPoblacion(4);
  assert.equal(resultado.historial.length, 4);
  for (let i = 0; i < 4; i += 1) {
    assert.deepEqual(resultado.historial[i], ESPERADO_4_TICKS[i], `tick ${i} no coincide`);
  }
});

test('con 4 ticks: poblacion fija en 10, evaluacion final con indice del ultimo tick (degradado, 0)', () => {
  const resultado = ejecutarCadenaCompletaConPoblacion(4);
  assert.equal(resultado.poblacionFija, 10);
  assert.equal(resultado.cambioPoblacionFinal, -1);
  assert.equal(resultado.poblacionFinal, 9);
  assert.equal(resultado.manoDeObraDisponible, 9);
});

test('con 4 ticks: almacenes y saldo final coinciden con el ultimo tick', () => {
  const resultado = ejecutarCadenaCompletaConPoblacion(4);
  assert.equal(resultado.almacenBombaFinal.stockProducto, 0);
  assert.equal(resultado.almacenGranjaFinal.stockProducto, 0);
  assert.equal(resultado.tesoreriaFinal.saldo, -34);
});

test('con 2 ticks (antes de degradar): evaluacion final usa el indice sano (1), poblacion crece', () => {
  const resultado = ejecutarCadenaCompletaConPoblacion(2);
  assert.equal(resultado.historial.length, 2);
  assert.equal(resultado.historial[1].saldoTesoreria, -28);
  assert.equal(resultado.cambioPoblacionFinal, 1);
  assert.equal(resultado.poblacionFinal, 11);
  assert.equal(resultado.manoDeObraDisponible, 11);
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarCadenaCompletaConPoblacion(3),
    ejecutarCadenaCompletaConPoblacion(3)
  );
});

test('numTicks no positivo o no entero lanza RangeError', () => {
  assert.throws(() => ejecutarCadenaCompletaConPoblacion(0), RangeError);
  assert.throws(() => ejecutarCadenaCompletaConPoblacion(-1), RangeError);
  assert.throws(() => ejecutarCadenaCompletaConPoblacion(1.5), RangeError);
});
