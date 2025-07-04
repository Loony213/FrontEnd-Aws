import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Hacer login y obtener el token
      const res = await axios.post('http://52.1.37.215:8001/login', {
        email,
        password
      });

      // Guardar el token en el almacenamiento local
      const token = res.data.token;
      localStorage.setItem('token', token);

      // Decodificar el token JWT para obtener el user_id
      const decoded = jwtDecode(token);
      const userId = decoded.user_id;  // Obtenemos el user_id del token

      alert('Login exitoso');

      // Redirigimos según el user_id
      if (userId === 9) {  // Si el user_id es 9 (Kevin)
        navigate('/root-dashboard');  // Redirigir a la página de root
      } else {
        navigate('/dashboard');  // Redirigir al dashboard normal
      }
      
    } catch (err) {
      alert('Login fallido');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar sesión</h2>

        <input
          type="text"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        <button onClick={handleLogin} className="login-button">
          Login
        </button>

        <p className="login-footer">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="login-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
