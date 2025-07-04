import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FriendProfile() {
  const [friendsList, setFriendsList] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState('');
  const [friendName, setFriendName] = useState('');
  const [friendDescription, setFriendDescription] = useState('');
  const [friendLastSeen, setFriendLastSeen] = useState('');
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

  const handleViewProfile = async () => {
    if (!selectedFriend) return;

    try {
      // Obtener nombre
      const resName = await fetch(`http://13.216.187.212:5002/get-name?email=${selectedFriend}`);
      const dataName = await resName.json();
      setFriendName(dataName.name || 'Desconocido');

      // Obtener descripción
      const resDesc = await fetch(`http://13.216.187.212:5003/get-description?email=${selectedFriend}`);
      const dataDesc = await resDesc.json();
      setFriendDescription(dataDesc.description || 'Sin descripción');

      // Obtener última conexión
      const resDate = await fetch(`http://54.145.79.10:4565/get-user-data?email=${selectedFriend}`);
      const dataDate = await resDate.json();
      setFriendLastSeen(dataDate.datee || 'Sin registro');
    } catch (err) {
      console.error('Error al obtener perfil:', err);
    }
  };

  return (
    <div style={{ padding: 20, textAlign: 'center' }}>
      <h2>Selecciona un amigo para ver su perfil</h2>
      <select
        value={selectedFriend}
        onChange={(e) => setSelectedFriend(e.target.value)}
        style={{
          padding: '8px 16px',
          fontSize: '16px',
          margin: '10px 0',
          borderRadius: '4px',
          border: '1px solid #ddd',
        }}
      >
        <option value="">-- Seleccionar amigo --</option>
        {friendsList.map((friend, index) => (
          <option key={index} value={friend}>
            {friend}
          </option>
        ))}
      </select>
      <button
        onClick={handleViewProfile}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginLeft: '10px',
          borderRadius: '4px',
          backgroundColor: '#4CAF50',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Ver perfil
      </button>

      {/* Botón de regreso */}
      <button
        onClick={() => navigate(-1)} // Volver a la página anterior
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          marginTop: '20px',
          borderRadius: '4px',
          backgroundColor: '#f44336',
          color: '#fff',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Regresar
      </button>

      {(friendName || friendDescription || friendLastSeen) && (
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          {/* Foto de perfil simulada */}
          <div
            style={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              backgroundColor: '#ddd',
              margin: '0 auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontSize: '2rem',
              color: '#fff',
            }}
          >
            {friendName ? friendName.charAt(0).toUpperCase() : 'F'}
          </div>

          <h3 style={{ marginTop: '15px' }}>{friendName}</h3>
          <p style={{ fontStyle: 'italic', color: '#555' }}>
            <strong>Descripción:</strong> {friendDescription}
          </p>
          <p style={{ color: '#777' }}>
            <strong>Última conexión:</strong> {friendLastSeen}
          </p>
        </div>
      )}
    </div>
  );
}

export default FriendProfile;
