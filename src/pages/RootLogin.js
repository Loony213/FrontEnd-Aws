import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css'; // Usamos el mismo estilo para que se vea similar

function RootLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://52.1.37.215:8001/login', {
        email,
        password
      });

      const userId = res.data.user_id;

      // Verificamos si el user_id es el del usuario Root
      if (userId === 9) { // Suponiendo que el ID de usuario root es 9
        localStorage.setItem('token', res.data.token);
        alert('Login Root exitoso');
        navigate('/root-dashboard');
      } else {
        alert('No tienes permiso para acceder a esta página');
      }
    } catch (err) {
      alert('Login fallido');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar sesión - Usuario Root</h2>

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
      </div>
    </div>
  );
}

export default RootLogin;
