const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaPoblacionDinamica } = require('../src/ejecutarCadenaPoblacionDinamica.js');

test('poblacion y degradacion evolucionan juntas tick a tick: la poblacion se reduce hasta estabilizarse en una cobertura sostenible, pero la tesoreria nunca se recupera', () => {
  const resultado = ejecutarCadenaPoblacionDinamica();
  assert.deepEqual(resultado, {
    historial: [
      {
        tick: 0, degradado: false, aguaProducida: 4, aguaRequerida: 2, aguaParaPoblacion: 2,
        coberturaAgua: 1, aguaRestante: 2, aguaEnviadaGranja: 2, aguaRecibidaGranja: 2,
        manzanasProducidas: 4, comidaRequerida: 2, comidaParaPoblacion: 2, coberturaComida: 1,
        manzanasRestantes: 2, manzanasVendidas: 2, montoVenta: 4, indiceCobertura: 1,
        montoMantenimiento: 3, saldoTesoreria: -29, contadorQuiebra: 1,
        poblacionInicioTick: 10, cambioPoblacion: 1, poblacionFinTick: 11,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 1, degradado: false, aguaProducida: 4, aguaRequerida: 2.2, aguaParaPoblacion: 2.2,
        coberturaAgua: 1, aguaRestante: 1, aguaEnviadaGranja: 1, aguaRecibidaGranja: 1,
        manzanasProducidas: 2, comidaRequerida: 2.2, comidaParaPoblacion: 2,
        coberturaComida: 0.9090909090909091, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, indiceCobertura: 0.9090909090909091, montoMantenimiento: 3,
        saldoTesoreria: -32, contadorQuiebra: 2, poblacionInicioTick: 11, cambioPoblacion: 0,
        poblacionFinTick: 11, bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 2, degradado: true, aguaProducida: 2, aguaRequerida: 2.2, aguaParaPoblacion: 2,
        coberturaAgua: 0.9090909090909091, aguaRestante: 0, aguaEnviadaGranja: 0,
        aguaRecibidaGranja: 0, manzanasProducidas: 0, comidaRequerida: 2.2,
        comidaParaPoblacion: 0, coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0,
        montoVenta: 0, indiceCobertura: 0, montoMantenimiento: 3, saldoTesoreria: -35,
        contadorQuiebra: 3, poblacionInicioTick: 11, cambioPoblacion: -2, poblacionFinTick: 9,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 3, degradado: true, aguaProducida: 2, aguaRequerida: 1.8, aguaParaPoblacion: 1.8,
        coberturaAgua: 1, aguaRestante: 0, aguaEnviadaGranja: 0, aguaRecibidaGranja: 0,
        manzanasProducidas: 0, comidaRequerida: 1.8, comidaParaPoblacion: 0,
        coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0,
        indiceCobertura: 0, montoMantenimiento: 3, saldoTesoreria: -38, contadorQuiebra: 4,
        poblacionInicioTick: 9, cambioPoblacion: -1, poblacionFinTick: 8,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 4, degradado: true, aguaProducida: 2, aguaRequerida: 1.6, aguaParaPoblacion: 1.6,
        coberturaAgua: 1, aguaRestante: 0, aguaEnviadaGranja: 0, aguaRecibidaGranja: 0,
        manzanasProducidas: 0, comidaRequerida: 1.6, comidaParaPoblacion: 0,
        coberturaComida: 0, manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0,
        indiceCobertura: 0, montoMantenimiento: 3, saldoTesoreria: -41, contadorQuiebra: 5,
        poblacionInicioTick: 8, cambioPoblacion: -1, poblacionFinTick: 7,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 5, degradado: true, aguaProducida: 2, aguaRequerida: 1.4000000000000001,
        aguaParaPoblacion: 1.4000000000000001, coberturaAgua: 1, aguaRestante: 0,
        aguaEnviadaGranja: 0, aguaRecibidaGranja: 0, manzanasProducidas: 0,
        comidaRequerida: 1.4000000000000001, comidaParaPoblacion: 0, coberturaComida: 0,
        manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0, indiceCobertura: 0,
        montoMantenimiento: 3, saldoTesoreria: -44, contadorQuiebra: 6,
        poblacionInicioTick: 7, cambioPoblacion: -1, poblacionFinTick: 6,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 6, degradado: true, aguaProducida: 2, aguaRequerida: 1.2000000000000002,
        aguaParaPoblacion: 1.2000000000000002, coberturaAgua: 1, aguaRestante: 0,
        aguaEnviadaGranja: 0, aguaRecibidaGranja: 0, manzanasProducidas: 0,
        comidaRequerida: 1.2000000000000002, comidaParaPoblacion: 0, coberturaComida: 0,
        manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0, indiceCobertura: 0,
        montoMantenimiento: 3, saldoTesoreria: -47, contadorQuiebra: 7,
        poblacionInicioTick: 6, cambioPoblacion: -1, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 7, degradado: true, aguaProducida: 2, aguaRequerida: 1, aguaParaPoblacion: 1,
        coberturaAgua: 1, aguaRestante: 1, aguaEnviadaGranja: 1, aguaRecibidaGranja: 1,
        manzanasProducidas: 1, comidaRequerida: 1, comidaParaPoblacion: 1, coberturaComida: 1,
        manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0, indiceCobertura: 1,
        montoMantenimiento: 3, saldoTesoreria: -50, contadorQuiebra: 8,
        poblacionInicioTick: 5, cambioPoblacion: 0, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 8, degradado: true, aguaProducida: 2, aguaRequerida: 1, aguaParaPoblacion: 1,
        coberturaAgua: 1, aguaRestante: 1, aguaEnviadaGranja: 1, aguaRecibidaGranja: 1,
        manzanasProducidas: 1, comidaRequerida: 1, comidaParaPoblacion: 1, coberturaComida: 1,
        manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0, indiceCobertura: 1,
        montoMantenimiento: 3, saldoTesoreria: -53, contadorQuiebra: 9,
        poblacionInicioTick: 5, cambioPoblacion: 0, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
      {
        tick: 9, degradado: true, aguaProducida: 2, aguaRequerida: 1, aguaParaPoblacion: 1,
        coberturaAgua: 1, aguaRestante: 1, aguaEnviadaGranja: 1, aguaRecibidaGranja: 1,
        manzanasProducidas: 1, comidaRequerida: 1, comidaParaPoblacion: 1, coberturaComida: 1,
        manzanasRestantes: 0, manzanasVendidas: 0, montoVenta: 0, indiceCobertura: 1,
        montoMantenimiento: 3, saldoTesoreria: -56, contadorQuiebra: 10,
        poblacionInicioTick: 5, cambioPoblacion: 0, poblacionFinTick: 5,
        bombaAlmacenLleno: false, granjaAlmacenLleno: false,
      },
    ],
    almacenBombaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 10, stockMateriaPrima: 0, stockProducto: 0 },
    almacenGranjaFinal: { capacidadMateriaPrima: 1, capacidadProducto: 20, stockMateriaPrima: 0, stockProducto: 0 },
    tesoreriaFinal: { saldo: -56 },
    poblacionInicial: 10,
    poblacionFinal: 5,
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(ejecutarCadenaPoblacionDinamica(), ejecutarCadenaPoblacionDinamica());
});
