import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/Login.css';
import { login } from '../services/api';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Username dan password wajib diisi!');
      return;
    }
    setLoading(true);
    try {
      const user = await login(username, password);
      onLogin && onLogin(user);
    } catch (err) {
      setError(err.message || 'Login gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Left panel - branding */}
      <div className="login-left">
        <div className="login-left-content">
          <div className="login-brand-icon">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <rect x="4" y="4" width="40" height="40" rx="12" fill="rgba(255,255,255,0.15)" />
              <path d="M24 14v20M14 24h20" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="login-brand-title">Sistem Asuhan Keperawatan</h1>
          <p className="login-brand-desc">
            Platform digital untuk pencatatan, perencanaan, dan evaluasi asuhan keperawatan secara efisien dan terstruktur.
          </p>
          <div className="login-features">
            <div className="login-feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Manajemen data pasien terpusat</span>
            </div>
            <div className="login-feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Rencana askep berbasis AI</span>
            </div>
            <div className="login-feature-item">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 10l3 3 5-6" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              <span>Evaluasi dan laporan otomatis</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right panel - login form */}
      <div className="login-right">
        <div className="login-form-wrapper">
          <div className="login-form-header">
            <h2>Masuk</h2>
            <p>Silakan masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {error && (
            <div className="login-error">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><circle cx="8" cy="8" r="7" stroke="#dc2626" strokeWidth="1.5"/><path d="M8 5v3.5M8 10.5v.5" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>{error}</span>
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
            <div className="login-field">
              <label htmlFor="username">Username</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <circle cx="9" cy="6" r="3.5" stroke="#94a3b8" strokeWidth="1.5"/>
                  <path d="M2.5 16c0-3 2.9-5 6.5-5s6.5 2 6.5 5" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                <input
                  id="username"
                  type="text"
                  placeholder="Masukkan username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="password">Password</label>
              <div className="login-input-wrap">
                <svg className="login-input-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <rect x="3" y="8" width="12" height="8" rx="2" stroke="#94a3b8" strokeWidth="1.5"/>
                  <path d="M6 8V5.5a3 3 0 116 0V8" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round"/>
                  <circle cx="9" cy="12.5" r="1" fill="#94a3b8"/>
                </svg>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="login-toggle-pw"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  aria-label="Tampilkan Password"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#64748b" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" stroke="#64748b" strokeWidth="1.5"/><line x1="3" y1="3" x2="15" y2="15" stroke="#64748b" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#64748b" strokeWidth="1.5"/><circle cx="9" cy="9" r="2.5" stroke="#64748b" strokeWidth="1.5"/></svg>
                  )}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={() => setRemember((prev) => !prev)}
                />
                <span>Ingat Saya</span>
              </label>
            </div>

            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? (
                <span className="login-spinner" />
              ) : (
                'Masuk'
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>Belum punya akun? <Link to="/regis">Daftar sekarang</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
