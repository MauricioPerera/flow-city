const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarTraficoConCombustible } = require('../src/ejecutarTraficoConCombustible.js');

test('carretera siempre se degrada sin combustible, subte no se ve afectado, maritima corta no se ve afectada pero larga si', () => {
  const resultado = ejecutarTraficoConCombustible();
  assert.deepEqual(resultado, {
    escenarios: [
      {
        nombre: 'carretera-con-combustible-suficiente', tipoRuta: 'carretera', longitud: 5,
        esRutaLarga: false, requiereCombustible: true, cargaSolicitada: 10,
        combustibleDisponible: 10, cargaEfectiva: 10, factorDegradacion: 1,
      },
      {
        nombre: 'carretera-sin-combustible', tipoRuta: 'carretera', longitud: 5,
        esRutaLarga: false, requiereCombustible: true, cargaSolicitada: 10,
        combustibleDisponible: 0, cargaEfectiva: 0, factorDegradacion: 0,
      },
      {
        nombre: 'carretera-con-combustible-parcial', tipoRuta: 'carretera', longitud: 5,
        esRutaLarga: false, requiereCombustible: true, cargaSolicitada: 10,
        combustibleDisponible: 5, cargaEfectiva: 5, factorDegradacion: 0.5,
      },
      {
        nombre: 'subte-sin-combustible-no-afectado', tipoRuta: 'subte', longitud: 5,
        esRutaLarga: false, requiereCombustible: false, cargaSolicitada: 10,
        combustibleDisponible: 0, cargaEfectiva: 10, factorDegradacion: 1,
      },
      {
        nombre: 'maritima-corta-sin-combustible-no-afectada', tipoRuta: 'maritima', longitud: 5,
        esRutaLarga: false, requiereCombustible: false, cargaSolicitada: 10,
        combustibleDisponible: 0, cargaEfectiva: 10, factorDegradacion: 1,
      },
      {
        nombre: 'maritima-larga-sin-combustible-afectada', tipoRuta: 'maritima', longitud: 25,
        esRutaLarga: true, requiereCombustible: true, cargaSolicitada: 10,
        combustibleDisponible: 0, cargaEfectiva: 0, factorDegradacion: 0,
      },
    ],
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarTraficoConCombustible(), ejecutarTraficoConCombustible());
});
