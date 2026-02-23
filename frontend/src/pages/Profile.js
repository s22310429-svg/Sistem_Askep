import React, { useState, useEffect, useCallback } from 'react';
import '../assets/Profile.css';
import { getProfile, updateProfile, changePassword } from '../services/api';

const Profile = ({ user }) => {
  const [profile, setProfile] = useState({
    namaLengkap: user?.namaLengkap || user?.username || '',
    username: user?.username || '',
    email: user?.email || '',
    tanggalBergabung: '-',
    loginTerakhir: '-',
    status: 'Aktif',
    role: user?.role || 'Perawat',
    totalLogin: 0,
  });
  const [activityLog, setActivityLog] = useState([]);
  const [activeTab, setActiveTab] = useState('info');

  // Modals
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Password form
  const [pwForm, setPwForm] = useState({ oldPassword: '', newPassword: '', confirmPassword: '' });
  const [pwError, setPwError] = useState('');
  const [pwSaving, setPwSaving] = useState(false);

  // Edit profile form
  const [editForm, setEditForm] = useState({ namaLengkap: '', email: '' });
  const [editError, setEditError] = useState('');
  const [editSaving, setEditSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    try {
      const data = await getProfile();
      setProfile(prev => ({ ...prev, ...data }));
      if (data.log) setActivityLog(data.log);
    } catch (e) {
      console.error('Failed to fetch profile:', e);
    }
  }, []);

  useEffect(() => { fetchProfile(); }, [fetchProfile]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError('');
    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwError('Password baru tidak cocok');
      return;
    }
    if (pwForm.newPassword.length < 6) {
      setPwError('Password minimal 6 karakter');
      return;
    }
    setPwSaving(true);
    try {
      await changePassword(pwForm.oldPassword, pwForm.newPassword);
      alert('Password berhasil diubah');
      setShowPasswordModal(false);
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) {
      setPwError(e.message);
    } finally {
      setPwSaving(false);
    }
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSaving(true);
    try {
      const updated = await updateProfile(editForm.namaLengkap, editForm.email);
      setProfile(prev => ({ ...prev, ...updated }));
      alert('Profil berhasil diperbarui');
      setShowEditModal(false);
    } catch (e) {
      setEditError(e.message);
    } finally {
      setEditSaving(false);
    }
  };

  const openEditModal = () => {
    setEditForm({ namaLengkap: profile.namaLengkap || '', email: profile.email || '' });
    setEditError('');
    setShowEditModal(true);
  };

  const infoFields = [
    { label: 'Nama Lengkap', value: profile.namaLengkap || '-' },
    { label: 'Username', value: profile.username },
    { label: 'Email', value: profile.email || '-' },
    { label: 'Role', value: profile.role || 'Perawat' },
    { label: 'Tanggal Bergabung', value: profile.tanggalBergabung || '-' },
    { label: 'Login Terakhir', value: profile.loginTerakhir || '-' },
  ];

  return (
    <div className="pf-page">
      {/* Top card */}
      <div className="pf-top-card">
        <div className="pf-top-left">
          <div className="pf-avatar">
            {profile.username?.charAt(0).toUpperCase()}
          </div>
          <div className="pf-top-info">
            <h2 className="pf-name">{profile.namaLengkap || profile.username}</h2>
            <p className="pf-handle">@{profile.username}</p>
            <span className="pf-role-tag">{profile.role || 'Perawat'}</span>
          </div>
        </div>
        <div className="pf-top-right">
          <div className="pf-top-stat">
            <span className="pf-top-stat-val">{profile.totalLogin || 15}+</span>
            <span className="pf-top-stat-label">Total Login</span>
          </div>
          <div className="pf-top-stat">
            <span className="pf-top-stat-val pf-safe">Aktif</span>
            <span className="pf-top-stat-label">Status</span>
          </div>
          <div className="pf-top-stat">
            <span className="pf-top-stat-val pf-safe">Aman</span>
            <span className="pf-top-stat-label">Keamanan</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="pf-tabs">
        <button
          className={`pf-tab${activeTab === 'info' ? ' active' : ''}`}
          onClick={() => setActiveTab('info')}
        >
          Informasi Profil
        </button>
        <button
          className={`pf-tab${activeTab === 'security' ? ' active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          Keamanan
        </button>
        <button
          className={`pf-tab${activeTab === 'activity' ? ' active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          Riwayat Aktivitas
        </button>
      </div>

      {/* Tab content */}
      <div className="pf-tab-content">
        {activeTab === 'info' && (
          <div className="pf-info-grid">
            {infoFields.map((f) => (
              <div className="pf-info-item" key={f.label}>
                <span className="pf-info-label">{f.label}</span>
                <span className="pf-info-value">{f.value}</span>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="pf-security">
            <div className="pf-security-card">
              <div className="pf-security-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              </div>
              <div>
                <h4>Password</h4>
                <p>Terakhir diubah 30 hari yang lalu</p>
              </div>
              <button className="pf-btn pf-btn-outline" onClick={() => { setPwError(''); setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' }); setShowPasswordModal(true); }}>Ubah Password</button>
            </div>
            <div className="pf-security-card">
              <div className="pf-security-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <div>
                <h4>Status Keamanan</h4>
                <p className="pf-safe">Akun Anda aman. Tidak ada aktivitas mencurigakan.</p>
              </div>
            </div>
            <div className="pf-security-card">
              <div className="pf-security-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="3" />
                  <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
              </div>
              <div>
                <h4>Pengaturan Akun</h4>
                <p>Kelola preferensi dan pengaturan akun Anda.</p>
              </div>
              <button className="pf-btn pf-btn-outline" onClick={openEditModal}>Edit Profil</button>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="pf-activity-table-wrap">
            <table className="pf-activity-table">
              <thead>
                <tr>
                  <th>Waktu</th>
                  <th>Aktivitas</th>
                  <th>Detail</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {(activityLog.length > 0 ? activityLog : (user?.log || [])).map((log, idx) => (
                  <tr key={idx}>
                    <td className="pf-activity-time">{log.waktu}</td>
                    <td className="pf-activity-name">{log.aktivitas}</td>
                    <td>{log.detail}</td>
                    <td><span className="pf-badge-success">{log.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="ps-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="ps-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3 style={{ marginBottom: 16 }}>Ubah Password</h3>
            {pwError && <div style={{ color: '#ef4444', marginBottom: 12, fontSize: 14 }}>{pwError}</div>}
            <form onSubmit={handleChangePassword}>
              <div className="ps-form-group">
                <label>Password Lama</label>
                <input type="password" value={pwForm.oldPassword} onChange={e => setPwForm(p => ({ ...p, oldPassword: e.target.value }))} required />
              </div>
              <div className="ps-form-group">
                <label>Password Baru</label>
                <input type="password" value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} required />
              </div>
              <div className="ps-form-group">
                <label>Konfirmasi Password Baru</label>
                <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} required />
              </div>
              <div className="ps-modal-actions">
                <button type="button" className="ps-btn-cancel" onClick={() => setShowPasswordModal(false)}>Batal</button>
                <button type="submit" className="pf-btn pf-btn-outline" disabled={pwSaving}>{pwSaving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      {showEditModal && (
        <div className="ps-overlay" onClick={() => setShowEditModal(false)}>
          <div className="ps-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 420 }}>
            <h3 style={{ marginBottom: 16 }}>Edit Profil</h3>
            {editError && <div style={{ color: '#ef4444', marginBottom: 12, fontSize: 14 }}>{editError}</div>}
            <form onSubmit={handleEditProfile}>
              <div className="ps-form-group">
                <label>Nama Lengkap</label>
                <input type="text" value={editForm.namaLengkap} onChange={e => setEditForm(p => ({ ...p, namaLengkap: e.target.value }))} required />
              </div>
              <div className="ps-form-group">
                <label>Email</label>
                <input type="email" value={editForm.email} onChange={e => setEditForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div className="ps-modal-actions">
                <button type="button" className="ps-btn-cancel" onClick={() => setShowEditModal(false)}>Batal</button>
                <button type="submit" className="pf-btn pf-btn-outline" disabled={editSaving}>{editSaving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
