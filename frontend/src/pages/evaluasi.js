import React, { useState } from 'react';
import '../assets/Evaluasi.css';

// Dummy data for demonstration
const pasienList = [
  { id: 1, nama: 'Ahmad Wijaya', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa awal', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi obat + edukasi', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → kondisi membaik', status: 'done' },
  ], trenNyeri: [8, 6, 4, 3] },
  { id: 2, nama: 'Siti Aminah', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa awal', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi edukasi', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → perlu monitoring', status: 'pending' },
  ], trenNyeri: [7, 7, 6, 6] },
  { id: 3, nama: 'Budi Santoso', status: 'memburuk', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa awal', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi obat', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → kondisi memburuk', status: 'alert' },
  ], trenNyeri: [5, 6, 7, 8] },
  { id: 4, nama: 'Dewi Lestari', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa pneumonia', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi antibiotik', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [6, 5, 4, 3] },
  { id: 5, nama: 'Joko Susilo', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa gastritis', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi diet lambung', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → perlu monitoring', status: 'pending' },
  ], trenNyeri: [5, 5, 6, 5] },
  { id: 6, nama: 'Lina Marlina', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa asma', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi inhalasi', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [7, 6, 5, 4] },
  { id: 7, nama: 'Hendra Gunawan', status: 'memburuk', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa gagal ginjal', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi diet renal', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → memburuk', status: 'alert' },
  ], trenNyeri: [6, 7, 8, 8] },
  { id: 8, nama: 'Nur Aisyah', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa anemia', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi suplemen', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → monitoring', status: 'pending' },
  ], trenNyeri: [4, 4, 5, 4] },
  { id: 9, nama: 'Agus Setiawan', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa PPOK', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi oksigen', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [7, 6, 5, 5] },
  { id: 10, nama: 'Maria Josephine', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa DBD', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi cairan', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → monitoring', status: 'pending' },
  ], trenNyeri: [6, 6, 7, 6] },
  { id: 11, nama: 'Rahmat Hidayat', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa hiperglikemia', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi insulin', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [8, 7, 6, 5] },
  { id: 12, nama: 'Tania Kusuma', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa ISK', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi antibiotik', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → monitoring', status: 'pending' },
  ], trenNyeri: [5, 5, 6, 5] },
  { id: 13, nama: 'Fajar Pratama', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa ulkus peptikum', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi diet', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [6, 5, 4, 3] },
  { id: 14, nama: 'Indah Wulandari', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa migren', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi analgesik', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → monitoring', status: 'pending' },
  ], trenNyeri: [7, 7, 6, 6] },
  { id: 15, nama: 'Dedi Kurniawan', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa DM & HT', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi diet & insulin', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [8, 7, 6, 5] },
  { id: 16, nama: 'Ayu Rahmawati', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa apendisitis', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi operasi', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → monitoring', status: 'pending' },
  ], trenNyeri: [6, 6, 7, 6] },
  { id: 17, nama: 'Bambang Herlambang', status: 'memburuk', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa jantung koroner', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi monitoring EKG', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → memburuk', status: 'alert' },
  ], trenNyeri: [7, 8, 8, 9] },
  { id: 18, nama: 'Silvia Anggraini', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa gastritis', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi diet', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [5, 4, 4, 3] },
  { id: 19, nama: 'Toni Saputra', status: 'monitoring', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa TBC paru', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi OAT', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → monitoring', status: 'pending' },
  ], trenNyeri: [6, 6, 7, 6] },
  { id: 20, nama: 'Ratna Dewi', status: 'membaik', progress: [
    { hari: 'Hari 1', deskripsi: 'Diagnosa vertigo', status: 'done' },
    { hari: 'Hari 2', deskripsi: 'Implementasi latihan keseimbangan', status: 'done' },
    { hari: 'Hari 3', deskripsi: 'Evaluasi → membaik', status: 'done' },
  ], trenNyeri: [7, 6, 5, 4] },
];

