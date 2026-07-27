function esVerticeValido(vertice) {
  return typeof vertice === 'string' && vertice.length > 0;
}

function esObjetoPlano(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function conectarVertices(grafo, verticeA, verticeB, tramo) {
  if (!esObjetoPlano(grafo)) {
    throw new RangeError('grafo debe ser un objeto');
  }
  if (!esVerticeValido(verticeA) || !esVerticeValido(verticeB)) {
    throw new RangeError('verticeA y verticeB deben ser strings no vacios');
  }
  if (verticeA === verticeB) {
    throw new RangeError('un vertice no puede conectarse consigo mismo');
  }
  if (!esObjetoPlano(tramo)) {
    throw new RangeError('tramo debe ser un objeto');
  }

  if (grafo[verticeA] && grafo[verticeA][verticeB] !== undefined) {
    throw new Error(`los vertices '${verticeA}' y '${verticeB}' ya estan conectados`);
  }

  if (!grafo[verticeA]) {
    grafo[verticeA] = {};
  }
  if (!grafo[verticeB]) {
    grafo[verticeB] = {};
  }
  grafo[verticeA][verticeB] = tramo;
  grafo[verticeB][verticeA] = tramo;

  return grafo;
}

module.exports = { conectarVertices };
