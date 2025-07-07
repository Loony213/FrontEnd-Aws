import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [generatedPassword, setGeneratedPassword] = useState('');

  // Función para obtener una contraseña generada del microservicio
  const generatePassword = async () => {
    try {
      const res = await axios.get('http://3.213.102.18:8002/generate-password');
      setGeneratedPassword(res.data.password); // Guardamos la contraseña generada
      setPassword(res.data.password); // Auto-llena el campo de contraseña
    } catch (err) {
      alert('Error al generar la contraseña');
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://54.85.217.202/api/register', {
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
          placeholder="Usuario"
          onChange={(e) => setEmail(e.target.value)}
          className="register-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="register-input"
        />

        {/* Botón para generar la contraseña */}
        <button onClick={generatePassword} className="generate-password-button">
          Generar Contraseña Segura
        </button>

        {/* Mostrar la contraseña generada debajo del campo de contraseña */}
        {generatedPassword && (
          <p className="generated-password">
            Contraseña generada: {generatedPassword}
          </p>
        )}

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
