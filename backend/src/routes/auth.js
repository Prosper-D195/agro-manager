const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { createUser, findUserByEmail } = require('../models/users');
const { authenticate, requireRole } = require('../middleware/auth');
const pool = require('../utils/db');
const { sendResetPasswordEmail } = require('../services/email');

const router = express.Router();

// Inscription
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const user = await createUser({ name, email, password, role });
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de l’inscription', error: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const accessToken = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    await pool.query(
      'INSERT INTO refresh_tokens (user_id, token) VALUES ($1, $2)',
      [user.id, refreshToken]
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur lors de la connexion', error: err.message });
  }
});

// GET /me
router.get('/me', authenticate, (req, res) => {
  res.json({ user: req.user });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: 'Refresh token non fourni' });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const { rows } = await pool.query(
      'SELECT token FROM refresh_tokens WHERE user_id = $1 AND token = $2',
      [payload.id, refreshToken]
    );
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Refresh token invalide' });
    }

    const newAccessToken = jwt.sign(
      { id: payload.id },
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000
    });

    res.json({ ok: true });
  } catch (err) {
    return res.status(401).json({ message: 'Refresh token invalide' });
  }
});

// Logout
router.post('/logout', async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await pool.query('DELETE FROM refresh_tokens WHERE token = $1', [refreshToken]);
  }

  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.json({ ok: true });
});

// POST /api/auth/forgot-password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'email est obligatoire' });
    }

    const { rows: userRows } = await pool.query(
      'SELECT id, email FROM users WHERE email = $1',
      [email]
    );

    if (userRows.length === 0) {
      return res.json({
        message: 'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.'
      });
    }

    const user = userRows[0];

    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = await bcrypt.hash(resetToken, 10);

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await pool.query(
      'INSERT INTO password_reset_tokens (user_id, token, expires_at) VALUES ($1, $2, $3)',
      [user.id, hashedToken, expiresAt]
    );

    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    console.log('Calling sendResetPasswordEmail with:');
    console.log('to:', user.email);
    console.log('resetLink:', resetLink);

    await sendResetPasswordEmail(user.email, resetLink)
      .then((info) => {
        console.log('SUCCESS: Reset email sent, messageId:', info.messageId);
      })
      .catch((err) => {
        console.error('ERROR: Failed to send reset email:', err);
        return res.status(500).json({ message: 'Erreur lors de l’envoi de l’email', error: err.message });
      });

    res.json({
      message: 'Si cet email est associé à un compte, vous recevrez un lien de réinitialisation.'
    });
  } catch (err) {
    console.error('forgot-password error:', err);
    res.status(500).json({ message: 'Erreur lors de la demande de réinitialisation', error: err.message });
  }
});

// POST /api/auth/reset-password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'token et password sont obligatoires' });
    }

    // Trouver le token valide le plus récent (pas expiré, pas utilisé)
    const { rows: tokenRows } = await pool.query(
      'SELECT user_id, token, expires_at, used_at ' +
      'FROM password_reset_tokens ' +
      'WHERE expires_at > NOW() AND used_at IS NULL ' +
      'ORDER BY created_at DESC LIMIT 1'
    );

    if (tokenRows.length === 0) {
      return res.status(400).json({ message: 'Token invalide ou expiré' });
    }

    const resetRecord = tokenRows[0];

    const isValid = await bcrypt.compare(token, resetRecord.token);
    if (!isValid) {
      return res.status(400).json({ message: 'Token invalide' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET password = $1 WHERE id = $2',
      [hashedPassword, resetRecord.user_id]
    );

    await pool.query(
      'UPDATE password_reset_tokens SET used_at = NOW() WHERE user_id = $1 AND token = $2',
      [resetRecord.user_id, resetRecord.token]
    );

    res.json({ message: 'Mot de passe réinitialisé avec succès. Vous pouvez maintenant vous connecter.' });
  } catch (err) {
    console.error('reset-password error:', err);
    res.status(500).json({ message: 'Erreur lors de la réinitialisation du mot de passe', error: err.message });
  }
});

module.exports = router;