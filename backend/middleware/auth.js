const store = require('../data/store');

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token tidak ditemukan' });
  }
  const token = authHeader.split(' ')[1];
  const userId = store.tokens[token];
  if (!userId) {
    return res.status(401).json({ error: 'Token tidak valid atau sudah expired' });
  }
  const user = store.users.find(u => u.id === userId);
  if (!user) {
    return res.status(401).json({ error: 'User tidak ditemukan' });
  }
  req.user = user;
  req.token = token;
  next();
}

module.exports = authMiddleware;
