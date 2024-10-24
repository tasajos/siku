import React, { useState } from 'react';
import Menu from '../Menu/Menu';
import ResumenOrden from '../Orden/ResumenOrden';

const PaginaMenu = () => {
  const [pedido, setPedido] = useState([]);

  const agregarAlPedido = (producto) => {
    setPedido([...pedido, producto]);
  };

  const cancelarPedido = () => {
    setPedido([]);
  };

  return (
    <div className="pagina-menu">
      <Menu agregarAlPedido={agregarAlPedido} />
      <ResumenOrden pedido={pedido} cancelarPedido={cancelarPedido} />
    </div>
  );
};

export default PaginaMenu;
