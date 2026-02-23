const express = require('express');
const router = express.Router();
const store = require('../../data/store');
const auth = require('../../middleware/auth');

/* GET /api/reports */
router.get('/', auth, (req, res) => {
  const membaik = store.reports.filter(r => r.status === 'membaik').length;
  const stabil = store.reports.filter(r => r.status === 'stabil').length;
  const memburuk = store.reports.filter(r => r.status === 'memburuk').length;
  res.json({
    reports: store.reports,
    summary: {
      totalPasien: store.patients.length,
      totalDiagnosa: store.reports.length + 12,
      totalImplementasi: store.completedImplementations.length,
      membaik,
      stabil,
      memburuk,
    },
  });
});

/* GET /api/reports/:id - Detail of single report */
router.get('/:id', auth, (req, res) => {
  const report = store.reports.find(r => r.id === parseInt(req.params.id));
  if (!report) return res.status(404).json({ error: 'Laporan tidak ditemukan' });
  // Enrich with more data
  const patient = store.patients.find(p => p.name === report.nama);
  const evalData = store.evaluations.find(e => e.nama === report.nama);
  const implData = store.completedImplementations.filter(i => i.patient_name === report.nama);
  res.json({ report, patient, evaluation: evalData, implementations: implData });
});

/* GET /api/reports/export/csv - Export all reports as CSV */
router.get('/export/csv', auth, (req, res) => {
  const header = 'No,Nama,Diagnosa,Implementasi,Evaluasi,Status,Tanggal\n';
  const rows = store.reports.map((r, i) =>
    `${i + 1},"${r.nama}","${r.diagnosa}","${r.implementasi}","${r.evaluasi}","${r.status}","${r.tanggal}"`
  ).join('\n');
  const csv = header + rows;
  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=laporan_keperawatan.csv');
  res.send(csv);
});

module.exports = router;
