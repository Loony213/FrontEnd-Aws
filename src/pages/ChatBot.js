import React, { useState } from 'react';

const ChatBot = () => {
  const [userMessage, setUserMessage] = useState('');
  const [chatMessages, setChatMessages] = useState([]);
  
  
  const sendMessage = async () => {
    if (userMessage.trim() === "") {
      alert("Por favor, ingresa un mensaje.");
      return;
    }

    
    const newMessages = [...chatMessages, { sender: 'Tú', message: userMessage }];
    setChatMessages(newMessages);
    
    
    setUserMessage('');

    
    try {
      const response = await fetch("http://52.22.200.93:8080/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage })
      });

      if (response.ok) {
        const data = await response.json();
        const botReply = data.botReply;

        
        setChatMessages([
          ...newMessages,
          { sender: 'Bot', message: botReply }
        ]);
      } else {
        setChatMessages([
          ...newMessages,
          { sender: 'Bot', message: 'Lo siento, hubo un error.' }
        ]);
      }
    } catch (error) {
      console.error("Error al enviar el mensaje:", error);
    }
  };

  return (
    <div className="chat-container" style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', backgroundColor: '#fff', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)', borderRadius: '8px' }}>
      <h2>Chat con OpenAI</h2>
      
      {/* Campo de entrada para el mensaje */}
      <input
        type="text"
        value={userMessage}
        onChange={(e) => setUserMessage(e.target.value)}
        placeholder="Escribe un mensaje..."
        style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc', borderRadius: '4px' }}
      />
      <button
        onClick={sendMessage}
        style={{
          width: '100%',
          padding: '10px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Enviar
      </button>
      
      {/* Área de chat donde se mostrarán los mensajes */}
      <div
        className="chat-box"
        style={{
          marginTop: '20px',
          padding: '10px',
          border: '1px solid #ddd',
          maxHeight: '400px',
          overflowY: 'scroll',
          backgroundColor: '#f9f9f9',
          borderRadius: '4px'
        }}
      >
        {chatMessages.length > 0 ? (
          chatMessages.map((msg, idx) => (
            <div key={idx} className="message" style={{ margin: '10px 0' }}>
              <strong style={{ fontWeight: msg.sender === 'Tú' ? 'bold' : 'normal', color: msg.sender === 'Tú' ? '#333' : '#007BFF' }}>
                {msg.sender}:
              </strong> 
              {msg.message}
            </div>
          ))
        ) : (
          <p>No hay mensajes aún.</p>
        )}
      </div>
    </div>
  );
};

export default ChatBot;
