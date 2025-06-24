import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const [email, setEmail] = useState('');
  const [statusPhrase, setStatusPhrase] = useState('Disponible');
  const [friendEmail, setFriendEmail] = useState('');
  const [friendsList, setFriendsList] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userEmail = decoded.email;
        setEmail(userEmail);

        const storedPhrase = localStorage.getItem(`statusPhrase-${userEmail}`);
        if (storedPhrase) {
          setStatusPhrase(storedPhrase);
        }

        const storedPic = localStorage.getItem(`profilePic-${userEmail}`);
        if (storedPic) {
          setProfilePic(storedPic);
        }

        fetch(`http://54.236.126.209:8083/friends/${userEmail}`)
          .then((res) => res.json())
          .then((data) => setFriendsList(data))
          .catch((err) => console.error('Error al cargar amigos:', err));
      } catch (err) {
        console.error('Token inválido');
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  const goToSettings = () => {
    navigate('/settings');
  };

  const handleAddFriend = async () => {
    if (!friendEmail.trim()) return;
    try {
      const res = await fetch('http://54.236.126.209:8083/add-friend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_email: email, friend_email: friendEmail })
      });
      const data = await res.json();
      if (data.message) {
        alert('Amigo agregado');
        setFriendsList((prev) => [...prev, friendEmail]);
        setFriendEmail('');
      } else {
        alert(data.error || 'No se pudo agregar amigo');
      }
    } catch (err) {
      alert('Error al conectar con el servidor');
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileName = `profile_pics/${Date.now()}-${file.name}`;
    const s3URL = `https://chatapp-profile-photos-kamartinez.s3.amazonaws.com/${fileName}`;

    try {
      await fetch(s3URL, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      });
      setProfilePic(s3URL);
      localStorage.setItem(`profilePic-${email}`, s3URL);
    } catch (error) {
      console.error('Error al subir imagen:', error);
      alert('Error al subir la imagen');
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <button onClick={goToSettings} className="header-button">Configuraciones</button>
        <button onClick={handleLogout} className="header-button">Cerrar sesión</button>
      </div>

      <div className="dashboard-profile">
        <div className="profile-picture-placeholder">
          {profilePic ? (
            <img src={profilePic} alt="Perfil" width={100} height={100} style={{ borderRadius: '50%' }} />
          ) : (
            "Foto"
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        <p className="dashboard-email">{email}</p>
        <p className="status-phrase">{statusPhrase}</p>
      </div>

      <div className="friends-section">
        <h3>Agregar amigo</h3>
        <input
          type="email"
          placeholder="Correo del amigo"
          value={friendEmail}
          onChange={(e) => setFriendEmail(e.target.value)}
        />
        <button onClick={handleAddFriend}>Agregar</button>

        <h3>Mis amigos</h3>
        <ul>
          {friendsList.length > 0 ? (
            friendsList.map((f, idx) => <li key={idx}>{f}</li>)
          ) : (
            <li>No tienes amigos aún</li>
          )}
        </ul>
      </div>

      <div className="chat-button-container">
        <button onClick={() => navigate('/chat')} className="form-button">
          Comenzar a chatear
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
