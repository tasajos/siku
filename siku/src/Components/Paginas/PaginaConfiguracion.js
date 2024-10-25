import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faCashRegister, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import './Configuracion.css';

const Configuracion = () => {
  return (
    <div className="configuracion-container">
      <h2></h2>
      <div className="configuracion-cards">
      <br></br>
        <div className="config-card">
          <FontAwesomeIcon icon={faUsers} className="config-icon" />
          <br></br>
          <h3>Administración de Usuarios</h3>
          <p>Gestión de permisos y control de acceso de los usuarios.</p>
          <Link to="/adm-usuario">
            <button className="config-button">Acceder</button>
          </Link>
        </div>
        <div className="config-card">
          <FontAwesomeIcon icon={faCashRegister} className="config-icon" />
          <br></br>
          <h3>Administración de Caja</h3>
    
          <p>Configuración de caja, historial de movimientos y cierres.</p>
          <Link to="/admin-caja">
            <button className="config-button">Acceder</button>
          </Link>
        </div>
        <div className="config-card">
          <FontAwesomeIcon icon={faUserFriends} className="config-icon" />
          <br></br>
          <h3>Administración de Clientes</h3>
          <p>Gestión de clientes, registro y seguimiento de datos.</p>
          <Link to="/admin-clientes">
            <button className="config-button">Acceder</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Configuracion;
