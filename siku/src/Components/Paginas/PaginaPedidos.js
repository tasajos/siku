import React, { useState, useEffect } from 'react';
import { database } from '../../firebase'; // Importar Firebase
import { ref, onValue, update } from 'firebase/database';
import { Button, Card } from 'react-bootstrap'; // Usaremos componentes de Bootstrap para estilizar
import './PaginaPedido.css'; // Estilos para las tarjetas

const PaginaPedido = () => {
  const [pedidosPendientes, setPedidosPendientes] = useState([]);
  const [pedidosTrabajando, setPedidosTrabajando] = useState([]);
  const [pedidosCancelados, setPedidosCancelados] = useState([]);

  // Función para obtener los pedidos con estado "Pendiente", "Trabajando" y "Cancelado"
  useEffect(() => {
    const pedidosRef = ref(database, 'pedidos');
    onValue(pedidosRef, (snapshot) => {
      const data = snapshot.val();
      
      // Filtrar los pedidos "Pendiente"
      const pedidosPendientesFiltrados = data
        ? Object.values(data).filter((pedido) => pedido.estado === 'Pendiente')
        : [];
      setPedidosPendientes(pedidosPendientesFiltrados);
      
      // Filtrar los pedidos "Trabajando"
      const pedidosTrabajandoFiltrados = data
        ? Object.values(data).filter((pedido) => pedido.estado === 'Trabajando')
        : [];
      setPedidosTrabajando(pedidosTrabajandoFiltrados);

      // Filtrar los pedidos "Cancelado"
      const pedidosCanceladosFiltrados = data
        ? Object.values(data).filter((pedido) => pedido.estado === 'Cancelado')
        : [];
      setPedidosCancelados(pedidosCanceladosFiltrados);
    });
  }, []);

  // Función para actualizar el estado del pedido
  const actualizarEstado = (numeroPedido, nuevoEstado) => {
    const pedidoRef = ref(database, `pedidos/${numeroPedido}`);
    update(pedidoRef, { estado: nuevoEstado })
      .then(() => alert(`Pedido #${numeroPedido} actualizado a ${nuevoEstado}`))
      .catch((error) => console.error('Error al actualizar el estado del pedido: ', error));
  };

  // Función para agrupar productos por nombre en el menú
  const agruparProductos = (menu) => {
    const productosAgrupados = menu.reduce((acc, item) => {
      const existingItem = acc.find((prod) => prod.nombre === item.nombre);
      if (existingItem) {
        existingItem.cantidad += 1;
      } else {
        acc.push({ ...item, cantidad: 1 });
      }
      return acc;
    }, []);
    return productosAgrupados;
  };

  return (
    <div className="pedidos-container">
      <h2>Pedidos Pendientes</h2>
      <div className="cards-container">
        {pedidosPendientes.length > 0 ? (
          pedidosPendientes.map((pedido, index) => (
            <Card key={index} className="pedido-card">
              <Card.Body>
                <Card.Title>Pedido #{pedido.numeroPedido}</Card.Title>
                <Card.Text>Estado: {pedido.estado}</Card.Text>
                <Card.Text>Hora: {pedido.hora}</Card.Text>

                {/* Detalle del menú agrupado */}
                <Card.Text><strong>Menú:</strong></Card.Text>
                <ul className="menu-list">
                  {pedido.menu && agruparProductos(pedido.menu).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.nombre} x {item.cantidad}
                    </li>
                  ))}
                </ul>

                {/* Botones para cambiar el estado */}
                <div className="botones-pedido">
                  <Button
                    variant="warning"
                    onClick={() => actualizarEstado(pedido.numeroPedido, 'Trabajando')}
                  >
                    Trabajando
                  </Button>
                  <Button
                    variant="success"
                    onClick={() => actualizarEstado(pedido.numeroPedido, 'Entregado')}
                  >
                    Entregado
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => actualizarEstado(pedido.numeroPedido, 'Cancelado')}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No hay pedidos pendientes.</p>
        )}
      </div>

      {/* Sección para los pedidos en estado "Trabajando" */}
      <h2>Pedidos Trabajando</h2>
      <div className="cards-container">
        {pedidosTrabajando.length > 0 ? (
          pedidosTrabajando.map((pedido, index) => (
            <Card key={index} className="pedido-card">
              <Card.Body>
                <Card.Title>Pedido #{pedido.numeroPedido}</Card.Title>
                <Card.Text>Estado: {pedido.estado}</Card.Text>
                <Card.Text>Hora: {pedido.hora}</Card.Text>

                {/* Detalle del menú agrupado */}
                <Card.Text><strong>Menú:</strong></Card.Text>
                <ul className="menu-list">
                  {pedido.menu && agruparProductos(pedido.menu).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.nombre} x {item.cantidad}
                    </li>
                  ))}
                </ul>

                {/* Botones para cambiar el estado a "Entregado" o "Cancelado" */}
                <div className="botones-pedido">
                  <Button
                    variant="success"
                    onClick={() => actualizarEstado(pedido.numeroPedido, 'Entregado')}
                  >
                    Entregado
                  </Button>
                  <Button
                    variant="danger"
                    onClick={() => actualizarEstado(pedido.numeroPedido, 'Cancelado')}
                  >
                    Cancelar
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No hay pedidos en estado "Trabajando".</p>
        )}
      </div>

      {/* Sección para los pedidos en estado "Cancelado" */}
      <h2>Pedidos Cancelados</h2>
      <div className="cards-container">
        {pedidosCancelados.length > 0 ? (
          pedidosCancelados.map((pedido, index) => (
            <Card key={index} className="pedido-card">
              <Card.Body>
                <Card.Title>Pedido #{pedido.numeroPedido}</Card.Title>
                <Card.Text>Estado: {pedido.estado}</Card.Text>
                <Card.Text>Hora: {pedido.hora}</Card.Text>

                {/* Detalle del menú agrupado */}
                <Card.Text><strong>Menú:</strong></Card.Text>
                <ul className="menu-list">
                  {pedido.menu && agruparProductos(pedido.menu).map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.nombre} x {item.cantidad}
                    </li>
                  ))}
                </ul>

                {/* No mostrar botones en los pedidos cancelados */}
              </Card.Body>
            </Card>
          ))
        ) : (
          <p>No hay pedidos cancelados.</p>
        )}
      </div>
    </div>
  );
};

export default PaginaPedido;
