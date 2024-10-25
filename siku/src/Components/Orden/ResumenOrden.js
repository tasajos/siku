import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de papelera
import { Button, Modal, Form } from 'react-bootstrap'; // Importar los componentes de Bootstrap
import { database } from '../../firebase'; // Asegúrate de importar Firebase
import { ref, set, push, onValue } from 'firebase/database'; // Firebase methods

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [billete, setBillete] = useState(0); // Estado para almacenar el billete ingresado
  const [cambio, setCambio] = useState(0); // Estado para almacenar el cambio
  const [numPedido, setNumPedido] = useState(0); // Estado para el número de pedido

  const total = pedido.reduce((acc, item) => acc + item.precio, 0);
  const totalConServicio = (total * 1.1).toFixed(2); // Total con 10% de servicio

  // Funciones para abrir y cerrar el modal
  const handleShow = () => {
    obtenerUltimoNumeroPedido(); // Obtener el número de pedido antes de abrir el modal
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setBillete(0); // Reiniciar el campo de billete
    setCambio(0); // Reiniciar el cambio
  };

  // Función para manejar el cambio del billete ingresado
  const handleBilleteChange = (e) => {
    const valorIngresado = parseFloat(e.target.value);
    setBillete(valorIngresado);

    // Calcular el cambio
    const calculoCambio = valorIngresado - totalConServicio;
    setCambio(calculoCambio > 0 ? calculoCambio.toFixed(2) : 0);
  };

  // Función para registrar el pedido en Firebase
  const registrarPedido = () => {
    const pedidoRef = ref(database, `pedidos/${numPedido}`);

    const nuevoPedido = {
      numeroPedido: numPedido,
      estado: "Pendiente",
      total: totalConServicio,
      menu: pedido,
      cambio: cambio,
    };

    set(pedidoRef, nuevoPedido)
      .then(() => {
        alert('Pedido registrado con éxito');
        handleClose();
      })
      .catch((error) => {
        console.error('Error al registrar el pedido: ', error);
      });
  };

  // Obtener el último número de pedido y autoincrementar
  const obtenerUltimoNumeroPedido = () => {
    const pedidosRef = ref(database, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        const ultimoNumero = Math.max(...keys.map(key => parseInt(key))); // Obtiene el último número de pedido
        setNumPedido(ultimoNumero + 1); // Autoincrementa el número de pedido
      } else {
        setNumPedido(1); // Si no hay pedidos previos, empieza desde 1
      }
    });
  };

  return (
    <div className="resumen-orden">
      <h2>Resumen de Orden</h2>
      <ul>
        {pedido.map((item, index) => (
          <li key={index}>
            {item.nombre} - Bs {item.precio}
          </li>
        ))}
      </ul>
      <div>Subtotal: Bs {total}</div>
      <div>Total con servicio: Bs {totalConServicio}</div>
      <br />

      {/* Contenedor para alinear los botones */}
      <div className="botones-orden" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Botón para abrir el modal de pago */}
        <Button variant="success" onClick={handleShow}>
          Pagar
        </Button>

        {/* Icono de papelera para cancelar la orden */}
        <FontAwesomeIcon 
          icon={faTrash} 
          onClick={cancelarPedido} 
          className="icono-cancelar" 
          size="2x" 
          style={{ cursor: 'pointer', color: '#d9534f' }} 
        />
      </div>

      {/* Modal de Bootstrap para mostrar el total a pagar */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Total a Pagar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Subtotal: Bs {total}</p>
          <p>Total con servicio: Bs {totalConServicio}</p>

          {/* Campo para ingresar el billete */}
          <Form.Group>
            <Form.Label>Monto a Pagar (Bs):</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={billete}
              onChange={handleBilleteChange}
              placeholder="Ingrese el monto recibido"
            />
          </Form.Group>

          {/* Mostrar el cambio */}
          <p>Cambio: Bs {cambio}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          {/* Deshabilitar el botón si el billete es menor que el total */}
          <Button 
            variant="primary" 
            onClick={registrarPedido} 
            disabled={billete < totalConServicio}
          >
            Confirmar Pago
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResumenOrden;
