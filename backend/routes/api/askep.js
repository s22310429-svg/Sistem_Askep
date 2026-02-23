const express = require('express');
const router = express.Router();
const store = require('../../data/store');
const auth = require('../../middleware/auth');

/* Sample AI plan generator (simulates AI response based on actual patient data) */
function generateAIPlan(patientData, assessment) {
  const plans = {
    'Diabetes Mellitus': {
      nursing_diagnoses: [
        { id: 1, diagnosis: 'Ketidakseimbangan nutrisi kurang dari kebutuhan tubuh', related_to: 'Gangguan metabolisme glukosa', evidenced_by: `Kadar gula darah tinggi, ${assessment.objective || 'penurunan berat badan'}`, priority: 'Tinggi' },
        { id: 2, diagnosis: 'Risiko ketidakstabilan kadar glukosa darah', related_to: 'Kurangnya pengetahuan tentang manajemen diabetes', evidenced_by: assessment.subjective || 'Pasien belum pernah mendapat edukasi diabetes', priority: 'Sedang' },
      ],
      interventions: [
        { id: 1, diagnosis_id: 1, intervention: 'Monitor kadar glukosa darah', rationale: 'Memantau efektivitas terapi dan mencegah komplikasi', frequency: 'Setiap 6 jam' },
        { id: 2, diagnosis_id: 1, intervention: 'Berikan diet sesuai program diabetes', rationale: 'Mengontrol asupan karbohidrat untuk stabilitas gula darah', frequency: 'Setiap makan' },
        { id: 3, diagnosis_id: 2, intervention: 'Berikan edukasi tentang manajemen diabetes', rationale: 'Meningkatkan pengetahuan pasien untuk self-care', frequency: 'Setiap hari' },
      ],
      outcomes: [
        { id: 1, diagnosis_id: 1, outcome: 'Kadar glukosa darah dalam rentang normal (80-140 mg/dL)', indicators: ['Gula darah puasa < 126 mg/dL', 'Gula darah 2 jam PP < 140 mg/dL'], timeframe: '3 hari' },
        { id: 2, diagnosis_id: 2, outcome: 'Pasien mampu melakukan self-monitoring gula darah', indicators: ['Dapat menggunakan glucometer', 'Memahami jadwal pemeriksaan'], timeframe: '5 hari' },
      ],
    },
    default: {
      nursing_diagnoses: [
        { id: 1, diagnosis: `Gangguan rasa nyaman berhubungan dengan ${patientData.diagnosis}`, related_to: `Proses penyakit ${patientData.diagnosis}`, evidenced_by: assessment.subjective || 'Pasien mengeluh tidak nyaman', priority: 'Tinggi' },
        { id: 2, diagnosis: 'Risiko infeksi', related_to: 'Penurunan daya tahan tubuh', evidenced_by: assessment.objective || 'Tanda vital menunjukkan perubahan', priority: 'Sedang' },
      ],
      interventions: [
        { id: 1, diagnosis_id: 1, intervention: `Monitor tanda vital dan keluhan pasien terkait ${patientData.diagnosis}`, rationale: 'Mendeteksi dini perburukan kondisi', frequency: 'Setiap 4 jam' },
        { id: 2, diagnosis_id: 1, intervention: 'Berikan terapi sesuai program dokter', rationale: 'Mengatasi penyebab utama keluhan', frequency: 'Sesuai jadwal' },
        { id: 3, diagnosis_id: 2, intervention: 'Edukasi pasien tentang pencegahan infeksi', rationale: 'Meningkatkan kesadaran dan kepatuhan pasien', frequency: 'Setiap hari' },
        { id: 4, diagnosis_id: 1, intervention: 'Evaluasi respon terapi', rationale: 'Menilai efektivitas rencana perawatan', frequency: 'Setiap 8 jam' },
      ],
      outcomes: [
        { id: 1, diagnosis_id: 1, outcome: 'Keluhan pasien berkurang dalam 48 jam', indicators: ['Skala nyeri menurun', 'Pasien dapat beristirahat', 'Tanda vital stabil'], timeframe: '2 hari' },
        { id: 2, diagnosis_id: 2, outcome: 'Tidak ada tanda infeksi selama perawatan', indicators: ['Suhu tubuh normal', 'Leukosit dalam batas normal'], timeframe: '5 hari' },
      ],
    },
  };
  return plans[patientData.diagnosis] || plans.default;
}

/* POST /api/askep/generate - Generate AI plan */
router.post('/generate', auth, (req, res) => {
  const { patient_id, assessment } = req.body;
  if (!patient_id || !assessment || !assessment.subjective || !assessment.objective) {
    return res.status(400).json({ error: 'Data pasien dan assessment (subjective + objective) wajib diisi!' });
  }
  const patient = store.patients.find(p => p.id === patient_id);
  if (!patient) return res.status(404).json({ error: 'Pasien tidak ditemukan' });

  const plan = generateAIPlan(patient, assessment);
  res.json({ plan, confidence: 95 });
});

/* POST /api/askep/save - Save askep plan */
router.post('/save', auth, (req, res) => {
  const { patient_id, assessment, plan } = req.body;
  if (!patient_id || !plan) {
    return res.status(400).json({ error: 'Data pasien dan rencana wajib diisi!' });
  }
  const patient = store.patients.find(p => p.id === patient_id);
  if (!patient) return res.status(404).json({ error: 'Pasien tidak ditemukan' });

  const savedPlan = {
    id: store.generateId('ASK'),
    patient_id,
    patient_name: patient.name,
    assessment: assessment || {},
    plan,
    created_by: req.user.username,
    created_at: new Date().toISOString(),
  };
  store.askepPlans.push(savedPlan);

  // Add pending interventions from the plan
  if (plan.interventions) {
    plan.interventions.forEach(intv => {
      store.pendingInterventions.push({
        id: store.generateId('INT'),
        patient_id,
        patient_name: patient.name,
        intervention: intv.intervention,
        frequency: intv.frequency,
        scheduled_time: new Date(Date.now() + 3600000).toISOString(),
        priority: 'Sedang',
        status: 'pending',
      });
    });
  }

  store.activityLog.unshift({
    title: 'Askep AI Plan Dibuat',
    desc: `Rencana asuhan untuk ${patient.name} selesai dianalisis.`,
    time: new Date().toISOString(),
    color: '#3b82f6',
  });

  res.status(201).json({ message: 'Rencana asuhan berhasil disimpan!', plan: savedPlan });
});

/* GET /api/askep - List all saved plans */
router.get('/', auth, (req, res) => {
  res.json(store.askepPlans);
});

/* PUT /api/askep/intervention/:id - Edit intervention */
router.put('/intervention/:id', auth, (req, res) => {
  const { id } = req.params;
  const { intervention, rationale, frequency } = req.body;
  // Search in all saved plans
  for (const plan of store.askepPlans) {
    if (plan.plan && plan.plan.interventions) {
      const intv = plan.plan.interventions.find(i => i.id === parseInt(id) || i.id === id);
      if (intv) {
        if (intervention) intv.intervention = intervention;
        if (rationale) intv.rationale = rationale;
        if (frequency) intv.frequency = frequency;
        return res.json({ message: 'Intervensi berhasil diperbarui', intervention: intv });
      }
    }
  }
  return res.status(404).json({ error: 'Intervensi tidak ditemukan' });
});

module.exports = router;
