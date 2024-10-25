import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const Encabezado = ({ onSearch }) => {
  const [busqueda, setBusqueda] = useState('');
  const [fechaHora, setFechaHora] = useState('');

  // Función para actualizar la fecha y hora
  useEffect(() => {
    const actualizarFechaHora = () => {
      const fechaActual = new Date();
      const opcionesFecha = { year: 'numeric', month: 'long', day: 'numeric' };
      const opcionesHora = { hour: '2-digit', minute: '2-digit', second: '2-digit' };

      const fechaFormateada = fechaActual.toLocaleDateString('es-BO', opcionesFecha);
      const horaFormateada = fechaActual.toLocaleTimeString('es-BO', opcionesHora);

      setFechaHora(`${fechaFormateada} ${horaFormateada}`);
    };

    // Actualiza la fecha y hora cada segundo
    const intervalId = setInterval(actualizarFechaHora, 1000);

    return () => clearInterval(intervalId); // Limpia el intervalo cuando el componente se desmonta
  }, []);

  const manejarCambio = (event) => {
    const valorBusqueda = event.target.value;
    setBusqueda(valorBusqueda);
    onSearch(valorBusqueda); // Llama a la función de búsqueda del padre (App.js)
  };

  return (
    <nav className="navbar navbar-light bg-light p-3">
      <div className="navbar-brand">POS - SIKU - Chakuy</div>

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

      {/* Agregar fecha y hora al encabezado */}
      <div className="ml-auto">
        <span>{fechaHora}</span>
      </div>
    </nav>
  );
};

export default Encabezado;
