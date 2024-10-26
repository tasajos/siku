import React, { useState, useEffect } from 'react';
import { database } from '../../../firebase'; // Configuración de Firebase
import { ref, onValue } from 'firebase/database';
import './ListadoClientes.css';

const ListaClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Obtener clientes de Firebase
  useEffect(() => {
    const clientesRef = ref(database, 'clientes');
    onValue(clientesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const clientesArray = Object.values(data);
        setClientes(clientesArray);
      }
    });
  }, []);

  // Filtrar clientes según el término de búsqueda
  const clientesFiltrados = clientes.filter((cliente) =>
    cliente.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.carnet.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="lista-clientes-container">
      <h2>Lista de Clientes</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, email o carnet..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
      </div>
      <table className="clientes-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Carnet</th>
            <th>Dirección</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map((cliente, index) => (
            <tr key={index}>
              <td>{cliente.nombre}</td>
              <td>{cliente.apellido}</td>
              <td>{cliente.telefono}</td>
              <td>{cliente.email}</td>
              <td>{cliente.carnet}</td>
              <td>{cliente.direccion}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {clientesFiltrados.length === 0 && (
        <p className="no-results">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default ListaClientes;
