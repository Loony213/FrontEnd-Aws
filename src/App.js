import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Chat from './pages/Chat';
import Settings from './pages/Settings'; 
import RootDashboard from './pages/RootDashboard';
import RootLogin from './pages/RootLogin';
import Logs from './pages/Logs';
import FriendProfile from './pages/FriendProfile';
import ChatBot from './pages/ChatBot';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/root-dashboard" element={<RootDashboard />} />
        <Route path="/root-login" element={<RootLogin />} />
        <Route path="/logs" element={<Logs />} />
        <Route path="/friend-profile" element={<FriendProfile />} />
        <Route path="/chat-bot" element={<ChatBot />} />
      </Routes>
    </Router>
  );
}

export default App;
