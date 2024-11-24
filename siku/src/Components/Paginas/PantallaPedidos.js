import React, { useState, useEffect } from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import './PantallaPedidos.css';

const PantallaPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [hoy, setHoy] = useState('');
  const [direccionVideo, setDireccionVideo] = useState('');

  useEffect(() => {
    // Obtener la fecha de hoy en formato "DD/MM/YYYY"
    const fechaActual = new Date();
    const dia = String(fechaActual.getDate()).padStart(2, '0');
    const mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    const año = fechaActual.getFullYear();
    setHoy(`${dia}/${mes}/${año}`);

    // Obtener pedidos entregados
    const pedidoRef = ref(database, 'pedidos');
    onValue(pedidoRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const pedidosEntregados = Object.values(data)
          .filter(
            (pedido) =>
              pedido.estado === 'Entregado' && pedido.fecha === `${dia}/${mes}/${año}`
          )
          .slice(-3); // Obtener los últimos tres
        setPedidos(pedidosEntregados);
      }
    });

    // Obtener dirección del video
    const configRef = ref(database, 'config/pantallaPresentacion');
    onValue(configRef, (snapshot) => {
      const data = snapshot.val();
      if (data && data.direccionVideo) {
        setDireccionVideo(data.direccionVideo);
      }
    });
  }, []);

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        window.location.href = '/login';
      })
      .catch((error) => {
        console.error('Error al cerrar sesión:', error);
      });
  };

  return (
    <div className="pantalla-container">
      {/* Botón para cerrar sesión */}
      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button" title="Cerrar sesión">
          Cerrar Sesión
        </button>
      </div>

      {/* Sección izquierda para video */}
      <div className="video-container">
        {direccionVideo ? (
          <iframe
            width="100%"
            height="100%"
            src={direccionVideo}
            title="Video"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="video-iframe"
          ></iframe>
        ) : (
          <p>Cargando video...</p>
        )}
      </div>

      {/* Sección derecha para pedidos */}
      <div className="pedidos-container">
        <h2>Pedidos</h2>
        {pedidos.map((pedido, index) => (
          <div
            key={index}
            className={`pedido-item ${index === pedidos.length - 1 ? 'ultimo-pedido' : ''}`}
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
