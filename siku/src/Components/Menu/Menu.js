import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ProductoCard from './ProductoCard';
import './Menu.css';

const Menu = ({ agregarAlPedido, filtro }) => {
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState('tarjetas'); // Estado para la vista seleccionada

  useEffect(() => {
    const productosRef = ref(database, 'productos/');
    onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      const listaProductos = data ? Object.values(data) : [];
      
      // Filtrar productos que están disponibles
      const productosDisponibles = listaProductos.filter(producto => producto.disponible === true);
      
      setProductos(productosDisponibles);
    });
  }, []);

  // Filtrar productos según el valor del filtro de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div>
      <div className="vista-selector">
        <label>
          <input
            type="radio"
            name="vista"
            value="tarjetas"
            checked={vista === 'tarjetas'}
            onChange={() => setVista('tarjetas')}
          />
          Tarjetas
        </label>
        <label>
          <input
            type="radio"
            name="vista"
            value="lista"
            checked={vista === 'lista'}
            onChange={() => setVista('lista')}
          />
          Lista
        </label>
      </div>

      {vista === 'tarjetas' ? (
        <div className="menu-tarjetas">
          {productosFiltrados.map((producto, index) => (
            <ProductoCard key={index} producto={producto} agregarAlPedido={agregarAlPedido} />
          ))}
        </div>
      ) : (
        <ul className="menu-lista">
          {productosFiltrados.map((producto, index) => (
            <li key={index} className="producto-lista-item" onClick={() => agregarAlPedido(producto)}>
              <div className="producto-lista-info">
                <h3 className="producto-nombre">{producto.nombre}</h3>
                <p className="producto-categoria">Categoría: {producto.categoria}</p>
                <p className="producto-precio">Precio: Bs {producto.precio}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Menu;
