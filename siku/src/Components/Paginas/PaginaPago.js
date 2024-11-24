import React, { useState, useEffect } from 'react';
import { database } from '../../firebase'; // Importar Firebase
import { ref, onValue } from 'firebase/database';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faFilePdf } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf'; // Biblioteca para generar PDFs
import 'jspdf-autotable'; // Plugin para tablas en PDFs
import * as XLSX from 'xlsx'; // Biblioteca para generar archivos Excel
import './Pagos.css'; // Estilos para la tabla

const PaginaPagos = () => {
  const [ventasPorDia, setVentasPorDia] = useState({});
  const [productosMasVendidosPorDia, setProductosMasVendidosPorDia] = useState({});
  const [fechasDisponibles, setFechasDisponibles] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');

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
    const productosVendidosAgrupados = {};
    const fechas = new Set();

    Object.values(pedidos).forEach((pedido) => {
      if (pedido.estado === 'Entregado') {
        const fecha = pedido.fecha;
        fechas.add(fecha);

        if (!ventasAgrupadas[fecha]) {
          ventasAgrupadas[fecha] = { totalVentas: 0, productosVendidos: [] };
          productosVendidosAgrupados[fecha] = {};
        }

        ventasAgrupadas[fecha].totalVentas += parseFloat(pedido.total);

        pedido.menu.forEach((producto) => {
          ventasAgrupadas[fecha].productosVendidos.push(producto);

          if (!productosVendidosAgrupados[fecha][producto.nombre]) {
            productosVendidosAgrupados[fecha][producto.nombre] = 1;
          } else {
            productosVendidosAgrupados[fecha][producto.nombre] += 1;
          }
        });
      }
    });

    const productosMasVendidos = {};
    Object.keys(productosVendidosAgrupados).forEach((fecha) => {
      const productos = productosVendidosAgrupados[fecha];
      let productoMasVendido = null;
      let maxVentas = 0;

      Object.keys(productos).forEach((producto) => {
        if (productos[producto] > maxVentas) {
          productoMasVendido = producto;
          maxVentas = productos[producto];
        }
      });

      productosMasVendidos[fecha] = { nombre: productoMasVendido, cantidad: maxVentas };
    });

    setVentasPorDia(ventasAgrupadas);
    setProductosMasVendidosPorDia(productosMasVendidos);
    setFechasDisponibles(Array.from(fechas).sort());
  };

  const handleFechaSeleccionada = (e) => {
    setFechaSeleccionada(e.target.value);
  };

  const exportToExcel = () => {
    const data = Object.keys(ventasPorDia)
      .filter((fecha) => !fechaSeleccionada || fecha === fechaSeleccionada)
      .map((fecha) => ({
        Fecha: fecha,
        'Total Ventas (Bs)': ventasPorDia[fecha].totalVentas.toFixed(2),
        'Productos Vendidos': ventasPorDia[fecha].productosVendidos
          .map((producto) => `${producto.nombre} - Bs ${producto.precio}`)
          .join(', '),
        'Producto Más Vendido': productosMasVendidosPorDia[fecha]?.nombre || '',
        'Cantidad Más Vendida': productosMasVendidosPorDia[fecha]?.cantidad || 0,
      }));

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Ventas');
    XLSX.writeFile(workbook, 'Reporte_Ventas.xlsx');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.text('Reporte de Ventas', 14, 20);

    const rows = Object.keys(ventasPorDia)
      .filter((fecha) => !fechaSeleccionada || fecha === fechaSeleccionada)
      .map((fecha) => [
        fecha,
        ventasPorDia[fecha].totalVentas.toFixed(2),
        ventasPorDia[fecha].productosVendidos
          .map((producto) => `${producto.nombre} - Bs ${producto.precio}`)
          .join(', '),
        productosMasVendidosPorDia[fecha]?.nombre || '',
        productosMasVendidosPorDia[fecha]?.cantidad || 0,
      ]);

    doc.autoTable({
      head: [['Fecha', 'Total Ventas (Bs)', 'Productos Vendidos', 'Producto Más Vendido', 'Cantidad Más Vendida']],
      body: rows,
      startY: 30,
    });

    doc.save('Reporte_Ventas.pdf');
  };

  return (
    <div className="pagos-container">
      <h2>Reporte de Ventas</h2>

      <div className="fecha-selector">
        <label htmlFor="fecha">Seleccionar Fecha:</label>
        <select id="fecha" value={fechaSeleccionada} onChange={handleFechaSeleccionada}>
          <option value="">Todas las fechas</option>
          {fechasDisponibles.map((fecha) => (
            <option key={fecha} value={fecha}>
              {fecha}
            </option>
          ))}
        </select>
      </div>

      <div className="botonera-exportar">
        <button onClick={exportToExcel} title="Descargar en Excel" className="icon-button icon-excel">
          <FontAwesomeIcon icon={faFileExcel} />
        </button>
        <button onClick={exportToPDF} title="Descargar en PDF" className="icon-button icon-pdf">
          <FontAwesomeIcon icon={faFilePdf} />
        </button>
      </div>

      <table className="tabla-ventas">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total Ventas (Bs)</th>
            <th>Productos Vendidos</th>
            <th>Producto Más Vendido</th>
            <th>Cantidad Producto Más Vendido</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(ventasPorDia)
            .filter((fecha) => !fechaSeleccionada || fecha === fechaSeleccionada)
            .map((fecha) => (
              <tr key={fecha}>
                <td>{fecha}</td>
                <td>{ventasPorDia[fecha].totalVentas.toFixed(2)}</td>
                <td>
                  {ventasPorDia[fecha].productosVendidos.map((producto, index) => (
                    <div key={index}>
                      {producto.nombre} - Bs {producto.precio}
                    </div>
                  ))}
                </td>
                <td>{productosMasVendidosPorDia[fecha]?.nombre}</td>
                <td>{productosMasVendidosPorDia[fecha]?.cantidad}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default PaginaPagos;
