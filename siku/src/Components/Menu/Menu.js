import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import ProductoCard from './ProductoCard';
import './Menu.css';

const Menu = ({ agregarAlPedido, filtro }) => {
  const [productos, setProductos] = useState([]);
  const [vista, setVista] = useState('tarjetas');

  useEffect(() => {
    const productosRef = ref(database, 'productos/');
    onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      const listaProductos = data ? Object.values(data) : [];
      const productosDisponibles = listaProductos.filter((producto) => producto.disponible === true);
      setProductos(productosDisponibles);
    });
  }, []);

  // Filtrar productos según el valor del filtro de búsqueda
  const productosFiltrados = productos.filter((producto) =>
    producto.nombre.toLowerCase().includes(filtro.toLowerCase())
  );

  // Agrupar productos por categoría
  const productosPorCategoria = productosFiltrados.reduce((acc, producto) => {
    const { categoria } = producto;
    if (!acc[categoria]) acc[categoria] = [];
    acc[categoria].push(producto);
    return acc;
  }, {});

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
        <div className="menu-lista-columnas">
          {Object.keys(productosPorCategoria).map((categoria) => (
            <div key={categoria} className="categoria-columna">
              <h3 className="categoria-titulo">{categoria}</h3>
              <ul className="producto-lista">
                {productosPorCategoria[categoria].map((producto, index) => (
                  <li key={index} className="producto-lista-item" onClick={() => agregarAlPedido(producto)}>
                    <div className="producto-lista-info">
                      <h4 className="producto-nombre">{producto.nombre}</h4>
                      <p className="producto-precio">Precio: Bs {producto.precio}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Menu;
