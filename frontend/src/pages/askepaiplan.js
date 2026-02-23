import React, { useState, useEffect } from 'react';
import '../assets/AskepAiPlan.css';
import { getPatients, generateAskepPlan, saveAskepPlan } from '../services/api';

const AskepAiPlan = () => {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [assessment, setAssessment] = useState({
    subjective: '',
    objective: '',
    vital: { bp: '', pulse: '', temp: '', resp: '', spo2: '' },
  });
  const [generating, setGenerating] = useState(false);
  const [plan, setPlan] = useState(null);
  const [tab, setTab] = useState('assessment');
  const [savingPlan, setSavingPlan] = useState(false);
  const [editingIntv, setEditingIntv] = useState(null);
  const [editForm, setEditForm] = useState({ intervention: '', rationale: '', frequency: '' });

  useEffect(() => {
    getPatients().then(setPatients).catch(console.error);
  }, []);

  const patientData = patients.find((p) => p.id === selectedPatient);

  /* helpers */
  const set = (field, val) => {
    if (field.includes('.')) {
      const [p, c] = field.split('.');
      setAssessment((prev) => ({ ...prev, [p]: { ...prev[p], [c]: val } }));
    } else {
      setAssessment((prev) => ({ ...prev, [field]: val }));
    }
  };

  const canGenerate = selectedPatient && assessment.subjective && assessment.objective;

  const generate = async () => {
    if (!canGenerate) { alert('Mohon lengkapi data pasien dan assessment terlebih dahulu'); return; }
    setGenerating(true);
    try {
      const data = await generateAskepPlan(selectedPatient, assessment);
      setPlan(data.plan);
      setTab('plan');
    } catch (err) {
      alert(err.message || 'Gagal generate rencana');
    } finally {
      setGenerating(false);
    }
  };

  const handleSavePlan = async () => {
    if (!plan) return;
    setSavingPlan(true);
    try {
      await saveAskepPlan(selectedPatient, assessment, plan);
      alert('Rencana asuhan berhasil disimpan!');
    } catch (err) {
      alert(err.message || 'Gagal menyimpan rencana');
    } finally {
      setSavingPlan(false);
    }
  };

  const handleEditIntv = (intv) => {
    setEditingIntv(intv.id);
    setEditForm({ intervention: intv.intervention, rationale: intv.rationale, frequency: intv.frequency });
  };

  const handleSaveEditIntv = (intvId) => {
    setPlan(prev => ({
      ...prev,
      interventions: prev.interventions.map(i => i.id === intvId ? { ...i, ...editForm } : i),
    }));
    setEditingIntv(null);
  };

  const reset = () => {
    setSelectedPatient('');
    setAssessment({ subjective: '', objective: '', vital: { bp: '', pulse: '', temp: '', resp: '', spo2: '' } });
    setPlan(null);
    setTab('assessment');
  };

  /* ---------- render ---------- */
  return (
    <div className="ak-page">

      {/* title */}
      <div className="ak-title-row">
        <div>
          <h2 className="ak-title">Askep AI Plan</h2>
          <p className="ak-subtitle">Buat rencana asuhan keperawatan dengan bantuan Artificial Intelligence</p>
        </div>
        <div className="ak-title-actions">
          <button className="ak-btn ak-btn--outline" onClick={reset}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M12 5v14M5 12h14"/></svg>
            Assessment Baru
          </button>
          {plan && (
            <button className="ak-btn ak-btn--primary" onClick={handleSavePlan} disabled={savingPlan}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>
              {savingPlan ? 'Menyimpan...' : 'Simpan Rencana'}
            </button>
          )}
        </div>
      </div>

      {/* AI banner */}
      <div className="ak-banner">
        <div className="ak-banner-left">
          <span className="ak-banner-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          </span>
          <div>
            <h3 className="ak-banner-title">AI Assistant Ready</h3>
            <p className="ak-banner-desc">Sistem AI siap membantu Anda membuat rencana asuhan keperawatan yang komprehensif dan evidence-based</p>
          </div>
        </div>
        <div className="ak-banner-tags">
          <span className="ak-tag">Diagnosis Keperawatan</span>
          <span className="ak-tag">Intervensi</span>
          <span className="ak-tag">Outcome</span>
        </div>
      </div>

      {/* tabs */}
      <div className="ak-tabs">
        <button className={`ak-tab ${tab === 'assessment' ? 'active' : ''}`} onClick={() => setTab('assessment')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 12h6M9 16h6M9 8h6"/></svg>
          Assessment
        </button>
        <button className={`ak-tab ${tab === 'plan' ? 'active' : ''}`} onClick={() => setTab('plan')} disabled={!plan}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="M22 4L12 14.01l-3-3"/></svg>
          Rencana AI
        </button>
      </div>

      {/* ==================== ASSESSMENT TAB ==================== */}
      {tab === 'assessment' && (
        <div className="ak-form-stack">

          {/* patient select */}
          <section className="ak-card">
            <h3 className="ak-card-heading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Pilih Pasien
            </h3>
            <select className="ak-select" value={selectedPatient} onChange={(e) => setSelectedPatient(e.target.value)}>
              <option value="">-- Pilih Pasien --</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>{p.name} ({p.rm}) - {p.diagnosis}</option>
              ))}
            </select>
            {patientData && (
              <div className="ak-patient-preview">
                <div className="ak-patient-avatar" style={{ background: '#2563eb' }}>{patientData.avatar}</div>
                <div>
                  <strong>{patientData.name}</strong>
                  <span>RM: {patientData.rm}  |  {patientData.age} tahun  |  {patientData.gender}</span>
                  <span>Diagnosis: {patientData.diagnosis}</span>
                </div>
              </div>
            )}
          </section>

          {/* subjective */}
          <section className="ak-card">
            <h3 className="ak-card-heading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              Data Subjektif
            </h3>
            <label className="ak-label">Keluhan Utama & Riwayat Penyakit</label>
            <textarea className="ak-textarea" rows="4" placeholder="Masukkan keluhan pasien, riwayat penyakit, dan informasi subjektif lainnya..." value={assessment.subjective} onChange={(e) => set('subjective', e.target.value)} />
          </section>

          {/* objective */}
          <section className="ak-card">
            <h3 className="ak-card-heading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
              Data Objektif
            </h3>
            <label className="ak-label">Temuan Pemeriksaan Fisik</label>
            <textarea className="ak-textarea" rows="4" placeholder="Masukkan hasil pemeriksaan fisik dan temuan objektif lainnya..." value={assessment.objective} onChange={(e) => set('objective', e.target.value)} />

            <div className="ak-vital-grid">
              {[
                { key: 'vital.bp', label: 'Tekanan Darah', ph: '120/80 mmHg' },
                { key: 'vital.pulse', label: 'Nadi', ph: '80 x/menit' },
                { key: 'vital.temp', label: 'Suhu', ph: '36.5 C' },
                { key: 'vital.resp', label: 'Pernapasan', ph: '20 x/menit' },
                { key: 'vital.spo2', label: 'Saturasi O2', ph: '98%' },
              ].map((v) => (
                <div className="ak-vital-item" key={v.key}>
                  <label className="ak-label">{v.label}</label>
                  <input className="ak-input" type="text" placeholder={v.ph} value={assessment.vital[v.key.split('.')[1]]} onChange={(e) => set(v.key, e.target.value)} />
                </div>
              ))}
            </div>
          </section>

          {/* generate */}
          <div className="ak-generate">
            <button className="ak-btn-generate" onClick={generate} disabled={generating || !canGenerate}>
              {generating ? (
                <><span className="ak-spinner" /> AI sedang menganalisis...</>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                  Generate Rencana dengan AI
                </>
              )}
            </button>
            <p className="ak-generate-note">AI akan menganalisis data assessment dan membuat rencana asuhan keperawatan yang komprehensif</p>
          </div>
        </div>
      )}

      {/* ==================== PLAN TAB ==================== */}
      {tab === 'plan' && plan && (
        <div className="ak-plan">

          {/* plan header */}
          <div className="ak-plan-header">
            <div>
              <h3 className="ak-plan-title">Rencana Asuhan Keperawatan</h3>
              <p className="ak-plan-meta">Pasien: {patientData?.name} ({patientData?.rm})</p>
              <p className="ak-plan-meta">Dibuat dengan AI pada: {new Date().toLocaleDateString('id-ID')}</p>
            </div>
            <div className="ak-confidence">
              <span className="ak-confidence-val">95%</span>
              <span className="ak-confidence-lbl">AI Confidence</span>
            </div>
          </div>

          {/* diagnoses */}
          <section className="ak-card">
            <h4 className="ak-card-heading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              Diagnosis Keperawatan
            </h4>
            <div className="ak-dx-list">
              {plan.nursing_diagnoses.map((dx) => (
                <div className="ak-dx" key={dx.id}>
                  <div className="ak-dx-top">
                    <h5 className="ak-dx-name">{dx.diagnosis}</h5>
                    <span className={`ak-priority ak-priority--${dx.priority.toLowerCase()}`}>{dx.priority}</span>
                  </div>
                  <p className="ak-dx-detail"><strong>Berhubungan dengan:</strong> {dx.related_to}</p>
                  <p className="ak-dx-detail"><strong>Ditandai dengan:</strong> {dx.evidenced_by}</p>
                </div>
              ))}
            </div>
          </section>

          {/* interventions */}
          <section className="ak-card">
            <h4 className="ak-card-heading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
              Intervensi Keperawatan
            </h4>
            <div className="ak-int-list">
              {plan.interventions.map((i) => (
                <div className="ak-int" key={i.id}>
                  {editingIntv === i.id ? (
                    <div className="ak-int-body">
                      <input className="ak-input" value={editForm.intervention} onChange={e => setEditForm(f => ({...f, intervention: e.target.value}))} placeholder="Intervensi" style={{marginBottom:6}} />
                      <input className="ak-input" value={editForm.rationale} onChange={e => setEditForm(f => ({...f, rationale: e.target.value}))} placeholder="Rasional" style={{marginBottom:6}} />
                      <input className="ak-input" value={editForm.frequency} onChange={e => setEditForm(f => ({...f, frequency: e.target.value}))} placeholder="Frekuensi" style={{marginBottom:6}} />
                      <div style={{display:'flex',gap:6}}>
                        <button className="ak-btn-sm" onClick={() => handleSaveEditIntv(i.id)} style={{background:'#10b981',color:'#fff'}}>Simpan</button>
                        <button className="ak-btn-sm" onClick={() => setEditingIntv(null)}>Batal</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="ak-int-body">
                        <h6 className="ak-int-name">{i.intervention}</h6>
                        <p className="ak-int-rationale"><strong>Rasional:</strong> {i.rationale}</p>
                        <span className="ak-freq">{i.frequency}</span>
                      </div>
                      <button className="ak-btn-sm" onClick={() => handleEditIntv(i)}>Edit</button>
                    </>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* outcomes */}
          <section className="ak-card">
            <h4 className="ak-card-heading">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              Kriteria Hasil (NOC)
            </h4>
            <div className="ak-out-list">
              {plan.outcomes.map((o) => (
                <div className="ak-out" key={o.id}>
                  <div className="ak-out-top">
                    <h6 className="ak-out-name">{o.outcome}</h6>
                    <span className="ak-timeframe">Target: {o.timeframe}</span>
                  </div>
                  <p className="ak-out-lbl"><strong>Indikator:</strong></p>
                  <ul className="ak-out-indicators">
                    {o.indicators.map((ind, idx) => <li key={idx}>{ind}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default AskepAiPlan;
