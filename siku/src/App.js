import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaMenu from './Components/Paginas/PaginaMenu';
import PaginaPedido from './Components/Paginas/PaginaPedidos';
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
        {/* Encabezado maneja la búsqueda y actualiza el estado global */}
        <Encabezado onSearch={manejarBusqueda} />
        <div className="contenido">
          <BarraLateral />
          <Routes>
            {/* Pasamos el filtro a PaginaMenu */}
            <Route path="/menu" element={<PaginaMenu filtro={filtro} />} />
            <Route path="/pedidos" element={<PaginaPedido />} />
            {/* Otras rutas aquí */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
