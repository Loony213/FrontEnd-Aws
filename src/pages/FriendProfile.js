import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FriendProfile() {
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [friendData, setFriendData] = useState(null);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return navigate('/');

    const decoded = JSON.parse(atob(token.split('.')[1]));
    const userEmail = decoded.email;

    // Obtener lista de amigos
    fetch(`http://44.193.181.80:8001/friends/${userEmail}`)
      .then((res) => res.json())
      .then((data) => setFriendsList(data))
      .catch((err) => console.error('Error al cargar amigos:', err));
  }, [token, navigate]);

  const handleViewProfile = () => {
    if (!selectedFriend) return;

    fetch(`http://54.145.79.10:4565/get-user-data?email=${selectedFriend}`)
      .then((res) => res.json())
      .then((data) => setFriendData(data))
      .catch((err) => console.error('Error al obtener datos del amigo:', err));
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Selecciona un amigo para ver su perfil</h2>
      <select
        value={selectedFriend}
        onChange={(e) => setSelectedFriend(e.target.value)}
      >
        <option value="">-- Seleccionar amigo --</option>
        {friendsList.map((friend, index) => (
          <option key={index} value={friend}>{friend}</option>
        ))}
      </select>
      <button onClick={handleViewProfile} style={{ marginLeft: 10 }}>
        Ver perfil
      </button>

      {friendData && (
        <div style={{ marginTop: 20 }}>
          <h3>Perfil de {friendData.email}</h3>
          <p><strong>Descripción:</strong> {friendData.description || 'Sin descripción'}</p>
          <p><strong>Última conexión:</strong> {friendData.datee || 'Sin registro'}</p>
        </div>
      )}
    </div>
  );
}

export default FriendProfile;
