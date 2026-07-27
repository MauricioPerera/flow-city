function talaProduceEnZona(estadoArboles, celdasEnZona) {
  return celdasEnZona.some(({ x, y }) => {
    const entrada = estadoArboles.get(`${x},${y}`) || { estado: 'arbol' };
    return entrada.estado === 'arbol';
  });
}

module.exports = { talaProduceEnZona };
