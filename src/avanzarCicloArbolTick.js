const UMBRAL_TOCON_A_LIMPIO = 2;
const UMBRAL_LIMPIO_A_ARBOL = 3;

function avanzarCicloArbolTick(estadoArboles, x, y) {
  const clave = `${x},${y}`;
  const entrada = estadoArboles.get(clave) || { estado: 'arbol', ticksEnEstado: 0 };

  if (entrada.estado === 'arbol') {
    return 'arbol';
  }

  const nuevosTicks = entrada.ticksEnEstado + 1;

  let nuevoEstado;
  let ticksFinal;

  if (entrada.estado === 'tocon') {
    if (nuevosTicks >= UMBRAL_TOCON_A_LIMPIO) {
      nuevoEstado = 'limpio';
      ticksFinal = 0;
    } else {
      nuevoEstado = 'tocon';
      ticksFinal = nuevosTicks;
    }
  } else {
    if (nuevosTicks >= UMBRAL_LIMPIO_A_ARBOL) {
      nuevoEstado = 'arbol';
      ticksFinal = 0;
    } else {
      nuevoEstado = 'limpio';
      ticksFinal = nuevosTicks;
    }
  }

  estadoArboles.set(clave, { estado: nuevoEstado, ticksEnEstado: ticksFinal });
  return nuevoEstado;
}

module.exports = { avanzarCicloArbolTick };
