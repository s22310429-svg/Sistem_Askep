import React, { useState, useMemo, useEffect } from 'react';
import '../assets/Laporan.css';
import { getReports, getReportDetail, exportReports, downloadBlob } from '../services/api';

const statusConfig = {
  membaik:   { color: '#10b981', bg: '#ecfdf5', border: '#a7f3d0', label: 'Membaik' },
  stabil:    { color: '#f59e0b', bg: '#fffbeb', border: '#fde68a', label: 'Stabil' },
  memburuk:  { color: '#ef4444', bg: '#fef2f2', border: '#fecaca', label: 'Memburuk' },
};

const barData = [
  { kategori: 'Nyeri', jumlah: 12 },
  { kategori: 'Risiko Infeksi', jumlah: 10 },
  { kategori: 'Intoleransi Aktivitas', jumlah: 10 },
];

const lineData = [10, 12, 14, 16, 18, 20];

const Laporan = () => {
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [laporanList, setLaporanList] = useState([]);
  const [summary, setSummary] = useState({ totalPasien: 0, totalDiagnosa: 0, totalImplementasi: 0, membaik: 0, stabil: 0, memburuk: 0 });
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    getReports().then(data => {
      setLaporanList(data.reports);
      setSummary(data.summary);
    }).catch(console.error);
  }, []);

  const handleExportAll = async () => {
    try {
      const blob = await exportReports();
      downloadBlob(blob, 'laporan_keperawatan.csv');
    } catch (e) { alert('Export gagal: ' + e.message); }
  };

  const handlePrint = () => { window.print(); };

  const handleDetailReport = async (report) => {
    try {
      const data = await getReportDetail(report.id);
      setDetailData(data);
      setShowDetailModal(true);
    } catch (e) {
      setDetailData({ report });
      setShowDetailModal(true);
    }
  };

  const handleExportSingle = (report) => {
    const csv = `Nama,Diagnosa,Implementasi,Evaluasi,Status,Tanggal\n"${report.nama}","${report.diagnosa}","${report.implementasi}","${report.evaluasi}","${report.status}","${report.tanggal}"`;
    const blob = new Blob([csv], { type: 'text/csv' });
    downloadBlob(blob, `laporan_${report.nama.replace(/\s/g, '_')}.csv`);
  };

  const filtered = useMemo(() =>
    laporanList.filter(l => {
      const matchStatus = filterStatus ? l.status === filterStatus : true;
      const matchSearch = search
        ? l.nama.toLowerCase().includes(search.toLowerCase()) || l.diagnosa.toLowerCase().includes(search.toLowerCase())
        : true;
      return matchStatus && matchSearch;
    }), [search, filterStatus, laporanList]);

  const total = summary.membaik + summary.stabil + summary.memburuk;

  const icons = {
    search: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>),
    table: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/></svg>),
    grid: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>),
    download: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>),
    printer: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>),
    users: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>),
    clipboard: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/></svg>),
    checkCircle: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>),
    trendUp: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>),
    trendDown: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>),
    ai: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>),
    eye: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>),
    trend: (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>),
  };

  const statCards = [
    { label: 'Total Pasien Aktif', value: summary.totalPasien, icon: icons.users, accent: '#3b82f6' },
    { label: 'Diagnosa Dibuat', value: summary.totalDiagnosa, icon: icons.clipboard, accent: '#8b5cf6' },
    { label: 'Implementasi Selesai', value: summary.totalImplementasi, icon: icons.checkCircle, accent: '#0ea5e9' },
    { label: 'Evaluasi Membaik', value: summary.membaik, icon: icons.trendUp, accent: '#10b981' },
    { label: 'Evaluasi Memburuk', value: summary.memburuk, icon: icons.trendDown, accent: '#ef4444' },
  ];

  const maxBar = Math.max(...barData.map(d => d.jumlah));

  return (
    <div className="lp-page">
      {/* Header */}
      <div className="lp-header">
        <div className="lp-header-text">
          <h1 className="lp-title">Laporan Keperawatan</h1>
          <p className="lp-subtitle">Analisis, evaluasi, dan insight pasien secara real-time</p>
        </div>
        <div className="lp-header-actions">
          <button className="lp-btn lp-btn--outline" onClick={handleExportAll}>{icons.download} Export</button>
          <button className="lp-btn lp-btn--outline" onClick={handlePrint}>{icons.printer} Cetak</button>
        </div>
      </div>

      {/* Stats */}
      <div className="lp-stats">
        {statCards.map((s, i) => (
          <div key={i} className="lp-stat-card">
            <div className="lp-stat-icon" style={{ background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
            <div className="lp-stat-info">
              <span className="lp-stat-label">{s.label}</span>
              <span className="lp-stat-value" style={{ color: s.accent }}>{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="lp-charts-row">
        {/* Pie / Donut */}
        <div className="lp-chart-card">
          <h3 className="lp-card-title">Distribusi Status</h3>
          <div className="lp-pie-wrap">
            <svg className="lp-pie-svg" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f1f5f9" strokeWidth="3.8"/>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#10b981" strokeWidth="3.8"
                strokeDasharray={`${(summary.membaik/total)*100} ${100-(summary.membaik/total)*100}`}
                strokeDashoffset="25" strokeLinecap="round"/>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#f59e0b" strokeWidth="3.8"
                strokeDasharray={`${(summary.stabil/total)*100} ${100-(summary.stabil/total)*100}`}
                strokeDashoffset={`${25-(summary.membaik/total)*100}`} strokeLinecap="round"/>
              <circle cx="18" cy="18" r="15.915" fill="none" stroke="#ef4444" strokeWidth="3.8"
                strokeDasharray={`${(summary.memburuk/total)*100} ${100-(summary.memburuk/total)*100}`}
                strokeDashoffset={`${25-(summary.membaik/total)*100-(summary.stabil/total)*100}`} strokeLinecap="round"/>
            </svg>
            <div className="lp-pie-legend">
              {Object.entries(statusConfig).map(([key, cfg]) => (
                <div key={key} className="lp-legend-item">
                  <span className="lp-legend-dot" style={{ background: cfg.color }}/>
                  <span className="lp-legend-label">{cfg.label}</span>
                  <span className="lp-legend-count">{summary[key]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="lp-chart-card">
          <h3 className="lp-card-title">Diagnosa Keperawatan Utama</h3>
          <div className="lp-bar-list">
            {barData.map((d, i) => (
              <div key={i} className="lp-bar-item">
                <div className="lp-bar-label-row">
                  <span className="lp-bar-label">{d.kategori}</span>
                  <span className="lp-bar-count">{d.jumlah}</span>
                </div>
                <div className="lp-bar-track">
                  <div className="lp-bar-fill" style={{ width: `${(d.jumlah / maxBar) * 100}%` }}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Line Chart */}
        <div className="lp-chart-card">
          <h3 className="lp-card-title">Tren Evaluasi Mingguan</h3>
          <div className="lp-line-wrap">
            <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
              <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" strokeLinejoin="round"
                points={lineData.map((v, i) => `${i * 34 + 15},${78 - v * 3.2}`).join(' ')}/>
              {lineData.map((v, i) => (
                <circle key={i} cx={i * 34 + 15} cy={78 - v * 3.2} r="3.5" fill="#3b82f6" stroke="#fff" strokeWidth="1.5"/>
              ))}
            </svg>
            <div className="lp-line-labels">
              {lineData.map((v, i) => (<span key={i}>W{i + 1}</span>))}
            </div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="lp-ai-card">
        <div className="lp-ai-header">
          {icons.ai}
          <h3 className="lp-card-title">AI Insight</h3>
        </div>
        <p className="lp-ai-text">
          Dari 20 pasien bulan ini, 70% menunjukkan perbaikan kondisi, 20% stabil, 10% memburuk. Intervensi paling efektif: edukasi pasien + manajemen nyeri.
        </p>
        <div className="lp-ai-tags">
          <span className="lp-ai-tag lp-ai-tag--green">{summary.membaik} Membaik</span>
          <span className="lp-ai-tag lp-ai-tag--yellow">{summary.stabil} Stabil</span>
          <span className="lp-ai-tag lp-ai-tag--red">{summary.memburuk} Memburuk</span>
        </div>
      </div>

      {/* Data Section */}
      <div className="lp-data-section">
        <div className="lp-data-header">
          <h3 className="lp-card-title">Detail Laporan Pasien</h3>
          <div className="lp-data-controls">
            <div className="lp-search-box">
              {icons.search}
              <input type="text" className="lp-search-input" placeholder="Cari pasien..." value={search} onChange={e => setSearch(e.target.value)}/>
            </div>
            <select className="lp-filter-select" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="">Semua Status</option>
              <option value="membaik">Membaik</option>
              <option value="stabil">Stabil</option>
              <option value="memburuk">Memburuk</option>
            </select>
            <div className="lp-view-toggle">
              <button className={`lp-toggle-btn ${view === 'table' ? 'lp-toggle-btn--active' : ''}`} onClick={() => setView('table')} title="Table">{icons.table}</button>
              <button className={`lp-toggle-btn ${view === 'card' ? 'lp-toggle-btn--active' : ''}`} onClick={() => setView('card')} title="Card">{icons.grid}</button>
            </div>
          </div>
        </div>

        {view === 'table' ? (
          <div className="lp-table-wrap">
            <table className="lp-table">
              <thead>
                <tr>
                  <th>Nama Pasien</th>
                  <th>Diagnosa</th>
                  <th>Implementasi</th>
                  <th>Hasil Evaluasi</th>
                  <th>Status</th>
                  <th>Tanggal</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(l => {
                  const cfg = statusConfig[l.status];
                  return (
                    <tr key={l.id} className={l.status === 'memburuk' ? 'lp-row--alert' : ''}>
                      <td className="lp-td-name">{l.nama}</td>
                      <td>{l.diagnosa}</td>
                      <td>{l.implementasi}</td>
                      <td className="lp-td-eval">{l.evaluasi}</td>
                      <td><span className="lp-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span></td>
                      <td className="lp-td-date">{l.tanggal}</td>
                      <td>
                        <div className="lp-action-btns">
                          <button className="lp-btn lp-btn--sm lp-btn--primary" onClick={() => handleDetailReport(l)}>{icons.eye} Detail</button>
                          <button className="lp-btn lp-btn--sm lp-btn--outline" onClick={() => handleExportSingle(l)}>{icons.download}</button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="lp-card-grid">
            {filtered.map(l => {
              const cfg = statusConfig[l.status];
              return (
                <div key={l.id} className={`lp-patient-card ${l.status === 'memburuk' ? 'lp-patient-card--alert' : ''}`}>
                  <div className="lp-patient-card-top">
                    <h4 className="lp-patient-name">{l.nama}</h4>
                    <span className="lp-badge" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>{cfg.label}</span>
                  </div>
                  <div className="lp-patient-card-body">
                    <div className="lp-info-row"><span className="lp-info-label">Diagnosa</span><span>{l.diagnosa}</span></div>
                    <div className="lp-info-row"><span className="lp-info-label">Implementasi</span><span>{l.implementasi}</span></div>
                    <div className="lp-info-row"><span className="lp-info-label">Evaluasi</span><span>{l.evaluasi}</span></div>
                    <div className="lp-info-row"><span className="lp-info-label">Tanggal</span><span>{l.tanggal}</span></div>
                  </div>
                  <div className="lp-patient-card-actions">
                    <button className="lp-btn lp-btn--sm lp-btn--primary" onClick={() => handleDetailReport(l)}>{icons.eye} Detail</button>
                    <button className="lp-btn lp-btn--sm lp-btn--outline" onClick={() => handleExportSingle(l)}>{icons.download} Export</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && detailData && (
        <div className="ps-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="ps-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 600 }}>
            <h3 style={{ marginBottom: 16 }}>Detail Laporan</h3>
            <div className="ps-detail-row"><strong>Nama Pasien:</strong> <span>{detailData.nama}</span></div>
            <div className="ps-detail-row"><strong>Diagnosa:</strong> <span>{detailData.diagnosa}</span></div>
            <div className="ps-detail-row"><strong>Implementasi:</strong> <span>{detailData.implementasi}</span></div>
            <div className="ps-detail-row"><strong>Evaluasi:</strong> <span>{detailData.evaluasi}</span></div>
            <div className="ps-detail-row"><strong>Tanggal:</strong> <span>{detailData.tanggal}</span></div>
            <div className="ps-detail-row"><strong>Status:</strong> <span style={{
              padding: '2px 10px',
              borderRadius: 8,
              background: statusConfig[detailData.status]?.bg,
              color: statusConfig[detailData.status]?.color,
              border: `1px solid ${statusConfig[detailData.status]?.border}`
            }}>{statusConfig[detailData.status]?.label}</span></div>
            {detailData.catatan && <div className="ps-detail-row"><strong>Catatan:</strong> <span>{detailData.catatan}</span></div>}
            {detailData.patientInfo && (
              <div style={{ marginTop: 12, padding: 12, background: '#f8f9fa', borderRadius: 8 }}>
                <strong>Info Pasien:</strong>
                <div className="ps-detail-row"><strong>Umur:</strong> <span>{detailData.patientInfo.umur}</span></div>
                <div className="ps-detail-row"><strong>Jenis Kelamin:</strong> <span>{detailData.patientInfo.jenisKelamin}</span></div>
                <div className="ps-detail-row"><strong>Ruangan:</strong> <span>{detailData.patientInfo.ruangan}</span></div>
              </div>
            )}
            <div className="ps-modal-actions" style={{ marginTop: 16 }}>
              <button className="lp-btn lp-btn--outline" onClick={() => setShowDetailModal(false)}>Tutup</button>
              <button className="lp-btn lp-btn--primary" onClick={() => handleExportSingle(detailData)}>Export</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Laporan;
