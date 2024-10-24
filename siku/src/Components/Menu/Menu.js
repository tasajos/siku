import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ProductoCard from './ProductoCard';
import './Menu.css';

const Menu = ({ agregarAlPedido, filtro }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosRef = ref(database, 'productos/');
    onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      const listaProductos = data ? Object.values(data) : [];
      setProductos(listaProductos);
    });
  }, []);

  // Filtrar productos según el valor del filtro
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="menu">
      {productosFiltrados.map((producto, index) => (
        <ProductoCard key={index} producto={producto} agregarAlPedido={agregarAlPedido} />
      ))}
    </div>
  );
};

export default Menu;
