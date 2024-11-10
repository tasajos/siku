import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { database, storage } from '../../firebase';
import { ref, set, push, onValue } from 'firebase/database';
import { getDownloadURL, ref as storageRef, uploadBytesResumable } from 'firebase/storage';
import './AgregarMenu.css';

const AgregarMenu = () => {
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');
  const [imagen, setImagen] = useState(null);
  const [urlImagen, setUrlImagen] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [nuevaCategoria, setNuevaCategoria] = useState('');
  const [agregarOtraCategoria, setAgregarOtraCategoria] = useState(false);

  // Cargar categorías desde Firebase al iniciar el componente
  useEffect(() => {
    const categoriasRef = ref(database, 'categorias');
    onValue(categoriasRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setCategorias(Object.values(data)); // Actualiza la lista de categorías
      }
    });
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageReference = storageRef(storage, `menu/${file.name}`);
      const uploadTask = uploadBytesResumable(storageReference, file);

      setSubiendo(true);

      uploadTask.on(
        'state_changed',
        (snapshot) => {},
        (error) => {
          console.error('Error al subir la imagen:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            setUrlImagen(downloadURL);
            setSubiendo(false);
          });
        }
      );
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const categoriaFinal = agregarOtraCategoria ? nuevaCategoria : categoria;

    if (nombre && precio && urlImagen && categoriaFinal) {
      const productoRef = push(ref(database, 'productos'));
      const nuevoProducto = {
        nombre,
        precio: parseFloat(precio),
        imagen: urlImagen,
        categoria: categoriaFinal,
      };

      set(productoRef, nuevoProducto)
        .then(() => {
          alert('Producto añadido con éxito');
          setNombre('');
          setPrecio('');
          setImagen(null);
          setUrlImagen('');
          setCategoria('');
          setNuevaCategoria('');
          setAgregarOtraCategoria(false);

          // Añadir la nueva categoría a la lista si es una categoría nueva
          if (agregarOtraCategoria && nuevaCategoria && !categorias.includes(nuevaCategoria)) {
            const nuevaListaCategorias = [...categorias, nuevaCategoria];
            setCategorias(nuevaListaCategorias);

            // Guardar la nueva lista de categorías en Firebase
            const categoriasRef = ref(database, 'categorias');
            set(categoriasRef, nuevaListaCategorias);
          }
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

        <Form.Group controlId="formCategoria">
          <Form.Label>Categoría</Form.Label>
          {agregarOtraCategoria ? (
            <>
              <Form.Control
                type="text"
                placeholder="Ingresa una nueva categoría"
                value={nuevaCategoria}
                onChange={(e) => setNuevaCategoria(e.target.value)}
              />
              <Button
                variant="link"
                onClick={() => {
                  setAgregarOtraCategoria(false);
                  setNuevaCategoria('');
                }}
              >
                Cancelar
              </Button>
            </>
          ) : (
            <>
              <Form.Select
                value={categoria}
                onChange={(e) => {
                  if (e.target.value === 'otra') {
                    setAgregarOtraCategoria(true);
                    setCategoria('');
                  } else {
                    setCategoria(e.target.value);
                  }
                }}
              >
                <option value="">Seleccione una categoría</option>
                {categorias.map((cat, index) => (
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
                <option value="otra">Añadir otra</option>
              </Form.Select>
            </>
          )}
        </Form.Group>
<br></br>
        <Button variant="primary" type="submit" disabled={subiendo}>
          Añadir Producto
        </Button>
      </Form>
    </div>
  );
};

export default AgregarMenu;
