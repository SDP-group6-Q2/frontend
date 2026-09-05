import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: resolve(__dirname, '../.env'),
});

const { default: authRoutes } = await import('./routes/authRoutes.js');

const app = express();

const PORT = process.env.PORT || 8000;

console.log('Server configuration:');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('DB_USER:', process.env.DB_USER);

app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
  });
});

app.use('/auth', authRoutes);

app.listen(PORT, () => {
  console.log(
    `AROL Customer Platform API running on http://localhost:${PORT}`,
  );
});