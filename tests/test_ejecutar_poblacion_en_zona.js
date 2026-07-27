const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarPoblacionEnZona } = require('../src/ejecutarPoblacionEnZona.js');

test('arma el escenario completo con los valores esperados', () => {
  const resultado = ejecutarPoblacionEnZona();
  assert.deepEqual(resultado, {
    poblacionInicial: 20,
    casasConstruidas: 2,
    casaFueraDeZonaRechazada: true,
    coberturaAgua: 0.75,
    coberturaComida: 1,
    indiceCobertura: 0.75,
    cambioPoblacion: 1,
    poblacionFinal: 21,
    manoDeObraDisponible: 21,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarPoblacionEnZona(), ejecutarPoblacionEnZona());
});
