import React, { forwardRef } from 'react';

const Recibo = forwardRef(({ pedido, total, numPedido, fecha, hora }, ref) => {
  return (
    <div ref={ref} className="recibo-container">
      <h2>Recibo del Pedido</h2>
      <p><strong>Número de Pedido:</strong> {numPedido}</p>
      <p><strong>Fecha:</strong> {fecha}</p>
      <p><strong>Hora:</strong> {hora}</p>
      <ul>
        {pedido.map((item, index) => (
          <li key={index}>
            {item.nombre} - Bs {item.precio}
          </li>
        ))}
      </ul>
      <p><strong>Total:</strong> Bs {total}</p>
    </div>
  );
});

export default Recibo;
