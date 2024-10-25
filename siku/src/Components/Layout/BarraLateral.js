import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Usamos useNavigate para redirigir
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faUtensils, faMoneyBillAlt, faClipboardList, faCog, faPlusCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons'; // Añadir el icono de cerrar sesión
import { getAuth, signOut } from 'firebase/auth'; // Importar Firebase Authentication
import './BarraLateral.css';
import logo from '../../assets/logo_cha.png'; // Importar el logo

const BarraLateral = () => {
  const navigate = useNavigate(); // Usamos navigate para redirigir al usuario

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Redirigir al login una vez que se haya cerrado la sesión
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <aside className="barra-lateral bg-danger text-light">
      <div className="logo text-center mt-3">
        {/* Agregar el logo */}
        <img src={logo} alt="Logo SIKU" className="logo-img mb-3" style={{ width: '100px', height: '100px' }} />
        <h2 className="text-center"></h2>
      </div>
      <ul className="list-unstyled mt-4">
        <li>
          <Link to="/" className="nav-link text-light">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Inicio
          </Link>
        </li>
        <li>
          <Link to="/menu" className="nav-link text-light">
            <FontAwesomeIcon icon={faUtensils} className="mr-2" />
            Menú
          </Link>
        </li>
        <li>
          <Link to="/pagos" className="nav-link text-light">
            <FontAwesomeIcon icon={faMoneyBillAlt} className="mr-2" />
            Pago
          </Link>
        </li>
        <li>
          <Link to="/pedidos" className="nav-link text-light">
            <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
            Pedidos
          </Link>
        </li>
        <li>
          <Link to="/configuracion" className="nav-link text-light">
            <FontAwesomeIcon icon={faCog} className="mr-2" />
            Configuración
          </Link>
        </li>
        <li>
          <Link to="/agregar-menu" className="nav-link text-light">
            <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
            Agregar Menú
          </Link>
        </li>
        {/* Botón para cerrar sesión */}
        <li>
          <button onClick={handleLogout} className="nav-link text-light btn btn-link">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Cerrar Sesión
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default BarraLateral;
