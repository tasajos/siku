import React, { useState } from 'react';
import { ref, set } from 'firebase/database';
import { database } from '../../../firebase'; // Asegúrate de que el archivo 'firebase.js' exporte 'database'
import './ConfigurarPantallaPresentacion.css';

const ConfigurarPantallaPresentacion = () => {
  const [direccionVideo, setDireccionVideo] = useState('');

  // Función para transformar una URL de YouTube a formato embebido
  const transformarUrl = (url) => {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname === 'www.youtube.com' && urlObj.pathname === '/watch') {
        // Transformar "https://www.youtube.com/watch?v=VIDEO_ID" a "https://www.youtube.com/embed/VIDEO_ID"
        const videoId = urlObj.searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      } else if (urlObj.hostname === 'youtu.be') {
        // Transformar "https://youtu.be/VIDEO_ID" a "https://www.youtube.com/embed/VIDEO_ID"
        const videoId = urlObj.pathname.substring(1);
        return `https://www.youtube.com/embed/${videoId}`;
      }

      // Si ya está en formato embed, devolverla sin cambios
      return url;
    } catch (error) {
      console.error('Error al transformar la URL:', error);
      return url;
    }
  };

  const handleGuardar = (e) => {
    e.preventDefault();

    if (!direccionVideo) {
      alert('Por favor, ingrese una dirección válida.');
      return;
    }

    // Transformar la URL antes de guardarla
    const urlTransformada = transformarUrl(direccionVideo);

    const configRef = ref(database, 'config/pantallaPresentacion');
    set(configRef, { direccionVideo: urlTransformada })
      .then(() => {
        alert('Dirección de video guardada con éxito.');
        setDireccionVideo(''); // Limpiar el formulario
      })
      .catch((error) => {
        console.error('Error al guardar la dirección de video:', error);
      });
  };

  return (
    <div className="configuracion-pantalla-container">
      <h2>Configurar Pantalla de Presentación</h2>
      <form className="configuracion-form" onSubmit={handleGuardar}>
        <div className="form-group">
          <label htmlFor="direccionVideo" className="form-label">
            Dirección del Video
          </label>
          <input
            type="text"
            id="direccionVideo"
            className="form-input"
            placeholder="Ingrese la URL del video"
            value={direccionVideo}
            onChange={(e) => setDireccionVideo(e.target.value)}
          />
        </div>
        <button type="submit" className="form-button">
          Guardar
        </button>
      </form>
    </div>
  );
};

export default ConfigurarPantallaPresentacion;
