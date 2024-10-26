import React, { useState } from 'react';
import { database } from '../../../firebase'; // Asegúrate de importar la configuración de Firebase correctamente
import { ref, push } from 'firebase/database';
import './addcliente.css';

const AddCliente = () => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [carnet, setCarnet] = useState(''); // Nuevo estado para el Carnet de Identidad
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [direccion, setDireccion] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleAgregarCliente = () => {
    if (nombre && apellido && carnet && email && telefono && direccion) {
      const clienteRef = ref(database, 'clientes');
      const nuevoCliente = {
        nombre,
        apellido,
        carnet,
        email,
        telefono,
        direccion,
      };

      push(clienteRef, nuevoCliente)
        .then(() => {
          setMensaje('Cliente añadido exitosamente.');
          setNombre('');
          setApellido('');
          setCarnet('');
          setEmail('');
          setTelefono('');
          setDireccion('');
        })
        .catch((error) => {
          console.error('Error al añadir cliente:', error);
          setMensaje('Hubo un error al añadir el cliente.');
        });
    } else {
      setMensaje('Por favor, complete todos los campos.');
    }
  };

  return (
    <div className="añadir-cliente-container">
      <h2>Añadir Cliente</h2>
      {mensaje && <p className="mensaje">{mensaje}</p>}
      <form className="form-añadir-cliente">
        <label>
          Nombre:
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
          />
        </label>
        <label>
          Apellido:
          <input
            type="text"
            value={apellido}
            onChange={(e) => setApellido(e.target.value)}
            required
          />
        </label>
        <label>
          Carnet de Identidad:
          <input
            type="text"
            value={carnet}
            onChange={(e) => setCarnet(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Teléfono:
          <input
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            required
          />
        </label>
        <label>
          Dirección:
          <input
            type="text"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
          />
        </label>
        <button type="button" onClick={handleAgregarCliente} className="guardar-button">
          Guardar Cliente
        </button>
      </form>
    </div>
  );
};

export default AddCliente;