const statusBadge = {
  membaik: { color: '#22c55e', icon: '🟢', label: 'Membaik' },
  monitoring: { color: '#eab308', icon: '🟡', label: 'Perlu Monitoring' },
  memburuk: { color: '#ef4444', icon: '🔴', label: 'Memburuk' },
};

function Evaluasi() {
  const [mode, setMode] = useState('light');
  const [view, setView] = useState('table');

  // State dan filter pencarian pasien
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState("");
  const filteredPatients = pasienList.filter(
    (p) => p.nama.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Data yang ditampilkan (terfilter berdasarkan pencarian dan pilihan pasien)
  const displayedPatients = pasienList.filter((p) => {
    const matchesSearch = searchTerm ? p.nama.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesSelected = selectedPatient ? p.id === parseInt(selectedPatient) : true;
    return matchesSearch && matchesSelected;
  });

  // Pie chart dummy data
  const pieData = [
    { label: 'Membaik', value: 1, color: '#22c55e' },
    { label: 'Perlu Monitoring', value: 1, color: '#eab308' },
    { label: 'Memburuk', value: 1, color: '#ef4444' },
  ];

  // AI Analysis dummy
  const aiAnalysis =
    '🤖 Rekomendasi: Pasien dengan nyeri skala 6 setelah 3 hari implementasi masih tinggi, disarankan rujukan dokter atau intervensi tambahan.';

  return (
    <div className={`evaluasi-page ${mode}`}> 
      <div className="evaluasi-header">
      {/* Kolom Pencarian Pasien */}
      <div className="evaluasi-search-bar">
        <input
          type="text"
          className="search-input"
          placeholder="Cari nama pasien..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          className="search-dropdown"
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">Semua Pasien</option>
          {filteredPatients.map((p) => (
            <option key={p.id} value={p.id}>
              {p.nama}
            </option>
          ))}
        </select>
      </div>
        <h1>Evaluasi Pasien</h1>
        <div className="evaluasi-header-actions">
          <button onClick={() => setMode(mode === 'light' ? 'dark' : 'light')}>
            {mode === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
          <button onClick={() => setView(view === 'table' ? 'card' : 'table')}>
            {view === 'table' ? '🔳 Card View' : '📋 Table View'}
          </button>
          <button>⬇️ Export</button>
          <button>📧 Share</button>
        </div>
      </div>

      {/* Mini dashboard with charts */}
      <div className="evaluasi-dashboard-mini">
        <div className="evaluasi-pie-chart">
          {/* Simple SVG Pie Chart */}
          <svg width="80" height="80" viewBox="0 0 32 32">
            <circle r="16" cx="16" cy="16" fill="#f3f4f6" />
            <circle r="16" cx="16" cy="16" fill="none" stroke="#22c55e" strokeWidth="32" strokeDasharray="33 67" strokeDashoffset="0" />
            <circle r="16" cx="16" cy="16" fill="none" stroke="#eab308" strokeWidth="32" strokeDasharray="33 67" strokeDashoffset="-33" />
            <circle r="16" cx="16" cy="16" fill="none" stroke="#ef4444" strokeWidth="32" strokeDasharray="34 66" strokeDashoffset="-66" />
          </svg>
          <div className="evaluasi-pie-legend">
            {pieData.map((d) => (
              <div key={d.label} style={{ color: d.color }}>
                <span style={{ fontSize: 18 }}>●</span> {d.label}
              </div>
            ))}
          </div>
        </div>
        <div className="evaluasi-ai-analysis">
          <div className="ai-analysis-box">{aiAnalysis}</div>
        </div>
      </div>

      {/* Progress tracker & timeline */}
      <div className="evaluasi-progress-section">
        <h2>Progress Tracker Pasien</h2>
        {displayedPatients.map((pasien) => (
          <div className="evaluasi-pasien-timeline" key={pasien.id}>
            <div className="evaluasi-pasien-header">
              <span className="evaluasi-pasien-nama">{pasien.nama}</span>
              <span className="evaluasi-status-badge" style={{ background: statusBadge[pasien.status].color }}>
                {statusBadge[pasien.status].icon} {statusBadge[pasien.status].label}
              </span>
            </div>
            <div className="evaluasi-timeline">
              {pasien.progress.map((step, idx) => (
                <div className={`evaluasi-timeline-step ${step.status}`} key={idx}>
                  <div className="timeline-dot"></div>
                  <div className="timeline-content">
                    <div className="timeline-day">{step.hari}</div>
                    <div className="timeline-desc">{step.deskripsi}</div>
                  </div>
                  {idx < pasien.progress.length - 1 && <div className="timeline-connector"></div>}
                </div>
              ))}
            </div>
            {/* Line chart dummy */}
            <div className="evaluasi-line-chart">
              <svg width="180" height="40" viewBox="0 0 180 40">
                <polyline
                  fill="none"
                  stroke="#2563eb"
                  strokeWidth="3"
                  points={pasien.trenNyeri.map((v, i) => `${i * 45 + 10},${40 - v * 4}`).join(' ')}
                />
                {pasien.trenNyeri.map((v, i) => (
                  <circle key={i} cx={i * 45 + 10} cy={40 - v * 4} r="4" fill="#60a5fa" />
                ))}
              </svg>
              <div className="line-chart-label">Tren Nyeri: {pasien.trenNyeri.join(' → ')}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Table/Card view for all pasien */}
      <div className="evaluasi-data-section">
        {view === 'table' ? (
          <table className="evaluasi-table">
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
              {displayedPatients.map((pasien) => (
                <tr key={pasien.id}>
                  <td>{pasien.nama}</td>
                  <td>
                    <span className="evaluasi-status-badge" style={{ background: statusBadge[pasien.status].color }}>
                      {statusBadge[pasien.status].icon} {statusBadge[pasien.status].label}
                    </span>
                  </td>
                  <td>{pasien.progress.map((p) => p.hari).join(', ')}</td>
                  <td>{pasien.trenNyeri.join(' → ')}</td>
                  <td>{pasien.progress[pasien.progress.length - 1].deskripsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="evaluasi-card-grid">
            {displayedPatients.map((pasien) => (
              <div className="evaluasi-pasien-card" key={pasien.id}>
                <div className="evaluasi-pasien-card-header">
                  <span className="evaluasi-pasien-nama">{pasien.nama}</span>
                  <span className="evaluasi-status-badge" style={{ background: statusBadge[pasien.status].color }}>
                    {statusBadge[pasien.status].icon} {statusBadge[pasien.status].label}
                  </span>
                </div>
                <div className="evaluasi-pasien-card-body">
                  <div className="evaluasi-pasien-progress">
                    {pasien.progress.map((step, idx) => (
                      <div className={`evaluasi-card-step ${step.status}`} key={idx}>
                        <span className="card-step-day">{step.hari}</span>
                        <span className="card-step-desc">{step.deskripsi}</span>
                      </div>
                    ))}
                  </div>
                  <div className="evaluasi-line-chart">
                    <svg width="140" height="32" viewBox="0 0 140 32">
                      <polyline
                        fill="none"
                        stroke="#2563eb"
                        strokeWidth="2.5"
                        points={pasien.trenNyeri.map((v, i) => `${i * 40 + 8},${32 - v * 3}`).join(' ')}
                      />
                      {pasien.trenNyeri.map((v, i) => (
                        <circle key={i} cx={i * 40 + 8} cy={32 - v * 3} r="3" fill="#60a5fa" />
                      ))}
                    </svg>
                    <div className="line-chart-label">Tren Nyeri: {pasien.trenNyeri.join(' → ')}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Evaluasi;
