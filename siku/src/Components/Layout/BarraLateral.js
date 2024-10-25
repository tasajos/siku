import React from 'react';
import { Link } from 'react-router-dom';

const BarraLateral = () => {
  return (
    <aside className="barra-lateral">
      <ul>
        <li><Link to="/">Inicio</Link></li>
        <li><Link to="/menu">Menú</Link></li>
        <li><Link to="/pagos">Pago</Link></li>
        <li><Link to="/pedidos">Pedidos</Link></li>
        <li><Link to="/configuracion">Configuración</Link></li>
      </ul>
    </aside>
  );
};

export default BarraLateral;
