import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { database } from '../../../firebase'; // Asegúrate de que tu configuración de Firebase esté importada
import { ref, set } from 'firebase/database';
import './AgregarUsuario.css';

const AgregarUsuario = () => {
  const [nombre, setNombre] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [carnetIdentidad, setCarnetIdentidad] = useState('');
  const [profesion, setProfesion] = useState('');
  const [rol, setRol] = useState('Administrador');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const auth = getAuth();

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      // Registrar los datos del usuario en la base de datos
      const userRef = ref(database, `usuarios/${userId}`);
      await set(userRef, {
        nombre,
        apellidos,
        telefono,
        email,
        carnetIdentidad,
        profesion,
        rol,
      });

      setSuccess('Usuario creado exitosamente.');
      // Limpiar campos
      setNombre('');
      setApellidos('');
      setTelefono('');
      setEmail('');
      setPassword('');
      setCarnetIdentidad('');
      setProfesion('');
      setRol('Administrador');
    } catch (error) {
      setError('Error al crear el usuario. Inténtalo de nuevo.');
    }
  };

  return (
    <div className="agregar-usuario-container">
      <h2>Agregar Usuario</h2>
      {error && <p className="error-message">{error}</p>}
      {success && <p className="success-message">{success}</p>}
      <form onSubmit={handleAddUser} className="form-usuario">
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Apellidos:</label>
          <input
            type="text"
            value={apellidos}
            onChange={(e) => setApellidos(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Teléfono:</label>
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Correo Electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Carnet de Identidad:</label>
          <input
            type="text"
            value={carnetIdentidad}
            onChange={(e) => setCarnetIdentidad(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Profesión:</label>
          <input
            type="text"
            value={profesion}
            onChange={(e) => setProfesion(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Rol:</label>
          <select value={rol} onChange={(e) => setRol(e.target.value)} required>
            <option value="Administrador">Administrador</option>
            <option value="Cajero">Cajero</option>
            <option value="Supervisor">Supervisor</option>
            <option value="Gerente">Gerente</option>
            <option value="Presentacion">Presentacion</option>
          </select>
        </div>
        <button type="submit" className="agregar-button">Agregar Usuario</button>
      </form>
    </div>
  );
};

export default AgregarUsuario;
