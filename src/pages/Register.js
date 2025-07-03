import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://52.1.37.215:8002/register', {
        email,
        password
      });
      alert(res.data.message);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert('Este correo ya está registrado');
      } else {
        alert('Error al registrar');
      }
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2 className="register-title">Registro</h2>

        <input
          type="text"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        <button onClick={handleRegister} className="register-button">
          Registrar
        </button>

        <p className="register-footer">
          ¿Ya tienes cuenta?{' '}
          <Link to="/" className="register-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
