import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [captcha, setCaptcha] = useState(null); // Estado para guardar la imagen del captcha
  const [captchaText, setCaptchaText] = useState(''); // Estado para guardar el texto ingresado por el usuario
  const navigate = useNavigate();

  // Función para obtener la imagen del captcha
  useEffect(() => {
    const fetchCaptcha = async () => {
      try {
        const response = await axios.get('http://52.5.241.128:5000/generate-captcha', { responseType: 'blob' });
        
        // Crear una URL del objeto blob
        const imageUrl = URL.createObjectURL(response.data);
        setCaptcha(imageUrl);
      } catch (err) {
        console.error('Error al cargar el captcha:', err);
      }
    };

    fetchCaptcha(); // Llamar a la función al montar el componente
  }, []);

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://52.1.37.215:8001/login', {
        email,
        password,
        captcha: captchaText // Incluir el captcha ingresado por el usuario
      });

      localStorage.setItem('token', res.data.token);
      alert('Login exitoso');
      navigate('/dashboard');
    } catch (err) {
      alert('Login fallido');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Iniciar sesión </h2>

        <input
          type="text"
          placeholder="Correo"
          onChange={(e) => setEmail(e.target.value)}
          className="login-input"
        />

        <input
          type="password"
          placeholder="Contraseña"
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />

        {/* Mostrar el captcha */}
        {captcha && (
          <div>
            <img src={captcha} alt="captcha" />
            <input
              type="text"
              placeholder="Ingresa el captcha"
              onChange={(e) => setCaptchaText(e.target.value)}
              className="login-input"
            />
          </div>
        )}

        <button onClick={handleLogin} className="login-button">
          Login
        </button>

        <p className="login-footer">
          ¿No tienes una cuenta?{' '}
          <Link to="/register" className="login-link">
            Regístrate aquí
          </Link>
          <br />
          <Link to="/root-login" className="login-link">
            Eres usuario Root, da click aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
