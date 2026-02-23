/**
 * In-memory data store for the Sistem Askep backend.
 * Seeded with initial data matching the frontend's hardcoded data.
 */
const crypto = require('crypto');

/* ---------- helpers ---------- */
function hashPassword(pw) {
  return crypto.createHash('sha256').update(pw).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function generateId(prefix) {
  return prefix + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

/* ---------- Users ---------- */
const users = [
  {
    id: 'U001',
    username: 'admin',
    email: 'admin@sistemaskep.local',
    fullname: 'Administrator Sistem Askep',
    password: hashPassword('admin123'),
    role: 'Perawat',
    createdAt: '2025-09-27',
    lastLogin: null,
    totalLogin: 0,
    status: 'Aktif',
  },
];

/* ---------- Tokens ---------- */
const tokens = {}; // token -> userId

/* ---------- Patients ---------- */
const patients = [
  { id: 'P001', rm: 'RM001', name: 'Ahmad Wijaya', age: 45, gender: 'Laki-laki', diagnosis: 'Diabetes Mellitus', status: 'Rawat Inap', avatar: 'A' },
  { id: 'P002', rm: 'RM002', name: 'Siti Aminah', age: 32, gender: 'Perempuan', diagnosis: 'Hipertensi', status: 'Rawat Jalan', avatar: 'S' },
  { id: 'P003', rm: 'RM003', name: 'Budi Santoso', age: 58, gender: 'Laki-laki', diagnosis: 'Stroke', status: 'Pulang', avatar: 'B' },
  { id: 'P004', rm: 'RM004', name: 'Dewi Lestari', age: 28, gender: 'Perempuan', diagnosis: 'Pneumonia', status: 'Rawat Inap', avatar: 'D' },
  { id: 'P005', rm: 'RM005', name: 'Joko Susilo', age: 41, gender: 'Laki-laki', diagnosis: 'Gastritis', status: 'Rawat Jalan', avatar: 'J' },
  { id: 'P006', rm: 'RM006', name: 'Lina Marlina', age: 37, gender: 'Perempuan', diagnosis: 'Asma Bronkial', status: 'Rawat Jalan', avatar: 'L' },
  { id: 'P007', rm: 'RM007', name: 'Hendra Gunawan', age: 50, gender: 'Laki-laki', diagnosis: 'Gagal Ginjal Kronis', status: 'Rawat Inap', avatar: 'H' },
  { id: 'P008', rm: 'RM008', name: 'Nur Aisyah', age: 26, gender: 'Perempuan', diagnosis: 'Anemia', status: 'Rawat Jalan', avatar: 'N' },
  { id: 'P009', rm: 'RM009', name: 'Agus Setiawan', age: 63, gender: 'Laki-laki', diagnosis: 'COPD (PPOK)', status: 'Pulang', avatar: 'A' },
  { id: 'P010', rm: 'RM010', name: 'Maria Josephine', age: 30, gender: 'Perempuan', diagnosis: 'Demam Berdarah', status: 'Rawat Inap', avatar: 'M' },
  { id: 'P011', rm: 'RM011', name: 'Rahmat Hidayat', age: 48, gender: 'Laki-laki', diagnosis: 'Hiperglikemia', status: 'Rawat Jalan', avatar: 'R' },
  { id: 'P012', rm: 'RM012', name: 'Tania Kusuma', age: 24, gender: 'Perempuan', diagnosis: 'Infeksi Saluran Kemih', status: 'Rawat Jalan', avatar: 'T' },
  { id: 'P013', rm: 'RM013', name: 'Fajar Pratama', age: 35, gender: 'Laki-laki', diagnosis: 'Ulkus Peptikum', status: 'Rawat Inap', avatar: 'F' },
  { id: 'P014', rm: 'RM014', name: 'Indah Wulandari', age: 39, gender: 'Perempuan', diagnosis: 'Migren Kronis', status: 'Rawat Jalan', avatar: 'I' },
  { id: 'P015', rm: 'RM015', name: 'Dedi Kurniawan', age: 59, gender: 'Laki-laki', diagnosis: 'Hipertensi & Diabetes', status: 'Rawat Inap', avatar: 'D' },
  { id: 'P016', rm: 'RM016', name: 'Ayu Rahmawati', age: 29, gender: 'Perempuan', diagnosis: 'Apendisitis', status: 'Rawat Inap', avatar: 'A' },
  { id: 'P017', rm: 'RM017', name: 'Bambang Herlambang', age: 54, gender: 'Laki-laki', diagnosis: 'Jantung Koroner', status: 'Pulang', avatar: 'B' },
  { id: 'P018', rm: 'RM018', name: 'Silvia Anggraini', age: 27, gender: 'Perempuan', diagnosis: 'Gastritis', status: 'Rawat Jalan', avatar: 'S' },
  { id: 'P019', rm: 'RM019', name: 'Toni Saputra', age: 46, gender: 'Laki-laki', diagnosis: 'TBC Paru', status: 'Rawat Inap', avatar: 'T' },
  { id: 'P020', rm: 'RM020', name: 'Ratna Dewi', age: 33, gender: 'Perempuan', diagnosis: 'Vertigo', status: 'Rawat Jalan', avatar: 'R' },
];

/* ---------- Askep Plans ---------- */
const askepPlans = [];

/* ---------- Interventions (pending) ---------- */
const pendingInterventions = [
  { id: 'INT001', patient_id: 'P001', patient_name: 'Ahmad Wijaya', intervention: 'Monitor kadar glukosa darah', frequency: 'Setiap 6 jam', scheduled_time: '2025-09-30T08:00', priority: 'Tinggi', status: 'pending' },
  { id: 'INT002', patient_id: 'P001', patient_name: 'Ahmad Wijaya', intervention: 'Berikan edukasi diet diabetes', frequency: 'Setiap hari', scheduled_time: '2025-09-30T10:00', priority: 'Sedang', status: 'pending' },
  { id: 'INT003', patient_id: 'P002', patient_name: 'Siti Aminah', intervention: 'Monitoring tekanan darah', frequency: 'Setiap 4 jam', scheduled_time: '2025-09-30T09:00', priority: 'Tinggi', status: 'pending' },
  { id: 'INT004', patient_id: 'P003', patient_name: 'Budi Santoso', intervention: 'Latihan mobilisasi', frequency: '2x sehari', scheduled_time: '2025-09-30T11:00', priority: 'Sedang', status: 'pending' },
  { id: 'INT005', patient_id: 'P006', patient_name: 'Lina Marlina', intervention: 'Inhalasi bronkodilator', frequency: 'Setiap 8 jam', scheduled_time: '2025-09-30T07:00', priority: 'Sedang', status: 'pending' },
  { id: 'INT006', patient_id: 'P007', patient_name: 'Hendra Gunawan', intervention: 'Pantau cairan dan diet renal', frequency: 'Setiap hari', scheduled_time: '2025-09-30T09:30', priority: 'Tinggi', status: 'pending' },
  { id: 'INT007', patient_id: 'P008', patient_name: 'Nur Aisyah', intervention: 'Pemberian suplemen zat besi', frequency: 'Setiap hari', scheduled_time: '2025-09-30T10:30', priority: 'Sedang', status: 'pending' },
  { id: 'INT008', patient_id: 'P010', patient_name: 'Maria Josephine', intervention: 'Pantau tanda syok & cairan', frequency: 'Setiap 4 jam', scheduled_time: '2025-09-30T12:00', priority: 'Tinggi', status: 'pending' },
  { id: 'INT009', patient_id: 'P012', patient_name: 'Tania Kusuma', intervention: 'Pantau output urin', frequency: 'Setiap 6 jam', scheduled_time: '2025-09-30T13:00', priority: 'Sedang', status: 'pending' },
  { id: 'INT010', patient_id: 'P015', patient_name: 'Dedi Kurniawan', intervention: 'Pantau kadar gula & tekanan darah', frequency: 'Setiap 8 jam', scheduled_time: '2025-09-30T14:00', priority: 'Tinggi', status: 'pending' },
  { id: 'INT011', patient_id: 'P018', patient_name: 'Silvia Anggraini', intervention: 'Pantau nyeri & edukasi diet', frequency: 'Setiap hari', scheduled_time: '2025-09-30T15:00', priority: 'Sedang', status: 'pending' },
  { id: 'INT012', patient_id: 'P020', patient_name: 'Ratna Dewi', intervention: 'Pantau keseimbangan & edukasi vertigo', frequency: 'Setiap hari', scheduled_time: '2025-09-30T16:00', priority: 'Sedang', status: 'pending' },
];

/* ---------- Completed Implementations ---------- */
const completedImplementations = [
  { id: 'IMP001', patient_id: 'P001', patient_name: 'Ahmad Wijaya', intervention: 'Monitor kadar glukosa darah', implementation_note: 'Pemeriksaan gula darah menggunakan glucometer. Hasil: 180 mg/dL', patient_response: 'Pasien kooperatif, tidak ada keluhan', vital_signs: { blood_pressure: '130/80', pulse: '88', temperature: '36.5', respiration: '20', oxygen_saturation: '98' }, nurse_name: 'Ns. Maria', implementation_time: '2025-09-30T06:00', status: 'completed' },
  { id: 'IMP002', patient_id: 'P002', patient_name: 'Siti Aminah', intervention: 'Monitoring tekanan darah', implementation_note: 'Pengukuran TD menggunakan tensimeter digital', patient_response: 'Pasien mengeluh pusing ringan', vital_signs: { blood_pressure: '150/90', pulse: '92', temperature: '36.8', respiration: '18', oxygen_saturation: '97' }, nurse_name: 'Ns. Sari', implementation_time: '2025-09-30T05:00', status: 'completed' },
  { id: 'IMP003', patient_id: 'P006', patient_name: 'Lina Marlina', intervention: 'Inhalasi bronkodilator', implementation_note: 'Pemberian inhalasi sesuai dosis, pasien tampak lega setelah terapi.', patient_response: 'Pasien melaporkan napas lebih lega, tidak ada wheezing.', vital_signs: { blood_pressure: '120/80', pulse: '84', temperature: '36.7', respiration: '18', oxygen_saturation: '99' }, nurse_name: 'Ns. Rina', implementation_time: '2025-09-30T07:30', status: 'completed' },
  { id: 'IMP004', patient_id: 'P007', patient_name: 'Hendra Gunawan', intervention: 'Pantau cairan dan diet renal', implementation_note: 'Asupan cairan dibatasi, edukasi diet renal diberikan.', patient_response: 'Pasien memahami instruksi, tidak ada keluhan.', vital_signs: { blood_pressure: '140/90', pulse: '90', temperature: '36.6', respiration: '20', oxygen_saturation: '97' }, nurse_name: 'Ns. Dedi', implementation_time: '2025-09-30T09:45', status: 'completed' },
  { id: 'IMP005', patient_id: 'P008', patient_name: 'Nur Aisyah', intervention: 'Pemberian suplemen zat besi', implementation_note: 'Suplemen diberikan oral, pasien diobservasi efek samping.', patient_response: 'Pasien tidak mengeluh mual, tampak kooperatif.', vital_signs: { blood_pressure: '110/70', pulse: '80', temperature: '36.5', respiration: '19', oxygen_saturation: '99' }, nurse_name: 'Ns. Sari', implementation_time: '2025-09-30T10:45', status: 'completed' },
  { id: 'IMP006', patient_id: 'P010', patient_name: 'Maria Josephine', intervention: 'Pantau tanda syok & cairan', implementation_note: 'Tanda vital stabil, tidak ada tanda syok, cairan IV berjalan baik.', patient_response: 'Pasien tampak tenang, tidak ada keluhan.', vital_signs: { blood_pressure: '115/75', pulse: '86', temperature: '36.8', respiration: '20', oxygen_saturation: '98' }, nurse_name: 'Ns. Maria', implementation_time: '2025-09-30T12:30', status: 'completed' },
  { id: 'IMP007', patient_id: 'P012', patient_name: 'Tania Kusuma', intervention: 'Pantau output urin', implementation_note: 'Output urin dicatat, tidak ada tanda infeksi.', patient_response: 'Pasien tidak mengeluh nyeri saat BAK.', vital_signs: { blood_pressure: '112/72', pulse: '78', temperature: '36.4', respiration: '18', oxygen_saturation: '99' }, nurse_name: 'Ns. Rina', implementation_time: '2025-09-30T13:30', status: 'completed' },
  { id: 'IMP008', patient_id: 'P015', patient_name: 'Dedi Kurniawan', intervention: 'Pantau kadar gula & tekanan darah', implementation_note: 'Gula darah dan TD dipantau, edukasi diberikan.', patient_response: 'Pasien kooperatif, tidak ada keluhan.', vital_signs: { blood_pressure: '145/95', pulse: '88', temperature: '36.9', respiration: '20', oxygen_saturation: '97' }, nurse_name: 'Ns. Dedi', implementation_time: '2025-09-30T14:30', status: 'completed' },
  { id: 'IMP009', patient_id: 'P018', patient_name: 'Silvia Anggraini', intervention: 'Pantau nyeri & edukasi diet', implementation_note: 'Nyeri dievaluasi, edukasi diet lambung diberikan.', patient_response: 'Pasien mengaku nyeri berkurang setelah edukasi.', vital_signs: { blood_pressure: '118/76', pulse: '82', temperature: '36.6', respiration: '18', oxygen_saturation: '99' }, nurse_name: 'Ns. Sari', implementation_time: '2025-09-30T15:30', status: 'completed' },
  { id: 'IMP010', patient_id: 'P020', patient_name: 'Ratna Dewi', intervention: 'Pantau keseimbangan & edukasi vertigo', implementation_note: 'Edukasi pencegahan vertigo, latihan keseimbangan dilakukan.', patient_response: 'Pasien tampak lebih percaya diri berjalan.', vital_signs: { blood_pressure: '120/80', pulse: '80', temperature: '36.5', respiration: '18', oxygen_saturation: '99' }, nurse_name: 'Ns. Rina', implementation_time: '2025-09-30T16:30', status: 'completed' },
];

/* ---------- Evaluations ---------- */
const evaluations = [
  { id: 1, nama: 'Ahmad Wijaya', patient_id: 'P001', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa awal', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi obat + edukasi', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - kondisi membaik', status: 'done' }], trenNyeri: [8, 6, 4, 3] },
  { id: 2, nama: 'Siti Aminah', patient_id: 'P002', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa awal', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi edukasi', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - perlu monitoring', status: 'pending' }], trenNyeri: [7, 7, 6, 6] },
  { id: 3, nama: 'Budi Santoso', patient_id: 'P003', status: 'memburuk', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa awal', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi obat', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - kondisi memburuk', status: 'alert' }], trenNyeri: [5, 6, 7, 8] },
  { id: 4, nama: 'Dewi Lestari', patient_id: 'P004', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa pneumonia', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi antibiotik', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [6, 5, 4, 3] },
  { id: 5, nama: 'Joko Susilo', patient_id: 'P005', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa gastritis', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi diet lambung', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - perlu monitoring', status: 'pending' }], trenNyeri: [5, 5, 6, 5] },
  { id: 6, nama: 'Lina Marlina', patient_id: 'P006', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa asma', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi inhalasi', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [7, 6, 5, 4] },
  { id: 7, nama: 'Hendra Gunawan', patient_id: 'P007', status: 'memburuk', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa gagal ginjal', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi diet renal', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - memburuk', status: 'alert' }], trenNyeri: [6, 7, 8, 8] },
  { id: 8, nama: 'Nur Aisyah', patient_id: 'P008', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa anemia', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi suplemen', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - monitoring', status: 'pending' }], trenNyeri: [4, 4, 5, 4] },
  { id: 9, nama: 'Agus Setiawan', patient_id: 'P009', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa PPOK', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi oksigen', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [7, 6, 5, 5] },
  { id: 10, nama: 'Maria Josephine', patient_id: 'P010', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa DBD', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi cairan', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - monitoring', status: 'pending' }], trenNyeri: [6, 6, 7, 6] },
  { id: 11, nama: 'Rahmat Hidayat', patient_id: 'P011', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa hiperglikemia', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi insulin', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [8, 7, 6, 5] },
  { id: 12, nama: 'Tania Kusuma', patient_id: 'P012', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa ISK', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi antibiotik', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - monitoring', status: 'pending' }], trenNyeri: [5, 5, 6, 5] },
  { id: 13, nama: 'Fajar Pratama', patient_id: 'P013', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa ulkus peptikum', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi diet', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [6, 5, 4, 3] },
  { id: 14, nama: 'Indah Wulandari', patient_id: 'P014', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa migren', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi analgesik', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - monitoring', status: 'pending' }], trenNyeri: [7, 7, 6, 6] },
  { id: 15, nama: 'Dedi Kurniawan', patient_id: 'P015', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa DM & HT', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi diet & insulin', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [8, 7, 6, 5] },
  { id: 16, nama: 'Ayu Rahmawati', patient_id: 'P016', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa apendisitis', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi operasi', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - monitoring', status: 'pending' }], trenNyeri: [6, 6, 7, 6] },
  { id: 17, nama: 'Bambang Herlambang', patient_id: 'P017', status: 'memburuk', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa jantung koroner', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi monitoring EKG', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - memburuk', status: 'alert' }], trenNyeri: [7, 8, 8, 9] },
  { id: 18, nama: 'Silvia Anggraini', patient_id: 'P018', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa gastritis', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi diet', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [5, 4, 4, 3] },
  { id: 19, nama: 'Toni Saputra', patient_id: 'P019', status: 'monitoring', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa TBC paru', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi OAT', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - monitoring', status: 'pending' }], trenNyeri: [6, 6, 7, 6] },
  { id: 20, nama: 'Ratna Dewi', patient_id: 'P020', status: 'membaik', progress: [{ hari: 'Hari 1', deskripsi: 'Diagnosa vertigo', status: 'done' }, { hari: 'Hari 2', deskripsi: 'Implementasi latihan keseimbangan', status: 'done' }, { hari: 'Hari 3', deskripsi: 'Evaluasi - membaik', status: 'done' }], trenNyeri: [7, 6, 5, 4] },
];

/* ---------- Reports ---------- */
const reports = [
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

/* ---------- Activity Log ---------- */
const activityLog = [
  { title: 'Pasien Baru Ditambahkan', desc: 'Ahmad Wijaya telah didaftarkan ke sistem.', time: new Date(Date.now() - 2 * 60000).toISOString(), color: '#10b981' },
  { title: 'Askep AI Plan Dibuat', desc: 'Rencana asuhan untuk Siti Aminah selesai dianalisis.', time: new Date(Date.now() - 15 * 60000).toISOString(), color: '#3b82f6' },
  { title: 'Implementasi Selesai', desc: 'Tindakan keperawatan Budi Santoso telah diselesaikan.', time: new Date(Date.now() - 60 * 60000).toISOString(), color: '#f59e0b' },
  { title: 'Evaluasi Diperbarui', desc: 'Evaluasi pasien Ratna Dewi menunjukkan perkembangan.', time: new Date(Date.now() - 180 * 60000).toISOString(), color: '#8b5cf6' },
];

/* ---------- Exports ---------- */
module.exports = {
  // helpers
  hashPassword,
  generateToken,
  generateId,
  // data
  users,
  tokens,
  patients,
  askepPlans,
  pendingInterventions,
  completedImplementations,
  evaluations,
  reports,
  activityLog,
};
