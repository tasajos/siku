import React, { useState, useEffect } from 'react';
import { database } from '../../../firebase'; // Configuración de Firebase
import { ref, onValue } from 'firebase/database';
import './ListaUsuarios.css';

const ListaUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState('');

  // Obtener usuarios de Firebase
  useEffect(() => {
    const usuariosRef = ref(database, 'usuarios');
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const usuariosArray = Object.values(data);
        setUsuarios(usuariosArray);
      }
    });
  }, []);

  // Filtrar usuarios según el término de búsqueda
  const usuariosFiltrados = usuarios.filter((usuario) =>
    usuario.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.apellidos.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.email.toLowerCase().includes(busqueda.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div className="lista-usuarios-container">
      <h2>Lista de Usuarios</h2>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido, email o rol..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="search-input"
        />
      </div>
      <table className="usuarios-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Apellidos</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Carnet</th>
            <th>Profesión</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          {usuariosFiltrados.map((usuario, index) => (
            <tr key={index}>
              <td>{usuario.nombre}</td>
              <td>{usuario.apellidos}</td>
              <td>{usuario.telefono}</td>
              <td>{usuario.email}</td>
              <td>{usuario.carnetIdentidad}</td>
              <td>{usuario.profesion}</td>
              <td>{usuario.rol}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {usuariosFiltrados.length === 0 && (
        <p className="no-results">No se encontraron resultados.</p>
      )}
    </div>
  );
};

export default ListaUsuarios;
