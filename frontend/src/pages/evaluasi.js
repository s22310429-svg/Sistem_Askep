import React, { useState, useMemo, useEffect } from 'react';
import '../assets/Evaluasi.css';
import { getEvaluations, exportEvaluations, downloadBlob } from '../services/api';

const statusConfig = {
  membaik:    { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', label: 'Membaik' },
  monitoring: { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'Perlu Monitoring' },
  memburuk:   { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Memburuk' },
};

const dotColor = { done: '#10b981', pending: '#f59e0b', alert: '#ef4444' };

const Evaluasi = () => {
  const [view, setView] = useState('table');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');
  const [pasienList, setPasienList] = useState([]);

  useEffect(() => {
    getEvaluations().then(setPasienList).catch(console.error);
  }, []);

  const handleExport = async () => {
    try {
      const blob = await exportEvaluations();
      downloadBlob(blob, 'evaluasi_pasien.csv');
    } catch (e) { alert('Export gagal: ' + e.message); }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'Evaluasi Pasien', text: 'Data evaluasi pasien Sistem Askep', url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link berhasil disalin ke clipboard!');
    }
  };

  const displayedPatients = useMemo(() =>
    pasienList.filter(p => {
      const matchSearch = searchTerm ? p.nama.toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchSelected = selectedPatient ? p.id === parseInt(selectedPatient) : true;
      return matchSearch && matchSelected;
    }), [searchTerm, selectedPatient, pasienList]);

  const counts = useMemo(() => ({
    membaik: pasienList.filter(p => p.status === 'membaik').length,
    monitoring: pasienList.filter(p => p.status === 'monitoring').length,
    memburuk: pasienList.filter(p => p.status === 'memburuk').length,
  }), [pasienList]);

  const total = counts.membaik + counts.monitoring + counts.memburuk;

  const icons = {
    search: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
    table: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>),
    grid: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
    download: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
    share: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>),
    ai: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4v2a4 4 0 01-8 0V6a4 4 0 014-4z"/><path d="M16 14a4 4 0 00-8 0"/><circle cx="12" cy="20" r="2"/><line x1="12" y1="16" x2="12" y2="18"/></svg>),
    trend: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  };

  return (
    <div className="ev-page">
      {/* Header */}
      <div className="ev-header">
        <div className="ev-header-text">
          <h1 className="ev-title">Evaluasi Pasien</h1>
          <p className="ev-subtitle">Pantau perkembangan dan evaluasi kondisi pasien</p>
        </div>
        <div className="ev-header-actions">
          <div className="ev-search-box">
            {icons.search}
            <input type="text" className="ev-search-input" placeholder="Cari pasien..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>
          <select className="ev-filter-select" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
            <option value="">Semua Pasien</option>
            {pasienList.map(p => (<option key={p.id} value={p.id}>{p.nama}</option>))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="ev-stats">
        {Object.entries(statusConfig).map(([key, cfg]) => (
          <div key={key} className="ev-stat-card" style={{ borderLeft: `4px solid ${cfg.color}` }}>
            <div className="ev-stat-dot" style={{ background: cfg.color }} />
            <div className="ev-stat-info">
              <span className="ev-stat-label">{cfg.label}</span>
              <span className="ev-stat-value">{counts[key]}</span>
            </div>
            <div className="ev-stat-pct">{total ? Math.round((counts[key] / total) * 100) : 0}%</div>
          </div>
        ))}
      </div>

      {/* Summary Row: Pie + AI */}
      <div className="ev-summary-row">
        <div className="ev-pie-card">
          <h3 className="ev-card-title">Distribusi Status</h3>
          <div className="ev-pie-wrap">
            <svg className="ev-pie-svg" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.8" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.8"
                strokeDasharray={`${(counts.membaik / total) * 100} ${100 - (counts.membaik / total) * 100}`}
                strokeDashoffset="25" strokeLinecap="round" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.8"
                strokeDasharray={`${(counts.monitoring / total) * 100} ${100 - (counts.monitoring / total) * 100}`}
                strokeDashoffset={`${25 - (counts.membaik / total) * 100}`} strokeLinecap="round" />
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3.8"
                strokeDasharray={`${(counts.memburuk / total) * 100} ${100 - (counts.memburuk / total) * 100}`}
                strokeDashoffset={`${25 - (counts.membaik / total) * 100 - (counts.monitoring / total) * 100}`} strokeLinecap="round" />
            </svg>
            <div className="ev-pie-legend">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="ev-legend-item">
                  <span className="ev-legend-dot" style={{ background: cfg.color }} />
                  <span className="ev-legend-label">{cfg.label}</span>
                  <span className="ev-legend-count">{counts[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="ev-ai-card">
          <div className="ev-ai-header">
            {icons.ai}
            <h3 className="ev-card-title">Rekomendasi AI</h3>
          </div>
          <p className="ev-ai-text">
            Pasien dengan nyeri skala 6 setelah 3 hari implementasi masih tinggi, disarankan rujukan dokter atau intervensi tambahan.
          </p>
          <div className="ev-ai-tags">
            <span className="ev-ai-tag ev-ai-tag--red">3 Pasien Memburuk</span>
            <span className="ev-ai-tag ev-ai-tag--yellow">{counts.monitoring} Perlu Monitoring</span>
          </div>
        </div>
      </div>

      {/* View Toggle + Data */}
      <div className="ev-data-section">
        <div className="ev-data-header">
          <h3 className="ev-card-title">Progress Tracker Pasien</h3>
          <div className="ev-view-toggle">
            <button className={`ev-toggle-btn ${view === 'table' ? 'ev-toggle-btn--active' : ''}`} onClick={() => setView('table')} title="Table View">{icons.table}</button>
            <button className={`ev-toggle-btn ${view === 'card' ? 'ev-toggle-btn--active' : ''}`} onClick={() => setView('card')} title="Card View">{icons.grid}</button>
            <button className="ev-toggle-btn" title="Export" onClick={handleExport}>{icons.download}</button>
            <button className="ev-toggle-btn" title="Share" onClick={handleShare}>{icons.share}</button>
          </div>
        </div>

        {view === 'table' ? (
          <div className="ev-table-wrap">
            <table className="ev-table">
              <thead>
                <tr>
                  <th>Nama Pasien</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Tren Nyeri</th>
                  <th>Evaluasi Terakhir</th>
                </tr>
              </thead>
              <tbody>
                {displayedPatients.map(p => {
                  const cfg = statusConfig[p.status];
                  return (
                    <tr key={p.id}>
                      <td className="ev-td-name">{p.nama}</td>
                      <td><span className="ev-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span></td>
                      <td className="ev-td-progress">
                        <div className="ev-mini-timeline">
                          {p.progress.map((s, i) => (
                            <React.Fragment key={i}>
                              <span className="ev-mini-dot" style={{ background: dotColor[s.status] }} title={`${s.hari}: ${s.deskripsi}`} />
                              {i < p.progress.length - 1 && <span className="ev-mini-line" />}
                            </React.Fragment>
                          ))}
                        </div>
                      </td>
                      <td>
                        <div className="ev-trend-row">
                          {icons.trend}
                          <span>{p.trenNyeri.join(' - ')}</span>
                        </div>
                      </td>
                      <td className="ev-td-eval">{p.progress[p.progress.length - 1].deskripsi}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="ev-card-grid">
            {displayedPatients.map(p => {
              const cfg = statusConfig[p.status];
              return (
                <div key={p.id} className="ev-patient-card">
                  <div className="ev-patient-card-top">
                    <h4 className="ev-patient-name">{p.nama}</h4>
                    <span className="ev-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                  </div>

                  <div className="ev-timeline">
                    {p.progress.map((step, idx) => (
                      <div key={idx} className="ev-tl-step">
                        <div className="ev-tl-indicator">
                          <span className="ev-tl-dot" style={{ background: dotColor[step.status] }} />
                          {idx < p.progress.length - 1 && <span className="ev-tl-connector" />}
                        </div>
                        <div className="ev-tl-content">
                          <span className="ev-tl-day">{step.hari}</span>
                          <span className="ev-tl-desc">{step.deskripsi}</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="ev-trend-chart">
                    <svg width="100%" height="40" viewBox="0 0 180 40" preserveAspectRatio="none">
                      <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round"
                        points={p.trenNyeri.map((v, i) => `${i * 50 + 15},${38 - v * 3.5}`).join(' ')} />
                      {p.trenNyeri.map((v, i) => (
                        <circle key={i} cx={i * 50 + 15} cy={38 - v * 3.5} r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5" />
                      ))}
                    </svg>
                    <span className="ev-trend-label">Tren Nyeri: {p.trenNyeri.join(' - ')}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Evaluasi;
