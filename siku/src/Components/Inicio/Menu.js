import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';

const Menu = () => {
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
    <div>
      <h2>Menú</h2>
      <ul>
        {productos.map((producto, index) => (
          <li key={index}>
            {producto.nombre} - ${producto.precio}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Menu;
