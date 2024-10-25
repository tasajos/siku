import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Para redirigir
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import './Login.css'; // Estilos personalizados para el formulario

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showReset, setShowReset] = useState(false); // Estado para mostrar o ocultar la recuperación de contraseña

  const navigate = useNavigate();
  const auth = getAuth(); // Inicializamos la autenticación de Firebase

  // Manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/'); // Redirige al inicio después de iniciar sesión correctamente
    } catch (error) {
      setError('Error en el inicio de sesión. Verifica tus credenciales.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar la recuperación de contraseña
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setError('Se ha enviado un correo de recuperación.');
    } catch (error) {
      setError('Error al enviar el correo de recuperación.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>{showReset ? 'Recuperar Contraseña' : 'Iniciar Sesión'}</h2>
        {error && <p className="error-message">{error}</p>}
        
        <form onSubmit={showReset ? handlePasswordReset : handleLogin}>
          <div className="input-group">
            <label htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {!showReset && (
            <div className="input-group">
              <label htmlFor="password">Contraseña</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Cargando...' : showReset ? 'Recuperar Contraseña' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>

        <div className="options">
          {!showReset && (
            <button className="reset-button" onClick={() => setShowReset(true)}>
              ¿Olvidaste tu contraseña?
            </button>
          )}

          {showReset && (
            <button className="reset-button" onClick={() => setShowReset(false)}>
              Volver al inicio de sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
