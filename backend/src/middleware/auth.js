
const jwt = require('jsonwebtoken');

function authenticate(req, res, next) {
  let token = req.cookies?.accessToken;

  // Si pas de cookie, essayer Authorization header
  if (!token && req.headers.authorization) {
    const auth = req.headers.authorization;
    if (auth.startsWith('Bearer ')) {
      token = auth.slice(7);
    }
  }

  if (!token) {
    return res.status(401).json({ message: 'Token non fourni' });
  }

  try {
    const payload = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.user = payload; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalide' });
  }
}

function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Utilisateur non connecté' });
    }
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Role non autorisé' });
    }
    next();
  };
}

module.exports = { authenticate, requireRole };
