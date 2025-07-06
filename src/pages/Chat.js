import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Chat.css';

function Chat() {
  const [message, setMessage] = useState('');
  const [friends, setFriends] = useState([]);
  const [email, setEmail] = useState('');
  const [activeChat, setActiveChat] = useState('');
  const [conversations, setConversations] = useState({});
  const [unreadMessages, setUnreadMessages] = useState(new Set());

  const socketRef = useRef(null);
  const token = localStorage.getItem('token');

  // Fetch user email and friends list
  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userEmail = decoded.email;
        setEmail(userEmail);

        fetch(`http://13.219.27.66:8001/friends/${userEmail}`)
          .then(res => res.json())
          .then(data => setFriends(data))
          .catch(err => console.error('Error al cargar amigos:', err));
      } catch (err) {
        console.error('Token inválido');
      }
    }
  }, [token]);

  // WebSocket connection setup
  useEffect(() => {
    if (!email) return;

    const connectWebSocket = () => {
      socketRef.current = new WebSocket(`ws://98.84.0.194:8000/ws/${email}`);

      socketRef.current.onmessage = (event) => {
        const data = JSON.parse(event.data); // { sender, message }
        const sender = data.sender;

        setConversations(prev => {
          const updated = { ...prev };
          if (!updated[sender]) updated[sender] = [];
          updated[sender].push(data);
          return updated;
        });

        if (sender !== activeChat) {
          setUnreadMessages(prev => new Set(prev).add(sender));
        }
      };

      socketRef.current.onclose = () => {
        console.log('Conexión WebSocket cerrada. Intentando reconectar...');
        setTimeout(connectWebSocket, 1000); // Intentar reconectar después de 1 segundo
      };

      socketRef.current.onerror = (err) => {
        console.error('Error en WebSocket:', err);
      };
    };

    connectWebSocket(); // Establecer la conexión inicial

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [email, activeChat]);

  // Recuperar mensajes históricos
  const loadMessages = (friend) => {
    const chat_id = email < friend ? `${email}_${friend}` : `${friend}_${email}`;
    
    fetch(`http://98.84.0.194:8000/messages/${chat_id}`)
      .then(res => res.json())
      .then(data => {
        // Verificar que la respuesta sea un array antes de hacer .map()
        if (Array.isArray(data)) {
          setConversations(prev => {
            const updated = { ...prev };
            updated[friend] = data.map(msg => ({
              sender: msg.sender_id === email ? `Tú → ${friend}` : `${friend} → Tú`,
              message: msg.message,
              time: new Date(msg.timestamp).toLocaleTimeString()
            }));
            return updated;
          });
        } else {
          console.error("No se recibieron mensajes válidos: ", data);
        }
      })
      .catch(err => console.error('Error al cargar mensajes previos:', err));
  };

  // Handle chat selection
  const handleSelectChat = (friend) => {
    setActiveChat(friend);
    loadMessages(friend);
    setUnreadMessages(prev => {
      const updated = new Set(prev);
      updated.delete(friend);
      return updated;
    });
  };

  const sendMessage = () => {
    if (!message.trim() || !activeChat) return;

    const payload = {
      from: email,
      to: activeChat,
      message: message,
      timestamp: new Date().toISOString()
    };

    socketRef.current.send(JSON.stringify(payload));

    const time = new Date().toLocaleTimeString();
    const outgoingMessage = { sender: `Tú → ${activeChat}`, message, time };

    setConversations(prev => {
      const updated = { ...prev };
      if (!updated[activeChat]) updated[activeChat] = [];
      updated[activeChat].push(outgoingMessage);
      return updated;
    });

    setMessage(''); // Limpiar el campo de mensaje
  };

  return (
    <div className="chat-multi-container">
      <div className="sidebar">
        <h3>Conversaciones</h3>
        {[...new Set([...friends, ...Object.keys(conversations)])].map((friend, idx) => (
          <button
            key={idx}
            className={`chat-tab ${friend === activeChat ? 'active' : ''}`}
            onClick={() => handleSelectChat(friend)}
          >
            {friend}
            {unreadMessages.has(friend) && <span className="unread-indicator">●</span>}
          </button>
        ))}
      </div>

      <div className="chat-area">
        <h3>{activeChat ? `Chat con ${activeChat}` : 'Selecciona una conversación'}</h3>

        <div className="chat-box">
          {activeChat && conversations[activeChat] ? (
            conversations[activeChat].map((msg, idx) => (
              <div key={idx} className="chat-message">
                <strong>{msg.sender}:</strong> {msg.message}
                {msg.time && <div className="chat-time">{msg.time}</div>}
              </div>
            ))
          ) : (
            <p>No hay mensajes con este usuario.</p>
          )}
        </div>

        {activeChat && (
          <div className="chat-input">
            <input
              type="text"
              placeholder="Escribe un mensaje..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Enviar</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
