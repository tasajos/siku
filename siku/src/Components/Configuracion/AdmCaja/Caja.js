import React, { useState, useEffect } from 'react';
import { database } from '../../../firebase';
import { ref, onValue, set, update } from 'firebase/database';
import './Caja.css';

const Caja = () => {
  const [fecha, setFecha] = useState('');
  const [monto, setMonto] = useState('');
  const [responsable, setResponsable] = useState('');
  const [aperturadoPor, setAperturadoPor] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [cajaAperturada, setCajaAperturada] = useState(false);

  // Verificar si la caja ya ha sido aperturada para la fecha
  useEffect(() => {
    if (fecha) {
      const cajaRef = ref(database, `cajas/${fecha}`);
      onValue(cajaRef, (snapshot) => {
        if (snapshot.exists()) {
          setCajaAperturada(true);
          setMensaje('La caja ya fue aperturada para esta fecha.');
        } else {
          setCajaAperturada(false);
          setMensaje('');
        }
      });
    }
  }, [fecha]);

  // Función para manejar la apertura de la caja
  const handleAperturarCaja = () => {
    if (fecha && monto && responsable && aperturadoPor) {
      const cajaRef = ref(database, `cajas/${fecha}`);
      const nuevaCaja = {
        fecha,
        monto,
        responsable,
        aperturadoPor,
        estado: 'Aperturada'
      };

      set(cajaRef, nuevaCaja)
        .then(() => {
          update(ref(database, 'cajas/aperturaActiva'), { activa: true, monto: monto });
          setMensaje('Caja aperturada con éxito.');
          setCajaAperturada(true);
        })
        .catch((error) => {
          setMensaje('Error al aperturar la caja. Inténtalo de nuevo.');
          console.error(error);
        });
    } else {
      setMensaje('Por favor, completa todos los campos.');
    }
  };

  return (
    <div className="caja-container">
      <h2>Aperturar Caja</h2>

      {mensaje && <p className={`mensaje ${cajaAperturada ? 'error' : 'exito'}`}>{mensaje}</p>}

      {!cajaAperturada ? (
        <form>
          <label>
            Fecha:
            <input
              type="date"
              value={fecha}
              onChange={(e) => setFecha(e.target.value)}
              required
            />
          </label>
          <label>
            Monto Inicial:
            <input
              type="number"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
          </label>
          <label>
            Responsable:
            <input
              type="text"
              value={responsable}
              onChange={(e) => setResponsable(e.target.value)}
              required
            />
          </label>
          <label>
            Aperturado por:
            <input
              type="text"
              value={aperturadoPor}
              onChange={(e) => setAperturadoPor(e.target.value)}
              required
            />
          </label>
          <button
            type="button"
            className="aperturar-button"
            onClick={handleAperturarCaja}
          >
            Aperturar Caja
          </button>
        </form>
      ) : (
        <p>La caja ya ha sido aperturada para esta fecha.</p>
      )}
    </div>
  );
};

export default Caja;
