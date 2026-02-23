const express = require('express');
const router = express.Router();
const store = require('../../data/store');
const auth = require('../../middleware/auth');

/* GET /api/evaluations */
router.get('/', auth, (req, res) => {
  res.json(store.evaluations);
});

/* GET /api/evaluations/export - Export evaluations as CSV */
router.get('/export', auth, (req, res) => {
  const header = 'No,Nama Pasien,Status,Tren Nyeri,Evaluasi Terakhir\n';
  const rows = store.evaluations.map((e, i) => {
    const lastProgress = e.progress[e.progress.length - 1];
    return `${i + 1},"${e.nama}","${e.status}","${e.trenNyeri.join('-')}","${lastProgress.deskripsi}"`;
  }).join('\n');
  const csv = header + rows;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=evaluasi_pasien.csv');
  res.send(csv);
});

module.exports = router;
