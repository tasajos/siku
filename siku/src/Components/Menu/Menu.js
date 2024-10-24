import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ProductoCard from './ProductoCard';
import './Menu.css'; // Asegúrate de tener los estilos CSS

const Menu = ({ agregarAlPedido }) => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosRef = ref(database, 'productos/');
    onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      const listaProductos = data ? Object.values(data) : [];
      setProductos(listaProductos);
    });
  }, []);

  return (
    <div className="menu">
      {productos.map((producto, index) => (
        <ProductoCard key={index} producto={producto} agregarAlPedido={agregarAlPedido} />
      ))}
    </div>
  );
};

export default Menu;
