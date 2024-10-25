import React, { useState } from 'react';
import { database } from '../../../firebase'; // Configuración de Firebase
import { ref, onValue, update } from 'firebase/database';
import './ModificarUsuario.css';

const ModificarUsuario = () => {
  const [carnetIdentidad, setCarnetIdentidad] = useState('');
  const [usuario, setUsuario] = useState(null);
  const [usuarioId, setUsuarioId] = useState(''); // Nuevo estado para almacenar el ID del usuario
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Manejar el cambio del carnet de identidad
  const handleBuscarUsuario = () => {
    const usuariosRef = ref(database, 'usuarios');
    onValue(usuariosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Buscar el usuario que tenga el carnetIdentidad proporcionado
        const usuarioEncontrado = Object.entries(data).find(
          ([id, user]) => user.carnetIdentidad === carnetIdentidad
        );

        if (usuarioEncontrado) {
          const [id, userData] = usuarioEncontrado;
          setUsuario(userData);
          setUsuarioId(id); // Guardar el ID del usuario encontrado
          setError('');
          setMensajeExito('');
        } else {
          setUsuario(null);
          setError('Usuario no encontrado. Verifica el número de carnet.');
        }
      } else {
        setUsuario(null);
        setError('No hay usuarios registrados.');
      }
    });
  };

  // Manejar el cambio en los campos del formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUsuario((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar los cambios del usuario en Firebase
  const handleGuardarCambios = () => {
    const usuarioRef = ref(database, `usuarios/${usuarioId}`); // Usar el ID del usuario encontrado
    update(usuarioRef, usuario)
      .then(() => {
        setMensajeExito('Usuario actualizado con éxito.');
        setError('');
      })
      .catch((error) => {
        setError('Error al actualizar el usuario. Inténtalo de nuevo.');
        console.error(error);
      });
  };

  return (
    <div className="modificar-usuario-container">
      <h2>Modificar Usuario</h2>
      <div className="busqueda-container">
        <label htmlFor="carnetIdentidad">Ingrese el Carnet de Identidad:</label>
        <input
          type="text"
          id="carnetIdentidad"
          value={carnetIdentidad}
          onChange={(e) => setCarnetIdentidad(e.target.value)}
        />
        <button onClick={handleBuscarUsuario} className="buscar-button">
          Buscar
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {mensajeExito && <p className="success-message">{mensajeExito}</p>}

      {usuario && (
        <div className="usuario-form">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={usuario.nombre}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Apellidos:
            <input
              type="text"
              name="apellidos"
              value={usuario.apellidos}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={usuario.telefono}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={usuario.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Profesión:
            <input
              type="text"
              name="profesion"
              value={usuario.profesion}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Rol:
            <select name="rol" value={usuario.rol} onChange={handleInputChange}>
              <option value="Administrador">Administrador</option>
              <option value="Cajero">Cajero</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Gerente">Gerente</option>
            </select>
          </label>
          <label>
            Estado:
            <select name="estado" value={usuario.estado || 'Activo'} onChange={handleInputChange}>
              <option value="Activo">Activo</option>
              <option value="Baja">Baja</option>
            </select>
          </label>
          <button onClick={handleGuardarCambios} className="guardar-button">
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default ModificarUsuario;
