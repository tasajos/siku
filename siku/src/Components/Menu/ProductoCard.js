import React from 'react';
import './ProductoCard.css'; // Asegúrate de tener los estilos CSS

const ProductoCard = ({ producto, agregarAlPedido }) => {
  return (
    <div className="producto-card" onClick={() => agregarAlPedido(producto)}>
      <img src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
      <div className="producto-info">
        <h3 className="producto-nombre">{producto.nombre}</h3>
        <p className="producto-categoria">Categoría: {producto.categoria}</p>
        <p className="producto-precio">Precio: Bs {producto.precio}</p>
      </div>
    </div>
  );
};

export default ProductoCard;
