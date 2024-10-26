import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUserPlus, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import './AdministracionClientes.css';

const AdministracionClientes = () => {
  return (
    <div className="admin-clientes-container">
      <h2>Administración de Clientes</h2>
      <div className="admin-clientes-cards">
        <div className="admin-card">
          <FontAwesomeIcon icon={faUsers} className="admin-icon" />
          <h3>Lista de Clientes</h3>
          <p>Consulta y visualiza la lista de todos los clientes registrados.</p>
          <Link to="/lista-clientes">
            <button className="admin-button">Ver Lista</button>
          </Link>
        </div>
        <div className="admin-card">
          <FontAwesomeIcon icon={faUserPlus} className="admin-icon" />
          <h3>Añadir Cliente</h3>
          <p>Agrega nuevos clientes con sus datos de contacto y detalles relevantes.</p>
          <Link to="/add-clientes">
            <button className="admin-button">Añadir Cliente</button>
          </Link>
        </div>
        <div className="admin-card">
          <FontAwesomeIcon icon={faUserEdit} className="admin-icon" />
          <h3>Modificar Cliente</h3>
          <p>Actualiza la información de los clientes y ajusta sus datos según sea necesario.</p>
          <Link to="/mod-clientes">
            <button className="admin-button">Modificar Cliente</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdministracionClientes;
