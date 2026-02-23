import React, { useState, useEffect, useCallback, useMemo } from 'react';
import '../assets/Dashboard.css';
import '../assets/Patients.css';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Pasien from './pasien';
import AskepAiPlan from './askepaiplan';
import Implementasi from './implementasi';
import Profile from './Profile';
import Evaluasi from './evaluasi';
import Laporan from './laporan';
import { getDashboardStats, getDashboardActivities } from '../services/api';

const defaultStatsData = [
  {
    title: 'Total Pasien',
    value: '...',
    desc: 'Pasien terdaftar',
    trend: '-',
    trendType: 'neutral',
    color: '#10b981',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 21v-2a4 4 0 00-4-4H8a4 4 0 00-4-4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M20 8v6M23 11h-6" />
      </svg>
    ),
  },
  {
    title: 'Askep Aktif',
    value: '...',
    desc: 'Rencana sedang berjalan',
    trend: '-',
    trendType: 'neutral',
    color: '#3b82f6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: 'Implementasi',
    value: '...',
    desc: 'Tindakan selesai',
    trend: '-',
    trendType: 'neutral',
    color: '#f59e0b',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
      </svg>
    ),
  },
  {
    title: 'Laporan',
    value: '...',
    desc: 'Laporan tersedia',
    trend: '-',
    trendType: 'neutral',
    color: '#8b5cf6',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    ),
  },
];

const Dashboard = ({ user, onLogout }) => {
  const [activeMenu, setActiveMenu] = useState('dashboard');

  const renderContent = () => {
    switch (activeMenu) {
      case 'profile':
        return <Profile user={user} />;
      case 'pasien':
        return <Pasien onNavigate={setActiveMenu} />;
      case 'askep':
        return <AskepAiPlan />;
      case 'implementasi':
        return <Implementasi />;
      case 'evaluasi':
        return <Evaluasi />;
      case 'laporan':
        return <Laporan />;
      case 'dashboard':
      default:
        return <DashboardHome user={user} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar
        activeMenu={activeMenu}
        setActiveMenu={setActiveMenu}
        user={user}
        onLogout={onLogout}
      />
      <div className="app-main">
        <Header
          title={activeMenu === 'dashboard' ? `Selamat Datang, ${user.username}` : getPageTitle(activeMenu)}
          subtitle={activeMenu === 'dashboard' ? 'Kelola asuhan keperawatan secara efisien' : undefined}
          user={user}
        />
        <main className="app-content">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </div>
  );
};

function getPageTitle(menuId) {
  const titles = {
    profile: 'Profil Pengguna',
    pasien: 'Data Pasien',
    askep: 'Askep AI Plan',
    implementasi: 'Implementasi',
    evaluasi: 'Evaluasi',
    laporan: 'Laporan',
  };
  return titles[menuId] || 'Dashboard';
}

const DashboardHome = ({ user }) => {
  const [statsData, setStatsData] = useState(defaultStatsData);
  const [recentActivities, setRecentActivities] = useState([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const colorMap = useMemo(() => ({ 'Total Pasien': '#10b981', 'Askep Aktif': '#3b82f6', 'Implementasi': '#f59e0b', 'Laporan': '#8b5cf6' }), []);

  const fetchDashboard = useCallback(async () => {
    try {
      const [statsRes, activitiesRes] = await Promise.all([
        getDashboardStats(),
        getDashboardActivities()
      ]);
      const stats = statsRes?.stats || statsRes || [];
      const activities = Array.isArray(activitiesRes) ? activitiesRes : [];
      if (stats.length) {
        setStatsData(prev => prev.map(s => {
          const apiStat = stats.find(a => a.title === s.title);
          if (apiStat) return { ...s, value: String(apiStat.value), desc: apiStat.desc || s.desc, trend: apiStat.trend || '-', trendType: apiStat.trendType || 'neutral' };
          return s;
        }));
      }
      if (activities.length) {
        setRecentActivities(activities.map(a => ({
          ...a,
          time: a.timeAgo || a.time,
          color: a.color || colorMap[a.title] || '#3b82f6',
        })));
      }
    } catch (e) {
      console.error('Dashboard fetch error:', e);
    }
  }, [colorMap]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return (
    <div className="dash-home">
      {/* Welcome banner */}
      <div className="dash-welcome">
        <div className="dash-welcome-text">
          <h2>
            Halo, <strong>{user.username}</strong>
          </h2>
          <p>
            Peran: <span className="dash-role-badge">{user.role}</span>
          </p>
          <p className="dash-welcome-desc">
            Sistem Askep AI membantu Anda mengelola asuhan keperawatan secara profesional dan efisien. Pantau pasien, buat rencana, dan evaluasi dari satu tempat.
          </p>
        </div>
        <div className="dash-welcome-art">
          <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
            <rect x="20" y="15" width="80" height="55" rx="10" fill="#fff" fillOpacity="0.15" />
            <path d="M35 50Q50 25 60 50Q70 75 85 50" stroke="#fff" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="60" cy="50" r="5" fill="#fff" fillOpacity="0.4" />
            <circle cx="42" cy="38" r="3" fill="#fff" fillOpacity="0.25" />
            <circle cx="78" cy="62" r="3" fill="#fff" fillOpacity="0.25" />
          </svg>
        </div>
      </div>

      {/* Stats grid */}
      <section className="dash-stats">
        <h3 className="dash-section-title">Ringkasan Aktivitas</h3>
        <div className="dash-stats-grid">
          {statsData.map((s) => (
            <div className="dash-stat-card" key={s.title}>
              <div className="dash-stat-top">
                <div className="dash-stat-icon" style={{ background: s.color }}>
                  {s.icon}
                </div>
                <span className={`dash-stat-trend ${s.trendType}`}>{s.trend}</span>
              </div>
              <h4 className="dash-stat-label">{s.title}</h4>
              <p className="dash-stat-value">{s.value}</p>
              <p className="dash-stat-desc">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section className="dash-activity">
        <div className="dash-activity-header">
          <h3 className="dash-section-title">Aktivitas Terbaru</h3>
        </div>
        <div className="dash-activity-list">
          {recentActivities.map((a, i) => (
            <div className="dash-activity-item" key={i}>
              <div className="dash-activity-dot" style={{ background: a.color }} />
              <div className="dash-activity-body">
                <h4>{a.title}</h4>
                <p>{a.desc}</p>
                <span className="dash-activity-time">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
