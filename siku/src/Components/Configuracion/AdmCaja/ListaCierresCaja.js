import React, { useState, useEffect } from 'react';
import { database } from '../../../firebase';
import { ref, onValue } from 'firebase/database';
import * as XLSX from 'xlsx';
import './ListaCierresCaja.css';

const ListaCierresCaja = () => {
  const [cierres, setCierres] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [cierresFiltrados, setCierresFiltrados] = useState([]);

  useEffect(() => {
    const cierresRef = ref(database, 'cajas');
    onValue(cierresRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listaCierres = Object.values(data).filter(caja => caja.estado === 'Cerrada');
        setCierres(listaCierres);
        setCierresFiltrados(listaCierres);
      }
    });
  }, []);

  useEffect(() => {
    const resultados = cierres.filter(cierre =>
      cierre.fecha.includes(filtro) ||
      (cierre.responsable && cierre.responsable.toLowerCase().includes(filtro.toLowerCase()))
    );
    setCierresFiltrados(resultados);
  }, [filtro, cierres]);

  const handleExportarExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(cierresFiltrados);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'CierresCaja');
    XLSX.writeFile(workbook, 'CierresCaja.xlsx');
  };

  return (
    <div className="lista-cierres-container">
      <h2>Lista de Cierres de Caja</h2>

      <div className="filtro-container">
        <input
          type="text"
          placeholder="Buscar por fecha o responsable..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="filtro-input"
        />
        <button onClick={handleExportarExcel} className="exportar-button">
          Exportar a Excel
        </button>
      </div>

      <table className="tabla-cierres">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Responsable</th>
            <th>Monto Apertura (Bs)</th>
            <th>Total Ventas del Día (Bs)</th>
            <th>Monto Final (Bs)</th>
          </tr>
        </thead>
        <tbody>
          {cierresFiltrados.length > 0 ? (
            cierresFiltrados.map((cierre, index) => (
              <tr key={index}>
                <td>{cierre.fecha}</td>
                <td>{cierre.responsable}</td>
                <td>Bs {parseFloat(cierre.monto).toFixed(2)}</td>
                <td>Bs {parseFloat(cierre.totalVentasDelDia).toFixed(2)}</td>
                <td>Bs {parseFloat(cierre.montoFinal).toFixed(2)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No se encontraron cierres de caja.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListaCierresCaja;
