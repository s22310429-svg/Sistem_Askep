import React from 'react';
import '../assets/Patients.css';

const interventions = [
  {
    id: 1,
    name: 'Ahmad Wijaya',
    schedule: '30 Sep, 08.00',
    priority: 'Tinggi',
    frequency: 'Setiap 6 jam',
    description: 'Monitor kadar glukosa darah',
  },
  {
    id: 2,
    name: 'Ahmad Wijaya',
    schedule: '30 Sep, 10.00',
    priority: 'Sedang',
    frequency: 'Setiap hari',
    description: 'Berikan edukasi diet diabetes',
  },
  {
    id: 3,
    name: 'Siti Aminah',
    schedule: '30 Sep, 09.00',
    priority: 'Tinggi',
    frequency: 'Setiap 4 jam',
    description: 'Monitoring tekanan darah',
  },
  {
    id: 4,
    name: 'Budi Santoso',
    schedule: '30 Sep, 11.00',
    priority: 'Sedang',
    frequency: '2x sehari',
    description: 'Latihan mobilisasi',
  },
];

const InterventionList = () => {
  return (
    <div className="intervention-list">
      <h2>Intervensi Menunggu Implementasi</h2>
      <div className="intervention-container">
        {interventions.map((intervention) => (
          <div key={intervention.id} className="intervention-card">
            <div className="intervention-header">
              <h3>{intervention.name}</h3>
              <p>Jadwal: {intervention.schedule}</p>
            </div>
            <div className="intervention-body">
              <span className={`priority ${intervention.priority.toLowerCase()}`}>
                {intervention.priority}
              </span>
              <span className="frequency">{intervention.frequency}</span>
              <p>{intervention.description}</p>
            </div>
            <div className="intervention-footer">
              <button className="btn btn-implement">Implementasi</button>
              <button className="btn btn-detail">Detail</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InterventionList;