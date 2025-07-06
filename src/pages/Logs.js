import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Logs.css';

function Logs() {
  const navigate = useNavigate();

  const handleExecuteLogs = async () => {
    try {
      
      const response = await fetch('http://54.236.236.86/api/loadlogs', {  
        method: 'POST',
      });

      const data = await response.json();
      if (data.success) {
        alert('Logs ejecutados con éxito');
      } else {
        alert('Error al ejecutar los logs');
      }
    } catch (err) {
      alert('Fallo en la solicitud');
    }
  };

  return (
    <div className="logs-container">
      <h1>Administrador de Logs</h1>
      <p>Esta página permite ejecutar los logs de la base de datos SQL Server.</p>

      <button onClick={handleExecuteLogs} className="execute-logs-button">
        Ejecutar Logs de la Base de Datos SQL Server
      </button>

      <button onClick={() => navigate('/root-dashboard')} className="back-button">
        Volver al Panel de Control
      </button>
    </div>
  );
}

export default Logs;
