import React, { useState, useEffect } from 'react';
import { database } from '../../firebase'; // Importar Firebase
import { ref, onValue } from 'firebase/database';
import './Pagos.css'; // Estilos para la tabla

const PaginaPagos = () => {
  const [ventasPorDia, setVentasPorDia] = useState({});
  const [productosMasVendidosPorDia, setProductosMasVendidosPorDia] = useState({});

  useEffect(() => {
    const pedidosRef = ref(database, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        procesarVentas(data);
      }
    });
  }, []);

  // Función para procesar las ventas y agruparlas por día
  const procesarVentas = (pedidos) => {
    const ventasAgrupadas = {};
    const productosVendidosAgrupados = {};

    Object.values(pedidos).forEach((pedido) => {
      if (pedido.estado === 'Entregado') {
        const fecha = pedido.fecha; // Se asume que el campo 'fecha' tiene el formato 'DD/MM/AAAA'
        
        // Inicializar las ventas para ese día si no existen
        if (!ventasAgrupadas[fecha]) {
          ventasAgrupadas[fecha] = { totalVentas: 0, productosVendidos: [] };
          productosVendidosAgrupados[fecha] = {};
        }

        // Sumar el total de ventas
        ventasAgrupadas[fecha].totalVentas += parseFloat(pedido.total);

        // Agregar los productos vendidos a la lista
        pedido.menu.forEach((producto) => {
          ventasAgrupadas[fecha].productosVendidos.push(producto);
          
          // Contabilizar cuántos productos se han vendido
          if (!productosVendidosAgrupados[fecha][producto.nombre]) {
            productosVendidosAgrupados[fecha][producto.nombre] = 1;
          } else {
            productosVendidosAgrupados[fecha][producto.nombre] += 1;
          }
        });
      }
    });

    // Encontrar el producto más vendido por cada día
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
  };

  return (
    <div className="pagos-container">
      <h2>Pagos y Ventas por Día</h2>
      <table className="tabla-ventas">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Total Ventas (Bs)</th>
            <th>Productos Vendidos</th>
            <th>Producto Más Vendido</th>
            <th>Cantidad</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(ventasPorDia).map((fecha) => (
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
