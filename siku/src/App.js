import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaMenu from './Components/Paginas/PaginaMenu';
import PaginaPedido from './Components/Paginas/PaginaPedidos';
import Pagos from './Components/Paginas/PaginaPago'; 
import AgregarMenu from './Components/Menu/AgregarMenu';
import Encabezado from './Components/Layout/Encabezado';
import BarraLateral from './Components/Layout/BarraLateral';
import './App.css';

function App() {
  const [filtro, setFiltro] = useState(''); // Estado del filtro global

  // Función para manejar la búsqueda y actualizar el estado del filtro
  const manejarBusqueda = (busqueda) => {
    setFiltro(busqueda);
  };

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
              {/* Otras rutas aquí */}
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;