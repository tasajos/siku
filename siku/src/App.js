import logo from './logo.svg';
import './App.css';
import React from 'react';
import Header from './Components/Inicio/Header';
import Menu from './Components/Inicio/Menu';
import Pedido from './Components/Inicio/Pedido';
import Footer from './Components/Inicio/Footer';


function App() {
  return (
    <div className="App">
      <Header />
      <Menu />
      <Pedido />
      <Footer />
    </div>
  );
}

export default App;
