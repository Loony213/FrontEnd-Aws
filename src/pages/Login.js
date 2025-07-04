import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://52.1.37.215:8001/login', {
        email,
        password
      });

      // Guardamos el token en el almacenamiento local
      const token = res.data.token;
      localStorage.setItem('token', token);

      // Obtenemos el user_id de la respuesta
      const userId = res.data.user_id;  // El user_id es devuelto por el backend

      alert('Login exitoso');

      // Redirigimos según el user_id
      if (userId === 1) {  // Asumiendo que el user_id de Kevin es 1
        navigate('/root-dashboard');  // Redirigimos a la página del usuario root
      } else {
        navigate('/dashboard');  // Redirigimos al dashboard normal
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
