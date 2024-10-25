import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faList, faUserPlus, faUserEdit } from '@fortawesome/free-solid-svg-icons';
import './AdministracionUsuarios.css';

const AdministracionUsuarios = () => {
  return (
    <div className="admin-usuarios-container">
      <h2>Administración de Usuarios</h2>
      <div className="admin-usuarios-cards">
        <div className="admin-card">
          <FontAwesomeIcon icon={faList} className="admin-icon" />
          <h3>Lista de Usuarios</h3>
          <p>Consulta y visualiza la lista de todos los usuarios registrados.</p>
          <Link to="/lista-usuarios">
            <button className="admin-button">Ver Lista</button>
          </Link>
        </div>
        <div className="admin-card">
          <FontAwesomeIcon icon={faUserPlus} className="admin-icon" />
          <h3>Añadir Usuario</h3>
          <p>Agrega nuevos usuarios con sus respectivas credenciales y permisos.</p>
          <Link to="/añadir-usuario">
            <button className="admin-button">Añadir Usuario</button>
          </Link>
        </div>
        <div className="admin-card">
          <FontAwesomeIcon icon={faUserEdit} className="admin-icon" />
          <h3>Modificar Usuario</h3>
          <p>Actualiza la información de los usuarios y modifica sus permisos.</p>
          <Link to="/modificar-usuario">
            <button className="admin-button">Modificar Usuario</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdministracionUsuarios;
