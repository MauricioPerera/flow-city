---
type: 'Task Contract'
title: 'Producción de un nodo en un tick, con almacén de producto'
description: 'Funcion que integra producirTickNodo con el almacen de producto: solo produce si el resultado entra completo en el espacio disponible, si no la produccion se frena del todo.'
tags: ['motor-almacenes', 'flow-city', 'produccion', 'tick']

task: producir-tick-nodo-con-almacen
intent: "Producir en un tick solo si el resultado completo entra en el espacio disponible del almacen de producto; si no, frenar la produccion del todo."
target: src/producirTickNodoConAlmacen.js
signature: "function producirTickNodoConAlmacen(nodo, almacen, entradaRecibida)"
test_command: "node tests/test_producir_tick_nodo_con_almacen.js"
budget:
  max_cyclomatic_complexity: 8
  max_nesting_depth: 2
tests: "tests/test_producir_tick_nodo_con_almacen.js"
tests_sha256: "984ffc3ad86e139a9b7713d72f089911868aa7f9e53fd2f0030715abc42b4397"
touch_only: ['src/producirTickNodoConAlmacen.js']
deps_allowed: []
forbids: ['network', 'subprocess', 'llm']
---

# Contract: Producción de un nodo en un tick, con almacén de producto

## Intent
Cuarta y última pieza del [Contrato 10](../../specs/CONTRACT-10-almacenes.md): integra
[`producirTickNodo`](./producir-tick-nodo.md) con el almacén de producto
([`crearAlmacen`](./crear-almacen.md) +
[`agregarStockAlmacen`](./agregar-stock-almacen.md)). Decisión confirmada en conversación antes
de escribir este contrato: si la producción potencial de un tick NO entra completa en el
espacio disponible del almacén de producto, la producción se frena del todo ese tick (no se
produce nada, el almacén no se modifica) — nunca producción parcial.

`retirarStockAlmacen` (pieza anterior de este contrato) no es necesaria para esta integración
puntual — sirve para el transporte de salida de un almacén, fuera del alcance de esta tarea.

## Interface
```
function producirTickNodoConAlmacen(nodo, almacen, entradaRecibida)
```
Devuelve `{ producido, almacenLleno }`. Muta `almacen.stockProducto` solo cuando `producido >
0`.

## Invariants
- Calcula `produccionPotencial = producirTickNodo(nodo, entradaRecibida)` (delega toda la
  validación de `nodo`/`entradaRecibida` a esa función — sus errores se propagan tal cual).
- Si `produccionPotencial <= (almacen.capacidadProducto - almacen.stockProducto)`: se agrega
  `produccionPotencial` al almacén (si es `> 0`) y devuelve `{ producido:
  produccionPotencial, almacenLleno: false }`.
- Si `produccionPotencial` NO entra completo en el espacio disponible: devuelve `{ producido:
  0, almacenLleno: true }`, el almacén NO se modifica.
- Si `produccionPotencial === 0` (ej. `entradaRecibida: 0` en un nodo de receta): devuelve
  `{ producido: 0, almacenLleno: false }` — no es un bloqueo por almacén lleno, simplemente no
  había nada que producir.
- `almacen` `null` o no-objeto: lanza `RangeError`.

## Examples
- Nodo extracción `produccionFija: 4`, almacén con espacio `>= 4`: `{ producido: 4,
  almacenLleno: false }`.
- Nodo receta que produciría `20`, espacio disponible `15`: `{ producido: 0, almacenLleno: true
  }`, almacén sin cambios.
- Nodo receta que produciría `20`, espacio disponible exacto `20`: `{ producido: 20,
  almacenLleno: false }`.
- Nodo receta con `entradaRecibida: 0`: `{ producido: 0, almacenLleno: false }`.

## Do / Don't
- DO: reusar `producirTickNodo` y `agregarStockAlmacen`, no reimplementar su lógica.
- DO: distinguir `producido: 0` por "nada que producir" (`almacenLleno: false`) de `producido:
  0` por "no entra en el almacén" (`almacenLleno: true`).
- DON'T: usar red, `require` de paquetes externos (salvo `producirTickNodo` y
  `agregarStockAlmacen`, módulos hermanos), ni acceso a estado global.
- DON'T: producir una cantidad parcial cuando no entra completa — es todo o nada.

## Tests
(Los tests están en `tests/test_producir_tick_nodo_con_almacen.js` — oráculo congelado, sellado
por `tests_sha256`.)

## Constraints
- PARAR y reportar si necesitas conectarte a la red.
- PARAR y reportar si el `intent` resulta imposible de cumplir sin violar `touch_only` o
  `forbids`.
