const test = require('node:test');
const assert = require('node:assert/strict');
const {
  ejecutarCadenaConPoblacionReal,
} = require('../src/ejecutarCadenaConPoblacionReal.js');

test('la poblacion toma su cobertura de la produccion real antes que la granja/el comercio', () => {
  const resultado = ejecutarCadenaConPoblacionReal();
  assert.deepEqual(resultado, {
    poblacionInicial: 10,
    aguaProducida: 4,
    aguaParaPoblacion: 2,
    aguaEnviadaGranja: 2,
    aguaRecibidaGranja: 2,
    manzanasProducidas: 4,
    comidaParaPoblacion: 2,
    manzanasVendidas: 2,
    montoVenta: 4,
    coberturaAgua: 1,
    coberturaComida: 1,
    indiceCobertura: 1,
    cambioPoblacion: 1,
    poblacionFinal: 11,
    manoDeObraDisponible: 11,
    saldoTesoreria: 4,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarCadenaConPoblacionReal(),
    ejecutarCadenaConPoblacionReal()
  );
});
