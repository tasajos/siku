import React, { useState, useEffect } from 'react';
import { database } from '../../firebase';
import { ref, onValue } from 'firebase/database';
import './ReporteVentas.css';

const ReporteVentas = () => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [ventasDelDia, setVentasDelDia] = useState(0); // Total ventas del día
  const [cajaAperturada, setCajaAperturada] = useState(null); // Datos de la caja

  // Obtener la fecha actual en formato "YYYY-MM-DD"
  const obtenerFechaActual = () => {
    const fecha = new Date();
    return fecha.toISOString().split('T')[0];
  };

  useEffect(() => {
    setFechaSeleccionada(obtenerFechaActual());
  }, []);

  useEffect(() => {
    if (fechaSeleccionada) {
     

      // Leer datos de la caja para la fecha seleccionada (sin cambiar su comportamiento actual)
      const cajaRef = ref(database, `cajas/${fechaSeleccionada}`);
      onValue(
        cajaRef,
        (snapshot) => {
          if (snapshot.exists()) {
            setCajaAperturada(snapshot.val());
          } else {
            setCajaAperturada(null);
          }
        },
        (error) => {
          console.error('Error al leer la caja:', error);
          setCajaAperturada(null);
        }
      );
    }
  }, [fechaSeleccionada]);

  return (
    <div className="reporte-ventas-container">
      <h2>Reporte de Ventas</h2>

      {/* Selector de fecha */}
      <div className="fecha-selector">
        <label htmlFor="fecha">Seleccionar Fecha:</label>
        <input
          type="date"
          id="fecha"
          value={fechaSeleccionada}
          onChange={(e) => setFechaSeleccionada(e.target.value)}
        />
      </div>

      {/* Información de ventas */}
      <div className="ventas-info">
        <h3>Total Ventas del Día:</h3>
        <p>
          Bs{' '}
          {cajaAperturada && cajaAperturada.totalVentasDelDia
            ? cajaAperturada.totalVentasDelDia.toFixed(2)
            : ventasDelDia.toFixed(2)}
        </p>
      </div>

    

      {/* Estado de la caja */}
      <div className="caja-info">
        <h3>Estado de la Caja:</h3>
        {cajaAperturada ? (
          <div>
            <p>
              <strong>Monto Inicial:</strong> Bs {cajaAperturada.monto}
            </p>
            <p>
              <strong>Total Ventas del Día:</strong> Bs{' '}
              {cajaAperturada.totalVentasDelDia}
            </p>
            <p>
              <strong>Monto Final:</strong> Bs {cajaAperturada.montoFinal}
            </p>
            <p>
              <strong>Responsable:</strong> {cajaAperturada.responsable}
            </p>
            <p>
              <strong>Aperturado por:</strong> {cajaAperturada.aperturadoPor}
            </p>
          </div>
        ) : (
          <p>No se ha aperturado la caja para esta fecha.</p>
        )}
      </div>
    </div>
  );
};

export default ReporteVentas;
