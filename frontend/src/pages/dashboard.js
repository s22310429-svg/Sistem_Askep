import React, { useState } from 'react';
import '../assets/Dashboard.css';
import '../assets/Patients.css';
import Pasien from './pasien';
import AskepAiPlan from './askepaiplan';
import Implementasi from './implementasi';
import Profile from './Profile';
import Evaluasi from './evaluasi';
import Laporan from './laporan';

const Dashboard = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const menuItems = [
    {
      id: 'profile',
      label: 'Profil Pengguna',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 20c0-4 8-4 8-4s8 0 8 4v2H4v-2z" />
        </svg>
      )
    },
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M3 13h8V3H3v10zm0 8h8v-6H3v6zm10 0h8V11h-8v10zm0-18v6h8V3h-8z"/>
        </svg>
      )
    },
    { 
      id: 'pasien', 
      label: 'Pasien', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
        </svg>
      )
    },
    { 
      id: 'askep', 
      label: 'Askep AI Plan', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      )
    },
    { 
      id: 'implementasi', 
      label: 'Implementasi', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
        </svg>
      )
    },
    { 
      id: 'evaluasi', 
      label: 'Evaluasi', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
        </svg>
      )
    },
    { 
      id: 'laporan', 
      label: 'Laporan', 
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
        </svg>
      )
    },
  ];

  const renderContent = () => {
  switch (activeMenu) {
      case 'profile':
        return <Profile user={user} />;
      case 'dashboard':
        return (
          <div className="dashboard-content">
            {/* Redesigned Header */}
            <div className="dashboard-header-gradient">
              <div className="dashboard-header-inner">
                <div className="dashboard-header-left">
                  <div className="dashboard-header-logo">
                    <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="24" cy="24" r="22" stroke="#fff" strokeWidth="3" fill="#2563eb"/>
                      <path d="M24 14V34M14 24H34" stroke="#fff" strokeWidth="3.5" strokeLinecap="round"/>
                      <circle cx="24" cy="24" r="6" fill="#fff" opacity="0.18"/>
                    </svg>
                  </div>
                  <div className="dashboard-header-greeting">
                    <h1>Selamat Datang, <span className="username-highlight">{user.username}</span></h1>
                    <p className="dashboard-header-role">Peran: <span className="role-badge">{user.role}</span></p>
                    <p className="dashboard-header-desc">Sistem Askep AI membantu Anda mengelola asuhan keperawatan secara profesional dan efisien.</p>
                  </div>
                </div>
                <div className="dashboard-header-illustration">
                  {/* Modern Health/AI SVG Illustration */}
                  <svg width="140" height="120" viewBox="0 0 140 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <ellipse cx="70" cy="110" rx="60" ry="10" fill="#3b82f6" opacity="0.12"/>
                    <rect x="40" y="30" width="60" height="50" rx="12" fill="#fff" stroke="#2563eb" strokeWidth="2.5"/>
                    <rect x="55" y="45" width="30" height="20" rx="5" fill="#60a5fa" opacity="0.18"/>
                    <path d="M50 55 Q60 35 70 55 Q80 75 90 55" stroke="#2563eb" strokeWidth="2.5" fill="none"/>
                    <circle cx="70" cy="55" r="4" fill="#2563eb"/>
                    <circle cx="55" cy="45" r="2.5" fill="#60a5fa"/>
                    <circle cx="85" cy="65" r="2.5" fill="#60a5fa"/>
                  </svg>
                </div>
              </div>
            </div>
            {/* End Redesigned Header */}

            <div className="stats-section">
              <h3 className="section-title">Ringkasan Aktivitas</h3>
              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon patients">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M16 8c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4zM12 14c-5.33 0-8 2.67-8 4v2h16v-2c0-1.33-2.67-4-8-4z"/>
                      </svg>
                    </div>
                    <div className="stat-trend positive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z"/>
                      </svg>
                      +12%
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3>Total Pasien</h3>
                    <p className="stat-number">246</p>
                    <p className="stat-description">Pasien terdaftar bulan ini</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon askep">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                    <div className="stat-trend positive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z"/>
                      </svg>
                      +8%
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3>Askep Aktif</h3>
                    <p className="stat-number">89</p>
                    <p className="stat-description">Rencana yang sedang berjalan</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon implementation">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                    </div>
                    <div className="stat-trend positive">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M7 14l5-5 5 5z"/>
                      </svg>
                      +15%
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3>Implementasi</h3>
                    <p className="stat-number">156</p>
                    <p className="stat-description">Tindakan selesai hari ini</p>
                  </div>
                </div>
                
                <div className="stat-card">
                  <div className="stat-header">
                    <div className="stat-icon reports">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                    </div>
                    <div className="stat-trend neutral">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 12l4-4 4 4z"/>
                      </svg>
                      0%
                    </div>
                  </div>
                  <div className="stat-content">
                    <h3>Laporan</h3>
                    <p className="stat-number">42</p>
                    <p className="stat-description">Laporan dibuat minggu ini</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="activity-section">
              <div className="section-header">
                <h3 className="section-title">Aktivitas Terbaru</h3>
                <button className="btn-secondary">Lihat Semua</button>
              </div>
              <div className="activity-grid">
                <div className="activity-card">
                  <div className="activity-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <h4>Pasien Baru Ditambahkan</h4>
                    <p>Ahmad Wijaya telah didaftarkan ke sistem</p>
                    <span className="activity-time">2 menit yang lalu</span>
                  </div>
                </div>
                
                <div className="activity-card">
                  <div className="activity-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <h4>Askep AI Plan Dibuat</h4>
                    <p>Rencana asuhan untuk Siti Aminah selesai dianalisis AI</p>
                    <span className="activity-time">15 menit yang lalu</span>
                  </div>
                </div>
                
                <div className="activity-card">
                  <div className="activity-icon">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                    </svg>
                  </div>
                  <div className="activity-content">
                    <h4>Implementasi Selesai</h4>
                    <p>Tindakan keperawatan Budi Santoso telah diselesaikan</p>
                    <span className="activity-time">1 jam yang lalu</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'pasien':
        return <Pasien />;
      case 'askep':
        return <AskepAiPlan />;
      case 'implementasi':
        return <Implementasi />;
      case 'evaluasi':
  return <Evaluasi />;
      case 'laporan':
  return <Laporan />;
      default:
        return (
          <div className="dashboard-content">
            <h1>Dashboard</h1>
            <p>Pilih menu di sidebar untuk mulai bekerja.</p>
          </div>
        );
    }
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2" fill="none"/>
              <path d="M12 8V16M8 12H16" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="12" cy="12" r="3" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <div className="brand-text">
            <h3>Sistem Askep</h3>
            <p>Healthcare Platform</p>
          </div>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeMenu === item.id ? 'active' : ''}`}
              onClick={() => setActiveMenu(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
              {activeMenu === item.id && <div className="active-indicator"></div>}
            </button>
          ))}
          
          <div className="nav-divider"></div>
          
          <button className="nav-item logout-btn" onClick={onLogout}>
            <span className="nav-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.59L17 17l5-5z"/>
                <path d="M4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"/>
              </svg>
            </span>
            <span className="nav-label">Logout</span>
          </button>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="user-avatar">
              {user.username.charAt(0).toUpperCase()}
            </div>
            <div className="user-info">
              <p className="user-name">{user.username}</p>
              <p className="user-role">{user.role}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
