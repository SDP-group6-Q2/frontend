import pool from '../db/connection.js';
import { verifyToken } from '../utils/jwt.js';

async function requireAuth(req, res, next) {
  const token = req.cookies.arol_session;

  if (!token) {
    return res.status(401).json({
      error: 'Not authenticated',
    });
  }

  try {
    const decoded = verifyToken(token);

    const result = await pool.query(
      `
      SELECT
        "userId",
        "companyId",
        "firstName",
        "lastName",
        email,
        "jobTitle",
        visibility
      FROM users
      WHERE "userId" = $1
      LIMIT 1
      `,
      [decoded.userId],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'User not found',
      });
    }

    req.user = result.rows[0];

    next();
  } catch (error) {
    console.error(error);

    return res.status(401).json({
      error: 'Invalid session',
    });
  }
}

export default requireAuth;