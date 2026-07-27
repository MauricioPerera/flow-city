const test = require('node:test');
const assert = require('node:assert/strict');
const { ejecutarCadenaTalaReforestacionConNivel } = require('../src/ejecutarCadenaTalaReforestacionConNivel.js');

test('tala solo produce madera cuando hay un arbol listo; el ciclo completo se repite cada 5 ticks', () => {
  const resultado = ejecutarCadenaTalaReforestacionConNivel();
  assert.deepEqual(resultado, {
    centro: { x: 5, y: 5 },
    nivel: 'S',
    radio: 2,
    celda: { x: 5, y: 5 },
    celdaEnAreaDeAccion: true,
    historial: [
      { tick: 0, estadoAntes: 'arbol', maderaProducida: 1, estadoDespues: 'tocon' },
      { tick: 1, estadoAntes: 'tocon', maderaProducida: 0, estadoDespues: 'limpio' },
      { tick: 2, estadoAntes: 'limpio', maderaProducida: 0, estadoDespues: 'limpio' },
      { tick: 3, estadoAntes: 'limpio', maderaProducida: 0, estadoDespues: 'limpio' },
      { tick: 4, estadoAntes: 'limpio', maderaProducida: 0, estadoDespues: 'arbol' },
      { tick: 5, estadoAntes: 'arbol', maderaProducida: 1, estadoDespues: 'tocon' },
    ],
  });
});

test('el resultado es deterministico entre corridas', () => {
  assert.deepEqual(
    ejecutarCadenaTalaReforestacionConNivel(),
    ejecutarCadenaTalaReforestacionConNivel()
  );
});
