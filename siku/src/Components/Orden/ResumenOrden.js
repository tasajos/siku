import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal, Form } from 'react-bootstrap';
import { database } from '../../firebase';
import { ref, onValue, set } from 'firebase/database';
import Recibo from './Recibo';
import jsPDF from 'jspdf';

const ResumenOrden = ({ pedido, cancelarPedido }) => {
  const [showModal, setShowModal] = useState(false);
  const [showReciboModal, setShowReciboModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [billete, setBillete] = useState(0);
  const [cambio, setCambio] = useState(0);
  const [numPedido, setNumPedido] = useState(0);
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [cajaEstado, setCajaEstado] = useState(''); // 'activa', 'cerrada', 'no_apertura'
  const [montoApertura, setMontoApertura] = useState(0);

  useEffect(() => {
    const obtenerFechaActual = () => {
      const fechaActual = new Date();
      const dia = String(fechaActual.getDate()).padStart(2, '0');
      const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
      const año = fechaActual.getFullYear();
      return `${año}-${mes}-${dia}`;
    };

    const fechaHoy = obtenerFechaActual();
    const cajaRef = ref(database, `cajas/${fechaHoy}`);

    onValue(cajaRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        if (data.estado === 'Aperturada') {
          setCajaEstado('activa');
          setMontoApertura(data.monto);
        } else {
          setCajaEstado('cerrada');
        }
      } else {
        setCajaEstado('no_apertura');
      }
    });
  }, []);

  const total = pedido.reduce((acc, item) => acc + item.precio, 0);
  const totalConServicio = total;

  const handleGeneratePDF = () => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [226, 600], // Tamaño de recibo ajustado
    });
  
    doc.setFont("courier", "normal");
    doc.setFontSize(10);
  
    // Agrupar productos por nombre
    const productosAgrupados = {};
    pedido.forEach((item) => {
      if (productosAgrupados[item.nombre]) {
        productosAgrupados[item.nombre].cantidad += 1;
        productosAgrupados[item.nombre].total += item.precio;
      } else {
        productosAgrupados[item.nombre] = {
          nombre: item.nombre,
          precio: item.precio,
          cantidad: 1,
          total: item.precio,
        };
      }
    });
  
    // Encabezado del recibo
    doc.text("PRINCIPAL", 113, 20, null, null, "center");
    doc.setFontSize(8);
    doc.text(`Recibo No: ${numPedido}`, 10, 40);
    doc.text(`Fecha: ${fecha}`, 10, 50);
    doc.text(`Hora: ${hora}`, 10, 60);
  
    // Encabezado de productos
    doc.text("PRODUCTO", 10, 80);
    doc.text("CANT", 90, 80);
    doc.text("P.UNI", 130, 80);
    doc.text("TOTAL", 180, 80);
  
    // Línea de separación
    doc.line(10, 85, 216, 85);
  
    // Detalle de productos agrupados
    let yPosition = 95;
    Object.values(productosAgrupados).forEach((item) => {
      doc.text(item.nombre, 10, yPosition);
      doc.text(`${item.cantidad}`, 90, yPosition);
      doc.text(`Bs ${item.precio.toFixed(2)}`, 130, yPosition);
      doc.text(`Bs ${item.total.toFixed(2)}`, 180, yPosition);
      yPosition += 10;
    });
  
    // Línea de separación antes del total
    doc.line(10, yPosition, 216, yPosition);
    yPosition += 10;
  
    // Total a pagar
    doc.setFontSize(10);
    doc.text(`TOTAL A PAGAR: Bs ${totalConServicio.toFixed(2)}`, 10, yPosition);
    yPosition += 15;
  
    // Pie de página con detalles del software
    yPosition += 20;
    doc.setFontSize(6);
    doc.text("Software: SIKU", 113, yPosition, null, null, "center");
    doc.text("Desarrollado por Chakuy", 113, yPosition + 10, null, null, "center");
  
    // Abrir el PDF en una nueva pestaña para vista previa e impresión
    window.open(doc.output("bloburl"), "_blank");
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
    setFecha(fechaActual.toLocaleDateString('es-BO', { timeZone: 'America/La_Paz' }));
    setHora(fechaActual.toLocaleTimeString('es-BO', opciones));
  };

  
   

  const obtenerUltimoNumeroPedido = () => {
    const pedidosRef = ref(database, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const keys = Object.keys(data);
        const ultimoNumero = Math.max(...keys.map(key => parseInt(key)));
        setNumPedido(ultimoNumero); // Asignamos el último número sin incremento
      } else {
        setNumPedido(1);
      }
    });
    obtenerFechaYHora();
  };
  
  const registrarPedido = () => {
    const pedidoRef = ref(database, `pedidos/${numPedido + 1}`); // Incrementamos aquí el número para el registro
    const nuevoPedido = {
      numeroPedido: numPedido + 1, // Usamos numPedido + 1 al registrar en la base de datos
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
        setNumPedido(numPedido + 1); // Actualizamos numPedido en el estado después de registrar
        setShowReciboModal(true);
        handleClose();
      })
      .catch((error) => {
        console.error('Error al registrar el pedido: ', error);
      });
  };
  
  

  const getMensajeCaja = () => {
    if (cajaEstado === 'cerrada') return 'Caja Cerrada';
    if (cajaEstado === 'no_apertura') return 'No hay caja aperturada';
    if (cajaEstado === 'activa') return `Monto de Apertura de Caja: Bs ${parseFloat(montoApertura).toFixed(2)}`;
    return '';
  };

  return (
    <div className="resumen-orden">
      <h2>Resumen de Orden</h2>
      <p style={{ color: cajaEstado === 'cerrada' ? 'red' : cajaEstado === 'no_apertura' ? 'blue' : 'green' }}>
        {getMensajeCaja()}
      </p>
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
          disabled={cajaEstado !== 'activa'} // Deshabilitar si la caja no está activa
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
            Ver/Imprimir Recibo
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResumenOrden;
