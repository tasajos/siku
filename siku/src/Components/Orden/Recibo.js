import React, { forwardRef } from 'react';

const Recibo = forwardRef(({ pedido, total, numPedido, fecha, hora }, ref) => (
  <div ref={ref}>
    <h3>Recibo</h3>
    <p>Número de Pedido: {numPedido}</p>
    <p>Fecha: {fecha}</p>
    <p>Hora: {hora}</p>
    <ul>
      {pedido.map((item, index) => (
        <li key={index}>
          {item.nombre} - Bs {item.precio}
        </li>
      ))}
    </ul>
    <p>Total: Bs {total}</p>
  </div>
));

export default Recibo;
