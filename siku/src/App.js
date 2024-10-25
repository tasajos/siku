import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import PaginaMenu from './Components/Paginas/PaginaMenu';
import PaginaPedido from './Components/Paginas/PaginaPedidos';
import PaginaConfiguracion from './Components/Paginas/PaginaConfiguracion';
import Pagos from './Components/Paginas/PaginaPago'; 
import AgregarMenu from './Components/Menu/AgregarMenu';
import Encabezado from './Components/Layout/Encabezado';
import BarraLateral from './Components/Layout/BarraLateral';
import Login from './Components/Login/Login';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Authentication

/////ADM usuarios
import Admusuarios from './Components/Configuracion/AdmUsuarios/AdministracionUsuarios';
import Addusuarios from './Components/Configuracion/AdmUsuarios/AgregarUsuario';
import Listusuarios from './Components/Configuracion/AdmUsuarios/ListaUsuarios';
import Modusuarios from './Components/Configuracion/AdmUsuarios/ModificarUsuario';

/////ADM clientes
import Admclientes from './Components/Configuracion/AdmClientes/AdministracionClientes';
/////ADM caja
import Admccajas from './Components/Configuracion/AdmCaja/AdministracionCaja';
import Cajas from './Components/Configuracion/AdmCaja/Caja';
import CierreCajas from './Components/Configuracion/AdmCaja/CierreCaja';
import './App.css';

function App() {
  const [filtro, setFiltro] = useState(''); // Estado del filtro global
  const [user, setUser] = useState(null); // Estado para guardar la autenticación

  // Verificar autenticación cuando la app se carga
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Guardamos al usuario si está autenticado
    });
    return () => unsubscribe(); // Limpiamos el efecto cuando el componente se desmonta
  }, []);

  // Función para manejar la búsqueda y actualizar el estado del filtro
  const manejarBusqueda = (busqueda) => {
    setFiltro(busqueda);
  };

  // Si el usuario no está autenticado, mostramos la página de Login
  if (!user) {
    return (
      <Router>
        <Routes>
          <Route path="*" element={<Login />} />
        </Routes>
      </Router>
    );
  }

  return (
    <Router>
      <div className="App">
        <Encabezado onSearch={manejarBusqueda} />
        <div className="contenido">
          {/* Barra lateral al 30% */}
          <BarraLateral />
          {/* Contenido principal al 70% */}
          <div className="contenido-principal">
            <Routes>
              <Route path="/menu" element={<PaginaMenu filtro={filtro} />} />
              <Route path="/pedidos" element={<PaginaPedido />} />
              <Route path="/pagos" element={<Pagos />} />
              <Route path="/agregar-menu" element={<AgregarMenu />} />
              <Route path="/configuracion" element={<PaginaConfiguracion />} />
              <Route path="/adm-usuario" element={<Admusuarios />} />
              <Route path="/add-usuario" element={<Addusuarios />} />
              <Route path="/list-usuario" element={<Listusuarios />} />
              <Route path="/mod-usuario" element={<Modusuarios />} />
              <Route path="/adm-clientes" element={<Admclientes />} />
              <Route path="/cajas" element={<Cajas />} />
              <Route path="/cierrecajas" element={<CierreCajas />} />
              <Route path="/adm-caja" element={<Admccajas />} />
              <Route path="/login" element={<Navigate to="/" />} /> {/* Redirigir si ya está autenticado */}
              <Route path="*" element={<Navigate to="/menu" />} /> {/* Redirigir a menú por defecto */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
