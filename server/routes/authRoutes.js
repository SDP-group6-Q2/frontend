import express from 'express';
import bcrypt from 'bcrypt';

import pool from '../db/connection.js';
import requireAuth from '../middleware/authMiddleware.js';
import { createToken } from '../utils/jwt.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      error: 'Email and password are required',
    });
  }

  try {
    const result = await pool.query(
      `
      SELECT
        "userId",
        "companyId",
        "firstName",
        "lastName",
        email,
        "passwordHash",
        "jobTitle",
        visibility
      FROM users
      WHERE LOWER(email) = LOWER($1)
      LIMIT 1
      `,
      [email],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const user = result.rows[0];

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        error: 'Invalid email or password',
      });
    }

    const token = createToken(user);

    res.cookie(
      'arol_session',
      token,
      {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 8 * 60 * 60 * 1000,
      },
    );

    return res.json({
      user: {
        userId: user.userId,
        companyId: user.companyId,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        jobTitle: user.jobTitle,
        visibility: user.visibility,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      error: 'Internal server error',
    });
  }
});

router.get('/me', requireAuth, (req, res) => {
  return res.json({
    user: req.user,
  });
});

router.post('/logout', (req, res) => {
  res.clearCookie('arol_session');

  return res.json({
    message: 'Logged out successfully',
  });
});

export default router;