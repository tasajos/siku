import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons'; // Importa el ícono de papelera
import { Button, Modal } from 'react-bootstrap'; // Importar los componentes de Bootstrap

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal

  const total = pedido.reduce((acc, item) => acc + item.precio, 0);

  // Funciones para abrir y cerrar el modal
  const handleShow = () => setShowModal(true);
  const handleClose = () => setShowModal(false);

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
      <div>Total con servicio: Bs {(total * 1.1).toFixed(2)}</div>
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
          <p>Total con servicio: Bs {(total * 1.1).toFixed(2)}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cerrar
          </Button>
          <Button variant="primary" onClick={() => alert('Pago realizado!')}>
            Confirmar Pago
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResumenOrden;
