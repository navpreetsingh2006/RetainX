import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.ts';
import dashboardRoutes from './routes/dashboardRoutes.ts';

dotenv.config();
const app = express();
app.use(
  cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
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