import React, { useState } from 'react';
import patientsData from '../data/patients';
import '../assets/Dashboard.css';
import '../assets/Implementasi.css';

const Implementasi = () => {
  const [selectedPatient, setSelectedPatient] = useState('');
  const [searchPatient, setSearchPatient] = useState('');
  // Data pasien dari shared data
  const allPatients = patientsData;
  const [activeTab, setActiveTab] = useState('pending');
  const [showImplementationForm, setShowImplementationForm] = useState(false);
  const [implementationData, setImplementationData] = useState({
    intervention_id: '',
    implementation_note: '',
    patient_response: '',
    vital_signs: {
      blood_pressure: '',
      pulse: '',
      temperature: '',
      respiration: '',
      oxygen_saturation: ''
    },
    complications: '',
    next_action: '',
    nurse_name: '',
    implementation_time: new Date().toISOString().slice(0, 16)
  });

  // Data contoh pasien dengan rencana askep
  const patientsWithPlans = [
    {
      id: 'P001',
      name: 'Ahmad Wijaya',
      rm: 'RM001',
      diagnosis: 'Diabetes Mellitus',
      plans: [
        {
          id: 'PLAN001',
          title: 'Manajemen Diabetes Mellitus',
          created_date: '2025-09-28',
          status: 'active'
        }
      ]
    },
    {
      id: 'P002',
      name: 'Siti Aminah',
      rm: 'RM002',
      diagnosis: 'Hipertensi',
      plans: [
        {
          id: 'PLAN002',
          title: 'Kontrol Tekanan Darah',
          created_date: '2025-09-29',
          status: 'active'
        }
      ]
    },
    {
      id: 'P003',
      name: 'Budi Santoso',
      rm: 'RM003',
      diagnosis: 'Stroke',
      plans: [
        {
          id: 'PLAN003',
          title: 'Rehabilitasi Post Stroke',
          created_date: '2025-09-27',
          status: 'active'
        }
      ]
    }
  ];

  // Data contoh intervensi yang menunggu implementasi
  const pendingInterventions = [
    {
      id: 'INT001',
      patient_id: 'P001',
      patient_name: 'Ahmad Wijaya',
      intervention: 'Monitor kadar glukosa darah',
      frequency: 'Setiap 6 jam',
      scheduled_time: '2025-09-30T08:00',
      priority: 'Tinggi',
      status: 'pending'
    },
    {
      id: 'INT002',
      patient_id: 'P001',
      patient_name: 'Ahmad Wijaya',
      intervention: 'Berikan edukasi diet diabetes',
      frequency: 'Setiap hari',
      scheduled_time: '2025-09-30T10:00',
      priority: 'Sedang',
      status: 'pending'
    },
    {
      id: 'INT003',
      patient_id: 'P002',
      patient_name: 'Siti Aminah',
      intervention: 'Monitoring tekanan darah',
      frequency: 'Setiap 4 jam',
      scheduled_time: '2025-09-30T09:00',
      priority: 'Tinggi',
      status: 'pending'
    },
    {
      id: 'INT004',
      patient_id: 'P003',
      patient_name: 'Budi Santoso',
      intervention: 'Latihan mobilisasi',
      frequency: '2x sehari',
      scheduled_time: '2025-09-30T11:00',
      priority: 'Sedang',
      status: 'pending'
    },
    // Tambahan intervensi untuk pasien baru agar tampilan lebih hidup
    {
      id: 'INT005',
      patient_id: 'P006',
      patient_name: 'Lina Marlina',
      intervention: 'Inhalasi bronkodilator',
      frequency: 'Setiap 8 jam',
      scheduled_time: '2025-09-30T07:00',
      priority: 'Sedang',
      status: 'pending'
    },
    {
      id: 'INT006',
      patient_id: 'P007',
      patient_name: 'Hendra Gunawan',
      intervention: 'Pantau cairan dan diet renal',
      frequency: 'Setiap hari',
      scheduled_time: '2025-09-30T09:30',
      priority: 'Tinggi',
      status: 'pending'
    },
    {
      id: 'INT007',
      patient_id: 'P008',
      patient_name: 'Nur Aisyah',
      intervention: 'Pemberian suplemen zat besi',
      frequency: 'Setiap hari',
      scheduled_time: '2025-09-30T10:30',
      priority: 'Sedang',
      status: 'pending'
    },
    {
      id: 'INT008',
      patient_id: 'P010',
      patient_name: 'Maria Josephine',
      intervention: 'Pantau tanda syok & cairan',
      frequency: 'Setiap 4 jam',
      scheduled_time: '2025-09-30T12:00',
      priority: 'Tinggi',
      status: 'pending'
    },
    {
      id: 'INT009',
      patient_id: 'P012',
      patient_name: 'Tania Kusuma',
      intervention: 'Pantau output urin',
      frequency: 'Setiap 6 jam',
      scheduled_time: '2025-09-30T13:00',
      priority: 'Sedang',
      status: 'pending'
    },
    {
      id: 'INT010',
      patient_id: 'P015',
      patient_name: 'Dedi Kurniawan',
      intervention: 'Pantau kadar gula & tekanan darah',
      frequency: 'Setiap 8 jam',
      scheduled_time: '2025-09-30T14:00',
      priority: 'Tinggi',
      status: 'pending'
    },
    {
      id: 'INT011',
      patient_id: 'P018',
      patient_name: 'Silvia Anggraini',
      intervention: 'Pantau nyeri & edukasi diet',
      frequency: 'Setiap hari',
      scheduled_time: '2025-09-30T15:00',
      priority: 'Sedang',
      status: 'pending'
    },
    {
      id: 'INT012',
      patient_id: 'P020',
      patient_name: 'Ratna Dewi',
      intervention: 'Pantau keseimbangan & edukasi vertigo',
      frequency: 'Setiap hari',
      scheduled_time: '2025-09-30T16:00',
      priority: 'Sedang',
      status: 'pending'
    }
  ];

  // Data contoh implementasi yang sudah selesai
  const completedImplementations = [
    {
      id: 'IMP001',
      patient_id: 'P001',
      patient_name: 'Ahmad Wijaya',
      intervention: 'Monitor kadar glukosa darah',
      implementation_note: 'Pemeriksaan gula darah menggunakan glucometer. Hasil: 180 mg/dL',
      patient_response: 'Pasien kooperatif, tidak ada keluhan',
      vital_signs: {
        blood_pressure: '130/80',
        pulse: '88',
        temperature: '36.5',
        respiration: '20',
        oxygen_saturation: '98'
      },
      nurse_name: 'Ns. Maria',
      implementation_time: '2025-09-30T06:00',
      status: 'completed'
    },
    {
      id: 'IMP002',
      patient_id: 'P002',
      patient_name: 'Siti Aminah',
      intervention: 'Monitoring tekanan darah',
      implementation_note: 'Pengukuran TD menggunakan tensimeter digital',
      patient_response: 'Pasien mengeluh pusing ringan',
      vital_signs: {
        blood_pressure: '150/90',
        pulse: '92',
        temperature: '36.8',
        respiration: '18',
        oxygen_saturation: '97'
      },
      nurse_name: 'Ns. Sari',
      implementation_time: '2025-09-30T05:00',
      status: 'completed'
    },
    // Tambahan implementasi selesai untuk pasien lain
    {
      id: 'IMP003',
      patient_id: 'P006',
      patient_name: 'Lina Marlina',
      intervention: 'Inhalasi bronkodilator',
      implementation_note: 'Pemberian inhalasi sesuai dosis, pasien tampak lega setelah terapi.',
      patient_response: 'Pasien melaporkan napas lebih lega, tidak ada wheezing.',
      vital_signs: {
        blood_pressure: '120/80',
        pulse: '84',
        temperature: '36.7',
        respiration: '18',
        oxygen_saturation: '99'
      },
      nurse_name: 'Ns. Rina',
      implementation_time: '2025-09-30T07:30',
      status: 'completed'
    },
    {
      id: 'IMP004',
      patient_id: 'P007',
      patient_name: 'Hendra Gunawan',
      intervention: 'Pantau cairan dan diet renal',
      implementation_note: 'Asupan cairan dibatasi, edukasi diet renal diberikan.',
      patient_response: 'Pasien memahami instruksi, tidak ada keluhan.',
      vital_signs: {
        blood_pressure: '140/90',
        pulse: '90',
        temperature: '36.6',
        respiration: '20',
        oxygen_saturation: '97'
      },
      nurse_name: 'Ns. Dedi',
      implementation_time: '2025-09-30T09:45',
      status: 'completed'
    },
    {
      id: 'IMP005',
      patient_id: 'P008',
      patient_name: 'Nur Aisyah',
      intervention: 'Pemberian suplemen zat besi',
      implementation_note: 'Suplemen diberikan oral, pasien diobservasi efek samping.',
      patient_response: 'Pasien tidak mengeluh mual, tampak kooperatif.',
      vital_signs: {
        blood_pressure: '110/70',
        pulse: '80',
        temperature: '36.5',
        respiration: '19',
        oxygen_saturation: '99'
      },
      nurse_name: 'Ns. Sari',
      implementation_time: '2025-09-30T10:45',
      status: 'completed'
    },
    {
      id: 'IMP006',
      patient_id: 'P010',
      patient_name: 'Maria Josephine',
      intervention: 'Pantau tanda syok & cairan',
      implementation_note: 'Tanda vital stabil, tidak ada tanda syok, cairan IV berjalan baik.',
      patient_response: 'Pasien tampak tenang, tidak ada keluhan.',
      vital_signs: {
        blood_pressure: '115/75',
        pulse: '86',
        temperature: '36.8',
        respiration: '20',
        oxygen_saturation: '98'
      },
      nurse_name: 'Ns. Maria',
      implementation_time: '2025-09-30T12:30',
      status: 'completed'
    },
    {
      id: 'IMP007',
      patient_id: 'P012',
      patient_name: 'Tania Kusuma',
      intervention: 'Pantau output urin',
      implementation_note: 'Output urin dicatat, tidak ada tanda infeksi.',
      patient_response: 'Pasien tidak mengeluh nyeri saat BAK.',
      vital_signs: {
        blood_pressure: '112/72',
        pulse: '78',
        temperature: '36.4',
        respiration: '18',
        oxygen_saturation: '99'
      },
      nurse_name: 'Ns. Rina',
      implementation_time: '2025-09-30T13:30',
      status: 'completed'
    },
    {
      id: 'IMP008',
      patient_id: 'P015',
      patient_name: 'Dedi Kurniawan',
      intervention: 'Pantau kadar gula & tekanan darah',
      implementation_note: 'Gula darah dan TD dipantau, edukasi diberikan.',
      patient_response: 'Pasien kooperatif, tidak ada keluhan.',
      vital_signs: {
        blood_pressure: '145/95',
        pulse: '88',
        temperature: '36.9',
        respiration: '20',
        oxygen_saturation: '97'
      },
      nurse_name: 'Ns. Dedi',
      implementation_time: '2025-09-30T14:30',
      status: 'completed'
    },
    {
      id: 'IMP009',
      patient_id: 'P018',
      patient_name: 'Silvia Anggraini',
      intervention: 'Pantau nyeri & edukasi diet',
      implementation_note: 'Nyeri dievaluasi, edukasi diet lambung diberikan.',
      patient_response: 'Pasien mengaku nyeri berkurang setelah edukasi.',
      vital_signs: {
        blood_pressure: '118/76',
        pulse: '82',
        temperature: '36.6',
        respiration: '18',
        oxygen_saturation: '99'
      },
      nurse_name: 'Ns. Sari',
      implementation_time: '2025-09-30T15:30',
      status: 'completed'
    },
    {
      id: 'IMP010',
      patient_id: 'P020',
      patient_name: 'Ratna Dewi',
      intervention: 'Pantau keseimbangan & edukasi vertigo',
      implementation_note: 'Edukasi pencegahan vertigo, latihan keseimbangan dilakukan.',
      patient_response: 'Pasien tampak lebih percaya diri berjalan.',
      vital_signs: {
        blood_pressure: '120/80',
        pulse: '80',
        temperature: '36.5',
        respiration: '18',
        oxygen_saturation: '99'
      },
      nurse_name: 'Ns. Rina',
      implementation_time: '2025-09-30T16:30',
      status: 'completed'
    }
  ];

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setImplementationData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setImplementationData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleImplementIntervention = (intervention) => {
    setImplementationData({
      ...implementationData,
      intervention_id: intervention.id,
      implementation_time: new Date().toISOString().slice(0, 16)
    });
    setShowImplementationForm(true);
  };

  const handleSaveImplementation = () => {
    if (!implementationData.implementation_note) {
      alert('Mohon lengkapi catatan implementasi');
      return;
    }

    // Logic untuk menyimpan implementasi
    alert('Implementasi berhasil disimpan!');
    setShowImplementationForm(false);
    setImplementationData({
      intervention_id: '',
      implementation_note: '',
      patient_response: '',
      vital_signs: {
        blood_pressure: '',
        pulse: '',
        temperature: '',
        respiration: '',
        oxygen_saturation: ''
      },
      complications: '',
      next_action: '',
      nurse_name: '',
      implementation_time: new Date().toISOString().slice(0, 16)
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Tinggi': return 'high';
      case 'Sedang': return 'medium';
      case 'Rendah': return 'low';
      default: return 'medium';
    }
  };


  // Filter by patient select and search
  const filteredInterventions = pendingInterventions.filter(int => {
    const matchPatient = selectedPatient ? int.patient_id === selectedPatient : true;
    const matchSearch = searchPatient ? int.patient_name.toLowerCase().includes(searchPatient.toLowerCase()) : true;
    return matchPatient && matchSearch;
  });

  const filteredImplementations = completedImplementations.filter(imp => {
    const matchPatient = selectedPatient ? imp.patient_id === selectedPatient : true;
    const matchSearch = searchPatient ? imp.patient_name.toLowerCase().includes(searchPatient.toLowerCase()) : true;
    return matchPatient && matchSearch;
  });

  return (
    <div className="dashboard-content">
      <div className="page-header">
        <div className="header-content">
          <h1>Implementasi Keperawatan</h1>
          <p className="header-subtitle">Catat dan kelola implementasi tindakan keperawatan</p>
        </div>
        <div className="header-actions" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-patient-box">
            <input
              type="text"
              className="search-patient-input"
              placeholder={allPatients && allPatients.length > 0 ? `Cari pasien... (${allPatients.map(p=>p.name).slice(0,3).join(', ')}${allPatients.length>3?', ...':''})` : 'Cari pasien...'}
              value={searchPatient}
              onChange={e => setSearchPatient(e.target.value)}
              list="all-patients-list"
              style={{ padding: '0.5rem 1rem', borderRadius: 8, border: '1px solid #d1d5db', fontSize: '0.95rem', minWidth: 180 }}
            />
            <datalist id="all-patients-list">
              {allPatients && allPatients.map(p => (
                <option key={p.id} value={p.name} />
              ))}
            </datalist>
          </div>
          <select 
            className="patient-filter"
            value={selectedPatient}
            onChange={(e) => setSelectedPatient(e.target.value)}
          >
            <option value="">Semua Pasien</option>
            {allPatients && allPatients.map(patient => (
              <option key={patient.id} value={patient.id}>
                {patient.name} ({patient.rm})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="implementation-stats">
        <div className="stat-card-small">
          <div className="stat-icon-small pending">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          </div>
          <div className="stat-content-small">
            <h4>Menunggu</h4>
            <p>{filteredInterventions.length}</p>
          </div>
        </div>
        
        <div className="stat-card-small">
          <div className="stat-icon-small completed">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
          </div>
          <div className="stat-content-small">
            <h4>Selesai Hari Ini</h4>
            <p>{filteredImplementations.length}</p>
          </div>
        </div>
        
        <div className="stat-card-small">
          <div className="stat-icon-small priority">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
            </svg>
          </div>
          <div className="stat-content-small">
            <h4>Prioritas Tinggi</h4>
            <p>{filteredInterventions.filter(int => int.priority === 'Tinggi').length}</p>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button 
          className={`tab-button ${activeTab === 'pending' ? 'active' : ''}`}
          onClick={() => setActiveTab('pending')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
          Menunggu Implementasi ({filteredInterventions.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
            <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
          </svg>
          Implementasi Selesai ({filteredImplementations.length})
        </button>
      </div>

      {/* Pending Interventions Tab */}
      {activeTab === 'pending' && (
        <div className="interventions-section">
          <div className="section-header">
            <h3 className="section-title">Intervensi Menunggu Implementasi</h3>
            <p className="section-subtitle">Daftar tindakan keperawatan yang perlu dilakukan</p>
          </div>

          {filteredInterventions.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
              </svg>
              <h3>Tidak Ada Intervensi Menunggu</h3>
              <p>Semua intervensi telah diimplementasikan atau tidak ada pasien yang dipilih</p>
            </div>
          ) : (
            <div className="interventions-list">
              {filteredInterventions.map((intervention) => (
                <div key={intervention.id} className="intervention-card-pending">
                  <div className="intervention-header">
                    <div className="patient-info">
                      <h4>{intervention.patient_name}</h4>
                      <p>Jadwal: {formatTime(intervention.scheduled_time)}</p>
                    </div>
                    <div className="intervention-meta">
                      <span className={`priority-badge ${getPriorityColor(intervention.priority)}`}>
                        {intervention.priority}
                      </span>
                      <span className="frequency-badge">{intervention.frequency}</span>
                    </div>
                  </div>
                  
                  <div className="intervention-content">
                    <h5>{intervention.intervention}</h5>
                  </div>

                  <div className="intervention-actions">
                    <button 
                      className="btn-implement"
                      onClick={() => handleImplementIntervention(intervention)}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                      </svg>
                      Implementasi
                    </button>
                    <button className="btn-secondary-small">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Completed Implementations Tab */}
      {activeTab === 'completed' && (
        <div className="implementations-section">
          <div className="section-header">
            <h3 className="section-title">Implementasi Selesai</h3>
            <p className="section-subtitle">Riwayat tindakan keperawatan yang telah dilakukan</p>
          </div>

          {filteredImplementations.length === 0 ? (
            <div className="empty-state">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="6" x2="12" y2="10"/>
                <line x1="12" y1="14" x2="12" y2="18"/>
              </svg>
              <h3>Belum Ada Implementasi</h3>
              <p>Belum ada implementasi yang tercatat untuk hari ini</p>
            </div>
          ) : (
            <div className="implementations-list">
              {filteredImplementations.map((implementation) => (
                <div key={implementation.id} className="implementation-card">
                  <div className="implementation-header">
                    <div className="patient-info">
                      <h4>{implementation.patient_name}</h4>
                      <p>Waktu: {formatTime(implementation.implementation_time)}</p>
                    </div>
                    <div className="nurse-info">
                      <span className="nurse-name">{implementation.nurse_name}</span>
                    </div>
                  </div>

                  <div className="implementation-content">
                    <h5>{implementation.intervention}</h5>
                    <div className="implementation-details">
                      <div className="detail-section">
                        <h6>Catatan Implementasi:</h6>
                        <p>{implementation.implementation_note}</p>
                      </div>
                      
                      <div className="detail-section">
                        <h6>Respon Pasien:</h6>
                        <p>{implementation.patient_response}</p>
                      </div>

                      <div className="vital-signs-summary">
                        <h6>Tanda Vital:</h6>
                        <div className="vital-signs-grid-small">
                          <span>TD: {implementation.vital_signs.blood_pressure}</span>
                          <span>Nadi: {implementation.vital_signs.pulse}</span>
                          <span>Suhu: {implementation.vital_signs.temperature}°C</span>
                          <span>RR: {implementation.vital_signs.respiration}</span>
                          <span>SpO2: {implementation.vital_signs.oxygen_saturation}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="implementation-actions">
                    <button className="btn-secondary-small">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 2 2h8c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                      </svg>
                      Print
                    </button>
                    <button className="btn-secondary-small">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                      </svg>
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Implementation Form Modal */}
      {showImplementationForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Form Implementasi Keperawatan</h3>
              <button 
                className="modal-close"
                onClick={() => setShowImplementationForm(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              </button>
            </div>

            <div className="modal-body">
              <div className="form-section">
                <div className="form-group">
                  <label>Waktu Implementasi</label>
                  <input
                    type="datetime-local"
                    className="form-input"
                    value={implementationData.implementation_time}
                    onChange={(e) => handleInputChange('implementation_time', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Catatan Implementasi *</label>
                  <textarea
                    className="form-textarea"
                    rows="4"
                    placeholder="Jelaskan secara detail bagaimana tindakan dilakukan..."
                    value={implementationData.implementation_note}
                    onChange={(e) => handleInputChange('implementation_note', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Respon Pasien</label>
                  <textarea
                    className="form-textarea"
                    rows="3"
                    placeholder="Bagaimana respon pasien terhadap tindakan yang diberikan..."
                    value={implementationData.patient_response}
                    onChange={(e) => handleInputChange('patient_response', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Tanda Vital</label>
                  <div className="vital-signs-grid">
                    <input
                      type="text"
                      className="form-input"
                      placeholder="TD (mmHg)"
                      value={implementationData.vital_signs.blood_pressure}
                      onChange={(e) => handleInputChange('vital_signs.blood_pressure', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Nadi (x/mnt)"
                      value={implementationData.vital_signs.pulse}
                      onChange={(e) => handleInputChange('vital_signs.pulse', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Suhu (°C)"
                      value={implementationData.vital_signs.temperature}
                      onChange={(e) => handleInputChange('vital_signs.temperature', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="RR (x/mnt)"
                      value={implementationData.vital_signs.respiration}
                      onChange={(e) => handleInputChange('vital_signs.respiration', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input"
                      placeholder="SpO2 (%)"
                      value={implementationData.vital_signs.oxygen_saturation}
                      onChange={(e) => handleInputChange('vital_signs.oxygen_saturation', e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Komplikasi (jika ada)</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Catat jika ada komplikasi atau efek samping..."
                    value={implementationData.complications}
                    onChange={(e) => handleInputChange('complications', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Tindakan Selanjutnya</label>
                  <textarea
                    className="form-textarea"
                    rows="2"
                    placeholder="Rencana tindakan atau observasi selanjutnya..."
                    value={implementationData.next_action}
                    onChange={(e) => handleInputChange('next_action', e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Nama Perawat *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Masukkan nama lengkap perawat"
                    value={implementationData.nurse_name}
                    onChange={(e) => handleInputChange('nurse_name', e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button 
                className="btn-secondary"
                onClick={() => setShowImplementationForm(false)}
              >
                Batal
              </button>
              <button 
                className="btn-primary"
                onClick={handleSaveImplementation}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17 3H5c-1.1 0-1.99.9-1.99 2L4 19c0 1.1.89 2 2 2h10c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V7h10v2z"/>
                </svg>
                Simpan Implementasi
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Implementasi;
