import { Router } from 'express';

const router = Router();
const applications = []; // In-memory store (use PostgreSQL in production)

// GET /api/applications
router.get('/', (req, res) => {
    const userId = req.query.userId || 'user-1';
    const userApps = applications.filter(a => a.userId === userId);
    res.json({ success: true, data: userApps, total: userApps.length });
});

// POST /api/applications
router.post('/', (req, res) => {
    const { country, countryCode, visaType, notes, userId } = req.body;
    if (!country || !visaType) return res.status(400).json({ success: false, error: 'Country and visa type required' });

    const app = {
        id: `app-${Date.now()}`,
        userId: userId || 'user-1',
        country, countryCode, visaType, notes,
        status: 'draft',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    applications.push(app);
    res.status(201).json({ success: true, data: app });
});

// PATCH /api/applications/:id/status
router.patch('/:id/status', (req, res) => {
    const app = applications.find(a => a.id === req.params.id);
    if (!app) return res.status(404).json({ success: false, error: 'Application not found' });
    app.status = req.body.status;
    app.updatedAt = new Date().toISOString();
    res.json({ success: true, data: app });
});

// DELETE /api/applications/:id
router.delete('/:id', (req, res) => {
    const idx = applications.findIndex(a => a.id === req.params.id);
    if (idx === -1) return res.status(404).json({ success: false, error: 'Application not found' });
    applications.splice(idx, 1);
    res.json({ success: true, message: 'Application deleted' });
});

export default router;
