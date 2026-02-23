import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username && password) {
      onLogin && onLogin({ username, role: 'Perawat' });
    } else {
      setError('Username dan password wajib diisi!');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card estetik-login-card">
        <div className="login-header">
          <div className="icon-container">
            <svg width="54" height="54" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#2563eb" strokeWidth="3" fill="#fff"/><path d="M24 16v16M16 24h16" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <h1 className="login-title">Sistem Asuhan Keperawatan</h1>
          <p className="login-desc">Masuk menggunakan akun Anda</p>
        </div>
        <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
          {error && <div className="error">{error}</div>}
          <div className="input-group icon-input">
            <label htmlFor="username">Username</label>
            <span className="input-icon">👤</span>
            <input
              id="username"
              type="text"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="input-group icon-input">
            <label htmlFor="password">Password</label>
            <span className="input-icon">🔒</span>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password Anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                aria-label="Tampilkan Password"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className="checkbox-group">
            <input
              id="remember"
              type="checkbox"
              checked={remember}
              onChange={() => setRemember((prev) => !prev)}
            />
            <label htmlFor="remember">Ingat Saya</label>
          </div>
          <button type="submit" className="btn btn-login">Masuk</button>
        </form>
        <div className="login-footer">
          <p>Belum memiliki akun? <Link to="/regis">Daftar di sini</Link></p>
        </div>
        {/* Ornamen wave SVG di background */}
        <svg className="login-wave-bg" width="700" height="180" viewBox="0 0 700 180" fill="none" style={{position:'absolute',bottom:-40,left:-60,zIndex:0,opacity:0.13}}><path d="M0 120C120 180 240 60 350 120C460 180 580 60 700 120V180H0V120Z" fill="#fff"/></svg>
      </div>
    </div>
  );
};

export default Login;
