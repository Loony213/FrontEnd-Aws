import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RootDashboard.css';

function RootDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');  
    navigate('/login');  
  };

  const goToLogs = () => {
    navigate('/logs');  
  };

  return (
    <div className="root-dashboard-container">
      <h1>Bienvenido, usuario root</h1>
      <p>Esta es la página exclusiva para el usuario root.</p>

      {/*  */}
      <button onClick={handleLogout} className="logout-button">
        Cerrar sesión
      </button>

      {/*  */}
      <button onClick={goToLogs} className="logs-button">
        Ir al Administrador de Logs
      </button>
    </div>
  );
}

export default RootDashboard;
