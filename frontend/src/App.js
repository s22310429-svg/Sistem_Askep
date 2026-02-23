
import React, { useState } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Regis from './pages/regis';
import Dashboard from './pages/dashboard';

function App() {
  const [user, setUser] = useState(null);

  const handleLogout = () => {
    setUser(null);
  };

  const handleRegister = (userData) => {
    setUser(userData);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/regis" element={user ? <Navigate to="/" replace /> : <Regis onRegister={handleRegister} />} />
        <Route path="/" element={
          !user ? <Login onLogin={setUser} /> : <Dashboard user={user} onLogout={handleLogout} />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
