import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de papelera
import { Button, Modal, Form } from 'react-bootstrap'; // Importar los componentes de Bootstrap
import { database } from '../../firebase'; // Asegúrate de importar Firebase
import { ref, set, onValue } from 'firebase/database'; // Firebase methods
import Recibo from './Recibo'; // Importar el componente Recibo
import { useReactToPrint } from 'react-to-print'; // Para imprimir el recibo

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal
  const [showReciboModal, setShowReciboModal] = useState(false); // Estado para mostrar el modal del recibo
  const [showErrorModal, setShowErrorModal] = useState(false); // Estado para controlar el modal de error
  const [billete, setBillete] = useState(0); // Estado para almacenar el billete ingresado
  const [cambio, setCambio] = useState(0); // Estado para almacenar el cambio
  const [numPedido, setNumPedido] = useState(0); // Estado para el número de pedido
  const [fecha, setFecha] = useState(''); // Estado para la fecha
  const [hora, setHora] = useState(''); // Estado para la hora

  const reciboRef = useRef(); // Referencia para el recibo

  const total = pedido.reduce((acc, item) => acc + item.precio, 0);
  const totalConServicio = total; // Total sin servicio adicional

  // Función para imprimir el recibo
  const handlePrint = useReactToPrint({
    content: () => reciboRef.current,
  });

  // Funciones para abrir y cerrar el modal
  const handleShow = () => {
    if (total === 0) {
      setShowErrorModal(true); // Mostrar modal de error si el subtotal es 0
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

  const handleReciboClose = () => setShowReciboModal(false);

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
    const fecha = fechaActual.toLocaleDateString('es-BO', { timeZone: 'America/La_Paz' });
    const hora = fechaActual.toLocaleTimeString('es-BO', opciones);
    setFecha(fecha);
    setHora(hora);
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
      hora,
      fecha
    };

    set(pedidoRef, nuevoPedido)
      .then(() => {
        alert('Pedido registrado con éxito');
        setShowReciboModal(true); // Mostrar el modal con el recibo
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
    obtenerFechaYHora(); // Obtener la fecha y hora actual
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

      <div className="botones-orden" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
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
      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Pedido inválido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>El monto no puede ser igual a 0. Por favor, seleccione productos antes de continuar.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowErrorModal(false)}>
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para el recibo */}
      <Modal show={showReciboModal} onHide={handleReciboClose}>
        <Modal.Header closeButton>
          <Modal.Title>Recibo del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Recibo 
            ref={reciboRef}
            pedido={pedido}
            total={totalConServicio}
            numPedido={numPedido}
            fecha={fecha}
            hora={hora}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleReciboClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={handlePrint}>
            Imprimir Recibo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResumenOrden;
