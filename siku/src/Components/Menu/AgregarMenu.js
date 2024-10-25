import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap'; // Utilizamos Bootstrap para los estilos
import { database, storage } from '../../firebase'; // Firebase database y storage
import { ref, set, push } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import './AgregarMenu.css'; // Para estilos similares a Burger King

const AgregarMenu = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null);
  const [urlImagen, setUrlImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);

  // Función para manejar la subida de la imagen
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageReference = storageRef(storage, `menu/${file.name}`);
      const uploadTask = uploadBytesResumable(storageReference, file);

      setSubiendo(true);

      // Monitorear la subida
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Puedes agregar un progreso de subida aquí si quieres
        },
        (error) => {
          console.error('Error al subir la imagen:', error);
        },
        () => {
          // Obtener URL de la imagen una vez subida
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrlImagen(downloadURL);
            setSubiendo(false);
          });
        }
      );
    }
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    if (nombre && precio && urlImagen) {
      const productoRef = push(ref(database, 'productos'));
      const nuevoProducto = {
        nombre,
        precio: parseFloat(precio), // Convertir el precio a número
        imagen: urlImagen,
      };

      set(productoRef, nuevoProducto)
        .then(() => {
          alert('Producto añadido con éxito');
          setNombre('');
          setPrecio('');
          setImagen(null);
          setUrlImagen('');
        })
        .catch((error) => {
          console.error('Error al añadir el producto:', error);
        });
    } else {
      alert('Por favor, completa todos los campos.');
    }
  };

  return (
    <div className="agregar-menu-container">
      <h2>Añadir Nuevo Producto al Menú</h2>
      <Form onSubmit={handleSubmit} className="agregar-menu-form">
        <Form.Group controlId="formNombre">
          <Form.Label>Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            placeholder="Ingresa el nombre del producto"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formPrecio">
          <Form.Label>Precio (Bs)</Form.Label>
          <Form.Control
            type="number"
            placeholder="Ingresa el precio del producto"
            value={precio}
            onChange={(e) => setPrecio(e.target.value)}
          />
        </Form.Group>

        <Form.Group controlId="formImagen">
          <Form.Label>Imagen del Producto</Form.Label>
          <Form.Control type="file" onChange={handleImageUpload} />
          {subiendo && <p>Subiendo imagen...</p>}
          {urlImagen && <img src={urlImagen} alt="Imagen del producto" width="100" />}
        </Form.Group>

        <Button variant="primary" type="submit" disabled={subiendo}>
          Añadir Producto
        </Button>
      </Form>
    </div>
  );
};

export default AgregarMenu;
