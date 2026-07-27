const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaConEscasez } = require('../src/ejecutarCadenaConEscasez.js');

test('poblacion mucho mayor a la produccion disponible fuerza escasez real y decrecimiento', () => {
  const resultado = ejecutarCadenaConEscasez();
  assert.deepEqual(resultado, {
    poblacionInicial: 40,
    aguaProducida: 4,
    aguaParaPoblacion: 4,
    aguaEnviadaGranja: 0,
    aguaRecibidaGranja: 0,
    manzanasProducidas: 0,
    comidaParaPoblacion: 0,
    manzanasVendidas: 0,
    montoVenta: 0,
    coberturaAgua: 0.5,
    coberturaComida: 0,
    indiceCobertura: 0,
    cambioPoblacion: -4,
    poblacionFinal: 36,
    manoDeObraDisponible: 36,
    saldoTesoreria: 0,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarCadenaConEscasez(), ejecutarCadenaConEscasez());
});
