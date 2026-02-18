import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import visaRoutes from './routes/visa.routes.js';
import chatRoutes from './routes/chat.routes.js';
import authRoutes from './routes/auth.routes.js';
import applicationRoutes from './routes/application.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middleware ──
app.use(helmet());
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:4200', credentials: true }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Routes ──
app.use('/api/visa', visaRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString(), version: '1.0.0' });
});

// ── 404 Handler ──
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

app.listen(PORT, () => {
    console.log(`🚀 Smart Visa Assistant API running on http://localhost:${PORT}`);
});

export default app;
