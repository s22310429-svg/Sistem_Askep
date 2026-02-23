import React, { useState, useMemo, useEffect, useCallback } from 'react';
import '../assets/Implementasi.css';
import { getPatients, getPendingInterventions, getCompletedImplementations, saveImplementation as apiSaveImpl, getImplementationDetail } from '../services/api';

const priorityMap = { Tinggi: 'high', Sedang: 'medium', Rendah: 'low' };

const formatTime = (timeString) =>
  new Date(timeString).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' });

const Implementasi = () => {
  const [allPatients, setAllPatients] = useState([]);
  const [pendingInterventions, setPendingInterventions] = useState([]);
  const [completedImplementations, setCompletedImplementations] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  const [activeTab, setActiveTab] = useState('pending');
  const [showForm, setShowForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [saving, setSaving] = useState(false);

  const initialFormData = {
    intervention_id: '',
    implementation_note: '',
    patient_response: '',
    vital_signs: { blood_pressure: '', pulse: '', temperature: '', respiration: '', oxygen_saturation: '' },
    complications: '',
    next_action: '',
    nurse_name: '',
    implementation_time: new Date().toISOString().slice(0, 16),
  };
  const [formData, setFormData] = useState(initialFormData);

  const fetchData = useCallback(async () => {
    try {
      const [pts, pending, completed] = await Promise.all([
        getPatients(),
        getPendingInterventions(),
        getCompletedImplementations(),
      ]);
      setAllPatients(pts);
      setPendingInterventions(pending);
      setCompletedImplementations(completed);
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredPending = useMemo(() =>
    pendingInterventions.filter(i => {
      const matchPat = selectedPatient ? i.patient_id === selectedPatient : true;
      const matchSearch = searchPatient ? i.patient_name.toLowerCase().includes(searchPatient.toLowerCase()) : true;
      return matchPat && matchSearch;
    }), [selectedPatient, searchPatient, pendingInterventions]);

  const filteredCompleted = useMemo(() =>
    completedImplementations.filter(i => {
      const matchPat = selectedPatient ? i.patient_id === selectedPatient : true;
      const matchSearch = searchPatient ? i.patient_name.toLowerCase().includes(searchPatient.toLowerCase()) : true;
      return matchPat && matchSearch;
    }), [selectedPatient, searchPatient, completedImplementations]);

  const highPriorityCount = filteredPending.filter(i => i.priority === 'Tinggi').length;

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({ ...prev, [parent]: { ...prev[parent], [child]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const openForm = (intervention) => {
    setFormData({ ...initialFormData, intervention_id: intervention.id, implementation_time: new Date().toISOString().slice(0, 16) });
    setShowForm(true);
  };

  const saveImplementation = async () => {
    if (!formData.implementation_note) { alert('Mohon lengkapi catatan implementasi'); return; }
    setSaving(true);
    try {
      await apiSaveImpl(formData);
      alert('Implementasi berhasil disimpan!');
      setShowForm(false);
      setFormData(initialFormData);
      fetchData(); // Refresh data from backend
    } catch (err) {
      alert(err.message || 'Gagal menyimpan implementasi');
    } finally {
      setSaving(false);
    }
  };

  const handleDetail = async (item) => {
    try {
      const data = await getImplementationDetail(item.id);
      setDetailData(data);
      setShowDetailModal(true);
    } catch (e) {
      setDetailData(item);
      setShowDetailModal(true);
    }
  };

  const handlePrint = (item) => {
    const printContent = `
LAPORAN IMPLEMENTASI KEPERAWATAN
================================
Pasien: ${item.patient_name}
Intervensi: ${item.intervention}
Catatan: ${item.implementation_note}
Respon Pasien: ${item.patient_response}
Tanda Vital: TD ${item.vital_signs?.blood_pressure || '-'} | Nadi ${item.vital_signs?.pulse || '-'} | Suhu ${item.vital_signs?.temperature || '-'}°C | RR ${item.vital_signs?.respiration || '-'} | SpO2 ${item.vital_signs?.oxygen_saturation || '-'}%
Perawat: ${item.nurse_name}
Waktu: ${formatTime(item.implementation_time)}
================================`;
    const w = window.open('', '_blank');
    w.document.write('<pre>' + printContent + '</pre>');
    w.document.close();
    w.print();
  };

  const icons = {
    clock: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>),
    check: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
    alert: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>),
    search: (<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>),
    eye: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>),
    checkSmall: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>),
    file: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>),
    edit: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>),
    x: (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>),
    save: (<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z" /><polyline points="17 21 17 13 7 13 7 21" /><polyline points="7 3 7 8 15 8" /></svg>),
    emptyPending: (<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 11-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>),
    emptyCompleted: (<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2" /><line x1="3" y1="9" x2="21" y2="9" /><line x1="9" y1="21" x2="9" y2="9" /></svg>),
  };

  return (
    <div className="im-page">
      <div className="im-header">
        <div className="im-header-text">
          <h1 className="im-title">Implementasi Keperawatan</h1>
          <p className="im-subtitle">Catat dan kelola implementasi tindakan keperawatan</p>
        </div>
        <div className="im-header-actions">
          <div className="im-search-box">
            {icons.search}
            <input type="text" className="im-search-input" placeholder="Cari pasien..." value={searchPatient} onChange={e => setSearchPatient(e.target.value)} />
          </div>
          <select className="im-filter-select" value={selectedPatient} onChange={e => setSelectedPatient(e.target.value)}>
            <option value="">Semua Pasien</option>
            {allPatients && allPatients.map(p => (<option key={p.id} value={p.id}>{p.name} ({p.rm})</option>))}
          </select>
        </div>
      </div>

      <div className="im-stats">
        <div className="im-stat-card">
          <div className="im-stat-icon im-stat-icon--pending">{icons.clock}</div>
          <div className="im-stat-info">
            <span className="im-stat-label">Menunggu</span>
            <span className="im-stat-value">{filteredPending.length}</span>
          </div>
          <div className="im-stat-bar"><div className="im-stat-bar-fill im-stat-bar--pending" style={{ width: `${Math.min(filteredPending.length * 10, 100)}%` }} /></div>
        </div>
        <div className="im-stat-card">
          <div className="im-stat-icon im-stat-icon--completed">{icons.check}</div>
          <div className="im-stat-info">
            <span className="im-stat-label">Selesai Hari Ini</span>
            <span className="im-stat-value">{filteredCompleted.length}</span>
          </div>
          <div className="im-stat-bar"><div className="im-stat-bar-fill im-stat-bar--completed" style={{ width: `${Math.min(filteredCompleted.length * 10, 100)}%` }} /></div>
        </div>
        <div className="im-stat-card">
          <div className="im-stat-icon im-stat-icon--priority">{icons.alert}</div>
          <div className="im-stat-info">
            <span className="im-stat-label">Prioritas Tinggi</span>
            <span className="im-stat-value">{highPriorityCount}</span>
          </div>
          <div className="im-stat-bar"><div className="im-stat-bar-fill im-stat-bar--priority" style={{ width: `${Math.min(highPriorityCount * 20, 100)}%` }} /></div>
        </div>
      </div>

      <div className="im-tabs">
        <button className={`im-tab ${activeTab === 'pending' ? 'im-tab--active' : ''}`} onClick={() => setActiveTab('pending')}>
          {icons.clock}<span>Menunggu Implementasi ({filteredPending.length})</span>
        </button>
        <button className={`im-tab ${activeTab === 'completed' ? 'im-tab--active' : ''}`} onClick={() => setActiveTab('completed')}>
          {icons.check}<span>Implementasi Selesai ({filteredCompleted.length})</span>
        </button>
      </div>

      {activeTab === 'pending' && (
        <div className="im-section">
          <div className="im-section-header">
            <h3 className="im-section-title">Intervensi Menunggu Implementasi</h3>
            <p className="im-section-sub">Daftar tindakan keperawatan yang perlu dilakukan</p>
          </div>
          {filteredPending.length === 0 ? (
            <div className="im-empty">{icons.emptyPending}<h3>Tidak Ada Intervensi Menunggu</h3><p>Semua intervensi telah diimplementasikan atau tidak ada pasien yang dipilih</p></div>
          ) : (
            <div className="im-card-list">
              {filteredPending.map(item => (
                <div key={item.id} className="im-card im-card--pending">
                  <div className="im-card-top">
                    <div className="im-card-patient"><h4>{item.patient_name}</h4><p>Jadwal: {formatTime(item.scheduled_time)}</p></div>
                    <div className="im-card-badges">
                      <span className={`im-badge-priority im-badge-priority--${priorityMap[item.priority] || 'medium'}`}>{item.priority}</span>
                      <span className="im-badge-freq">{item.frequency}</span>
                    </div>
                  </div>
                  <div className="im-card-body"><h5>{item.intervention}</h5></div>
                  <div className="im-card-actions">
                    <button className="im-btn im-btn--primary" onClick={() => openForm(item)}>{icons.checkSmall} Implementasi</button>
                    <button className="im-btn im-btn--outline" onClick={() => handleDetail(item)}>{icons.eye} Detail</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="im-section">
          <div className="im-section-header">
            <h3 className="im-section-title">Implementasi Selesai</h3>
            <p className="im-section-sub">Riwayat tindakan keperawatan yang telah dilakukan</p>
          </div>
          {filteredCompleted.length === 0 ? (
            <div className="im-empty">{icons.emptyCompleted}<h3>Belum Ada Implementasi</h3><p>Belum ada implementasi yang tercatat untuk hari ini</p></div>
          ) : (
            <div className="im-card-list">
              {filteredCompleted.map(item => (
                <div key={item.id} className="im-card im-card--completed">
                  <div className="im-card-top">
                    <div className="im-card-patient"><h4>{item.patient_name}</h4><p>Waktu: {formatTime(item.implementation_time)}</p></div>
                    <span className="im-nurse-tag">{item.nurse_name}</span>
                  </div>
                  <div className="im-card-body">
                    <h5>{item.intervention}</h5>
                    <div className="im-details">
                      <div className="im-detail-block"><h6>Catatan Implementasi</h6><p>{item.implementation_note}</p></div>
                      <div className="im-detail-block"><h6>Respon Pasien</h6><p>{item.patient_response}</p></div>
                      <div className="im-detail-block">
                        <h6>Tanda Vital</h6>
                        <div className="im-vitals-grid">
                          <span>TD: {item.vital_signs.blood_pressure}</span>
                          <span>Nadi: {item.vital_signs.pulse}</span>
                          <span>Suhu: {item.vital_signs.temperature}&deg;C</span>
                          <span>RR: {item.vital_signs.respiration}</span>
                          <span>SpO2: {item.vital_signs.oxygen_saturation}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="im-card-actions">
                    <button className="im-btn im-btn--outline" onClick={() => handlePrint(item)}>{icons.file} Print</button>
                    <button className="im-btn im-btn--outline" onClick={() => handleDetail(item)}>{icons.edit} Detail</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {showForm && (
        <div className="im-overlay" onClick={() => setShowForm(false)}>
          <div className="im-modal" onClick={e => e.stopPropagation()}>
            <div className="im-modal-header">
              <h3>Form Implementasi Keperawatan</h3>
              <button className="im-modal-close" onClick={() => setShowForm(false)}>{icons.x}</button>
            </div>
            <div className="im-modal-body">
              <div className="im-form-group">
                <label>Waktu Implementasi</label>
                <input type="datetime-local" className="im-input" value={formData.implementation_time} onChange={e => handleInputChange('implementation_time', e.target.value)} />
              </div>
              <div className="im-form-group">
                <label>Catatan Implementasi <span className="im-required">*</span></label>
                <textarea className="im-textarea" rows="4" placeholder="Jelaskan secara detail bagaimana tindakan dilakukan..." value={formData.implementation_note} onChange={e => handleInputChange('implementation_note', e.target.value)} />
              </div>
              <div className="im-form-group">
                <label>Respon Pasien</label>
                <textarea className="im-textarea" rows="3" placeholder="Bagaimana respon pasien terhadap tindakan yang diberikan..." value={formData.patient_response} onChange={e => handleInputChange('patient_response', e.target.value)} />
              </div>
              <div className="im-form-group">
                <label>Tanda Vital</label>
                <div className="im-vital-form-grid">
                  <input type="text" className="im-input" placeholder="TD (mmHg)" value={formData.vital_signs.blood_pressure} onChange={e => handleInputChange('vital_signs.blood_pressure', e.target.value)} />
                  <input type="text" className="im-input" placeholder="Nadi (x/mnt)" value={formData.vital_signs.pulse} onChange={e => handleInputChange('vital_signs.pulse', e.target.value)} />
                  <input type="text" className="im-input" placeholder="Suhu" value={formData.vital_signs.temperature} onChange={e => handleInputChange('vital_signs.temperature', e.target.value)} />
                  <input type="text" className="im-input" placeholder="RR (x/mnt)" value={formData.vital_signs.respiration} onChange={e => handleInputChange('vital_signs.respiration', e.target.value)} />
                  <input type="text" className="im-input" placeholder="SpO2 (%)" value={formData.vital_signs.oxygen_saturation} onChange={e => handleInputChange('vital_signs.oxygen_saturation', e.target.value)} />
                </div>
              </div>
              <div className="im-form-group">
                <label>Komplikasi (jika ada)</label>
                <textarea className="im-textarea" rows="2" placeholder="Catat jika ada komplikasi atau efek samping..." value={formData.complications} onChange={e => handleInputChange('complications', e.target.value)} />
              </div>
              <div className="im-form-group">
                <label>Tindakan Selanjutnya</label>
                <textarea className="im-textarea" rows="2" placeholder="Rencana tindakan atau observasi selanjutnya..." value={formData.next_action} onChange={e => handleInputChange('next_action', e.target.value)} />
              </div>
              <div className="im-form-group">
                <label>Nama Perawat <span className="im-required">*</span></label>
                <input type="text" className="im-input" placeholder="Masukkan nama lengkap perawat" value={formData.nurse_name} onChange={e => handleInputChange('nurse_name', e.target.value)} />
              </div>
            </div>
            <div className="im-modal-footer">
              <button className="im-btn im-btn--outline" onClick={() => setShowForm(false)}>Batal</button>
              <button className="im-btn im-btn--primary" onClick={saveImplementation} disabled={saving}>{icons.save} {saving ? 'Menyimpan...' : 'Simpan Implementasi'}</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && detailData && (
        <div className="im-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="im-modal" onClick={e => e.stopPropagation()}>
            <div className="im-modal-header">
              <h3>Detail - {detailData.patient_name}</h3>
              <button className="im-modal-close" onClick={() => setShowDetailModal(false)}>{icons.x}</button>
            </div>
            <div className="im-modal-body">
              <div className="im-form-group"><label>Intervensi</label><p style={{margin:0,padding:'8px 0',fontWeight:600}}>{detailData.intervention}</p></div>
              {detailData.implementation_note && <div className="im-form-group"><label>Catatan Implementasi</label><p style={{margin:0,padding:'8px 0'}}>{detailData.implementation_note}</p></div>}
              {detailData.patient_response && <div className="im-form-group"><label>Respon Pasien</label><p style={{margin:0,padding:'8px 0'}}>{detailData.patient_response}</p></div>}
              {detailData.vital_signs && <div className="im-form-group"><label>Tanda Vital</label><div className="im-vitals-grid"><span>TD: {detailData.vital_signs.blood_pressure || '-'}</span><span>Nadi: {detailData.vital_signs.pulse || '-'}</span><span>Suhu: {detailData.vital_signs.temperature || '-'}&deg;C</span><span>RR: {detailData.vital_signs.respiration || '-'}</span><span>SpO2: {detailData.vital_signs.oxygen_saturation || '-'}%</span></div></div>}
              {detailData.nurse_name && <div className="im-form-group"><label>Perawat</label><p style={{margin:0,padding:'8px 0'}}>{detailData.nurse_name}</p></div>}
              {detailData.scheduled_time && <div className="im-form-group"><label>Jadwal</label><p style={{margin:0,padding:'8px 0'}}>{formatTime(detailData.scheduled_time)}</p></div>}
              {detailData.priority && <div className="im-form-group"><label>Prioritas</label><p style={{margin:0,padding:'8px 0'}}>{detailData.priority}</p></div>}
            </div>
            <div className="im-modal-footer">
              <button className="im-btn im-btn--outline" onClick={() => setShowDetailModal(false)}>Tutup</button>
              {detailData.status === 'completed' && <button className="im-btn im-btn--primary" onClick={() => handlePrint(detailData)}>{icons.file} Print</button>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Implementasi;
