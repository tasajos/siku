import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome, faUtensils, faMoneyBillAlt, faClipboardList, faCog, faPlusCircle, faSignOutAlt, faChevronDown,
  faHamburger, faPizzaSlice
} from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from 'firebase/auth';
import { database } from '../../firebase'; // Firebase para obtener datos del usuario
import { ref, onValue } from 'firebase/database';
import './BarraLateral.css';
import logo from '../../assets/logo_cha.png';

const BarraLateral = () => {
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const [userRole, setUserRole] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userRoleRef = ref(database, `usuarios/${user.uid}/rol`); // Cambiado a 'usuarios'
      onValue(userRoleRef, (snapshot) => {
        const role = snapshot.val();
        setUserRole(role);
      });
    }
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigate('/login');
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  const toggleSubmenu = () => {
    setSubmenuVisible(!submenuVisible);
  };

  const isAdminOrManager = userRole === 'Administrador' || userRole === 'Gerente';
  const isCashier = userRole === 'Cajero';
  const isSupervisor = userRole === 'Supervisor';

  return (
    <aside className="barra-lateral bg-danger text-light">
      <div className="logo text-center mt-3">
        <img src={logo} alt="Logo SIKU" className="logo-img mb-3" style={{ width: '100px', height: '100px' }} />
      </div>
      <ul className="list-unstyled mt-4">
        <li>
          <Link to="/" className="nav-link text-light">
            <FontAwesomeIcon icon={faHome} className="mr-2" />
            Inicio
          </Link>
        </li>

        {(isAdminOrManager || isCashier || isSupervisor) && (
          <li>
            <Link to="/menu" className="nav-link text-light">
              <FontAwesomeIcon icon={faUtensils} className="mr-2" />
              Menú
            </Link>
          </li>
        )}

        {(isAdminOrManager || isCashier) && (
          <li>
            <Link to="/pagos" className="nav-link text-light">
              <FontAwesomeIcon icon={faMoneyBillAlt} className="mr-2" />
              Pago
            </Link>
          </li>
        )}

        <li>
          <Link to="/pedidos" className="nav-link text-light">
            <FontAwesomeIcon icon={faClipboardList} className="mr-2" />
            Pedidos
          </Link>
        </li>

        {isAdminOrManager && (
          <li>
            <Link to="/configuracion" className="nav-link text-light">
              <FontAwesomeIcon icon={faCog} className="mr-2" />
              Configuración
            </Link>
          </li>
        )}

        {(isAdminOrManager || isSupervisor) && (
          <li>
            <button onClick={toggleSubmenu} className="nav-link text-light btn btn-link d-flex align-items-center">
              <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
              Configuración Menú
              <FontAwesomeIcon icon={faChevronDown} className={`ml-auto ${submenuVisible ? 'rotate-icon' : ''}`} />
            </button>
            {submenuVisible && (
              <ul className="submenu">
                <li>
                  <Link to="/agregar-menu" className="submenu-link">
                    <FontAwesomeIcon icon={faHamburger} className="mr-2" />
                    Nuevo Producto
                  </Link>
                </li>
                <li>
                  <Link to="/nueva-categoria" className="submenu-link">
                    <FontAwesomeIcon icon={faPizzaSlice} className="mr-2" />
                    Nueva Categoría
                  </Link>
                </li>
                <li>
                  <Link to="/listar-menu" className="submenu-link">
                    <FontAwesomeIcon icon={faPizzaSlice} className="mr-2" />
                    Edicion Menu
                  </Link>
                </li>
              </ul>
            )}
          </li>
        )}

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
