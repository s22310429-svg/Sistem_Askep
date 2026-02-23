const express = require('express');
const router = express.Router();
const store = require('../../data/store');
const auth = require('../../middleware/auth');

/* POST /api/auth/login */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username dan password wajib diisi!' });
  }
  const user = store.users.find(u => u.username === username);
  if (!user || user.password !== store.hashPassword(password)) {
    return res.status(401).json({ error: 'Username atau password salah!' });
  }
  // Generate token
  const token = store.generateToken();
  store.tokens[token] = user.id;
  // Update login info
  user.lastLogin = new Date().toISOString();
  user.totalLogin = (user.totalLogin || 0) + 1;
  // Add activity
  store.activityLog.unshift({
    title: 'Login Sistem',
    desc: `${user.fullname || user.username} berhasil login.`,
    time: new Date().toISOString(),
    color: '#10b981',
  });
  res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullname: user.fullname,
      role: user.role,
      status: user.status,
      totalLogin: user.totalLogin,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    },
  });
});

/* POST /api/auth/register */
router.post('/register', (req, res) => {
  const { username, email, fullname, password } = req.body;
  if (!username || !email || !fullname || !password) {
    return res.status(400).json({ error: 'Semua field wajib diisi!' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password minimal 6 karakter!' });
  }
  if (store.users.find(u => u.username === username)) {
    return res.status(400).json({ error: 'Username sudah digunakan!' });
  }
  if (store.users.find(u => u.email === email)) {
    return res.status(400).json({ error: 'Email sudah digunakan!' });
  }
  const newUser = {
    id: store.generateId('U'),
    username,
    email,
    fullname,
    password: store.hashPassword(password),
    role: 'Perawat',
    createdAt: new Date().toISOString().split('T')[0],
    lastLogin: new Date().toISOString(),
    totalLogin: 1,
    status: 'Aktif',
  };
  store.users.push(newUser);
  // Auto-login after register
  const token = store.generateToken();
  store.tokens[token] = newUser.id;
  store.activityLog.unshift({
    title: 'User Baru Terdaftar',
    desc: `${newUser.fullname} mendaftar ke sistem.`,
    time: new Date().toISOString(),
    color: '#3b82f6',
  });
  res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      fullname: newUser.fullname,
      role: newUser.role,
      status: newUser.status,
      totalLogin: newUser.totalLogin,
      createdAt: newUser.createdAt,
      lastLogin: newUser.lastLogin,
    },
  });
});

/* GET /api/auth/profile */
router.get('/profile', auth, (req, res) => {
  const u = req.user;
  res.json({
    id: u.id,
    username: u.username,
    email: u.email,
    fullname: u.fullname,
    role: u.role,
    status: u.status,
    totalLogin: u.totalLogin,
    createdAt: u.createdAt,
    lastLogin: u.lastLogin,
  });
});

/* PUT /api/auth/profile */
router.put('/profile', auth, (req, res) => {
  const { fullname, email } = req.body;
  const user = req.user;
  if (fullname) user.fullname = fullname;
  if (email) {
    const existing = store.users.find(u => u.email === email && u.id !== user.id);
    if (existing) return res.status(400).json({ error: 'Email sudah digunakan!' });
    user.email = email;
  }
  store.activityLog.unshift({
    title: 'Edit Profil',
    desc: `${user.fullname} memperbarui profil.`,
    time: new Date().toISOString(),
    color: '#8b5cf6',
  });
  res.json({ message: 'Profil berhasil diperbarui', user: { id: user.id, username: user.username, email: user.email, fullname: user.fullname, role: user.role } });
});

/* PUT /api/auth/password */
router.put('/password', auth, (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!oldPassword || !newPassword) {
    return res.status(400).json({ error: 'Password lama dan baru wajib diisi!' });
  }
  if (newPassword.length < 6) {
    return res.status(400).json({ error: 'Password baru minimal 6 karakter!' });
  }
  if (req.user.password !== store.hashPassword(oldPassword)) {
    return res.status(400).json({ error: 'Password lama salah!' });
  }
  req.user.password = store.hashPassword(newPassword);
  store.activityLog.unshift({
    title: 'Ubah Password',
    desc: `${req.user.fullname || req.user.username} mengubah password.`,
    time: new Date().toISOString(),
    color: '#f59e0b',
  });
  res.json({ message: 'Password berhasil diubah' });
});

/* POST /api/auth/logout */
router.post('/logout', auth, (req, res) => {
  delete store.tokens[req.token];
  res.json({ message: 'Berhasil logout' });
});

module.exports = router;
