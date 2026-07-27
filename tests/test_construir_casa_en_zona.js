const test = require('node:test');
const assert = require('node:assert/strict');
const { crearGrid } = require('../src/crearGrid.js');
const { construirCasaEnZona } = require('../src/construirCasaEnZona.js');

test('casa dentro de la zona de influencia se construye', () => {
  const grid = crearGrid(4, 4, 'neutra');
  const celda = construirCasaEnZona(grid, 1, 1, 1, 0, 0, 'no_extractiva', 'casa-1');
  assert.equal(celda.nodo, 'casa-1');
  assert.equal(grid.celdas[0][0].nodo, 'casa-1');
});

test('casa justo en el borde del radio (distancia = radio) se construye', () => {
  const grid = crearGrid(4, 4, 'neutra');
  const celda = construirCasaEnZona(grid, 1, 1, 1, 2, 1, 'no_extractiva', 'casa-1');
  assert.equal(celda.nodo, 'casa-1');
});

test('casa fuera de la zona de influencia se rechaza sin tocar el grid', () => {
  const grid = crearGrid(4, 4, 'neutra');
  assert.throws(
    () => construirCasaEnZona(grid, 1, 1, 1, 3, 3, 'no_extractiva', 'casa-2'),
    (err) => err instanceof Error && !(err instanceof RangeError)
  );
  assert.equal(grid.celdas[3][3].nodo, null);
});

test('celda ya ocupada dentro de la zona propaga el error de colocarNodo', () => {
  const grid = crearGrid(4, 4, 'neutra');
  construirCasaEnZona(grid, 1, 1, 1, 0, 0, 'no_extractiva', 'casa-1');
  assert.throws(
    () => construirCasaEnZona(grid, 1, 1, 1, 0, 0, 'no_extractiva', 'casa-2'),
    (err) => err instanceof Error && !(err instanceof RangeError)
  );
});

test('categoriaTerreno invalida lanza RangeError (delegado de colocarNodo)', () => {
  const grid = crearGrid(4, 4, 'neutra');
  assert.throws(
    () => construirCasaEnZona(grid, 1, 1, 1, 0, 0, 'categoria-inexistente', 'casa-1'),
    RangeError
  );
});

test('coordenadas invalidas lanzan RangeError (delegado de estaEnZonaInfluencia)', () => {
  const grid = crearGrid(4, 4, 'neutra');
  assert.throws(
    () => construirCasaEnZona(grid, -1, 1, 1, 0, 0, 'no_extractiva', 'casa-1'),
    RangeError
  );
  assert.throws(
    () => construirCasaEnZona(grid, 1, 1, -1, 0, 0, 'no_extractiva', 'casa-1'),
    RangeError
  );
});
