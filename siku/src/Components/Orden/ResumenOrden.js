import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de papelera
import { Button, Modal, Form } from 'react-bootstrap'; // Importar los componentes de Bootstrap
import { database } from '../../firebase'; // Asegúrate de importar Firebase
import { ref, set, onValue } from 'firebase/database'; // Firebase methods

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para controlar el modal de error
  const [billete, setBillete] = useState(0); // Estado para almacenar el billete ingresado
  const [cambio, setCambio] = useState(0); // Estado para almacenar el cambio
  const [numPedido, setNumPedido] = useState(0); // Estado para el número de pedido

  const total = pedido.reduce((acc, item) => acc + item.precio, 0);
  const totalConServicio = total; // Total sin servicio adicional

  // Funciones para abrir y cerrar el modal
  const handleShow = () => {
    if (total === 0) {
      // Mostrar modal de error si el subtotal es 0
      setShowErrorModal(true);
    } else {
      obtenerUltimoNumeroPedido(); // Obtener el número de pedido antes de abrir el modal
      setShowModal(true);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setBillete(0); // Reiniciar el campo de billete
    setCambio(0); // Reiniciar el cambio
  };

  // Función para manejar el cierre del modal de error
  const handleErrorClose = () => setShowErrorModal(false);

  // Función para manejar el cambio del billete ingresado
  const handleBilleteChange = (e) => {
    const valorIngresado = parseFloat(e.target.value);
    setBillete(valorIngresado);

    // Calcular el cambio
    const calculoCambio = valorIngresado - totalConServicio;
    setCambio(calculoCambio > 0 ? calculoCambio.toFixed(2) : 0);
  };

  // Función para obtener la fecha y hora en formato HH:MM para la hora boliviana
  const obtenerFechaYHora = () => {
    const fechaActual = new Date();
    const opciones = { timeZone: 'America/La_Paz', hour: '2-digit', minute: '2-digit' };
    return fechaActual.toLocaleTimeString('es-BO', opciones);
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
      hora: obtenerFechaYHora(), // Agregar la hora al pedido
      fecha: new Date().toLocaleDateString('es-BO', { timeZone: 'America/La_Paz' }) // Fecha actual
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
      <div>Total con servicio: Bs {totalConServicio}</div> {/* Ahora el servicio es 0 */}
      <br />

      {/* Contenedor para alinear los botones */}
      <div className="botones-orden" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {/* Botón para abrir el modal de pago */}
        <Button 
          variant="success" 
          onClick={handleShow}
          disabled={total === 0} // Deshabilitar el botón si el subtotal es 0
        >
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

      {/* Modal de error para pedido inválido */}
      <Modal show={showErrorModal} onHide={handleErrorClose}>
        <Modal.Header closeButton>
          <Modal.Title>Pedido inválido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El monto no puede ser igual a 0. Por favor, seleccione productos antes de continuar.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleErrorClose}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResumenOrden;
