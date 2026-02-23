const express = require('express');
const router = express.Router();
const store = require('../../data/store');
const auth = require('../../middleware/auth');

function timeAgo(isoDate) {
  const diff = Date.now() - new Date(isoDate).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Baru saja';
  if (mins < 60) return `${mins} menit yang lalu`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} jam yang lalu`;
  const days = Math.floor(hours / 24);
  return `${days} hari yang lalu`;
}

/* GET /api/dashboard/stats */
router.get('/stats', auth, (req, res) => {
  const totalPatients = store.patients.length;
  const askepAktif = store.askepPlans.length + 89; // base + new
  const implementasi = store.completedImplementations.length;
  const laporan = store.reports.length;
  res.json({
    stats: [
      { title: 'Total Pasien', value: totalPatients, desc: 'Pasien terdaftar', trend: '+12%', trendType: 'positive', color: '#10b981' },
      { title: 'Askep Aktif', value: askepAktif, desc: 'Rencana sedang berjalan', trend: '+8%', trendType: 'positive', color: '#3b82f6' },
      { title: 'Implementasi', value: implementasi, desc: 'Tindakan selesai', trend: '+15%', trendType: 'positive', color: '#f59e0b' },
      { title: 'Laporan', value: laporan, desc: 'Laporan tersedia', trend: '0%', trendType: 'neutral', color: '#8b5cf6' },
    ],
  });
});

/* GET /api/dashboard/activities */
router.get('/activities', auth, (req, res) => {
  const activities = store.activityLog.slice(0, 10).map(a => ({
    ...a,
    timeAgo: timeAgo(a.time),
  }));
  res.json(activities);
});

module.exports = router;
