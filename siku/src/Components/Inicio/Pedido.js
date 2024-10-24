import React, { useState } from 'react';
import { database } from '../firebase';
import { ref, push } from 'firebase/database';

const Pedido = () => {
  const [pedido, setPedido] = useState([]);

  const agregarProducto = (producto) => {
    setPedido([...pedido, producto]);
  };

  const confirmarPedido = () => {
    const pedidosRef = ref(database, 'pedidos/');
    push(pedidosRef, { productos: pedido });
    setPedido([]);  // Limpiar el pedido después de enviarlo
  };

  return (
    <div>
      <h2>Tu Pedido</h2>
      <ul>
        {pedido.map((producto, index) => (
          <li key={index}>{producto.nombre}</li>
        ))}
      </ul>
      <button onClick={confirmarPedido}>Confirmar Pedido</button>
    </div>
  );
};

export default Pedido;
