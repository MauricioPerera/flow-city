const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarConexionRutaConElevacion } = require('../src/ejecutarConexionRutaConElevacion.js');

test('carretera bloqueada por agua, nivel S no cambia de plano, nivel M si, maritima bloqueada por tierra', () => {
  const resultado = ejecutarConexionRutaConElevacion();
  assert.deepEqual(resultado, {
    escenarios: [
      {
        nombre: 'carretera-bloqueada-por-agua', nivel: 'S', tipoRuta: 'carretera',
        terrenoOrigen: 'verde', terrenoDestino: 'agua_profunda', terrenoValido: false,
        planoOrigen: 'base', planoDestino: 'base', mismoPlano: true,
        puedeCambiarPlano: false, conexionPermitida: false,
      },
      {
        nombre: 'carretera-nivel-S-no-cambia-plano', nivel: 'S', tipoRuta: 'carretera',
        terrenoOrigen: 'verde', terrenoDestino: 'elevada', terrenoValido: true,
        planoOrigen: 'base', planoDestino: 'elevada', mismoPlano: false,
        puedeCambiarPlano: false, conexionPermitida: false,
      },
      {
        nombre: 'carretera-nivel-M-si-cambia-plano', nivel: 'M', tipoRuta: 'carretera',
        terrenoOrigen: 'verde', terrenoDestino: 'elevada', terrenoValido: true,
        planoOrigen: 'base', planoDestino: 'elevada', mismoPlano: false,
        puedeCambiarPlano: true, conexionPermitida: true,
      },
      {
        nombre: 'maritima-bloqueada-por-tierra', nivel: 'L', tipoRuta: 'maritima',
        terrenoOrigen: 'agua_profunda', terrenoDestino: 'verde', terrenoValido: false,
        planoOrigen: 'base', planoDestino: 'base', mismoPlano: true,
        puedeCambiarPlano: true, conexionPermitida: false,
      },
    ],
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarConexionRutaConElevacion(), ejecutarConexionRutaConElevacion());
});
