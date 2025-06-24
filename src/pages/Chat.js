import React, { useEffect, useRef, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const socketRef = useRef(null);

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

  useEffect(() => {
    if (!token) return;

    socketRef.current = new WebSocket(`ws://34.239.221.122:8000/ws/${email}`);

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    socketRef.current.onclose = () => {
      console.log('Conexión cerrada');
    };

    return () => socketRef.current.close();
  }, [token]);

  const sendMessage = () => {
    if (message.trim()) {
      socketRef.current.send(message);  // Enviamos el texto directo como espera el backend
      const currentTime = new Date().toLocaleTimeString();
      setMessages((prev) => [...prev, { sender: 'Tú', message, time: currentTime }]);
      setMessage('');
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat en tiempo real</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className="chat-message">
            <strong>{msg.sender}:</strong> {msg.message}
            {msg.time && (
              <div className="chat-time">{msg.time}</div>
            )}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button onClick={sendMessage}>Enviar</button>
      </div>
    </div>
  );
}

export default Chat;