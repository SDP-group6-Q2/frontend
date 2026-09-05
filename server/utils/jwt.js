import jwt from 'jsonwebtoken';

export function createToken(user) {
  return jwt.sign(
    {
      userId: user.userId,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '8h',
    },
  );
}

export function verifyToken(token) {
  return jwt.verify(
    token,
    process.env.JWT_SECRET,
  );
}