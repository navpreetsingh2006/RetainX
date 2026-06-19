import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import dashboardRoutes from './routes/dashboardRoutes.ts';

dotenv.config();
const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
];
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      const isLocal = origin.startsWith('http://localhost:') || 
                      origin.startsWith('http://127.0.0.1:') ||
                      origin.startsWith('http://192.168.') || 
                      origin.startsWith('http://10.') || 
                      origin.startsWith('http://172.');
      if (isLocal || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get('/api', (_req, res) => {
    res.json({
        success: true,
        message: 'Retain AI API Running',
    });
});
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});