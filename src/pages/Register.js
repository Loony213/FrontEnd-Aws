import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // 👈 Importar Link para navegación


function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:8000/api/auth/register', {
        email,
        password
      });
      alert(res.data.message);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        alert('Este correo ya está registradoo');
      } else {
        alert('Error al registrar');
      }
    }
  };

  return (
    <div>
      <h2>Registro</h2>
      <input type="text" placeholder="Correo" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Contraseña" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrar</button>
      <p>¿Ya tienes cuenta? <Link to="/">Inicia sesión</Link></p>

    </div>
  );
}

export default Register;
