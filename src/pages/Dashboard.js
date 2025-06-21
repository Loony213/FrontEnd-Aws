import React from 'react';
import { jwtDecode } from 'jwt-decode'; // Asegúrate de instalarlo con npm

function Dashboard() {
  const token = localStorage.getItem('token');
  let email = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      email = decoded.email;
    } catch (err) {
      console.error("Token inválido");
    }
  }

  return (
    <div>
      <h2>Bienvenido</h2>
      <p>{email ? `Usuario: ${email}` : 'No hay sesión activa'}</p>
    </div>
  );
}

export default Dashboard;
