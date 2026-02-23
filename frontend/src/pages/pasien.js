import React, { useState, useMemo, useEffect, useCallback } from 'react';
import '../assets/Patients.css';
import { getPatients, createPatient, updatePatient } from '../services/api';

const ITEMS_PER_PAGE = 6;

const statusMap = {
  'Rawat Inap': 'inap',
  'Rawat Jalan': 'jalan',
  Pulang: 'pulang',
};

const Pasien = ({ onNavigate }) => {
  const [patientsData, setPatientsData] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({ name: '', age: '', gender: 'Laki-laki', diagnosis: '', status: 'Rawat Inap' });
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      const data = await getPatients();
      setPatientsData(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchPatients(); }, [fetchPatients]);

  /* ---------- derived ---------- */
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return patientsData
      .filter((p) => {
        const matchText =
          p.name.toLowerCase().includes(q) ||
          p.rm.toLowerCase().includes(q) ||
          p.diagnosis.toLowerCase().includes(q);
        const matchStatus = !statusFilter || p.status === statusFilter;
        return matchText && matchStatus;
      })
      .sort((a, b) => {
        const aA = a.name.trim().toLowerCase().startsWith('a');
        const bA = b.name.trim().toLowerCase().startsWith('a');
        if (aA && !bA) return -1;
        if (!aA && bA) return 1;
        return 0;
      });
  }, [search, statusFilter, patientsData]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const paged = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const countByStatus = (s) => patientsData.filter((p) => p.status === s).length;

  /* ---------- handlers ---------- */
  const handleAdd = () => {
    setFormData({ name: '', age: '', gender: 'Laki-laki', diagnosis: '', status: 'Rawat Inap' });
    setFormError('');
    setShowAddModal(true);
  };
  const handleView = (p) => { setSelectedPatient(p); setShowViewModal(true); };
  const handleEdit = (p) => {
    setSelectedPatient(p);
    setFormData({ name: p.name, age: p.age, gender: p.gender, diagnosis: p.diagnosis, status: p.status });
    setFormError('');
    setShowEditModal(true);
  };
  const handleAskep = (p) => { if (onNavigate) onNavigate('askep'); };
  const handleReport = (p) => { if (onNavigate) onNavigate('laporan'); };

  const handleSaveAdd = async () => {
    if (!formData.name || !formData.age || !formData.diagnosis) {
      setFormError('Nama, usia, dan diagnosis wajib diisi!'); return;
    }
    setSaving(true);
    try {
      await createPatient(formData);
      setShowAddModal(false);
      fetchPatients();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const handleSaveEdit = async () => {
    if (!formData.name || !formData.age || !formData.diagnosis) {
      setFormError('Nama, usia, dan diagnosis wajib diisi!'); return;
    }
    setSaving(true);
    try {
      await updatePatient(selectedPatient.id, formData);
      setShowEditModal(false);
      fetchPatients();
    } catch (e) { setFormError(e.message); }
    finally { setSaving(false); }
  };

  const changePage = (n) => {
    if (n >= 1 && n <= totalPages) setPage(n);
  };

  // Reset page when filters change
  const handleSearch = (v) => { setSearch(v); setPage(1); };
  const handleStatus = (v) => { setStatusFilter(v); setPage(1); };

  /* ---------- page buttons ---------- */
  const pageButtons = () => {
    const btns = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= page - 1 && i <= page + 1)) {
        btns.push(i);
      } else if (btns[btns.length - 1] !== '...') {
        btns.push('...');
      }
    }
    return btns;
  };

  /* ---------- render ---------- */
  return (
    <div className="ps-page">
      {/* title row */}
      <div className="ps-title-row">
        <div>
          <h2 className="ps-title">Data Pasien</h2>
          <p className="ps-subtitle">Kelola dan pantau informasi pasien</p>
        </div>
        <button className="ps-btn-add" onClick={handleAdd}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Tambah Pasien
        </button>
      </div>

      {/* stats */}
      <div className="ps-stats">
        {[
          { label: 'TOTAL PASIEN', value: patientsData.length, color: '#10b981', icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"/></svg>
          )},
          { label: 'AKTIF HARI INI', value: countByStatus('Rawat Inap'), color: '#3b82f6', icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          )},
          { label: 'PASIEN BARU', value: countByStatus('Rawat Jalan'), color: '#f59e0b', icon: (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9l-5.91 5.74L18 22l-6-3.15L6 22l1.91-7.26L2 9l6.91-1.74L12 2z"/></svg>
          )},
        ].map((s, i) => (
          <div className="ps-stat-card" key={i}>
            <span className="ps-stat-icon" style={{ background: s.color }}>{s.icon}</span>
            <div>
              <span className="ps-stat-label">{s.label}</span>
              <span className="ps-stat-value">{s.value}</span>
            </div>
          </div>
        ))}
      </div>

      {/* patient list */}
      <div className="ps-list-card">
        <div className="ps-list-header">
          <h3 className="ps-list-title">Daftar Pasien</h3>
          <div className="ps-filters">
            <div className="ps-search">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Cari pasien..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
              />
            </div>
            <select
              className="ps-select"
              value={statusFilter}
              onChange={(e) => handleStatus(e.target.value)}
            >
              <option value="">Semua Status</option>
              <option value="Rawat Inap">Rawat Inap</option>
              <option value="Rawat Jalan">Rawat Jalan</option>
              <option value="Pulang">Pulang</option>
            </select>
          </div>
        </div>

        {/* cards */}
        <div className="ps-cards">
          {paged.length === 0 ? (
            <div className="ps-empty">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <p>Tidak ada pasien yang ditemukan</p>
            </div>
          ) : (
            paged.map((pt) => (
              <div className="ps-card" key={pt.id}>
                <div className="ps-card-avatar" style={{ background: statusMap[pt.status] === 'inap' ? '#2563eb' : statusMap[pt.status] === 'jalan' ? '#10b981' : '#64748b' }}>
                  {pt.avatar}
                </div>

                <div className="ps-card-body">
                  <h4 className="ps-card-name">{pt.name}</h4>
                  <p className="ps-card-meta">ID: {pt.id}  |  {pt.age} tahun  |  {pt.gender}</p>
                  <p className="ps-card-diag">{pt.diagnosis}</p>
                  <span className={`ps-badge ps-badge--${statusMap[pt.status]}`}>
                    {pt.status.toUpperCase()}
                  </span>
                </div>

                <div className="ps-card-actions">
                  <button className="ps-act ps-act--view" title="Lihat Detail" onClick={() => handleView(pt)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>
                  </button>
                  <button className="ps-act ps-act--edit" title="Edit" onClick={() => handleEdit(pt)}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>
                  </button>
                  {pt.status === 'Pulang' ? (
                    <button className="ps-act ps-act--report" title="Lihat Laporan" onClick={() => handleReport(pt)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/></svg>
                    </button>
                  ) : (
                    <button className="ps-act ps-act--askep" title="Buat Askep" onClick={() => handleAskep(pt)}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* pagination */}
        {filtered.length > ITEMS_PER_PAGE && (
          <div className="ps-pagination">
            <button className="ps-page-btn" disabled={page === 1} onClick={() => changePage(page - 1)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>
              Previous
            </button>
            <div className="ps-page-nums">
              {pageButtons().map((n, i) =>
                n === '...' ? (
                  <span key={i} className="ps-page-dots">...</span>
                ) : (
                  <button
                    key={i}
                    className={`ps-page-num ${n === page ? 'active' : ''}`}
                    onClick={() => changePage(n)}
                  >
                    {n}
                  </button>
                )
              )}
            </div>
            <button className="ps-page-btn" disabled={page === totalPages} onClick={() => changePage(page + 1)}>
              Next
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>
            </button>
          </div>
        )}
      </div>

      {/* ======= ADD MODAL ======= */}
      {showAddModal && (
        <div className="ps-overlay" onClick={() => setShowAddModal(false)}>
          <div className="ps-modal" onClick={e => e.stopPropagation()}>
            <h3>Tambah Pasien Baru</h3>
            {formError && <div style={{color:'#e11d48',marginBottom:8,fontWeight:600,background:'#fef2f2',padding:'8px 12px',borderRadius:8}}>{formError}</div>}
            <div className="ps-form-group"><label>Nama</label><input type="text" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} placeholder="Nama lengkap pasien" /></div>
            <div className="ps-form-group"><label>Usia</label><input type="number" value={formData.age} onChange={e => setFormData(f => ({...f, age: e.target.value}))} placeholder="Usia" /></div>
            <div className="ps-form-group"><label>Gender</label><select value={formData.gender} onChange={e => setFormData(f => ({...f, gender: e.target.value}))}><option>Laki-laki</option><option>Perempuan</option></select></div>
            <div className="ps-form-group"><label>Diagnosis</label><input type="text" value={formData.diagnosis} onChange={e => setFormData(f => ({...f, diagnosis: e.target.value}))} placeholder="Diagnosis pasien" /></div>
            <div className="ps-form-group"><label>Status</label><select value={formData.status} onChange={e => setFormData(f => ({...f, status: e.target.value}))}><option>Rawat Inap</option><option>Rawat Jalan</option><option>Pulang</option></select></div>
            <div className="ps-modal-actions">
              <button className="ps-btn-cancel" onClick={() => setShowAddModal(false)}>Batal</button>
              <button className="ps-btn-add" onClick={handleSaveAdd} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= VIEW MODAL ======= */}
      {showViewModal && selectedPatient && (
        <div className="ps-overlay" onClick={() => setShowViewModal(false)}>
          <div className="ps-modal" onClick={e => e.stopPropagation()}>
            <h3>Detail Pasien</h3>
            <div className="ps-detail-row"><strong>ID:</strong> {selectedPatient.id}</div>
            <div className="ps-detail-row"><strong>No. RM:</strong> {selectedPatient.rm}</div>
            <div className="ps-detail-row"><strong>Nama:</strong> {selectedPatient.name}</div>
            <div className="ps-detail-row"><strong>Usia:</strong> {selectedPatient.age} tahun</div>
            <div className="ps-detail-row"><strong>Gender:</strong> {selectedPatient.gender}</div>
            <div className="ps-detail-row"><strong>Diagnosis:</strong> {selectedPatient.diagnosis}</div>
            <div className="ps-detail-row"><strong>Status:</strong> {selectedPatient.status}</div>
            <div className="ps-modal-actions">
              <button className="ps-btn-cancel" onClick={() => setShowViewModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {/* ======= EDIT MODAL ======= */}
      {showEditModal && selectedPatient && (
        <div className="ps-overlay" onClick={() => setShowEditModal(false)}>
          <div className="ps-modal" onClick={e => e.stopPropagation()}>
            <h3>Edit Pasien - {selectedPatient.name}</h3>
            {formError && <div style={{color:'#e11d48',marginBottom:8,fontWeight:600,background:'#fef2f2',padding:'8px 12px',borderRadius:8}}>{formError}</div>}
            <div className="ps-form-group"><label>Nama</label><input type="text" value={formData.name} onChange={e => setFormData(f => ({...f, name: e.target.value}))} /></div>
            <div className="ps-form-group"><label>Usia</label><input type="number" value={formData.age} onChange={e => setFormData(f => ({...f, age: e.target.value}))} /></div>
            <div className="ps-form-group"><label>Gender</label><select value={formData.gender} onChange={e => setFormData(f => ({...f, gender: e.target.value}))}><option>Laki-laki</option><option>Perempuan</option></select></div>
            <div className="ps-form-group"><label>Diagnosis</label><input type="text" value={formData.diagnosis} onChange={e => setFormData(f => ({...f, diagnosis: e.target.value}))} /></div>
            <div className="ps-form-group"><label>Status</label><select value={formData.status} onChange={e => setFormData(f => ({...f, status: e.target.value}))}><option>Rawat Inap</option><option>Rawat Jalan</option><option>Pulang</option></select></div>
            <div className="ps-modal-actions">
              <button className="ps-btn-cancel" onClick={() => setShowEditModal(false)}>Batal</button>
              <button className="ps-btn-add" onClick={handleSaveEdit} disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan Perubahan'}</button>
            </div>
          </div>
        </div>
      )}

      {loading && <div style={{textAlign:'center',padding:40,color:'#64748b'}}>Memuat data pasien...</div>}
    </div>
  );
};

export default Pasien;
