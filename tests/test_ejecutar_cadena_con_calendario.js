const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaConCalendario } = require('../src/ejecutarCadenaConCalendario.js');

test('la cadena real de 8 ticks lleva calendario adjunto por tick, incluyendo el fin de semana', () => {
  const resultado = ejecutarCadenaConCalendario();
  assert.deepEqual(resultado, {
    historial: [
      {
        tick: 0, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 0, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana: 'lunes', esLaboral: true, estacion: 'otono' },
      },
      {
        tick: 1, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 1, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana: 'martes', esLaboral: true, estacion: 'otono' },
      },
      {
        tick: 2, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 2, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana: 'miercoles', esLaboral: true, estacion: 'otono' },
      },
      {
        tick: 3, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 3, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana: 'jueves', esLaboral: true, estacion: 'otono' },
      },
      {
        tick: 4, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 4, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana: 'viernes', esLaboral: true, estacion: 'otono' },
      },
      {
        tick: 5, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 5, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana: 'sabado', esLaboral: false, estacion: 'otono' },
      },
      {
        tick: 6, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 6, anio: 0, mesDelAnio: 0, semanaDelMes: 0, diaDeSemana: 'domingo', esLaboral: false, estacion: 'otono' },
      },
      {
        tick: 7, aguaProducida: 4, aguaEnviada: 4, aguaRecibida: 4,
        manzanasProducidas: 8, manzanasCompradas: 8, montoVenta: 16, granjaAlmacenLleno: false,
        calendario: { dia: 7, anio: 0, mesDelAnio: 0, semanaDelMes: 1, diaDeSemana: 'lunes', esLaboral: true, estacion: 'otono' },
      },
    ],
    almacenBombaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 10, stockMateriaPrima: 0, stockProducto: 0 },
    almacenGranjaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 20, stockMateriaPrima: 0, stockProducto: 0 },
    tesoreriaFinal: { saldo: 128 },
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarCadenaConCalendario(), ejecutarCadenaConCalendario());
});
