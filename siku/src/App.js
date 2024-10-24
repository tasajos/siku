import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PaginaMenu from './Components/Paginas/PaginaMenu';
import Encabezado from './Components/Layout/Encabezado';
import BarraLateral from './Components/Layout/BarraLateral';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Encabezado />
        <div className="contenido">
          <BarraLateral />
          <Routes>
            <Route path="/menu" element={<PaginaMenu />} />
            {/* Otras rutas aquí */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
