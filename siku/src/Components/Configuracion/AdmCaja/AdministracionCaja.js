import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faListAlt, faCashRegister, faLock, faChartLine } from '@fortawesome/free-solid-svg-icons';
import './AdministracionCaja.css';

const AdministracionCaja = () => {
  return (
    <div className="admin-caja-container">
      <h2>Administración de Caja</h2>
      <div className="admin-caja-cards">
        <div className="admin-card">
          <FontAwesomeIcon icon={faListAlt} className="admin-icon" />
          <h3>Lista de Cierres</h3>
          <p>Consulta los cierres de caja anteriores y sus detalles.</p>
          <Link to="/lista-cierres">
            <button className="admin-button">Ver Lista</button>
          </Link>
        </div>
        <div className="admin-card">
          <FontAwesomeIcon icon={faCashRegister} className="admin-icon" />
          <h3>Caja</h3>
          <p>Visualiza el estado actual de la caja y realiza ajustes.</p>
          <Link to="/cajas">
            <button className="admin-button">Acceder a Caja</button>
          </Link>
        </div>
        <div className="admin-card">
          <FontAwesomeIcon icon={faLock} className="admin-icon" />
          <h3>Cierre de Caja</h3>
          <p>Realiza el cierre de caja al final del día.</p>
          <Link to="/cierrecajas">
            <button className="admin-button">Cerrar Caja</button>
          </Link>
        </div>
        <div className="admin-card">
          <FontAwesomeIcon icon={faChartLine} className="admin-icon" />
          <h3>Reporte Diario</h3>
          <p>Genera un reporte diario de ingresos y egresos.</p>
          <Link to="/reporte-diario">
            <button className="admin-button">Ver Reporte</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdministracionCaja;
