const { tramoAdmiteTrafico } = require('./tramoAdmiteTrafico.js');

function esObjetoPlano(valor) {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function reconstruirCamino(previo, destino) {
  const camino = [destino];
  let actual = destino;
  while (previo[actual] !== undefined) {
    actual = previo[actual];
    camino.unshift(actual);
  }
  return camino;
}

function encontrarRuta(grafo, origen, destino, tipoTrafico) {
  if (!esObjetoPlano(grafo)) {
    throw new RangeError('grafo debe ser un objeto');
  }
  if (!['mercaderia', 'personas'].includes(tipoTrafico)) {
    throw new RangeError(`tipoTrafico invalido: ${tipoTrafico}`);
  }
  if (!(origen in grafo)) {
    throw new RangeError(`origen desconocido en el grafo: ${origen}`);
  }
  if (!(destino in grafo)) {
    throw new RangeError(`destino desconocido en el grafo: ${destino}`);
  }
  if (origen === destino) {
    return { camino: [origen], distanciaTotal: 0 };
  }

  const distancias = { [origen]: 0 };
  const previo = {};
  const visitados = new Set();
  const pendientes = new Set([origen]);

  while (pendientes.size > 0) {
    let actual = null;
    for (const candidato of pendientes) {
      if (actual === null || distancias[candidato] < distancias[actual]) {
        actual = candidato;
      }
    }
    pendientes.delete(actual);
    visitados.add(actual);

    if (actual === destino) {
      break;
    }

    const vecinos = grafo[actual] || {};
    for (const vecinoId of Object.keys(vecinos)) {
      if (visitados.has(vecinoId)) {
        continue;
      }
      const tramo = vecinos[vecinoId];
      if (!tramoAdmiteTrafico(tramo, tipoTrafico)) {
        continue;
      }
      const nuevaDistancia = distancias[actual] + tramo.longitud;
      if (distancias[vecinoId] === undefined || nuevaDistancia < distancias[vecinoId]) {
        distancias[vecinoId] = nuevaDistancia;
        previo[vecinoId] = actual;
        pendientes.add(vecinoId);
      }
    }
  }

  if (distancias[destino] === undefined) {
    return null;
  }

  return {
    camino: reconstruirCamino(previo, destino),
    distanciaTotal: distancias[destino],
  };
}

module.exports = { encontrarRuta };
