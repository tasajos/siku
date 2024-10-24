import React from 'react';

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const total = pedido.reduce((acc, item) => acc + item.precio, 0);
  
  return (
    <div className="resumen-orden">
      <h2>Resumen de Orden</h2>
      <ul>
        {pedido.map((item, index) => (
          <li key={index}>
            {item.nombre} - ${item.precio}
          </li>
        ))}
      </ul>
      <div>Subtotal: ${total}</div>
      <div>Total con servicio: ${(total * 1.1).toFixed(2)}</div>
      <button onClick={cancelarPedido}>Cancelar Orden</button>
    </div>
  );
};

export default ResumenOrden;
