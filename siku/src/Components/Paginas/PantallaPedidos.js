import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import './PantallaPedidos.css';

const PantallaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [hoy, setHoy] = useState('');

  useEffect(() => {
    // Obtener la fecha de hoy en formato "DD/MM/YYYY"
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const año = fechaActual.getFullYear();
    setHoy(`${dia}/${mes}/${año}`);

    const pedidoRef = ref(database, 'pedidos');
    onValue(pedidoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        // Filtrar los pedidos entregados de hoy
        const pedidosEntregados = Object.values(data)
          .filter(
            (pedido) => pedido.estado === 'Entregado' && pedido.fecha === `${dia}/${mes}/${año}`
          )
          .slice(-3); // Obtener los últimos tres
        setPedidos(pedidosEntregados);
      }
    });
  }, []);

  return (
    <div className="pantalla-container">
      {/* Sección izquierda para video o iframe */}
      <div className="video-container">
        <iframe
          width="100%"
          height="100%"
          src="https://www.youtube.com/embed/cb63BReoXIo?si=9QpzJuDKfG0M5N4u"
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="video-iframe"
        ></iframe>
      </div>

      {/* Sección derecha para pedidos */}
      <div className="pedidos-container">
        <h2>Pedidos</h2>
        {pedidos.map((pedido, index) => (
          <div
            key={index}
            className={`pedido-item ${
              index === pedidos.length - 1 ? 'ultimo-pedido' : ''
            }`}
          >
            <h3>Pedido #{pedido.numeroPedido}</h3>
            
            <h4>{pedido.modoEntrega}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PantallaPedidos;
