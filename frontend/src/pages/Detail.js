import React from 'react';
import { useParams } from 'react-router-dom';
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

const Detail = () => {
  const { id } = useParams();
  const intervention = interventions.find((item) => item.id === parseInt(id));

  if (!intervention) {
    return <div>Data tidak ditemukan</div>;
  }

  return (
    <div className="detail-container">
      <h2>Detail Intervensi</h2>
      <div className="detail-card">
        <h3>{intervention.name}</h3>
        <p>Jadwal: {intervention.schedule}</p>
        <p>Prioritas: {intervention.priority}</p>
        <p>Frekuensi: {intervention.frequency}</p>
        <p>Deskripsi: {intervention.description}</p>
      </div>
    </div>
  );
};

export default Detail;