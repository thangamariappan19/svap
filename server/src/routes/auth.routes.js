import { Router } from 'express';

const router = Router();
const users = []; // In-memory store (use PostgreSQL in production)

// POST /api/auth/register
router.post('/register', (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) return res.status(400).json({ success: false, error: 'All fields required' });
    if (users.find(u => u.email === email)) return res.status(409).json({ success: false, error: 'Email already registered' });

    const user = { id: `user-${Date.now()}`, email, name, createdAt: new Date().toISOString() };
    users.push({ ...user, password }); // In production, hash the password with bcrypt
    const token = `mock-jwt-${user.id}`; // In production, use jsonwebtoken

    res.status(201).json({ success: true, data: { user, token } });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);
    if (!user) return res.status(401).json({ success: false, error: 'Invalid credentials' });

    const { password: _, ...safeUser } = user;
    const token = `mock-jwt-${user.id}`;
    res.json({ success: true, data: { user: safeUser, token } });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, error: 'Unauthorized' });
    const userId = token.replace('mock-jwt-', '');
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(401).json({ success: false, error: 'User not found' });
    const { password: _, ...safeUser } = user;
    res.json({ success: true, data: safeUser });
});

export default router;
