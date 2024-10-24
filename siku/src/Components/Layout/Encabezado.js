import React from 'react';

const Encabezado = () => {
  const fechaActual = new Date().toLocaleDateString();
  return (
    <nav className="encabezado">
      <div className="logo">POS</div>
      <input type="text" placeholder="Buscar producto o pedido..." />
      <div className="fecha">{fechaActual}</div>
    </nav>
  );
};

export default Encabezado;
