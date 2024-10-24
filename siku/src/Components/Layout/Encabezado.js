import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Encabezado = ({ onSearch }) => {
  const [busqueda, setBusqueda] = useState('');

  const manejarCambio = (event) => {
    const valorBusqueda = event.target.value;
    setBusqueda(valorBusqueda);
    onSearch(valorBusqueda); // Llama a la función de búsqueda del padre (App.js)
  };

  return (
    <nav className="navbar navbar-light bg-light p-3">
      <div className="navbar-brand">POS</div>

      <div className="input-group w-50">
        <input
          type="text"
          className="form-control"
          placeholder="Buscar producto o pedido..."
          value={busqueda}
          onChange={manejarCambio}
        />
        <div className="input-group-append">
          <span className="input-group-text">
            <FontAwesomeIcon icon={faSearch} />
          </span>
        </div>
      </div>
    </nav>
  );
};

export default Encabezado;
