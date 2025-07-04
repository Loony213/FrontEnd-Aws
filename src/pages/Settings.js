import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';  // Corregido import para jwt-decode
import './Settings.css';

function Settings() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  let email = '';
  let userId = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.email;
      userId = decoded.user_id;  // Obtención del user_id del token
    } catch (err) {
      console.error('Token inválido');
    }
  }

  const [newEmail, setNewEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [phrase, setPhrase] = useState('');
  const [description, setDescription] = useState('');

  // Función para cambiar el email
  const handleEmailChange = async () => {
    try {
      const res = await fetch('http://54.145.79.10:4568/change-email', {
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

  // Función para cambiar la contraseña
  const handlePasswordChange = async () => {
    try {
      const res = await fetch('http://54.145.79.10:4567/change-password', {
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

  // Función para actualizar la frase de estado
  const handlePhraseUpdate = () => {
    if (email && phrase.trim()) {
      localStorage.setItem(`statusPhrase-${email}`, phrase.trim());
      alert('Frase actualizada');
    } else {
      alert('Escribe una frase válida');
    }
  };

  // Función para eliminar la cuenta
  const handleAccountDelete = async () => {
    const confirmDelete = window.confirm('¿Estás seguro de que deseas eliminar tu cuenta? Esta acción es irreversible.');
    if (confirmDelete) {
      try {
        const res = await fetch(`http://54.145.79.10:4569/delete_user?email=${email}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        if (data.message) {
          alert('Tu cuenta ha sido eliminada exitosamente.');
          localStorage.removeItem('token');
          navigate('/');
        } else {
          alert(data.error || 'Error al eliminar la cuenta');
        }
      } catch (err) {
        alert('Fallo en la solicitud para eliminar la cuenta');
      }
    }
  };

  // Función para actualizar la descripción
  const handleDescriptionUpdate = async () => {
    try {
      const res = await fetch('http://54.145.79.10:4566/update-description', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, description })
      });
      const data = await res.json();
      if (data.message) {
        alert('Descripción actualizada');
      } else {
        alert(data.error || 'Error al actualizar la descripción');
      }
    } catch (err) {
      alert('Fallo en la solicitud para actualizar la descripción');
    }
  };

  // Función para ingresar al modo root
  const handleRootAccess = () => {
    if (userId === 9) {
      navigate('/root-dashboard');  // Redirigimos a la página de root
    } else {
      alert('No tienes permiso para acceder al modo root');
    }
  };

  return (
    <div className="settings-container">
      <h2>Configuraciones de cuenta</h2>

      {/* Sección para cambiar email */}
      <div className="form-section">
        <h3>Cambiar email</h3>
        <input
          type="email"
          placeholder="Nuevo correo"
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button onClick={handleEmailChange}>Actualizar Email</button>
      </div>

      {/* Sección para cambiar contraseña */}
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

      {/* Sección para actualizar la frase de estado */}
      <div className="form-section">
        <h3>Actualizar frase de estado</h3>
        <input
          type="text"
          placeholder="¿En qué estás pensando?"
          onChange={(e) => setPhrase(e.target.value)}
        />
        <button onClick={handlePhraseUpdate}>Guardar frase</button>
      </div>

      {/* Sección para actualizar la descripción */}
      <div className="form-section">
        <h3>Actualizar descripción</h3>
        <textarea
          placeholder="Escribe una pequeña descripción sobre ti"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button onClick={handleDescriptionUpdate}>Guardar descripción</button>
      </div>

      {/* Botón para eliminar la cuenta */}
      <div className="form-section">
        <h3>Eliminar cuenta</h3>
        <button onClick={handleAccountDelete} className="delete-account-button">
          Eliminar mi cuenta
        </button>
      </div>

      {/* Botón para ingresar al modo root */}
      <div className="form-section">
        <h3>Modo Root</h3>
        <button onClick={handleRootAccess} className="root-access-button">
          Ingresar al modo root
        </button>
      </div>

      <button onClick={() => navigate('/dashboard')} className="back-button">
        Volver al perfil
      </button>
    </div>
  );
}

export default Settings;
