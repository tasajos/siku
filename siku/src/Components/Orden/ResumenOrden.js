import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import { database } from '../../firebase';
import { ref, set, onValue } from 'firebase/database';
import Recibo from './Recibo';
import jsPDF from 'jspdf'; // Importar jsPDF para generar el PDF

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const [showModal, setShowModal] = useState(false);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [billete, setBillete] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [numPedido, setNumPedido] = useState(0);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');

  const total = pedido.reduce((acc, item) => acc + item.precio, 0);
  const totalConServicio = total;

  // Función para generar el PDF del recibo
  const handleGeneratePDF = () => {
    const doc = new jsPDF();
    
    // Título del recibo
    doc.setFontSize(16);
    doc.text('Recibo del Pedido', 20, 20);

    // Detalles del pedido
    doc.setFontSize(12);
    doc.text(`Número de Pedido: ${numPedido}`, 20, 30);
    doc.text(`Fecha: ${fecha}`, 20, 40);
    doc.text(`Hora: ${hora}`, 20, 50);
    
    // Listado de productos
    doc.text('Detalle del Pedido:', 20, 60);
    pedido.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.nombre} - Bs ${item.precio}`, 20, 70 + index * 10);
    });

    // Total
    doc.text(`Total: Bs ${totalConServicio}`, 20, 80 + pedido.length * 10);

    // Descargar el PDF
    doc.save(`Recibo_Pedido_${numPedido}.pdf`);
  };

  const handleShow = () => {
    if (total === 0) {
      setShowErrorModal(true);
    } else {
      obtenerUltimoNumeroPedido(); 
      setShowModal(true);
    }
  };

  // Agrupar pedidos por producto
const groupedPedido = pedido.reduce((acc, item) => {
  const found = acc.find(i => i.nombre === item.nombre);
  if (found) {
    found.cantidad += 1;
    found.subtotal += item.precio;
  } else {
    acc.push({ ...item, cantidad: 1, subtotal: item.precio });
  }
  return acc;
}, []);


  const handleClose = () => {
    setShowModal(false);
    setBillete(0); 
    setCambio(0); 
  };

  const handleReciboClose = () => setShowReciboModal(false);

  const handleBilleteChange = (e) => {
    const valorIngresado = parseFloat(e.target.value);
    setBillete(valorIngresado);
    const calculoCambio = valorIngresado - totalConServicio;
    setCambio(calculoCambio > 0 ? calculoCambio.toFixed(2) : 0);
  };

  const obtenerFechaYHora = () => {
    const fechaActual = new Date();
    const opciones = { timeZone: 'America/La_Paz', hour: '2-digit', minute: '2-digit' };
    const fecha = fechaActual.toLocaleDateString('es-BO', { timeZone: 'America/La_Paz' });
    const hora = fechaActual.toLocaleTimeString('es-BO', opciones);
    setFecha(fecha);
    setHora(hora);
  };

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
        setShowReciboModal(true); 
        handleClose();
      })
      .catch((error) => {
        console.error('Error al registrar el pedido: ', error);
      });
  };

  const obtenerUltimoNumeroPedido = () => {
    const pedidosRef = ref(database, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        const ultimoNumero = Math.max(...keys.map(key => parseInt(key)));
        setNumPedido(ultimoNumero + 1);
      } else {
        setNumPedido(1);
      }
    });
    obtenerFechaYHora();
  };

  return (
    <div className="resumen-orden">
      <h2>Resumen de Orden</h2>
      <ul>
        {groupedPedido.map((item, index) => (
          <li key={index}>
            {item.nombre} - Cantidad: {item.cantidad} - Subtotal: Bs {item.subtotal.toFixed(2)}
          </li>
        ))}
      </ul>
      <div>Subtotal: Bs {total}</div>
      <div>Total con servicio: Bs {totalConServicio}</div>
      <br />
  
      <div className="botones-orden" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '10px' }}>
        <Button 
          variant="success" 
          onClick={handleShow}
          disabled={total === 0}
        >
          Pagar
        </Button>
  
        <FontAwesomeIcon 
          icon={faTrash} 
          onClick={cancelarPedido} 
          className="icono-cancelar" 
          size="2x" 
          style={{ cursor: 'pointer', color: '#d9534f' }} 
        />
      </div>
  
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Total a Pagar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Subtotal: Bs {total}</p>
          <p>Total con servicio: Bs {totalConServicio}</p>

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

      <Modal show={showReciboModal} onHide={handleReciboClose}>
        <Modal.Header closeButton>
          <Modal.Title>Recibo del Pedido</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Recibo 
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
          <Button variant="primary" onClick={handleGeneratePDF}>
            Descargar Recibo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResumenOrden;
