import React from 'react';

const ProductoCard = ({ producto, agregarAlPedido }) => {
  return (
    <div className="producto-card" onClick={() => agregarAlPedido(producto)}>
      <img src={producto.imagen} alt={producto.nombre} />
      <h3>{producto.nombre}</h3>
      <p>Categoría: {producto.categoria}</p>
      <p>Precio: ${producto.precio}</p>
    </div>
  );
};

export default ProductoCard;
