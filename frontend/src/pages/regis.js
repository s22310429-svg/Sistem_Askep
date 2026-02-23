import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/Regis.css';
import { register } from '../services/api';

const Regis = ({ onRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', fullname: '', password: '', confirm: '', agree: false });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    const { id, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [id]: type === 'checkbox' ? checked : value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.fullname || !form.password || !form.confirm) {
      setError('Semua field wajib diisi!');
      return;
    }
    if (form.password.length < 6) {
      setError('Password minimal 6 karakter!');
      return;
    }
    if (form.password !== form.confirm) {
      setError('Konfirmasi password tidak cocok!');
      return;
    }
    if (!form.agree) {
      setError('Anda harus menyetujui syarat dan ketentuan!');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const user = await register(form.username, form.email, form.fullname, form.password);
      onRegister && onRegister(user);
    } catch (err) {
      setError(err.message || 'Registrasi gagal!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="regis-bg">
      <div className="regis-card">
        <div className="regis-left">
          <h2>Kenapa mendaftar?</h2>
          <ul className="regis-benefit-list">
            <li>Akses dashboard asuhan keperawatan yang komprehensif.</li>
            <li>Simpan dan pantau data pasien serta hasil analisis.</li>
            <li>Dapatkan insight terbaru untuk perencanaan dan evaluasi asuhan.</li>
          </ul>
          <div className="regis-note">
            <span>Data Anda kami lindungi dengan standar keamanan terbaru.</span>
          </div>
        </div>
        <div className="regis-right">
          <div className="regis-logo-circle">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none"><circle cx="24" cy="24" r="22" stroke="#2563eb" strokeWidth="3" fill="#fff"/><path d="M24 16v16M16 24h16" stroke="#2563eb" strokeWidth="3" strokeLinecap="round"/></svg>
          </div>
          <h2 className="regis-title">Daftar Akun Baru</h2>
          <p className="regis-desc">Isi data untuk membuat akun Sistem Asuhan Keperawatan</p>
          <form className="regis-form" onSubmit={handleSubmit} autoComplete="off">
            {error && <div style={{color:'#e11d48',marginBottom:8,fontWeight:600,background:'#fef2f2',padding:'8px 12px',borderRadius:8}}>{error}</div>}
            <div className="input-group icon-input">
              <label htmlFor="username">Username</label>
              <span className="input-icon"></span>
              <input id="username" type="text" placeholder="Masukkan username Anda" value={form.username} onChange={handleChange} />
            </div>
            <div className="input-group icon-input">
              <label htmlFor="email">Email</label>
              <span className="input-icon"></span>
              <input id="email" type="email" placeholder="Masukkan email aktif" value={form.email} onChange={handleChange} />
            </div>
            <div className="input-group icon-input">
              <label htmlFor="fullname">Nama Lengkap</label>
              <span className="input-icon"></span>
              <input id="fullname" type="text" placeholder="Nama lengkap Anda" value={form.fullname} onChange={handleChange} />
            </div>
            <div className="input-group icon-input">
              <label htmlFor="password">Password</label>
              <span className="input-icon"></span>
              <div className="password-input-wrapper">
                <input id="password" type={showPassword ? 'text' : 'password'} placeholder="Minimal 6 karakter" value={form.password} onChange={handleChange} />
                <button type="button" className="show-password-btn" onClick={() => setShowPassword((v) => !v)} tabIndex={-1} aria-label="Tampilkan Password">{showPassword ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div className="input-group icon-input">
              <label htmlFor="confirm">Konfirmasi Password</label>
              <span className="input-icon"></span>
              <div className="password-input-wrapper">
                <input id="confirm" type={showConfirm ? 'text' : 'password'} placeholder="Ulangi password" value={form.confirm} onChange={handleChange} />
                <button type="button" className="show-password-btn" onClick={() => setShowConfirm((v) => !v)} tabIndex={-1} aria-label="Tampilkan Password">{showConfirm ? 'Hide' : 'Show'}</button>
              </div>
            </div>
            <div className="checkbox-group">
              <input id="agree" type="checkbox" checked={form.agree} onChange={handleChange} />
              <label htmlFor="agree">Saya setuju dengan <a href="/syarat-ketentuan">syarat dan ketentuan</a> penggunaan sistem ini.</label>
            </div>
            <button type="submit" className="btn btn-login" disabled={loading}>{loading ? 'Mendaftar...' : 'Daftar'}</button>
          </form>
          <div className="regis-footer">
            <span>Sudah punya akun? <Link to="/">Masuk di sini</Link></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Regis;