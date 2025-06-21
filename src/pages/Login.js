import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token); // ✅ guarda token
      alert('Login exitoso');
      navigate('/dashboard'); // ✅ redirige

    } catch (err) {
      alert('Login fallido');
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <input type="text" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <p>¿No tienes una cuenta? <Link to="/register">Regístrate aquí</Link></p>
    </div>
  );
}

export default Login;
