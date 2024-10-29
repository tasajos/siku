import React, { useState } from 'react';
import { database } from '../../../firebase'; // Configuración de Firebase
import { ref, onValue, update } from 'firebase/database';
import './ModificarCliente.css';

const ModificarCliente = () => {
  const [carnetIdentidad, setCarnetIdentidad] = useState('');
  const [cliente, setCliente] = useState(null);
  const [clienteId, setClienteId] = useState(''); // Estado para almacenar el ID del cliente
  const [error, setError] = useState('');
  const [mensajeExito, setMensajeExito] = useState('');

  // Buscar cliente por carnet de identidad
  const handleBuscarCliente = () => {
    const clientesRef = ref(database, 'clientes');
    onValue(clientesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const clienteEncontrado = Object.entries(data).find(
          ([id, client]) => client.carnet === carnetIdentidad
        );

        if (clienteEncontrado) {
          const [id, clientData] = clienteEncontrado;
          setCliente(clientData);
          setClienteId(id);
          setError('');
          setMensajeExito('');
        } else {
          setCliente(null);
          setError('Cliente no encontrado. Verifica el número de carnet.');
        }
      } else {
        setCliente(null);
        setError('No hay clientes registrados.');
      }
    });
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Guardar cambios del cliente en Firebase
  const handleGuardarCambios = () => {
    const clienteRef = ref(database, `clientes/${clienteId}`);
    update(clienteRef, cliente)
      .then(() => {
        setMensajeExito('Cliente actualizado con éxito.');
        setError('');
      })
      .catch((error) => {
        setError('Error al actualizar el cliente. Inténtalo de nuevo.');
        console.error(error);
      });
  };

  return (
    <div className="modificar-usuario-container">
      <h2>Modificar Cliente</h2>
      <div className="busqueda-container">
        <label htmlFor="carnetIdentidad">Ingrese el Carnet de Identidad:</label>
        <input
          type="text"
          id="carnetIdentidad"
          value={carnetIdentidad}
          onChange={(e) => setCarnetIdentidad(e.target.value)}
        />
        <button onClick={handleBuscarCliente} className="buscar-button">
          Buscar
        </button>
      </div>

      {error && <p className="error-message">{error}</p>}
      {mensajeExito && <p className="success-message">{mensajeExito}</p>}

      {cliente && (
        <div className="usuario-form">
          <label>
            Nombre:
            <input
              type="text"
              name="nombre"
              value={cliente.nombre}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Apellido:
            <input
              type="text"
              name="apellido"
              value={cliente.apellido}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Carnet de Identidad:
            <input
              type="text"
              name="carnet"
              value={cliente.carnet}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Teléfono:
            <input
              type="text"
              name="telefono"
              value={cliente.telefono}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Email:
            <input
              type="email"
              name="email"
              value={cliente.email}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Dirección:
            <input
              type="text"
              name="direccion"
              value={cliente.direccion}
              onChange={handleInputChange}
            />
          </label>
          <button onClick={handleGuardarCambios} className="guardar-button">
            Guardar Cambios
          </button>
        </div>
      )}
    </div>
  );
};

export default ModificarCliente;
