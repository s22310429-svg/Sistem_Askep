const express = require('express');
const router = express.Router();
const store = require('../../data/store');
const auth = require('../../middleware/auth');

/* GET /api/patients */
router.get('/', auth, (req, res) => {
  res.json(store.patients);
});

/* GET /api/patients/:id */
router.get('/:id', auth, (req, res) => {
  const patient = store.patients.find(p => p.id === req.params.id);
  if (!patient) return res.status(404).json({ error: 'Pasien tidak ditemukan' });
  res.json(patient);
});

/* POST /api/patients */
router.post('/', auth, (req, res) => {
  const { name, age, gender, diagnosis, status } = req.body;
  if (!name || !age || !gender || !diagnosis || !status) {
    return res.status(400).json({ error: 'Semua field wajib diisi!' });
  }
  const id = 'P' + String(store.patients.length + 1).padStart(3, '0');
  const rm = 'RM' + String(store.patients.length + 1).padStart(3, '0');
  const newPatient = {
    id,
    rm,
    name,
    age: Number(age),
    gender,
    diagnosis,
    status,
    avatar: name.charAt(0).toUpperCase(),
  };
  store.patients.push(newPatient);
  store.activityLog.unshift({
    title: 'Pasien Baru Ditambahkan',
    desc: `${name} telah didaftarkan ke sistem.`,
    time: new Date().toISOString(),
    color: '#10b981',
  });
  res.status(201).json(newPatient);
});

/* PUT /api/patients/:id */
router.put('/:id', auth, (req, res) => {
  const idx = store.patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Pasien tidak ditemukan' });
  const { name, age, gender, diagnosis, status } = req.body;
  if (name) store.patients[idx].name = name;
  if (age) store.patients[idx].age = Number(age);
  if (gender) store.patients[idx].gender = gender;
  if (diagnosis) store.patients[idx].diagnosis = diagnosis;
  if (status) store.patients[idx].status = status;
  if (name) store.patients[idx].avatar = name.charAt(0).toUpperCase();
  store.activityLog.unshift({
    title: 'Data Pasien Diperbarui',
    desc: `Data ${store.patients[idx].name} telah diperbarui.`,
    time: new Date().toISOString(),
    color: '#3b82f6',
  });
  res.json(store.patients[idx]);
});

/* DELETE /api/patients/:id */
router.delete('/:id', auth, (req, res) => {
  const idx = store.patients.findIndex(p => p.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Pasien tidak ditemukan' });
  const removed = store.patients.splice(idx, 1)[0];
  res.json({ message: `Pasien ${removed.name} berhasil dihapus` });
});

module.exports = router;
