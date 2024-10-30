import React, { useState, useEffect } from 'react';
import { Card, Button, Form } from 'react-bootstrap';
import { database } from '../../firebase'; // Importar Firebase
import { ref, onValue, update } from 'firebase/database';
import './ListarMenu.css'; // Estilos personalizados

const ListarMenu = () => {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const productosRef = ref(database, 'productos');
    onValue(productosRef, (snapshot) => {
      const data = snapshot.val();
      const productosArray = data ? Object.entries(data).map(([id, details]) => ({ id, ...details })) : [];
      setProductos(productosArray);
    });
  }, []);

  const handleEstadoChange = (id, nuevoEstado) => {
    const productoRef = ref(database, `productos/${id}`);
    update(productoRef, { disponible: nuevoEstado });
  };

  const handlePrecioChange = (id, nuevoPrecio) => {
    const productoRef = ref(database, `productos/${id}`);
    update(productoRef, { precio: parseFloat(nuevoPrecio) });
  };

  return (
    <div className="listar-menu-container">
      <h2>Lista de Productos del Menú</h2>
      <div className="productos-grid">
        {productos.map((producto) => (
          <Card key={producto.id} className="producto-card">
            <Card.Img variant="top" src={producto.imagen} alt={producto.nombre} className="producto-imagen" />
            <Card.Body>
              <Card.Title>{producto.nombre}</Card.Title>
              <Form.Group controlId={`precio-${producto.id}`} className="precio-group">
                <Form.Label>Precio (Bs)</Form.Label>
                <Form.Control
                  type="number"
                  value={producto.precio}
                  onChange={(e) => handlePrecioChange(producto.id, e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId={`estado-${producto.id}`} className="estado-group">
                <Form.Label>Estado</Form.Label>
                <Form.Control
                  as="select"
                  value={producto.disponible ? 'Disponible' : 'No disponible'}
                  onChange={(e) => handleEstadoChange(producto.id, e.target.value === 'Disponible')}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="No disponible">No disponible</option>
                </Form.Control>
              </Form.Group>
              <Button variant="primary" onClick={() => alert('Producto actualizado con éxito')}>Actualizar</Button>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ListarMenu;
