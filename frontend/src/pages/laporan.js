import React, { useState } from 'react';
import '../assets/Laporan.css';

// Dummy data for demonstration
const laporanList = [
  { id: 1, nama: 'Ahmad Wijaya', diagnosa: 'Diabetes Mellitus', implementasi: 'Manajemen nyeri, edukasi', evaluasi: 'Nyeri menurun, kondisi membaik', status: 'membaik', tanggal: '2025-09-28' },
  { id: 2, nama: 'Siti Aminah', diagnosa: 'Hipertensi', implementasi: 'Antibiotik, monitoring suhu', evaluasi: 'Suhu stabil, perlu monitoring', status: 'stabil', tanggal: '2025-09-29' },
  { id: 3, nama: 'Budi Santoso', diagnosa: 'Stroke', implementasi: 'Fisioterapi, edukasi', evaluasi: 'Kondisi memburuk, rujuk dokter', status: 'memburuk', tanggal: '2025-09-30' },
  { id: 4, nama: 'Dewi Lestari', diagnosa: 'Pneumonia', implementasi: 'Antibiotik, oksigen', evaluasi: 'Kondisi membaik, saturasi naik', status: 'membaik', tanggal: '2025-09-28' },
  { id: 5, nama: 'Joko Susilo', diagnosa: 'Gastritis', implementasi: 'Diet lambung, monitoring', evaluasi: 'Perlu monitoring, keluhan berkurang', status: 'stabil', tanggal: '2025-09-29' },
  { id: 6, nama: 'Lina Marlina', diagnosa: 'Asma Bronkial', implementasi: 'Inhalasi, edukasi', evaluasi: 'Napas lega, kondisi membaik', status: 'membaik', tanggal: '2025-09-30' },
  { id: 7, nama: 'Hendra Gunawan', diagnosa: 'Gagal Ginjal Kronis', implementasi: 'Diet renal, monitoring cairan', evaluasi: 'Kondisi memburuk, perlu rujukan', status: 'memburuk', tanggal: '2025-09-28' },
  { id: 8, nama: 'Nur Aisyah', diagnosa: 'Anemia', implementasi: 'Suplemen zat besi', evaluasi: 'Perlu monitoring, Hb naik', status: 'stabil', tanggal: '2025-09-29' },
  { id: 9, nama: 'Agus Setiawan', diagnosa: 'COPD (PPOK)', implementasi: 'Oksigen, fisioterapi', evaluasi: 'Kondisi membaik, saturasi stabil', status: 'membaik', tanggal: '2025-09-30' },
  { id: 10, nama: 'Maria Josephine', diagnosa: 'Demam Berdarah', implementasi: 'Cairan IV, monitoring', evaluasi: 'Perlu monitoring, trombosit naik', status: 'stabil', tanggal: '2025-09-28' },
  { id: 11, nama: 'Rahmat Hidayat', diagnosa: 'Hiperglikemia', implementasi: 'Insulin, monitoring gula', evaluasi: 'Kondisi membaik, gula turun', status: 'membaik', tanggal: '2025-09-29' },
  { id: 12, nama: 'Tania Kusuma', diagnosa: 'Infeksi Saluran Kemih', implementasi: 'Antibiotik, monitoring urin', evaluasi: 'Perlu monitoring, keluhan berkurang', status: 'stabil', tanggal: '2025-09-30' },
  { id: 13, nama: 'Fajar Pratama', diagnosa: 'Ulkus Peptikum', implementasi: 'Diet, monitoring nyeri', evaluasi: 'Kondisi membaik, nyeri turun', status: 'membaik', tanggal: '2025-09-28' },
  { id: 14, nama: 'Indah Wulandari', diagnosa: 'Migren Kronis', implementasi: 'Analgesik, edukasi', evaluasi: 'Perlu monitoring, keluhan berkurang', status: 'stabil', tanggal: '2025-09-29' },
  { id: 15, nama: 'Dedi Kurniawan', diagnosa: 'Hipertensi & Diabetes', implementasi: 'Diet, insulin, monitoring', evaluasi: 'Kondisi membaik, tekanan turun', status: 'membaik', tanggal: '2025-09-30' },
  { id: 16, nama: 'Ayu Rahmawati', diagnosa: 'Apendisitis', implementasi: 'Operasi, monitoring', evaluasi: 'Perlu monitoring, nyeri turun', status: 'stabil', tanggal: '2025-09-28' },
  { id: 17, nama: 'Bambang Herlambang', diagnosa: 'Jantung Koroner', implementasi: 'Monitoring EKG, edukasi', evaluasi: 'Kondisi memburuk, perlu rujukan', status: 'memburuk', tanggal: '2025-09-29' },
  { id: 18, nama: 'Silvia Anggraini', diagnosa: 'Gastritis', implementasi: 'Diet, monitoring nyeri', evaluasi: 'Kondisi membaik, nyeri turun', status: 'membaik', tanggal: '2025-09-30' },
  { id: 19, nama: 'Toni Saputra', diagnosa: 'TBC Paru', implementasi: 'OAT, monitoring dahak', evaluasi: 'Perlu monitoring, batuk berkurang', status: 'stabil', tanggal: '2025-09-28' },
  { id: 20, nama: 'Ratna Dewi', diagnosa: 'Vertigo', implementasi: 'Latihan keseimbangan, edukasi', evaluasi: 'Kondisi membaik, keluhan berkurang', status: 'membaik', tanggal: '2025-09-29' },
];

