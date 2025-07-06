import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css'; // Usamos el mismo estilo para que se vea similar

function RootLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://52.1.37.215/loginroot', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);
      alert('Login exitoso');
      navigate('/root-dashboard');
    } catch (err) {
      alert('Login fallido');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar sesión - Usuario Root </h2>

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
          <br />
        </p>
      </div>
    </div>
  );
}

export default RootLogin;
