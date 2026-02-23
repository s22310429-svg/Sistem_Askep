
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Regis from './pages/regis';
import Dashboard from './pages/dashboard';
import { getStoredUser, removeToken, removeStoredUser } from './services/api';

function App() {
  const [user, setUser] = useState(getStoredUser());

  const handleLogout = () => {
    removeToken();
    removeStoredUser();
    setUser(null);
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/regis" element={user ? <Navigate to="/" replace /> : <Regis onRegister={handleRegister} />} />
        <Route path="/" element={
          !user ? <Login onLogin={handleLogin} /> : <Dashboard user={user} onLogout={handleLogout} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
