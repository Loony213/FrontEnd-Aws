import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let email = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.email;
    } catch (err) {
      console.error('Token inválido');
    }
  }

  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phrase, setPhrase] = useState('');

  const handleEmailChange = async () => {
    try {
      const res = await fetch('http://54.157.52.212:8081/cambiar-email', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldEmail: email, newEmail })
      });
      const data = await res.json();
      if (data.message) {
        alert('Email actualizado');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert(data.error || 'Error al actualizar');
      }
    } catch (err) {
      alert('Fallo en la solicitud');
    }
  };

  const handlePasswordChange = async () => {
    try {
      const res = await fetch('http://54.157.52.212:8081/cambiar-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, oldPassword, newPassword })
      });
      const data = await res.json();
      if (data.message) {
        alert('Contraseña actualizada');
        localStorage.removeItem('token');
        navigate('/');
      } else {
        alert(data.error || 'Error al actualizar contraseña');
      }
    } catch (err) {
      alert('Fallo en la solicitud');
    }
  };

  const handlePhraseUpdate = () => {
    if (email && phrase.trim()) {
      localStorage.setItem(`statusPhrase-${email}`, phrase.trim());
      alert('Frase actualizada');
    } else {
      alert('Escribe una frase válida');
    }
  };

  return (
    <div className="settings-container">
      <h2>Configuraciones de cuenta</h2>

      <div className="form-section">
        <h3>Cambiar email</h3>
        <input
          type="email"
          placeholder="Nuevo correo"
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleEmailChange}>Actualizar Email</button>
      </div>

      <div className="form-section">
        <h3>Cambiar contraseña</h3>
        <input
          type="password"
          placeholder="Contraseña actual"
          onChange={(e) => setOldPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder="Nueva contraseña"
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <button onClick={handlePasswordChange}>Actualizar Contraseña</button>
      </div>

      <div className="form-section">
        <h3>Actualizar frase de estado</h3>
        <input
          type="text"
          placeholder="¿En qué estás pensando?"
          onChange={(e) => setPhrase(e.target.value)}
        />
        <button onClick={handlePhraseUpdate}>Guardar frase</button>
      </div>

      <button onClick={() => navigate('/dashboard')} className="back-button">
        Volver al perfil
      </button>
    </div>
  );
}

export default Settings;
