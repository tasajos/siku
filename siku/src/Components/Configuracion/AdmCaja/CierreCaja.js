import React, { useState, useEffect } from 'react';
import { database } from '../../../firebase';
import { ref, onValue, update } from 'firebase/database';
import './CierreCaja.css';

const CierreCaja = () => {
  const [cajas, setCajas] = useState([]);
  const [ventasPorDia, setVentasPorDia] = useState({});

  useEffect(() => {
    const cajasRef = ref(database, 'cajas');
    onValue(cajasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCajas(Object.values(data).filter(caja => caja.estado === 'Aperturada'));
      }
    });
  }, []);

  useEffect(() => {
    const pedidosRef = ref(database, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        procesarVentas(data);
      }
    });
  }, []);

  const procesarVentas = (pedidos) => {
    const ventasAgrupadas = {};

    Object.values(pedidos).forEach((pedido) => {
      if (pedido.estado === 'Entregado') {
        const fecha = convertirFecha(pedido.fecha); // Convertir la fecha a formato "YYYY-MM-DD"
        if (!ventasAgrupadas[fecha]) {
          ventasAgrupadas[fecha] = 0;
        }
        ventasAgrupadas[fecha] += parseFloat(pedido.total || 0);
      }
    });

    setVentasPorDia(ventasAgrupadas);
  };

  // Convertir fecha a formato "YYYY-MM-DD" para consistencia
  const convertirFecha = (fecha) => {
    const [day, month, year] = fecha.split('/');
    return `${year}-${month}-${day}`;
  };

  const handleCerrarCaja = (fecha) => {
    const caja = cajas.find(c => c.fecha === fecha);
    const totalVentas = ventasPorDia[fecha] || 0;
    const montoApertura = parseFloat(caja.monto) || 0;
    const montoFinal = montoApertura + totalVentas;

    const cajaRef = ref(database, `cajas/${fecha}`);
    update(cajaRef, { 
      estado: 'Cerrada', 
      totalVentasDelDia: totalVentas,
      montoFinal: montoFinal 
    })
      .then(() => {
        alert(`Caja del ${fecha} ha sido cerrada con un monto final de Bs ${montoFinal.toFixed(2)}.`);
      })
      .catch((error) => {
        console.error('Error al cerrar la caja:', error);
      });
  };

  return (
    <div className="cierre-caja-container">
      <h2>Cierre de Caja</h2>
      <div className="cajas-list">
        {cajas.length > 0 ? (
          cajas.map((caja) => (
            <div key={caja.fecha} className="caja-card">
              <h3>Caja del {caja.fecha}</h3>
              <p><strong>Responsable:</strong> {caja.responsable}</p>
              <p><strong>Aperturado por:</strong> {caja.aperturadoPor}</p>
              <p><strong>Monto Aperturado:</strong> Bs {parseFloat(caja.monto).toFixed(2)}</p>
              <p><strong>Ventas del Día:</strong> Bs {ventasPorDia[caja.fecha] ? ventasPorDia[caja.fecha].toFixed(2) : '0.00'}</p>
              <button
                className="cerrar-caja-button"
                onClick={() => handleCerrarCaja(caja.fecha)}
              >
                Cerrar Caja
              </button>
            </div>
          ))
        ) : (
          <p>No hay cajas aperturadas.</p>
        )}
      </div>
    </div>
  );
};

export default CierreCaja;