const statusBadge = {
  membaik: { color: '#22c55e', icon: '🟢', label: 'Membaik' },
  stabil: { color: '#eab308', icon: '🟡', label: 'Stabil' },
  memburuk: { color: '#ef4444', icon: '🔴', label: 'Memburuk' },
};

function Laporan() {
  const [view, setView] = useState('table');
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Dummy summary
  const summary = {
    totalPasien: 20,
    totalDiagnosa: 32,
    totalImplementasi: 28,
    membaik: 14,
    memburuk: 2,
    stabil: 4,
  };

  // Dummy AI insight
  const aiInsight =
    '🤖 Dari 20 pasien bulan ini, 70% menunjukkan perbaikan kondisi, 20% stabil, 10% memburuk. Intervensi paling efektif: edukasi pasien + manajemen nyeri.';

  // Dummy chart data
  const pieData = [
    { label: 'Membaik', value: summary.membaik, color: '#22c55e' },
    { label: 'Stabil', value: summary.stabil, color: '#eab308' },
    { label: 'Memburuk', value: summary.memburuk, color: '#ef4444' },
  ];
  const barData = [
    { kategori: 'Nyeri', jumlah: 12 },
    { kategori: 'Risiko Infeksi', jumlah: 10 },
    { kategori: 'Intoleransi Aktivitas', jumlah: 10 },
  ];
  const lineData = [10, 12, 14, 16, 18, 20];

  // Filtered laporan
  const filteredLaporan = laporanList.filter((lap) => {
    const matchStatus = filterStatus ? lap.status === filterStatus : true;
    const matchSearch = search
      ? lap.nama.toLowerCase().includes(search.toLowerCase()) ||
        lap.diagnosa.toLowerCase().includes(search.toLowerCase())
      : true;
    return matchStatus && matchSearch;
  });

  return (
    <div className="laporan-page">
      {/* Modern Blue Header */}
      <div className="laporan-modern-header">
        <div className="header-content">
          <div className="header-icon">
            <svg width="54" height="54" viewBox="0 0 54 54" fill="none">
              <circle cx="27" cy="27" r="27" fill="#2563eb" fillOpacity="0.13" />
              <path d="M18 36V34C18 31.7909 19.7909 30 22 30H32C34.2091 30 36 31.7909 36 34V36" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="27" cy="22" r="6" stroke="#2563eb" strokeWidth="2.5"/>
            </svg>
          </div>
          <div className="header-text">
            <h1 className="laporan-title">Laporan Keperawatan</h1>
            <div className="laporan-subtitle">Analisis, evaluasi, dan insight pasien secara real-time</div>
          </div>
        </div>
      </div>

      {/* Summary Cards & Analytics */}
      <div className="laporan-summary-analytics">
        <div className="laporan-summary-cards">
          <div className="summary-card floating">
            <div className="summary-title">Total Pasien Aktif</div>
            <div className="summary-value">{summary.totalPasien}</div>
          </div>
          <div className="summary-card floating">
            <div className="summary-title">Diagnosa Dibuat</div>
            <div className="summary-value">{summary.totalDiagnosa}</div>
          </div>
          <div className="summary-card floating">
            <div className="summary-title">Implementasi Selesai</div>
            <div className="summary-value">{summary.totalImplementasi}</div>
          </div>
          <div className="summary-card floating">
            <div className="summary-title">Evaluasi Membaik</div>
            <div className="summary-value" style={{ color: '#22c55e' }}>{summary.membaik}</div>
          </div>
          <div className="summary-card floating">
            <div className="summary-title">Evaluasi Memburuk</div>
            <div className="summary-value" style={{ color: '#ef4444' }}>{summary.memburuk}</div>
          </div>
        </div>
        <div className="laporan-analytics-charts">
          <div className="laporan-pie-chart big">
            <svg width="110" height="110" viewBox="0 0 32 32">
              <circle r="16" cx="16" cy="16" fill="#f3f4f6" />
              <circle r="16" cx="16" cy="16" fill="none" stroke="#22c55e" strokeWidth="32" strokeDasharray="70 30" strokeDashoffset="0" />
              <circle r="16" cx="16" cy="16" fill="none" stroke="#eab308" strokeWidth="32" strokeDasharray="20 80" strokeDashoffset="-70" />
              <circle r="16" cx="16" cy="16" fill="none" stroke="#ef4444" strokeWidth="32" strokeDasharray="10 90" strokeDashoffset="-90" />
            </svg>
            <div className="laporan-pie-legend">
              {pieData.map((d) => (
                <div key={d.label} style={{ color: d.color }}>
                  <span style={{ fontSize: 20, fontWeight: 700 }}>●</span> {d.label}
                </div>
              ))}
            </div>
          </div>
          <div className="laporan-bar-chart big">
            <svg width="160" height="80">
              {barData.map((d, i) => (
                <rect
                  key={d.kategori}
                  x={i * 48 + 16}
                  y={80 - d.jumlah * 6}
                  width="32"
                  height={d.jumlah * 6}
                  fill="#2563eb"
                  rx="8"
                />
              ))}
            </svg>
            <div className="bar-chart-labels">
              {barData.map((d) => (
                <span key={d.kategori}>{d.kategori}</span>
              ))}
            </div>
          </div>
          <div className="laporan-line-chart big">
            <svg width="160" height="80">
              <polyline
                fill="none"
                stroke="#60a5fa"
                strokeWidth="4"
                points={lineData.map((v, i) => `${i * 26 + 16},${80 - v * 3}` ).join(' ')}
              />
              {lineData.map((v, i) => (
                <circle key={i} cx={i * 26 + 16} cy={80 - v * 3} r="5" fill="#2563eb" />
              ))}
            </svg>
            <div className="line-chart-label">Tren Evaluasi Mingguan</div>
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="laporan-ai-insight gradient-info">
        <div className="ai-insight-box">{aiInsight}</div>
      </div>

      {/* Filter & Search */}
      <div className="laporan-filter-section">
        <input
          type="text"
          placeholder="Cari nama pasien "
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Semua Status</option>
          <option value="membaik">Membaik</option>
          <option value="stabil">Stabil</option>
          <option value="memburuk">Memburuk</option>
        </select>
        <button className="btn-export">Export</button>
        <button className="btn-print">Cetak</button>
      </div>

      {/* Table/Card View Toggle */}
      <div className="laporan-view-toggle">
        <button onClick={() => setView('table')} className={view === 'table' ? 'active' : ''}>Table View</button>
        <button onClick={() => setView('card')} className={view === 'card' ? 'active' : ''}>Card View</button>
      </div>

      {/* Tabel Laporan Detail / Card View */}
      {view === 'table' ? (
        <table className="laporan-table">
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
            {filteredLaporan.map((lap) => (
              <tr key={lap.id} className={lap.status === 'memburuk' ? 'alert-row' : ''}>
                <td>{lap.nama}</td>
                <td>{lap.diagnosa}</td>
                <td>{lap.implementasi}</td>
                <td>{lap.evaluasi}</td>
                <td>
                  <span className="laporan-status-badge" style={{ background: statusBadge[lap.status].color }}>
                    {statusBadge[lap.status].icon} {statusBadge[lap.status].label}
                  </span>
                </td>
                <td>{lap.tanggal}</td>
                <td>
                  <button className="btn-detail">Detail</button>
                  <button className="btn-export">Export</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="laporan-card-grid">
          {filteredLaporan.map((lap) => (
            <div className={`laporan-pasien-card ${lap.status === 'memburuk' ? 'alert-row' : ''}`} key={lap.id}>
              <div className="laporan-pasien-card-header">
                <span className="laporan-pasien-nama">{lap.nama}</span>
                <span className="laporan-status-badge" style={{ background: statusBadge[lap.status].color }}>
                  {statusBadge[lap.status].icon} {statusBadge[lap.status].label}
                </span>
              </div>
              <div className="laporan-pasien-card-body">
                <div><b>Diagnosa:</b> {lap.diagnosa}</div>
                <div><b>Implementasi:</b> {lap.implementasi}</div>
                <div><b>Evaluasi:</b> {lap.evaluasi}</div>
                <div><b>Tanggal:</b> {lap.tanggal}</div>
                <div className="laporan-card-actions">
                  <button className="btn-detail">Detail</button>
                  <button className="btn-export">Export</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Laporan;
