import React, { useState } from 'react';
import Menu from '../Menu/Menu';
import ResumenOrden from '../Orden/ResumenOrden';

const PaginaMenu = ({ filtro }) => { // Recibe el filtro como prop desde App.js
  const [pedido, setPedido] = useState([]);

  const agregarAlPedido = (producto) => {
    setPedido([...pedido, producto]);
  };

  const cancelarPedido = () => {
    setPedido([]);
  };

  return (
    <div className="pagina-menu">
      {/* El filtro se pasa al menú */}
      <Menu agregarAlPedido={agregarAlPedido} filtro={filtro} />
      <ResumenOrden pedido={pedido} cancelarPedido={cancelarPedido} />
    </div>
  );
};

export default PaginaMenu;
