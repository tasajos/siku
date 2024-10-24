import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de papelera

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const total = pedido.reduce((acc, item) => acc + item.precio, 0);

  return (
    <div className="resumen-orden">
      <h2>Resumen de Orden</h2>
      <ul>
        {pedido.map((item, index) => (
          <li key={index}>
            {item.nombre} - Bs {item.precio}
          </li>
        ))}
      </ul>
      <div>Subtotal: Bs {total}</div>
      <div>Total con servicio: Bs {(total * 1.1).toFixed(2)}</div>
      <br />
      {/* Icono de papelera para cancelar la orden */}
      <FontAwesomeIcon 
        icon={faTrash} 
        onClick={cancelarPedido} 
        className="icono-cancelar" 
        size="2x" 
        style={{ cursor: 'pointer', color: '#d9534f' }} 
      />
    </div>
  );
};

export default ResumenOrden;
