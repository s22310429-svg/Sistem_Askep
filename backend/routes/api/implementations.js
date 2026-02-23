const express = require('express');
const router = express.Router();
const store = require('../../data/store');
const auth = require('../../middleware/auth');

/* GET /api/implementations/pending */
router.get('/pending', auth, (req, res) => {
  res.json(store.pendingInterventions.filter(i => i.status === 'pending'));
});

/* GET /api/implementations/completed */
router.get('/completed', auth, (req, res) => {
  res.json(store.completedImplementations);
});

/* GET /api/implementations/:id - Get detail of a single intervention/implementation */
router.get('/:id', auth, (req, res) => {
  const { id } = req.params;
  const pending = store.pendingInterventions.find(i => i.id === id);
  if (pending) return res.json(pending);
  const completed = store.completedImplementations.find(i => i.id === id);
  if (completed) return res.json(completed);
  return res.status(404).json({ error: 'Implementasi tidak ditemukan' });
});

/* POST /api/implementations - Save new implementation (move from pending to completed) */
router.post('/', auth, (req, res) => {
  const { intervention_id, implementation_note, patient_response, vital_signs, complications, next_action, nurse_name, implementation_time } = req.body;
  if (!intervention_id || !implementation_note) {
    return res.status(400).json({ error: 'Intervention ID dan catatan implementasi wajib diisi!' });
  }
  const pendingIdx = store.pendingInterventions.findIndex(i => i.id === intervention_id);
  if (pendingIdx === -1) {
    return res.status(404).json({ error: 'Intervensi pending tidak ditemukan' });
  }
  const pending = store.pendingInterventions[pendingIdx];
  // Move to completed
  const impl = {
    id: store.generateId('IMP'),
    patient_id: pending.patient_id,
    patient_name: pending.patient_name,
    intervention: pending.intervention,
    implementation_note,
    patient_response: patient_response || '',
    vital_signs: vital_signs || {},
    complications: complications || '',
    next_action: next_action || '',
    nurse_name: nurse_name || req.user.fullname || req.user.username,
    implementation_time: implementation_time || new Date().toISOString(),
    status: 'completed',
  };
  store.completedImplementations.unshift(impl);
  // Remove from pending
  store.pendingInterventions.splice(pendingIdx, 1);

  store.activityLog.unshift({
    title: 'Implementasi Selesai',
    desc: `Tindakan keperawatan ${pending.patient_name} telah diselesaikan.`,
    time: new Date().toISOString(),
    color: '#f59e0b',
  });

  res.status(201).json({ message: 'Implementasi berhasil disimpan!', implementation: impl });
});

/* PUT /api/implementations/:id - Edit completed implementation */
router.put('/:id', auth, (req, res) => {
  const idx = store.completedImplementations.findIndex(i => i.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Implementasi tidak ditemukan' });
  const { implementation_note, patient_response, vital_signs, nurse_name } = req.body;
  if (implementation_note) store.completedImplementations[idx].implementation_note = implementation_note;
  if (patient_response) store.completedImplementations[idx].patient_response = patient_response;
  if (vital_signs) store.completedImplementations[idx].vital_signs = vital_signs;
  if (nurse_name) store.completedImplementations[idx].nurse_name = nurse_name;
  res.json({ message: 'Implementasi berhasil diperbarui', implementation: store.completedImplementations[idx] });
});

module.exports = router;
